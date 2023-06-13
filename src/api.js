const API_KEY = '37206496-4ba23d7a61facc457fce3b97c';
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true`;

export async function searchImages(searchQuery, page) {
  const apiUrl = `${BASE_URL}&q=${searchQuery}&page=${page}&per_page=40`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.hits;
}
