import axios, { AxiosHeaders } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

const API_BASE_URL = Config.API_BASE_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

API.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      // headers가 AxiosHeaders 인스턴스가 아니면 인스턴스로 감싸기
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      } else if (!(config.headers instanceof AxiosHeaders)) {
        config.headers = new AxiosHeaders(config.headers);
      }

      // 타입 안전하게 설정
      (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
      // 필요시 기본 헤더도 설정 가능
      // (config.headers as AxiosHeaders).set('Accept', 'application/json');
      // (config.headers as AxiosHeaders).set('Content-Type', 'application/json');
    }
    return config;
  },
  error => Promise.reject(error),
);

export default API;
