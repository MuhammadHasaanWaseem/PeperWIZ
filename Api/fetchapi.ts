import axios from 'axios';

// Public API Keys (Free tier)
const PIXABAY_API_KEY = process.env.EXPO_PUBLIC_API_KEY || '50843965-e86a3a948eccd30b42feac8d7'; // Public demo key
const PEXELS_API_KEY = process.env.EXPO_PUBLIC_PEXELS_KEY || 'your-pexels-key'; // Get free key from pexels.com/api
const UNSPLASH_ACCESS_KEY = process.env.EXPO_PUBLIC_UNSPLASH_KEY || 'your-unsplash-key'; // Get free key from unsplash.com/developers

// Pixabay API
const formatPixabayUrl = (params: any = {}) => {
  let url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&per_page=200&safesearch=false&editors_choice=true`;

  const paramKeys = Object.keys(params);
  paramKeys.forEach(key => {
    if (params[key] && params[key] !== '') {
      const value = key === 'q' ? encodeURIComponent(params[key]) : params[key];
      url += `&${key}=${value}`;
    }
  });

  return url;
};

// Pexels API (Free, requires API key - get from pexels.com/api)
const formatPexelsUrl = (params: any = {}) => {
  const query = params.q || params.category || 'nature';
  const page = params.page || 1;
  const perPage = 80; // Max per page
  
  return `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;
};

// Unsplash API
const formatUnsplashUrl = (params: any = {}) => {
  const query = params.q || params.category || 'nature';
  const page = params.page || 1;
  const perPage = 30;
  
  if (UNSPLASH_ACCESS_KEY && UNSPLASH_ACCESS_KEY !== 'your-unsplash-key') {
    return `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;
  }
  return null; // Unsplash requires API key
};

// Transform Pexels response to match Pixabay format
const transformPexelsData = (data: any) => {
  if (!data || !data.photos) return [];
  return data.photos.map((photo: any) => ({
    id: photo.id,
    webformatURL: photo.src.large,
    previewURL: photo.src.medium,
    largeImageURL: photo.src.original || photo.src.large2x,
    imageWidth: photo.width,
    imageHeight: photo.height,
    tags: photo.alt || '',
    user: photo.photographer,
    likes: 0,
    downloads: 0,
  }));
};

// Transform Unsplash response to match Pixabay format
const transformUnsplashData = (data: any) => {
  if (!data || !data.results) return [];
  return data.results.map((photo: any) => ({
    id: photo.id,
    webformatURL: photo.urls.regular,
    previewURL: photo.urls.small,
    largeImageURL: photo.urls.full || photo.urls.raw,
    imageWidth: photo.width,
    imageHeight: photo.height,
    tags: photo.description || photo.alt_description || '',
    user: photo.user.name,
    likes: photo.likes,
    downloads: 0,
  }));
};

// Main API call function with fallback to multiple sources
export const apiCall = async (params: any = {}) => {
  const page = params.page || 1;
  const useMultipleSources = params.useMultipleSources !== false; // Default true

  // Try Pixabay first (primary source)
  try {
    const pixabayUrl = formatPixabayUrl({ ...params, page });
    const pixabayResponse = await axios.get(pixabayUrl);
    const pixabayData = pixabayResponse.data;
    
    if (pixabayData.hits && pixabayData.hits.length > 0) {
      return {
        success: true,
        data: pixabayData.hits,
        totalHits: pixabayData.totalHits || pixabayData.hits.length,
        source: 'pixabay',
      };
    }
  } catch (err: any) {
    console.log('Pixabay API error:', err.message);
  }

  // If Pixabay fails or returns no results, try Pexels
  if (useMultipleSources && PEXELS_API_KEY && PEXELS_API_KEY !== 'your-pexels-key') {
    try {
      const pexelsUrl = formatPexelsUrl({ ...params, page });
      const pexelsResponse = await axios.get(pexelsUrl, {
        headers: { 'Authorization': PEXELS_API_KEY }
      });
      const pexelsData = pexelsResponse.data;
      const transformed = transformPexelsData(pexelsData);
      
      if (transformed.length > 0) {
        return {
          success: true,
          data: transformed,
          totalHits: pexelsData.total_results || transformed.length,
          source: 'pexels',
        };
      }
    } catch (err: any) {
      console.log('Pexels API error:', err.message);
    }

    // Try Unsplash as last resort (requires API key)
    try {
      const unsplashUrl = formatUnsplashUrl({ ...params, page });
      if (unsplashUrl) {
        const unsplashResponse = await axios.get(unsplashUrl, {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        });
        const unsplashData = unsplashResponse.data;
        const transformed = transformUnsplashData(unsplashData);
        
        if (transformed.length > 0) {
          return {
            success: true,
            data: transformed,
            totalHits: unsplashData.total || transformed.length,
            source: 'unsplash',
          };
        }
      }
    } catch (err: any) {
      console.log('Unsplash API error:', err.message);
    }
  }

  // Fallback: Return empty array
  return {
    success: false,
    data: [],
    msg: 'No images found from any source',
  };
};


// const API_KEY = '50843965-e86a3a948eccd30b42feac8d7';
// const BASE_URL = 'https://pixabay.com/api/';

// export interface PixabayImage {
//   id: number;
//   pageURL: string;
//   type: string;
//   tags: string;
//   previewURL: string;
//   previewWidth: number;
//   previewHeight: number;
//   webformatURL: string;
//   webformatWidth: number;
//   webformatHeight: number;
//   largeImageURL: string;
//   fullHDURL?: string;
//   imageURL?: string;
//   imageWidth: number;
//   imageHeight: number;
//   imageSize: number;
//   views: number;
//   downloads: number;
//   likes: number;
//   comments: number;
//   user_id: number;
//   user: string;
//   userImageURL: string;
// }

// interface PixabayResponse {
//   total: number;
//   totalHits: number;
//   hits: PixabayImage[];
// }

// export async function fetchPixabayImages(
//   q: string,
//   page: number = 1
// ): Promise<PixabayResponse> {
//   const url = new URL(BASE_URL);
//   url.searchParams.append('key', API_KEY);
//   url.searchParams.append('q', q);
//   url.searchParams.append('editors_choice', 'true');
//   url.searchParams.append('safesearch', 'false');
//   url.searchParams.append('per_page', '200');
//   url.searchParams.append('order', 'popular');
//   url.searchParams.append('page', page.toString());

//   const response = await fetch(url.toString());
//   if (!response.ok) {
//     throw new Error(`Pixabay API request failed: ${response.statusText}`);
//   }
//   const data: PixabayResponse = await response.json();
//   return data;
// }
