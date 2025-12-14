const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Image URL to scrape
const IMAGE_URL = 'https://i.pinimg.com/736x/59/cd/b2/59cdb2d00d15b6d2eb09a4e97ffae850.jpg';

// Output directory
const OUTPUT_DIR = path.join(__dirname, '..', 'assets', 'scraped-images');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function scrapeImage() {
  try {
    console.log('🔄 Starting image scrape...');
    console.log(`📥 Downloading from: ${IMAGE_URL}`);

    // Download the image
    const response = await axios({
      method: 'GET',
      url: IMAGE_URL,
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    // Extract filename from URL or use timestamp
    const urlParts = IMAGE_URL.split('/');
    const filename = urlParts[urlParts.length - 1] || `image-${Date.now()}.jpg`;
    const filePath = path.join(OUTPUT_DIR, filename);

    // Save the image
    fs.writeFileSync(filePath, response.data);
    console.log(`✅ Image saved to: ${filePath}`);

    // Extract metadata
    const metadata = {
      url: IMAGE_URL,
      filename: filename,
      filePath: filePath,
      fileSize: response.data.length,
      fileSizeMB: (response.data.length / (1024 * 1024)).toFixed(2),
      contentType: response.headers['content-type'] || 'image/jpeg',
      contentLength: response.headers['content-length'],
      lastModified: response.headers['last-modified'],
      etag: response.headers['etag'],
      date: new Date().toISOString(),
      headers: response.headers,
    };

    // Save metadata to JSON file
    const metadataPath = path.join(OUTPUT_DIR, `${filename.replace(/\.[^/.]+$/, '')}-metadata.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`📋 Metadata saved to: ${metadataPath}`);

    // Display summary
    console.log('\n📊 Image Information:');
    console.log('─'.repeat(50));
    console.log(`File Name: ${filename}`);
    console.log(`File Size: ${metadata.fileSizeMB} MB (${metadata.fileSize} bytes)`);
    console.log(`Content Type: ${metadata.contentType}`);
    console.log(`Saved At: ${filePath}`);
    console.log(`Download Date: ${metadata.date}`);
    if (metadata.lastModified) {
      console.log(`Last Modified: ${metadata.lastModified}`);
    }
    console.log('─'.repeat(50));

    // Try to extract image dimensions if possible
    try {
      const imageBuffer = Buffer.from(response.data);
      // Basic JPEG header parsing for dimensions
      if (imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8) {
        console.log('📐 Image Type: JPEG detected');
        // Note: Full dimension extraction would require a library like 'sharp' or 'jimp'
        console.log('💡 Tip: Install "sharp" package for detailed image metadata extraction');
      }
    } catch (err) {
      console.log('⚠️  Could not extract image dimensions (install "sharp" for full metadata)');
    }

    console.log('\n✨ Scraping completed successfully!');
    return metadata;

  } catch (error) {
    console.error('❌ Error scraping image:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Status Text: ${error.response.statusText}`);
    } else if (error.request) {
      console.error('No response received');
    } else {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

// Run the scraper
scrapeImage();

