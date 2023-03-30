import fetchImages from './js/fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchNameImgForm = document.querySelector('#search-form');
const searchNameImgInput = document.querySelector('input[name="searchQuery"]')
const containerGallery = document.querySelector('.gallery-list')
const loadMoreBtn = document.querySelector('.load-more')

searchNameImgForm.addEventListener('submit', onSearchImageClickBtn);

function onSearchImageClickBtn(e) {
  e.preventDefault();

  
  const searchNameImg = e.target.searchQuery.value.trim();
  if(searchNameImg==='') {
    Notify.info('Будь ласка, заповніть поле для пошуку зображень');
    clearMarkUp()
    loadMoreBtn.classList.add('is-hidden')
    return;
  }
  fetchImages(searchNameImg)
    .then((data) => {
        clearMarkUp();
        if(data.hits.length === 0) {
            Notify.failure('На жаль, немає зображень, які відповідають вашому пошуковому запиту. Будь ласка спробуйте ще раз :)')
        }
        Notify.success(`Ура! Ми знайшли ${data.totalHits} зображень/зображення.`);
       makeGalleryMarkUp(data);
       loadMoreBtn.classList.remove('is-hidden')

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
      <img src="${webformatURL}" alt="${tags}" class="gallery__img" width="300">
    </a>
    </li>
    <div class="box-info">
    <ul class="gallery-info list">
      <li class="gallery-info__item">
        <p class="gallery-info__text">
          <b class="gallery-info__value">
    Лайки:
        </b>
        ${likes}
      </p>
      </li>
      <li class="gallery-info__item">
        <p class="gallery-info__text">
          <b class="gallery-info__value">
    Комментарі:
        </b>
        ${comments}
      </p>
      </li>
      <li class="gallery-info__item">
        <p class="gallery-info__text">
          <b class="gallery-info__value">
    Перегляди:
        </b>
        ${views}
      </p>
      </li>
      <li class="gallery-info__item">
        <p class="gallery-info__text">
          <b class="gallery-info__value">
    Завантаження:
        </b>
        ${downloads}
      </p>
      </li>
    </ul>
    </div>`;
    }
  );
  containerGallery.innerHTML = markUp.join('')
}

  function clearMarkUp() {
    containerGallery.innerHTML = '';
    searchNameImgInput.value = "";
  }