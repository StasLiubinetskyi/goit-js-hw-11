import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { searchImages } from './api';

const API_KEY = '37206496-4ba23d7a61facc457fce3b97c';
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let searchQuery = '';

form.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', loadMoreImages);

async function handleFormSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  searchQuery = form.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }
const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
});
  
  loadMoreBtn.classList.add('hidden');
  try {
    const images = await searchImages(searchQuery, page);
    if (images.length > 0) {
      createImageCards(images);
      if (images.length === 40) {
        loadMoreBtn.classList.remove('hidden');
      }
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('An error occurred while fetching images.');
  } finally {
    form.searchQuery.value = ''; 
}

function createImageCards(images) {
  const fragment = document.createDocumentFragment();
  for (const image of images) {
    const card = createImageCard(image);
    fragment.appendChild(card);
  }
  gallery.appendChild(fragment);
    
  lightbox.refresh();

  window.addEventListener('scroll', handleScroll);
}

function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const link = document.createElement('a');
  link.href = image.largeImageURL;
  link.setAttribute('data-lightbox', 'photos');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = createInfoItem('Likes', image.likes);
  const views = createInfoItem('Views', image.views);
  const comments = createInfoItem('Comments', image.comments);
  const downloads = createInfoItem('Downloads', image.downloads);

  info.append(likes, views, comments, downloads);
  link.appendChild(img);
  card.append(link, info);

  return card;
}

function createInfoItem(label, value) {
  const item = document.createElement('p');
  item.classList.add('info-item');
  item.innerHTML = `<b>${label}: </b>${value}`;
  return item;
}

async function loadMoreImages() {
  page++;
  try {
    const images = await searchImages(searchQuery, page);
    if (images.length > 0) {
      createImageCards(images);
      if (images.length < 40) {
        loadMoreBtn.classList.add('hidden');
      }
    } else {
      loadMoreBtn.classList.add('hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('An error occurred while fetching images.');
  }
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    window.removeEventListener('scroll', handleScroll);
    loadMoreImages();
  }
}
