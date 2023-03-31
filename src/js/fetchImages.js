import axios from 'axios';

const API_KEY = '34879645-22f56e50c3160d67803a5d79c';
const API_URL = 'https://pixabay.com/api/';

export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.count = 16;
  }

  // async function getUser() {
  //   try {
  //     const response = await axios.get('/user?ID=12345');
  //     console.log(response);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // lang=pl,bg&per_page=${this.count}&page=${this.page}

  async fetchImages() {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: {
          key: API_KEY,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          page: this.page,
          per_page: this.count,
          safesearch: true,
          lang: 'pl,bg',
        },
      });
      // console.log(response.json());
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
