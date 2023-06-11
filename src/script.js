import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const API_KEY = '37206496-4ba23d7a61facc457fce3b97c';
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true`;

let page = 1;
let currentSearchQuery = '';

const fetchImages = async searchQuery => {
  try {
    const url = `${BASE_URL}&q=${encodeURIComponent(searchQuery)}&page=${page}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error('Something went wrong while fetching images.');
  }
};

const createImageCard = image => {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = document.createElement('p');
  likes.classList.add('info-item');
  likes.textContent = `Likes: ${image.likes}`;

  const views = document.createElement('p');
  views.classList.add('info-item');
  views.textContent = `Views: ${image.views}`;

  const downloads = document.createElement('p');
  downloads.classList.add('info-item');
  downloads.textContent = `Downloads: ${image.downloads}`;

  info.append(likes, views, downloads);
  card.append(img, info);

  return card;
};

const handleSearch = async event => {
  event.preventDefault();
  gallery.innerHTML = '';
  loadMoreBtn.style.display = 'none';

  const formData = new FormData(event.target);
  const searchQuery = formData.get('searchQuery');
  currentSearchQuery = searchQuery;

  if (searchQuery.trim() === '') {
    Notiflix.Notify.warning('Please enter a search query.');
    return;
  }

  try {
    const data = await fetchImages(searchQuery);

    if (data.hits.length === 0) {
      Notiflix.Notify.info('No images found for your search query.');
      return;
    }

    const cards = data.hits.map(createImageCard);
    gallery.append(...cards);

    if (data.totalHits > gallery.childElementCount) {
      loadMoreBtn.style.display = 'block';
    } else {
      Notiflix.Notify.info('No more images to load.');
    }
  } catch (error) {
    Notiflix.Notify.failure('Failed to fetch images. Please try again later.');
  }
};

const loadMoreImages = async () => {
  page += 1;

  try {
    const data = await fetchImages(currentSearchQuery);

    if (data.hits.length === 0) {
      Notiflix.Notify.info('No more images to load.');
      return;
    }

    const cards = data.hits.map(createImageCard);
    gallery.append(...cards);

    if (data.totalHits <= gallery.childElementCount) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info('No more images to load.');
    }
  } catch (error) {
    Notiflix.Notify.failure('Failed to fetch images. Please try again later.');
  }
};

searchForm.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', loadMoreImages);

const lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});
