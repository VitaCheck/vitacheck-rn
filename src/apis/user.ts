import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import API from './auth';

export interface UserInfo {
  email: string;
  nickname: string;
  fullName: string;
  provider: string;
  age: number;
  birthDate: string;
  phoneNumber: string;
  profileImageUrl?: string;
  gender?: 'MALE' | 'FEMALE'; // 서버 스키마에 맞춰 optional
}

/** 내 정보 조회 */
export const getUserInfo = async (): Promise<UserInfo> => {
  const response = await API.get('/api/v1/users/me');
  return response.data.result as UserInfo;
};

export interface UpdateUserRequest {
  nickname?: string;
  birthDate?: string;
  phoneNumber?: string;
}

/** 내 정보 수정 */
export const updateUserInfo = async (payload: UpdateUserRequest) => {
  const res = await API.put('/api/v1/users/me', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

/** 프로필 이미지 변경 */
export const updateProfileImageUrl = async (profileImageUrl: string) => {
  const res = await API.patch(
    '/api/v1/users/me/profile-image',
    { profileImageUrl },
    { headers: { 'Content-Type': 'application/json' } },
  );
  return res.data;
};

/** 내 프로필 이미지 URL 조회 */
export const getMyProfileImageUrl = async (): Promise<string | null> => {
  const res = await API.get<{
    isSuccess: boolean;
    code: string;
    message: string;
    result: string | null;
  }>('/api/v1/users/me/profile-image', {
    params: { _t: Date.now() },
  });
  return res.data.result ?? null;
};

/** FCM 토큰 서버에 갱신 */
export async function updateFcmTokenWithAsyncStorage() {
  const [fcmToken, accessToken] = await AsyncStorage.multiGet([
    'fcmToken',
    'accessToken',
  ]).then(pairs => pairs.map(([, v]) => v));

  if (!fcmToken || !accessToken) return;

  const baseUrl = Config.API_BASE_URL;

  await fetch(`${baseUrl}/api/v1/users/me/fcm-token`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ fcmToken }),
  });
}

/** 내 계정 삭제 */
export const deleteMyAccount = async (): Promise<void> => {
  await API.delete('/api/v1/users/me', {
    validateStatus: s => s === 200 || s === 204,
  });
};
