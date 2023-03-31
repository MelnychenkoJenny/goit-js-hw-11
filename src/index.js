import ImageApiService from './js/fetchImages';
import LoadMoreBtn from './js/load-more-btn';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchNameImgForm = document.querySelector('#search-form');
const searchNameImgInput = document.querySelector('input[name="searchQuery"]');
const containerGallery = document.querySelector('.gallery-list');

const imageApiService = new ImageApiService();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });

searchNameImgForm.addEventListener('submit', onSearchImageClickBtn);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreImage);

function onSearchImageClickBtn(e) {
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
  imageApiService
    .fetchImages()
    .then(data => {
      if (data.hits.length === 0) {
        Notify.failure(
          'На жаль, немає зображень, які відповідають вашому пошуковому запиту. Будь ласка спробуйте ще раз :)'
        );
        loadMoreBtn.hide();
      } else if (data.hits.length < 12) {
        Notify.success(`Ура! Ми знайшли ${data.totalHits} зображень/зображення.`);
        loadMoreBtn.hide();
      }
      Notify.success(`Ура! Ми знайшли ${data.totalHits} зображень/зображення.`);
      containerGallery.insertAdjacentHTML('beforeend', makeGalleryMarkUp(data));
      loadMoreBtn.enable();
    })
    .catch(er => console.log(er));
}

function onLoadMoreImage() {
  imageApiService.incrementPage();
  loadMoreBtn.disable();

  imageApiService
    .fetchImages()
    .then(data => {
      if (Math.ceil(data.totalHits / imageApiService.count) === imageApiService.page) {
        Notify.failure(
          'Вибачте, але Ви досягли кінця результатів пошуку.'
        );
        loadMoreBtn.hide();
      }
      Notify.success(`Ура! Ми знайшли ${data.totalHits - imageApiService.count} зображень/зображення.`);
      containerGallery.insertAdjacentHTML('beforeend', makeGalleryMarkUp(data));
      loadMoreBtn.enable();
    })
    .catch(er => console.log(er));
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
