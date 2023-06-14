import axios from 'axios';

const API_KEY = '37206496-4ba23d7a61facc457fce3b97c';
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true`;

export async function searchImages(searchQuery, page) {
  const apiUrl = `${BASE_URL}&q=${searchQuery}&page=${page}&per_page=40`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data.hits;
    return data;
  } catch (error) {
    throw new Error('An error occurred while fetching images.');
  }
}
