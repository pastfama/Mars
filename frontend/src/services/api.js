import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',  // Adjust this depending on where your backend is hosted
});

export default api;
