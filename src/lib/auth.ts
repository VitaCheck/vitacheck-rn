// src/lib/auth.ts
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'auth-storage' });

const AT_KEY = 'accessToken';
const RT_KEY = 'refreshToken';

const mask = (t?: string | null) =>
  t ? `${t.slice(0, 4)}...${t.slice(-6)}` : 'none';

export const saveTokens = (
  accessToken: string,
  refreshToken?: string | null,
) => {
  // accessToken은 필수 저장
  storage.set(AT_KEY, accessToken);

  // refreshToken이 넘어오면 갱신, 없으면 기존 값 유지
  if (typeof refreshToken === 'string') {
    storage.set(RT_KEY, refreshToken);
  }

  if (__DEV__) {
    console.debug(
      '[AUTH] saveTokens AT:',
      mask(accessToken),
      'RT:',
      mask(storage.getString(RT_KEY)),
    );
  }
};

export const getAccessToken = (): string | null => {
  return storage.getString(AT_KEY) ?? null;
};

export const getRefreshToken = (): string | null => {
  return storage.getString(RT_KEY) ?? null;
};

export const clearTokens = () => {
  storage.delete(AT_KEY);
  storage.delete(RT_KEY);
  if (__DEV__) console.debug('[AUTH] clearTokens');
};
