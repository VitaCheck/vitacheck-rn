// src/lib/axios.ts
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from './auth';

/** ───────────────────────────────────────────────────────────
 * BASE_URL 결정
 * - .env: API_URL=https://api.example.com
 * - iOS 시뮬레이터: http://127.0.0.1:8000
 * - Android 에뮬레이터: http://10.0.2.2:8000
 * ─────────────────────────────────────────────────────────── */
const FROM_ENV = Config?.API_URL?.trim?.();
const DEFAULT_LOCAL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';

const BASE_URL = (FROM_ENV || DEFAULT_LOCAL).replace(/\/+$/, ''); // 끝 슬래시 제거

// RN에선 쿠키 RT 잘 안 씀(웹과 쿠키 저장소가 다름)
const USE_COOKIE_REFRESH = false;

// 공개 엔드포인트(AT 불필요)
const PUBLIC_PATH_PREFIXES: string[] = [
  '/api/v1/combinations/recommend',
  '/api/v1/supplements/search',
  '/api/v1/combinations/analyze',
];

// URL → pathname (RN 환경에서 URL API 미지원 대비)
const pathOf = (url?: string, base?: string) => {
  try {
    const full = (base || '') + (url || '');
    const m = full.match(/^[a-z]+:\/{2}[^/]+(\/[^?#]*)?/i);
    return m && m[1] ? m[1] : url || '/';
  } catch {
    return url ?? '/';
  }
};

// 공용 인스턴스
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: USE_COOKIE_REFRESH,
  timeout: 20000, // 기본 타임아웃
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// ───────── 요청 인터셉터: 보호 API에만 AT 부착 ─────────
api.interceptors.request.use(config => {
  const pathname = pathOf(config.url, (config as any).baseURL ?? BASE_URL);
  const isPublic = PUBLIC_PATH_PREFIXES.some(p => pathname.startsWith(p));
  const isRefresh = pathname.includes('/api/v1/auth/refresh');

  // refresh 요청은 Authorization 제거
  if (isRefresh) {
    if (config.headers) delete (config.headers as any).Authorization;
    return config;
  }

  const at = (getAccessToken() || '').trim();
  if (!isPublic && at && config.headers) {
    (config.headers as any).Authorization = `Bearer ${at}`;
  }
  return config;
});

let isRefreshing = false;
let queue: Array<(t: string | null) => void> = [];

// ───────── 내부: 토큰 리프레시 ─────────
const doRefresh = async (): Promise<string | null> => {
  if (isRefreshing) {
    return new Promise(resolve => queue.push(resolve));
  }
  isRefreshing = true;
  try {
    const res = await axios.post(
      `${BASE_URL}/api/v1/auth/refresh`,
      USE_COOKIE_REFRESH
        ? {}
        : { refreshToken: (getRefreshToken() || '').trim() },
      { withCredentials: USE_COOKIE_REFRESH, timeout: 15000 },
    );

    const data: any = res.data ?? {};
    const newAT =
      data?.result?.accessToken ?? data?.accessToken ?? data?.token ?? null;
    const newRT = data?.result?.refreshToken ?? data?.refreshToken ?? null;

    if (!newAT) throw new Error('No access token in refresh response');

    // RT가 없으면 기존 값 유지
    saveTokens(newAT, newRT ?? (getRefreshToken() || ''));

    queue.forEach(fn => fn(newAT));
    queue = [];
    return newAT;
  } catch {
    queue.forEach(fn => fn(null));
    queue = [];
    clearTokens();
    return null;
  } finally {
    isRefreshing = false;
  }
};

// ───────── 응답 인터셉터: 401 처리(리프레시 → 재시도) ─────────
api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const { config, response } = error;
    const original = config as AxiosRequestConfig & {
      __isRetryRequest?: boolean;
    };
    const status = response?.status ?? 0;

    // 재시도 루프 방지
    if (status !== 401 || original?.__isRetryRequest) {
      return Promise.reject(error);
    }

    const path = pathOf(original?.url, (original as any)?.baseURL ?? BASE_URL);
    const isPublic = PUBLIC_PATH_PREFIXES.some(p => path.startsWith(p));

    // 공개 API는 리프레시 안 함
    if (isPublic) return Promise.reject(error);

    // refresh 자체 401/403은 로그아웃 처리
    if (path.includes('/api/v1/auth/refresh')) {
      clearTokens();
      return Promise.reject(error);
    }

    // RT 없으면 리프레시 불가
    const rt = (getRefreshToken() || '').trim();
    if (!rt && !USE_COOKIE_REFRESH) {
      clearTokens();
      return Promise.reject(error);
    }

    const newAT = await doRefresh();
    if (!newAT) {
      clearTokens();
      return Promise.reject(error);
    }

    // 원 요청 재시도
    original.__isRetryRequest = true;
    original.headers = {
      ...(original.headers || {}),
      Authorization: `Bearer ${newAT}`,
    };
    return api(original);
  },
);

export default api;
