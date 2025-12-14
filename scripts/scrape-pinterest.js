const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const SEARCH_QUERY = 'luffy';
const MAX_IMAGES = 20000;
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'pinterest-images');
const DELAY_BETWEEN_REQUESTS = 1000; // 1 second delay to avoid rate limiting
const BATCH_SIZE = 50; // Download images in batches

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Progress tracking
let downloadedCount = 0;
let failedCount = 0;
const downloadedUrls = new Set(); // To avoid duplicates
const failedUrls = [];

// Browser-like headers
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
});

// Delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Extract image URLs from Pinterest response
function extractImageUrls(data) {
  const imageUrls = [];
  
  try {
    // Pinterest returns data in various formats
    // Try to extract from resource responses
    if (data.resourceResponse && data.resourceResponse.data) {
      const pins = data.resourceResponse.data.results || [];
      pins.forEach(pin => {
        if (pin.images) {
          // Get highest quality image
          const imageSizes = ['originals', '736x', '564x', '474x', '236x'];
          for (const size of imageSizes) {
            if (pin.images[size] && pin.images[size].url) {
              imageUrls.push({
                url: pin.images[size].url,
                id: pin.id,
                description: pin.description || pin.rich_summary?.display_description || '',
              });
              break;
            }
          }
        }
      });
    }
    
    // Alternative: Extract from HTML/JSON embedded in page
    if (typeof data === 'string') {
      // Try to find JSON data in script tags
      const jsonMatches = data.match(/<script[^>]*>window\.__initialData__\s*=\s*({.+?});<\/script>/s);
      if (jsonMatches) {
        try {
          const jsonData = JSON.parse(jsonMatches[1]);
          // Navigate through Pinterest's data structure
          const extractFromObject = (obj) => {
            if (Array.isArray(obj)) {
              obj.forEach(item => extractFromObject(item));
            } else if (obj && typeof obj === 'object') {
              if (obj.images && obj.images.originals) {
                imageUrls.push({
                  url: obj.images.originals.url,
                  id: obj.id,
                  description: obj.description || '',
                });
              }
              Object.values(obj).forEach(value => {
                if (typeof value === 'object') {
                  extractFromObject(value);
                }
              });
            }
          };
          extractFromObject(jsonData);
        } catch (e) {
          console.log('Could not parse embedded JSON');
        }
      }
    }
  } catch (error) {
    console.error('Error extracting image URLs:', error.message);
  }
  
  return imageUrls;
}

// Fetch Pinterest search results
async function fetchPinterestSearch(query, bookmark = null) {
  try {
    const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}&rs=typed`;
    
    // First, get the initial page to extract API endpoints
    const pageResponse = await axios.get(searchUrl, {
      headers: getHeaders(),
      timeout: 30000,
    });
    
    // Extract API endpoint from page
    let apiUrl = null;
    const pageContent = pageResponse.data;
    
    // Try to find the API endpoint in the HTML
    const apiMatch = pageContent.match(/\/resource\/SearchResource\/get\/[^"']+/);
    if (apiMatch) {
      apiUrl = `https://www.pinterest.com${apiMatch[0]}`;
    } else {
      // Fallback: construct API URL
      apiUrl = `https://www.pinterest.com/resource/SearchResource/get/?source_url=/search/pins/?q=${encodeURIComponent(query)}&rs=typed&data=%7B%22options%22%3A%7B%22query%22%3A%22${encodeURIComponent(query)}%22%2C%22scope%22%3A%22pins%22%7D%2C%22context%22%3A%7B%7D%7D`;
    }
    
    // Add bookmark for pagination
    if (bookmark) {
      apiUrl += `&bookmarks=[${bookmark}]`;
    }
    
    // Fetch API data
    const apiResponse = await axios.get(apiUrl, {
      headers: getHeaders(),
      timeout: 30000,
    });
    
    return {
      data: apiResponse.data,
      bookmark: apiResponse.data?.resource?.options?.bookmarks?.[0] || null,
    };
  } catch (error) {
    console.error(`Error fetching Pinterest search: ${error.message}`);
    return { data: null, bookmark: null };
  }
}

// Download a single image
async function downloadImage(imageData, index) {
  try {
    if (downloadedUrls.has(imageData.url)) {
      return { success: false, reason: 'duplicate' };
    }
    
    const urlParts = imageData.url.split('/');
    const filename = imageData.id 
      ? `pinterest-${imageData.id}-${index}.jpg`
      : `pinterest-${Date.now()}-${index}.jpg`;
    const filePath = path.join(OUTPUT_DIR, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      downloadedUrls.add(imageData.url);
      return { success: true, reason: 'exists' };
    }
    
    const response = await axios({
      method: 'GET',
      url: imageData.url,
      responseType: 'arraybuffer',
      headers: getHeaders(),
      timeout: 30000,
    });
    
    // Check if it's actually an image
    const contentType = response.headers['content-type'] || '';
    if (!contentType.startsWith('image/')) {
      return { success: false, reason: 'not_image' };
    }
    
    // Save the image
    fs.writeFileSync(filePath, response.data);
    downloadedUrls.add(imageData.url);
    
    // Save metadata
    const metadata = {
      id: imageData.id,
      url: imageData.url,
      description: imageData.description,
      filename: filename,
      fileSize: response.data.length,
      downloadedAt: new Date().toISOString(),
    };
    
    const metadataPath = path.join(OUTPUT_DIR, `${filename.replace(/\.[^/.]+$/, '')}-metadata.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    return { success: true, filePath };
  } catch (error) {
    failedUrls.push({ url: imageData.url, error: error.message });
    return { success: false, reason: error.message };
  }
}

// Main scraping function
async function scrapePinterest() {
  console.log('🚀 Starting Pinterest Scraper');
  console.log(`🔍 Search Query: ${SEARCH_QUERY}`);
  console.log(`📊 Target: ${MAX_IMAGES} images`);
  console.log(`📁 Output Directory: ${OUTPUT_DIR}`);
  console.log('─'.repeat(60));
  
  let bookmark = null;
  let pageCount = 0;
  const allImageData = [];
  
  // Collect image URLs first
  console.log('\n📥 Collecting image URLs...');
  while (allImageData.length < MAX_IMAGES) {
    pageCount++;
    console.log(`\n📄 Fetching page ${pageCount}...`);
    
    const result = await fetchPinterestSearch(SEARCH_QUERY, bookmark);
    
    if (!result.data) {
      console.log('⚠️  No data received, waiting before retry...');
      await delay(DELAY_BETWEEN_REQUESTS * 2);
      continue;
    }
    
    const imageUrls = extractImageUrls(result.data);
    
    if (imageUrls.length === 0) {
      console.log('⚠️  No images found on this page');
      break;
    }
    
    // Add new images (avoid duplicates)
    imageUrls.forEach(img => {
      if (!downloadedUrls.has(img.url) && allImageData.length < MAX_IMAGES) {
        allImageData.push(img);
      }
    });
    
    console.log(`✅ Found ${imageUrls.length} images (Total: ${allImageData.length}/${MAX_IMAGES})`);
    
    bookmark = result.bookmark;
    if (!bookmark) {
      console.log('⚠️  No more pages available');
      break;
    }
    
    // Delay between page requests
    await delay(DELAY_BETWEEN_REQUESTS);
  }
  
  console.log(`\n✅ Collected ${allImageData.length} unique image URLs`);
  console.log('─'.repeat(60));
  console.log('\n📥 Starting download process...\n');
  
  // Download images in batches
  for (let i = 0; i < allImageData.length; i += BATCH_SIZE) {
    const batch = allImageData.slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map((img, idx) => 
      downloadImage(img, i + idx).then(result => {
        if (result.success) {
          downloadedCount++;
          if (downloadedCount % 10 === 0) {
            console.log(`✅ Downloaded: ${downloadedCount}/${allImageData.length} images`);
          }
        } else {
          failedCount++;
        }
        return result;
      })
    );
    
    await Promise.all(batchPromises);
    
    // Progress update
    const progress = ((i + batch.length) / allImageData.length * 100).toFixed(1);
    console.log(`📊 Progress: ${progress}% (${i + batch.length}/${allImageData.length})`);
    
    // Delay between batches
    if (i + BATCH_SIZE < allImageData.length) {
      await delay(DELAY_BETWEEN_REQUESTS);
    }
  }
  
  // Final summary
  console.log('\n' + '─'.repeat(60));
  console.log('✨ Scraping Complete!');
  console.log('─'.repeat(60));
  console.log(`✅ Successfully downloaded: ${downloadedCount} images`);
  console.log(`❌ Failed downloads: ${failedCount} images`);
  console.log(`📁 Images saved to: ${OUTPUT_DIR}`);
  
  // Save failed URLs for retry
  if (failedUrls.length > 0) {
    const failedPath = path.join(OUTPUT_DIR, 'failed-downloads.json');
    fs.writeFileSync(failedPath, JSON.stringify(failedUrls, null, 2));
    console.log(`📋 Failed URLs saved to: ${failedPath}`);
  }
  
  // Save summary
  const summary = {
    searchQuery: SEARCH_QUERY,
    totalFound: allImageData.length,
    downloaded: downloadedCount,
    failed: failedCount,
    outputDirectory: OUTPUT_DIR,
    completedAt: new Date().toISOString(),
  };
  
  const summaryPath = path.join(OUTPUT_DIR, 'scraping-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`📊 Summary saved to: ${summaryPath}`);
}

// Run the scraper
scrapePinterest().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

