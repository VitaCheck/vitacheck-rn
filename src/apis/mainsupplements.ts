import AsyncStorage from '@react-native-async-storage/async-storage';
import API from './auth';

export type Gender = 'MALE' | 'FEMALE' | 'ALL';

export interface SupplementSummary {
  supplementId: number;
  supplementName: string;
  brandName: string;
  imageUrl: string;
  searchCount: number;
}

export interface PagedResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  };
}

interface PopularParams {
  ageGroup: string;
  page?: number;
  size?: number;
  gender?: Gender;
}

/**
 * 인기 영양제 조회 (비로그인 허용)
 * - gender 기본값은 'ALL'(미전달 시 전체로 처리)
 * - 로그인: Authorization 헤더는 API 인터셉터가 자동 처리
 * - 비로그인: 그냥 API 호출 (토큰 없으면 인터셉터가 헤더를 추가하지 않음)
 */
export async function getPopularSupplementsByAge({
  ageGroup,
  page = 0,
  size = 10,
  gender = 'ALL',
}: PopularParams): Promise<PagedResponse<SupplementSummary>> {
  const params: Record<string, string | number> = { ageGroup, page, size };
  if (gender !== 'ALL') params.gender = gender;

  // 토큰 여부 확인 (비로그인일 경우 Authorization 자동 제외됨)
  const token = await AsyncStorage.getItem('accessToken');

  const res = await API.get<PagedResponse<SupplementSummary>>(
    '/api/v1/supplements/popular-supplements',
    {
      params,
      // 토큰 없는 경우에는 인터셉터에서 헤더를 붙이지 않음
      headers: token ? undefined : {},
    },
  );

  return res.data;
}
