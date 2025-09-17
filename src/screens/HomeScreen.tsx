import React, { useCallback, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Item = { id: string; title: string };

const MOCK: Item[] = [
  { id: '1', title: 'First item' },
  { id: '2', title: 'Second item' },
  { id: '3', title: 'Third item' },
];

export default function HomeScreen({ navigation }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<Item[]>(MOCK);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // 보통 이곳에서 API 재호출
    setTimeout(() => {
      setData(prev => [...prev].reverse()); // 데모용: 순서 뒤집기
      setRefreshing(false);
    }, 800);
  }, []);

  const header = useMemo(
    () => (
      <View style={styles.header}>
        <Text style={styles.hello}>👋 Welcome back</Text>
        <Text style={styles.subtitle}>Here’s your list</Text>
        <TouchableOpacity
          style={styles.cta}
          onPress={() => navigation.navigate('Detail', { id: '1' })}
        >
          <Text style={styles.ctaText}>Go to Detail</Text>
        </TouchableOpacity>
      </View>
    ),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Item }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { id: item.id })}
      >
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardMeta}>id: {item.id}</Text>
      </TouchableOpacity>
    ),
    [navigation],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        ListHeaderComponent={header}
        data={data}
        keyExtractor={it => it.id}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 12 },
  hello: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 12 },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ctaText: { color: '#fff', fontWeight: '600' },
  card: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardMeta: { fontSize: 12, color: '#6B7280' },
  separator: { height: 12 },
});
