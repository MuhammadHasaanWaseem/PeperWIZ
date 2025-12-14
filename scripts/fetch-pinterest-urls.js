const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const SEARCH_QUERY = process.argv[2] || 'luffy';
const MAX_IMAGES = parseInt(process.argv[3]) || 20000;
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'pinterest-urls');
const DELAY_BETWEEN_REQUESTS = 1500; // 1.5 seconds
const MAX_RETRIES = 3;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Progress tracking
let collectedCount = 0;
const collectedUrls = new Set();
const allImageData = [];

// Load existing progress
const progressFile = path.join(OUTPUT_DIR, `${SEARCH_QUERY}-progress.json`);
if (fs.existsSync(progressFile)) {
  try {
    const progress = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
    collectedCount = progress.collectedCount || 0;
    collectedUrls = new Set(progress.collectedUrls || []);
    console.log(`📂 Resuming: ${collectedCount} URLs already collected`);
  } catch (e) {
    console.log('Starting fresh session');
  }
}

// Save progress
function saveProgress() {
  const progress = {
    searchQuery: SEARCH_QUERY,
    collectedCount: collectedCount,
    collectedUrls: Array.from(collectedUrls),
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
}

// Browser headers
const getHeaders = () => ({
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
          // Get all available image sizes
          const imageInfo = {
            id: pin.id || `pin-${Date.now()}-${Math.random()}`,
            pinUrl: pin.pin_join?.visual_annotation?.pinJoin?.url || `https://www.pinterest.com/pin/${pin.id}/`,
            description: pin.description || pin.rich_summary?.display_description || pin.title || '',
            title: pin.title || '',
            board: pin.board?.name || '',
            creator: pin.creator?.username || pin.creator?.full_name || '',
            images: {},
          };
          
          // Collect all image sizes
          const sizes = ['originals', '736x', '564x', '474x', '236x'];
          sizes.forEach(size => {
            if (pin.images[size] && pin.images[size].url) {
              imageInfo.images[size] = {
                url: pin.images[size].url,
                width: pin.images[size].width,
                height: pin.images[size].height,
              };
            }
          });
          
          // Use highest quality URL as primary
          if (Object.keys(imageInfo.images).length > 0) {
            const primarySize = sizes.find(size => imageInfo.images[size]) || Object.keys(imageInfo.images)[0];
            imageInfo.primaryUrl = imageInfo.images[primarySize].url;
            imageInfo.primarySize = primarySize;
            images.push(imageInfo);
          }
        }
      });
    }
    
    // Method 2: Nested data structure extraction
    const extractFromObject = (obj, depth = 0) => {
      if (depth > 10) return;
      
      if (Array.isArray(obj)) {
        obj.forEach(item => extractFromObject(item, depth + 1));
      } else if (obj && typeof obj === 'object') {
        if (obj.images && typeof obj.images === 'object') {
          const imageInfo = {
            id: obj.id || `pin-${Date.now()}-${Math.random()}`,
            pinUrl: obj.url || obj.pin_url || '',
            description: obj.description || obj.title || '',
            title: obj.title || '',
            images: {},
          };
          
          const sizes = ['originals', '736x', '564x', '474x', '236x'];
          sizes.forEach(size => {
            if (obj.images[size] && obj.images[size].url) {
              imageInfo.images[size] = {
                url: obj.images[size].url,
                width: obj.images[size].width,
                height: obj.images[size].height,
              };
            }
          });
          
          if (Object.keys(imageInfo.images).length > 0) {
            const primarySize = sizes.find(size => imageInfo.images[size]) || Object.keys(imageInfo.images)[0];
            imageInfo.primaryUrl = imageInfo.images[primarySize].url;
            imageInfo.primarySize = primarySize;
            images.push(imageInfo);
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

// Fetch Pinterest search page
async function fetchPinterestPage(query, bookmark = null, retryCount = 0) {
  try {
    const baseUrl = 'https://www.pinterest.com/resource/SearchResource/get/';
    const params = new URLSearchParams({
      source_url: `/search/pins/?q=${encodeURIComponent(query)}&rs=typed`,
      data: JSON.stringify({
        options: {
          query: query,
          scope: 'pins',
          page_size: 250,
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
      validateStatus: (status) => status < 500,
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
      console.log(`⚠️  Retry ${retryCount + 1}/${MAX_RETRIES}: ${error.message}`);
      await delay(DELAY_BETWEEN_REQUESTS * 2);
      return fetchPinterestPage(query, bookmark, retryCount + 1);
    }
    return { success: false, error: error.message };
  }
}

// Main function - Only fetch URLs, no downloads
async function fetchPinterestUrls() {
  console.log('🔗 Pinterest URL Fetcher');
  console.log('─'.repeat(70));
  console.log(`🔍 Search Query: "${SEARCH_QUERY}"`);
  console.log(`📊 Target: ${MAX_IMAGES.toLocaleString()} image URLs`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log('─'.repeat(70));
  console.log('ℹ️  Note: Only fetching URLs, not downloading images');
  console.log('─'.repeat(70));
  
  let bookmark = null;
  let pageCount = 0;
  
  // Collect image URLs
  console.log('\n📥 Collecting image URLs...\n');
  
  const startTime = Date.now();
  
  while (allImageData.length < MAX_IMAGES) {
    pageCount++;
    process.stdout.write(`\r📄 Page ${pageCount} | Collected: ${allImageData.length}/${MAX_IMAGES} URLs`);
    
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
      if (img.primaryUrl && !collectedUrls.has(img.primaryUrl) && allImageData.length < MAX_IMAGES) {
        collectedUrls.add(img.primaryUrl);
        allImageData.push(img);
        collectedCount++;
      }
    });
    
    bookmark = result.bookmark;
    if (!bookmark) {
      console.log(`\n⚠️  No more pages available (reached end)`);
      break;
    }
    
    // Save progress every 100 URLs
    if (collectedCount % 100 === 0) {
      saveProgress();
    }
    
    await delay(DELAY_BETWEEN_REQUESTS);
  }
  
  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  
  console.log(`\n\n✅ Collected ${allImageData.length} unique image URLs`);
  console.log('─'.repeat(70));
  
  // Save all URLs to JSON
  const outputFile = path.join(OUTPUT_DIR, `${SEARCH_QUERY}-urls.json`);
  fs.writeFileSync(
    outputFile,
    JSON.stringify(allImageData, null, 2)
  );
  
  // Save simplified version with just URLs
  const simpleUrls = allImageData.map(img => ({
    id: img.id,
    url: img.primaryUrl,
    size: img.primarySize,
    description: img.description,
    pinUrl: img.pinUrl,
    allSizes: Object.keys(img.images),
  }));
  
  const simpleFile = path.join(OUTPUT_DIR, `${SEARCH_QUERY}-simple-urls.json`);
  fs.writeFileSync(
    simpleFile,
    JSON.stringify(simpleUrls, null, 2)
  );
  
  // Save just URLs array (for easy import)
  const urlsOnly = allImageData.map(img => img.primaryUrl);
  const urlsOnlyFile = path.join(OUTPUT_DIR, `${SEARCH_QUERY}-urls-only.json`);
  fs.writeFileSync(
    urlsOnlyFile,
    JSON.stringify(urlsOnly, null, 2)
  );
  
  // Final summary
  const summary = {
    searchQuery: SEARCH_QUERY,
    totalUrls: allImageData.length,
    totalTimeMinutes: parseFloat(totalTime),
    outputDirectory: OUTPUT_DIR,
    files: {
      full: outputFile,
      simple: simpleFile,
      urlsOnly: urlsOnlyFile,
    },
    completedAt: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${SEARCH_QUERY}-summary.json`),
    JSON.stringify(summary, null, 2)
  );
  
  saveProgress();
  
  console.log('\n✨ URL Collection Complete!');
  console.log('─'.repeat(70));
  console.log(`✅ Total URLs collected: ${allImageData.length.toLocaleString()}`);
  console.log(`⏱️  Total time: ${totalTime} minutes`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log('\n📄 Files created:');
  console.log(`   📋 Full data: ${outputFile}`);
  console.log(`   📋 Simple format: ${simpleFile}`);
  console.log(`   📋 URLs only: ${urlsOnlyFile}`);
  console.log(`   📊 Summary: ${SEARCH_QUERY}-summary.json`);
  console.log('─'.repeat(70));
}

// Run
fetchPinterestUrls().catch(error => {
  console.error('\n❌ Fatal error:', error);
  saveProgress();
  process.exit(1);
});

