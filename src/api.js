const API_KEY = '37206496-4ba23d7a61facc457fce3b97c';
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true`;

export const fetchImages = async (searchQuery, page) => {
  try {
    const url = `${BASE_URL}&q=${encodeURIComponent(searchQuery)}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error('Something went wrong while fetching images.');
  }
};
