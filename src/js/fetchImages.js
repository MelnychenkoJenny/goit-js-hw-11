import axios from 'axios';

const API_KEY = '34879645-22f56e50c3160d67803a5d79c';
const API_URL = 'https://pixabay.com/api/';

export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.count = 12;
  }
  async fetchImages() {
    console.log(this);
    
    const response = await fetch(
      `${API_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&lang=pl,bg&per_page=${this.count}&page=${this.page}`
    );
    if (!response.ok) {
      throw new Error(response.status);
    }
    return await response.json();
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
