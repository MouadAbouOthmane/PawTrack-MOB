import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../afterWillbeEnv';
import {navigate, resetRoot} from './NavigationService';
import Toast from 'react-native-toast-message';

const API = axios.create({
  baseURL: API_URL,
});

// Request Interceptor: Attach token dynamically
API.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('agentToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle responses like unauthorized errors
API.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem('agentToken');
      resetRoot('Login');
      // navigate('Login'); // Redirects to Login screen
      Toast.show({
        type: 'error',
        text1: 'Session Expired',
        text2: 'Please log in again.',
        position: 'center',
        autoHide: true,
        visibilityTime: 3000,
      });
    } else if (error.response && error.response.status >= 500) {
      Toast.show({
        type: 'error',
        text1: 'Server Error',
        text2: 'Something went wrong. Please try again later.',
        position: 'center',
        autoHide: true,
        visibilityTime: 5000,
      });
    }
    return Promise.reject(error);
  },
);

export default API;
