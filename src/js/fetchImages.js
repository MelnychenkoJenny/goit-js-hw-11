import axios from 'axios';
const API_KEY = '34879645-22f56e50c3160d67803a5d79c';
const API_URL = 'https://pixabay.com/api/';

export default async function fetchImages(searchName) {
  const response = await fetch(
    `${API_URL}?key=${API_KEY}&q=${searchName}&image_type=photo&orientation=horizontal&safesearch=true&lang=pl,bg`
  );
  if (!response.ok) {
    throw new Error(response.status);
  }
  return await response.json();
}
