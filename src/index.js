import ImageApiService from './js/fetchImages';
import LoadMoreBtn from './js/load-more-btn';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';

const searchNameImgForm = document.querySelector('#search-form');
const searchNameImgInput = document.querySelector('input[name="searchQuery"]');
const containerGallery = document.querySelector('.gallery-list');

const imageApiService = new ImageApiService();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });
const imageLightbox = new SimpleLightbox('.gallery-list .gallery__link', {
  captionsData: 'alt',
  captionDelay: 250,
});

searchNameImgForm.addEventListener('submit', onSearchImageClickBtn);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreImage);

async function onSearchImageClickBtn(e) {
  e.preventDefault();

  imageApiService.query = e.target.searchQuery.value.trim();
  imageApiService.resetPage();
  if (imageApiService.query === '') {
    Notify.info('Будь ласка, заповніть поле для пошуку зображень');
    loadMoreBtn.hide();
    clearMarkUp();
    return;
  }

  loadMoreBtn.show();
  loadMoreBtn.disable();
  clearMarkUp();

  try {
    const response = await imageApiService.fetchImages();

    if (response.hits.length === 0) {
      Notify.failure(
        'На жаль, немає зображень, які відповідають вашому пошуковому запиту. Будь ласка спробуйте ще раз :)'
      );
      loadMoreBtn.hide();
      return;
    } else if (response.hits.length < 16) {
      Notify.success(
        `Ура! Ми знайшли ${response.totalHits} зображень/зображення.`
      );
      containerGallery.insertAdjacentHTML(
        'beforeend',
        makeGalleryMarkUp(response)
      );
      loadMoreBtn.hide();
      return
    }
    Notify.success(
      `Ура! Ми знайшли ${response.totalHits} зображень/зображення.`
    );
    containerGallery.insertAdjacentHTML(
      'beforeend',
      makeGalleryMarkUp(response)
    );

    imageLightbox.refresh();
    smoothScroll(1.2);
    loadMoreBtn.enable();
  } catch (error) {
    Notify.info('Вибачте. Сталася помилка.');
  }
}

async function onLoadMoreImage() {
  imageApiService.incrementPage();
  loadMoreBtn.disable();

  try {
    const response = await imageApiService.fetchImages();
    if (
      Math.ceil(response.totalHits / imageApiService.count) ===
      imageApiService.page
    ) {
      Notify.failure('Вибачте, але Ви досягли кінця результатів пошуку.');
      loadMoreBtn.hide();
    }
    Notify.success(
      `Ура! Ми знайшли ще ${
        response.totalHits - imageApiService.count
      } зображень/зображення.`
    );
    containerGallery.insertAdjacentHTML(
      'beforeend',
      makeGalleryMarkUp(response)
    );
    
    imageLightbox.refresh();
    smoothScroll(2);
    loadMoreBtn.enable();
  } catch (error) {
    Notify.info('Вибачте. Сталася помилка.');
  }
}

function makeGalleryMarkUp({ hits }) {
  const markUp = hits.map(
    ({
      comments,
      downloads,
      largeImageURL,
      webformatURL,
      views,
      tags,
      likes,
    }) => {
      return `<li class="gallery__item">
    <a href="${largeImageURL}" class="gallery__link link">
      <div class="gallery__thumb"><img src="${webformatURL}" alt="${tags}" class="gallery__img" width="300" loading="lazy"></div>
      <div class="box-info">
    <ul class="gallery-info list">
      <li class="gallery-info__item">
        <p class="gallery-info__text">
          <b>
    Лайки
        </b>
        ${likes}
      </p>
      </li>
      <li class="gallery-info__item">
        <p class="gallery-info__text">
          <b class="gallery-info__value">
    Комментарі
        </b>
        ${comments}
      </p>
      </li>
      <li class="gallery-info__item">
        <p class="gallery-info__text">
          <b class="gallery-info__value">
    Перегляди
        </b>
        ${views}
      </p>
      </li>
      <li class="gallery-info__item">
        <p class="gallery-info__text">
          <b class="gallery-info__value">
    Завантаження
        </b>
        ${downloads}
      </p>
      </li>
    </ul>
    </div>
    </a>
    </li>
    `;
    }
  );
  return markUp.join('');
}

function clearMarkUp() {
  containerGallery.innerHTML = '';
  searchNameImgInput.value = '';
}

function smoothScroll(num) {
  const { height: cardHeight } = document
    .querySelector('.gallery-list')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * num,
    behavior: 'smooth',
  });
}

window.onscroll = debounce(function () {
  scrollFunction();
}, 300);

function scrollFunction() {
  console.log(document.body.scrollTop);
  console.log(document.documentElement.scrollTop);
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    document.getElementById('topBtn').style.display = 'block';
  } else {
    document.getElementById('topBtn').style.display = 'none';
  }
}

const topBtn = document.querySelector('.top-btn');
topBtn.addEventListener('click', topFunction);
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
