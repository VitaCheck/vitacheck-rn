// src/screens/AlarmScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from '../lib/axios';
import { getAccessToken } from '../lib/auth';
import type { DayOfWeek, Supplement } from '../types/alarm';
import {
  fmtYmd,
  normalizeSupplement,
  fixTime,
  formatTimes,
} from '../utils/alarm';

const DOW_KEYS: DayOfWeek[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const uniq = <T,>(a: T[]) => Array.from(new Set(a));

/** 선택 요일의 시간만 추출 + HH:mm 정규화(+고유/정렬) */
const timesForDay = (s: Supplement, dow: DayOfWeek): string[] => {
  if (Array.isArray(s.schedules) && s.schedules.length) {
    const onlyDay = s.schedules
      .filter(sch => sch?.dayOfWeek === dow)
      .map(sch => fixTime(sch?.time))
      .filter(Boolean);
    return uniq(onlyDay).sort((x, y) => x.localeCompare(y));
  }
  return uniq((s.times ?? []).map(fixTime).filter(Boolean)).sort((x, y) =>
    x.localeCompare(y),
  );
};

const today = new Date();
const todayStr = fmtYmd(today);

export default function AlarmScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());

  /** 선택한 날짜 기준 루틴 목록만 조회 */
  const fetchSupplementsByDate = async (date: Date) => {
    const ymd = fmtYmd(date);
    const dowKey = DOW_KEYS[date.getDay()];
    const tzOffset = -new Date().getTimezoneOffset();

    const res = await axios.get('/api/v1/notifications/routines', {
      params: { date: ymd, tzOffset },
    });

    const body = res.data;
    const rawList: any[] = Array.isArray(body?.result)
      ? body.result
      : Array.isArray(body)
      ? body
      : Array.isArray(body?.data)
      ? body.data
      : Array.isArray(body?.content)
      ? body.content
      : [];

    const normalized: Supplement[] = rawList
      .map(normalizeSupplement)
      .filter(
        s =>
          (s.daysOfWeek?.length ?? 0) === 0 || s.daysOfWeek?.includes(dowKey),
      )
      .map(s => ({
        ...s,
        times: timesForDay(s, dowKey),
        isTaken: typeof s.isTaken === 'boolean' ? s.isTaken : false,
      }));

    setSupplements(normalized);
  };

  useEffect(() => {
    const run = async () => {
      const at = getAccessToken();

      if (!at) {
        Alert.alert('로그인 필요', '로그인 해주세요.');
        return;
      }

      try {
        await fetchSupplementsByDate(selectedDate);
      } catch (e: any) {
        const st = e?.response?.status ?? 'NA';
        if (st === 401) {
          Alert.alert(
            '로그인 필요',
            '세션이 만료되었습니다. 다시 로그인 해주세요.',
          );
        } else {
          Alert.alert('오류', `루틴을 불러오지 못했어요. (status: ${st})`);
        }
      }
    };

    run();
  }, [selectedDate]);

  // 진행률(서버 isTaken 기준)
  const percentComplete = useMemo(() => {
    if (!supplements.length) return 0;
    const taken = supplements.filter(s => s.isTaken).length;
    return Math.round((taken / supplements.length) * 100);
  }, [supplements]);

  // 토글 → 서버값 우선 확정, 없으면 재조회
  const handleItemToggle = async (id: number) => {
    if (togglingIds.has(id)) return;

    // 낙관적 토글
    setSupplements(prev =>
      prev.map(s =>
        s.notificationRoutineId === id ? { ...s, isTaken: !s.isTaken } : s,
      ),
    );
    setTogglingIds(prev => new Set(prev).add(id));

    try {
      await axios.post(`/api/v1/notifications/records/${id}/toggle`, null, {
        params: { date: fmtYmd(selectedDate) },
      });
      await fetchSupplementsByDate(selectedDate);
    } catch (err) {
      // 롤백
      setSupplements(prev =>
        prev.map(s =>
          s.notificationRoutineId === id ? { ...s, isTaken: !s.isTaken } : s,
        ),
      );
      Alert.alert('오류', '섭취 상태 업데이트에 실패했습니다.');
    } finally {
      setTogglingIds(prev => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  };

  const marked = {
    [fmtYmd(selectedDate)]: { selected: true, selectedColor: '#FFDB67' },
    [todayStr]: { marked: true, dotColor: '#E7E7E7' },
  };

  const getCatEmoji = () => {
    if (percentComplete === 100) return '😺';
    if (percentComplete > 0) return '😼';
    return '😵‍💫';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.titleWrap}>
        <Text style={styles.title}>섭취 알림</Text>
      </View>

      {supplements.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>오늘은 섭취할 영양제가 없어요!</Text>
        </View>
      ) : (
        <View style={styles.progressWrap}>
          <Text style={styles.catFace}>{getCatEmoji()}</Text>
          <Text style={styles.progressNumber}>{percentComplete}%</Text>
          <Text style={styles.progressLabel}>섭취 완료</Text>
        </View>
      )}

      <View style={styles.calendarWrap}>
        <Calendar
          current={fmtYmd(selectedDate)}
          onDayPress={d => setSelectedDate(new Date(d.dateString))}
          markedDates={marked}
          theme={{
            arrowColor: '#111',
            monthTextColor: '#111',
            textSectionTitleColor: '#777',
            todayTextColor: '#111',
          }}
        />
      </View>

      <Pressable
        style={styles.manageBtn}
        onPress={() => {
          /* navigate to settings */
        }}
      >
        <Text style={styles.manageBtnPlus}>＋</Text>
        <Text style={styles.manageBtnText}>나의 영양제 관리</Text>
      </Pressable>

      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>💊 나의 영양제</Text>
      </View>

      <FlatList
        data={supplements}
        keyExtractor={s => String(s.notificationRoutineId)}
        contentContainerStyle={{ paddingBottom: 28 }}
        renderItem={({ item }) => {
          const toggling = togglingIds.has(item.notificationRoutineId);
          return (
            <Pressable
              onPress={() => handleItemToggle(item.notificationRoutineId)}
              disabled={toggling}
              style={[
                styles.card,
                item.isTaken ? styles.cardTaken : styles.cardDefault,
                toggling && { opacity: 0.6 },
              ]}
            >
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.supplementName}</Text>
                <Text style={styles.cardTimes}>{formatTimes(item.times)}</Text>
              </View>
              <View
                style={[styles.checkbox, item.isTaken && styles.checkboxOn]}
              >
                {item.isTaken ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF', padding: 16 },

  titleWrap: { marginTop: 4, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', color: '#111' },

  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F4F4F4',
    marginBottom: 12,
  },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#111' },

  progressWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  catFace: { fontSize: 40 },
  progressNumber: { fontSize: 34, fontWeight: '800', color: '#111' },
  progressLabel: { fontSize: 18, fontWeight: '700', color: '#111' },

  calendarWrap: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 16,
    overflow: 'hidden',
  },

  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    borderRadius: 18,
  },
  manageBtnPlus: { fontSize: 18, color: '#111' },
  manageBtnText: { fontSize: 18, fontWeight: '600', color: '#111' },

  listHeader: { marginTop: 16, marginBottom: 8 },
  listHeaderText: { fontSize: 18, fontWeight: '700', color: '#111' },

  card: {
    height: 86,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardDefault: { backgroundColor: '#FFF', borderColor: '#9C9A9A' },
  cardTaken: { backgroundColor: '#FFF8DC', borderColor: 'transparent' },

  cardText: { flex: 1, paddingRight: 12 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#111' },
  cardTimes: { fontSize: 16, color: '#808080', marginTop: 4 },

  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: '#FFC200',
    borderColor: 'transparent',
  },
  checkMark: { fontSize: 18, color: '#FFF', fontWeight: '900' },
});
