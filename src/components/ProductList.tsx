// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Modal,
//   Pressable,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import type { RootStackParamList } from '../navigation/RootNavigator';
// import ProductCard from './ProductCard';
// import { getUserInfo, type UserInfo } from '../apis/user';
// import {
//   getPopularSupplementsByAge,
//   type SupplementSummary,
//   type Gender,
// } from '../apis/mainsupplements';

// type Nav = NativeStackNavigationProp<RootStackParamList>;

// const ageOptions = ['10대', '20대', '30대', '40대', '50대', '60대 이상'];

// const mapAgeToGroup = (age: number): string => {
//   if (age < 20) return '10대';
//   if (age < 30) return '20대';
//   if (age < 40) return '30대';
//   if (age < 50) return '40대';
//   if (age < 60) return '50대';
//   return '60대 이상';
// };

// const ProductList = () => {
//   const navigation = useNavigation<Nav>();
//   const [selectedAge, setSelectedAge] = useState<string>('20대');
//   const [gender, setGender] = useState<Gender>('ALL');
//   const [open, setOpen] = useState(false);

//   const [items, setItems] = useState<SupplementSummary[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [loadError, setLoadError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUserAgeGroup = async () => {
//       try {
//         const user: UserInfo = await getUserInfo();
//         if (typeof user.age === 'number')
//           setSelectedAge(mapAgeToGroup(user.age));
//         if (user.gender === 'MALE' || user.gender === 'FEMALE')
//           setGender(user.gender);
//         else setGender('ALL');
//       } catch {
//         setGender('ALL');
//       }
//     };
//     fetchUserAgeGroup();
//   }, []);

//   useEffect(() => {
//     let ignore = false;
//     const fetchPopular = async () => {
//       try {
//         setLoading(true);
//         setLoadError(null);
//         const res = await getPopularSupplementsByAge({
//           ageGroup: selectedAge,
//           gender,
//           page: 0,
//           size: 10,
//         });
//         if (!ignore) setItems(res.result.content);
//       } catch {
//         if (!ignore) {
//           setItems([]);
//           setLoadError('인기 영양제 목록을 불러오지 못했습니다.');
//         }
//       } finally {
//         if (!ignore) setLoading(false);
//       }
//     };
//     fetchPopular();
//     return () => {
//       ignore = true;
//     };
//   }, [selectedAge, gender]);

//   const handlePressCard = (id: number | string) => {
//     // 상세 화면이 생기면 여기서 navigate
//   };

//   return (
//     <View className="px-6 pb-6">
//       {/* 헤더 */}
//       <View className="flex-row items-center justify-between mb-3">
//         <View className="flex-row items-center gap-x-3">
//           <Text className="text-[20px] font-bold">인기 영양제</Text>
//           <Pressable
//             onPress={() => setOpen(true)}
//             className="px-3 py-1.5 rounded-full border border-[#AAAAAA] bg-white"
//             accessibilityLabel="나이대 선택"
//           >
//             <Text className="text-[14px]">{selectedAge}</Text>
//           </Pressable>
//         </View>
//         <TouchableOpacity onPress={() => navigation.navigate('BestSupplement')}>
//           <Text className="text-[14px] text-black">더보기 {'>'}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* 나이대 선택 모달 */}
//       <Modal
//         visible={open}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setOpen(false)}
//       >
//         <Pressable
//           className="flex-1 bg-[rgba(0,0,0,0.25)] justify-center p-6"
//           onPress={() => setOpen(false)}
//         >
//           <View className="bg-white rounded-xl py-2">
//             {ageOptions.map(opt => {
//               const active = selectedAge === opt;
//               return (
//                 <Pressable
//                   key={opt}
//                   onPress={() => {
//                     setSelectedAge(opt);
//                     setOpen(false);
//                   }}
//                   className={`py-3 px-4 ${active ? 'bg-[#F3F4F6]' : ''}`}
//                 >
//                   <Text className={`text-[16px] ${active ? 'font-bold' : ''}`}>
//                     {opt}
//                   </Text>
//                 </Pressable>
//               );
//             })}
//           </View>
//         </Pressable>
//       </Modal>

//       {/* 상태 영역 */}
//       {loading && (
//         <View className="py-4 flex-row items-center gap-x-2">
//           <ActivityIndicator />
//           <Text className="text-[13px] text-[#797979]">불러오는 중입니다…</Text>
//         </View>
//       )}
//       {!!loadError && !loading && (
//         <View className="py-4 flex-row items-center gap-x-2">
//           <Text className="text-[13px] text-[#DC2626]">{loadError}</Text>
//         </View>
//       )}
//       {!loading && !loadError && items.length === 0 && (
//         <View className="py-4 flex-row items-center gap-x-2">
//           <Text className="text-[13px] text-[#797979]">
//             해당 나이대의 인기 영양제가 없습니다.
//           </Text>
//         </View>
//       )}

//       {/* 리스트 */}
//       {!loading && !loadError && items.length > 0 && (
//         <FlatList
//           horizontal
//           data={items}
//           keyExtractor={it => String(it.supplementId)}
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ columnGap: 12 }}
//           renderItem={({ item }) => (
//             <ProductCard
//               id={item.supplementId}
//               imageSrc={item.imageUrl}
//               name={item.supplementName}
//               onPress={handlePressCard}
//             />
//           )}
//         />
//       )}
//     </View>
//   );
// };

// export default ProductList;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import ProductCard from './ProductCard';
import { getUserInfo, type UserInfo } from '../apis/user';
import {
  getPopularSupplementsByAge,
  type SupplementSummary,
  type Gender,
} from '../apis/mainsupplements';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ageOptions = ['10대', '20대', '30대', '40대', '50대', '60대 이상'];

const mapAgeToGroup = (age: number): string => {
  if (age < 20) return '10대';
  if (age < 30) return '20대';
  if (age < 40) return '30대';
  if (age < 50) return '40대';
  if (age < 60) return '50대';
  return '60대 이상';
};

const ProductList = () => {
  const navigation = useNavigation<Nav>();
  const [selectedAge, setSelectedAge] = useState<string>('20대');
  const [gender, setGender] = useState<Gender>('ALL');
  const [open, setOpen] = useState(false);

  const [items, setItems] = useState<SupplementSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAgeGroup = async () => {
      try {
        const user: UserInfo = await getUserInfo();
        if (typeof user.age === 'number')
          setSelectedAge(mapAgeToGroup(user.age));
        if (user.gender === 'MALE' || user.gender === 'FEMALE')
          setGender(user.gender);
        else setGender('ALL');
      } catch {
        setGender('ALL');
      }
    };
    fetchUserAgeGroup();
  }, []);

  useEffect(() => {
    let ignore = false;
    const fetchPopular = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const res = await getPopularSupplementsByAge({
          ageGroup: selectedAge,
          gender,
          page: 0,
          size: 10,
        });
        if (!ignore) setItems(res.result.content);
      } catch {
        if (!ignore) {
          setItems([]);
          setLoadError('인기 영양제 목록을 불러오지 못했습니다.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchPopular();
    return () => {
      ignore = true;
    };
  }, [selectedAge, gender]);

  const handlePressCard = (_id: number | string) => {
    // 상세 화면이 생기면 여기서 navigate
  };

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <View style={styles.leftRow}>
          <Text style={styles.title}>인기 영양제</Text>
          <Pressable
            onPress={() => setOpen(true)}
            style={styles.dropdownBtn}
            accessibilityLabel="나이대 선택"
          >
            <Text style={styles.dropdownBtnText}>{selectedAge}</Text>
          </Pressable>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('BestSupplement')}>
          <Text style={styles.more}>더보기 {'>'}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <View style={styles.modalSheet}>
            {ageOptions.map(opt => (
              <Pressable
                key={opt}
                onPress={() => {
                  setSelectedAge(opt);
                  setOpen(false);
                }}
                style={[
                  styles.modalItem,
                  selectedAge === opt && styles.modalItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    selectedAge === opt && styles.modalItemTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {loading && (
        <View style={styles.stateWrap}>
          <ActivityIndicator />
          <Text style={styles.stateText}>불러오는 중입니다…</Text>
        </View>
      )}
      {!!loadError && !loading && (
        <View style={styles.stateWrap}>
          <Text style={[styles.stateText, { color: '#DC2626' }]}>
            {loadError}
          </Text>
        </View>
      )}
      {!loading && !loadError && items.length === 0 && (
        <View style={styles.stateWrap}>
          <Text style={styles.stateText}>
            해당 나이대의 인기 영양제가 없습니다.
          </Text>
        </View>
      )}

      {!loading && !loadError && items.length > 0 && (
        <FlatList
          horizontal
          data={items}
          keyExtractor={it => String(it.supplementId)}
          contentContainerStyle={{ columnGap: 12 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              id={item.supplementId}
              imageSrc={item.imageUrl}
              name={item.supplementName}
              onPress={handlePressCard}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: { paddingHorizontal: 24, paddingBottom: 24 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  leftRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  dropdownBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    backgroundColor: '#FFFFFF',
  },
  dropdownBtnText: { fontSize: 14 },
  more: { fontSize: 14, color: '#000000' },

  stateWrap: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  stateText: { fontSize: 13, color: '#797979' },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    padding: 24,
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
  },
  modalItem: { paddingVertical: 12, paddingHorizontal: 16 },
  modalItemActive: { backgroundColor: '#F3F4F6' },
  modalItemText: { fontSize: 16 },
  modalItemTextActive: { fontWeight: '700' },
});

export default ProductList;
