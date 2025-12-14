const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const SEARCH_QUERY = process.argv[2] || 'luffy';
const MAX_IMAGES = parseInt(process.argv[3]) || 20000;
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'pinterest-images', SEARCH_QUERY);
const DELAY_BETWEEN_REQUESTS = 1500; // 1.5 seconds
const BATCH_SIZE = 25; // Smaller batches for stability
const MAX_RETRIES = 3;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Progress tracking
let downloadedCount = 0;
let failedCount = 0;
const downloadedUrls = new Set();
const failedUrls = [];
const imageMetadata = [];

// Load existing progress
const progressFile = path.join(OUTPUT_DIR, 'progress.json');
if (fs.existsSync(progressFile)) {
  try {
    const progress = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
    downloadedCount = progress.downloadedCount || 0;
    downloadedUrls = new Set(progress.downloadedUrls || []);
    console.log(`📂 Resuming from previous session: ${downloadedCount} images already downloaded`);
  } catch (e) {
    console.log('Starting fresh session');
  }
}

// Save progress periodically
function saveProgress() {
  const progress = {
    downloadedCount,
    downloadedUrls: Array.from(downloadedUrls),
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
}

// Browser headers
const getHeaders = (additionalHeaders = {}) => ({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': 'https://www.pinterest.com/',
  'Origin': 'https://www.pinterest.com',
  'Connection': 'keep-alive',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'Cache-Control': 'no-cache',
  ...additionalHeaders,
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Extract images from Pinterest API response
function extractImagesFromResponse(responseData) {
  const images = [];
  
  try {
    // Method 1: Direct API response
    if (responseData.resource_response && responseData.resource_response.data) {
      const results = responseData.resource_response.data.results || [];
      results.forEach(pin => {
        if (pin.images) {
          // Priority: originals > 736x > 564x > 474x
          const sizes = ['originals', '736x', '564x', '474x', '236x'];
          for (const size of sizes) {
            if (pin.images[size] && pin.images[size].url) {
              images.push({
                url: pin.images[size].url,
                id: pin.id || `pin-${Date.now()}-${Math.random()}`,
                description: pin.description || pin.rich_summary?.display_description || pin.title || '',
                pinUrl: pin.pin_join?.visual_annotation?.pinJoin?.url || `https://www.pinterest.com/pin/${pin.id}/`,
              });
              break;
            }
          }
        }
      });
    }
    
    // Method 2: Nested data structure
    const extractFromObject = (obj, depth = 0) => {
      if (depth > 10) return; // Prevent infinite recursion
      
      if (Array.isArray(obj)) {
        obj.forEach(item => extractFromObject(item, depth + 1));
      } else if (obj && typeof obj === 'object') {
        if (obj.images) {
          const sizes = ['originals', '736x', '564x', '474x'];
          for (const size of sizes) {
            if (obj.images[size] && obj.images[size].url) {
              images.push({
                url: obj.images[size].url,
                id: obj.id || `pin-${Date.now()}-${Math.random()}`,
                description: obj.description || obj.title || '',
                pinUrl: obj.url || '',
              });
              break;
            }
          }
        }
        
        Object.values(obj).forEach(value => {
          if (typeof value === 'object' && value !== null) {
            extractFromObject(value, depth + 1);
          }
        });
      }
    };
    
    extractFromObject(responseData);
  } catch (error) {
    console.error('Error extracting images:', error.message);
  }
  
  return images;
}

// Fetch Pinterest search with retry
async function fetchPinterestPage(query, bookmark = null, retryCount = 0) {
  try {
    // Construct API URL
    const baseUrl = 'https://www.pinterest.com/resource/SearchResource/get/';
    const params = new URLSearchParams({
      source_url: `/search/pins/?q=${encodeURIComponent(query)}&rs=typed`,
      data: JSON.stringify({
        options: {
          query: query,
          scope: 'pins',
          page_size: 250, // Request more per page
        },
        context: {},
      }),
    });
    
    if (bookmark) {
      params.append('bookmarks', `[${bookmark}]`);
    }
    
    const url = `${baseUrl}?${params.toString()}`;
    
    const response = await axios.get(url, {
      headers: getHeaders(),
      timeout: 30000,
      validateStatus: (status) => status < 500, // Accept 4xx but retry on 5xx
    });
    
    if (response.status === 200 && response.data) {
      return {
        success: true,
        data: response.data,
        bookmark: response.data?.resource_response?.bookmark || null,
      };
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`⚠️  Retry ${retryCount + 1}/${MAX_RETRIES} after error: ${error.message}`);
      await delay(DELAY_BETWEEN_REQUESTS * 2);
      return fetchPinterestPage(query, bookmark, retryCount + 1);
    }
    return { success: false, error: error.message };
  }
}

// Download image with retry
async function downloadImage(imageData, index, retryCount = 0) {
  try {
    if (downloadedUrls.has(imageData.url)) {
      return { success: false, reason: 'duplicate' };
    }
    
    // Generate safe filename
    const safeId = imageData.id.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `pinterest_${safeId}_${index}.jpg`;
    const filePath = path.join(OUTPUT_DIR, filename);
    
    // Skip if exists
    if (fs.existsSync(filePath)) {
      downloadedUrls.add(imageData.url);
      downloadedCount++;
      return { success: true, reason: 'exists', filePath };
    }
    
    const response = await axios({
      method: 'GET',
      url: imageData.url,
      responseType: 'arraybuffer',
      headers: getHeaders({
        'Referer': imageData.pinUrl || 'https://www.pinterest.com/',
      }),
      timeout: 30000,
      maxContentLength: 50 * 1024 * 1024, // 50MB max
      maxBodyLength: 50 * 1024 * 1024,
    });
    
    // Validate image
    const contentType = response.headers['content-type'] || '';
    if (!contentType.startsWith('image/')) {
      return { success: false, reason: 'not_image' };
    }
    
    // Check minimum size (skip very small images)
    if (response.data.length < 5000) {
      return { success: false, reason: 'too_small' };
    }
    
    // Save image
    fs.writeFileSync(filePath, response.data);
    downloadedUrls.add(imageData.url);
    downloadedCount++;
    
    // Save metadata
    const metadata = {
      id: imageData.id,
      url: imageData.url,
      pinUrl: imageData.pinUrl,
      description: imageData.description,
      filename: filename,
      fileSize: response.data.length,
      fileSizeMB: (response.data.length / (1024 * 1024)).toFixed(2),
      contentType: contentType,
      downloadedAt: new Date().toISOString(),
    };
    
    imageMetadata.push(metadata);
    
    const metadataPath = path.join(OUTPUT_DIR, `${filename.replace(/\.[^/.]+$/, '')}_meta.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    // Save progress every 10 images
    if (downloadedCount % 10 === 0) {
      saveProgress();
    }
    
    return { success: true, filePath, metadata };
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await delay(DELAY_BETWEEN_REQUESTS);
      return downloadImage(imageData, index, retryCount + 1);
    }
    failedUrls.push({ url: imageData.url, error: error.message, id: imageData.id });
    failedCount++;
    return { success: false, reason: error.message };
  }
}

// Main function
async function scrapePinterest() {
  console.log('🚀 Pinterest Advanced Scraper');
  console.log('─'.repeat(70));
  console.log(`🔍 Search Query: "${SEARCH_QUERY}"`);
  console.log(`📊 Target: ${MAX_IMAGES.toLocaleString()} images`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log('─'.repeat(70));
  
  let bookmark = null;
  let pageCount = 0;
  const allImageData = [];
  
  // Phase 1: Collect image URLs
  console.log('\n📥 Phase 1: Collecting image URLs...\n');
  
  while (allImageData.length < MAX_IMAGES) {
    pageCount++;
    process.stdout.write(`\r📄 Page ${pageCount} | Found: ${allImageData.length}/${MAX_IMAGES} images`);
    
    const result = await fetchPinterestPage(SEARCH_QUERY, bookmark);
    
    if (!result.success || !result.data) {
      console.log(`\n⚠️  Failed to fetch page ${pageCount}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      await delay(DELAY_BETWEEN_REQUESTS * 2);
      continue;
    }
    
    const images = extractImagesFromResponse(result.data);
    
    if (images.length === 0) {
      console.log(`\n⚠️  No images found on page ${pageCount}. Stopping.`);
      break;
    }
    
    // Add unique images
    images.forEach(img => {
      if (!downloadedUrls.has(img.url) && allImageData.length < MAX_IMAGES) {
        allImageData.push(img);
      }
    });
    
    bookmark = result.bookmark;
    if (!bookmark) {
      console.log(`\n⚠️  No more pages available (reached end)`);
      break;
    }
    
    await delay(DELAY_BETWEEN_REQUESTS);
  }
  
  console.log(`\n\n✅ Collected ${allImageData.length} unique image URLs`);
  console.log('─'.repeat(70));
  
  // Phase 2: Download images
  console.log('\n📥 Phase 2: Downloading images...\n');
  
  const startTime = Date.now();
  
  for (let i = 0; i < allImageData.length; i += BATCH_SIZE) {
    const batch = allImageData.slice(i, Math.min(i + BATCH_SIZE, allImageData.length));
    
    const batchPromises = batch.map((img, idx) => 
      downloadImage(img, i + idx).then(result => {
        if (result.success && result.reason !== 'duplicate') {
          process.stdout.write(`\r✅ ${downloadedCount}/${allImageData.length} downloaded`);
        }
        return result;
      })
    );
    
    await Promise.all(batchPromises);
    
    const progress = ((i + batch.length) / allImageData.length * 100).toFixed(1);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const rate = downloadedCount / (elapsed / 60);
    
    console.log(`\n📊 Progress: ${progress}% | Downloaded: ${downloadedCount} | Rate: ${rate.toFixed(1)}/min | Elapsed: ${elapsed}s`);
    
    if (i + BATCH_SIZE < allImageData.length) {
      await delay(DELAY_BETWEEN_REQUESTS);
    }
  }
  
  // Final summary
  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  
  console.log('\n' + '─'.repeat(70));
  console.log('✨ Scraping Complete!');
  console.log('─'.repeat(70));
  console.log(`✅ Successfully downloaded: ${downloadedCount.toLocaleString()} images`);
  console.log(`❌ Failed: ${failedCount} images`);
  console.log(`⏱️  Total time: ${totalTime} minutes`);
  console.log(`📁 Location: ${OUTPUT_DIR}`);
  
  // Save final data
  const summary = {
    searchQuery: SEARCH_QUERY,
    totalFound: allImageData.length,
    downloaded: downloadedCount,
    failed: failedCount,
    totalTimeMinutes: parseFloat(totalTime),
    outputDirectory: OUTPUT_DIR,
    completedAt: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'summary.json'),
    JSON.stringify(summary, null, 2)
  );
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'all-metadata.json'),
    JSON.stringify(imageMetadata, null, 2)
  );
  
  if (failedUrls.length > 0) {
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'failed.json'),
      JSON.stringify(failedUrls, null, 2)
    );
    console.log(`📋 Failed URLs saved: ${failedUrls.length}`);
  }
  
  console.log('📊 Summary and metadata files saved');
  console.log('─'.repeat(70));
}

// Run
scrapePinterest().catch(error => {
  console.error('\n❌ Fatal error:', error);
  saveProgress(); // Save progress even on error
  process.exit(1);
});

