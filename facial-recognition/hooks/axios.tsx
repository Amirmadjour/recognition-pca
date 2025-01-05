import axios from "axios";
import Constants from "expo-constants";

const baseURLsm = () => {
  return 'http://192.168.1.33:8000/api';
};

const instance = axios.create({
  baseURL: baseURLsm(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Endpoints
export const endpoints = {
  hello: () => instance.get('/hello/'),
  pcaLetters: (imageBase64: string) => instance.post('/pca_letters/', { image: imageBase64 }),
  cnn_letters: (imageBase64: string) => instance.post('/cnn_letters/', { image: imageBase64 }),
  cnnPcaLetters: (imageBase64: string) => instance.post('/cnn_pca_letters/', { image: imageBase64 }),
};

// Intercepteurs pour le débogage
instance.interceptors.request.use(
  (config) => {
    console.log('Request:', config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;
