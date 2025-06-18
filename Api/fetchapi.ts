import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY; // Your API key
const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

// Function to build the full URL with parameters
const formatUrl = (params:any = {}) => {
  let url = `${apiUrl}&per_page=200&safesearch=false&editors_choice=true`;

  const paramKeys = Object.keys(params);
  if (paramKeys.length === 0) return url;

  paramKeys.forEach(key => {
    const value = key === 'q' ? encodeURIComponent(params[key]) : params[key];
    url += `&${key}=${value}`;
  });

  //console.log('Final URL:', url);
  return url;
};

// Function to make the API call
export const apiCall = async (params:any) => {
  try {
    const response = await axios.get(formatUrl(params));
    const data = response.data;
    // console.log(data);
    return {
      success: true,
      data: data.hits || data,}

    
  } catch (err:any) {
    console.error('Got error:', err.message);
    return {
      success: false,
      msg: err.message,
    };
  }
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
