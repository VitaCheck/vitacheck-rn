// import React from 'react';
// import {
//   TouchableOpacity,
//   Image,
//   Text,
//   View,
//   ImageSourcePropType,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import type { RootStackParamList } from '../navigation/RootNavigator';

// type Nav = NativeStackNavigationProp<RootStackParamList>;

// interface MobileMainCardProps {
//   title: string;
//   icon: ImageSourcePropType; // PNG 권장
//   to: keyof RootStackParamList;
// }

// const MobileMainCard = ({ title, icon, to }: MobileMainCardProps) => {
//   const navigation = useNavigation<Nav>();

//   return (
//     <TouchableOpacity
//       className="w-[90px] items-center"
//       onPress={() => navigation.navigate(to)}
//     >
//       <View className="w-[90px] h-[90px] bg-[#f4f4f4] rounded-[18px] items-center justify-center">
//         <Image
//           source={icon}
//           resizeMode="contain"
//           className="w-[42px] h-[42px]"
//         />
//       </View>
//       <Text className="mt-[6px] text-[14px] font-medium text-black">
//         {title}
//       </Text>
//     </TouchableOpacity>
//   );
// };

// export default MobileMainCard;

import React from 'react';
import {
  TouchableOpacity,
  Image,
  Text,
  View,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface MobileMainCardProps {
  title: string;
  icon: ImageSourcePropType; // PNG 권장
  to: keyof RootStackParamList;
}

const MobileMainCard = ({ title, icon, to }: MobileMainCardProps) => {
  const navigation = useNavigation<Nav>();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate(to)}
    >
      <View style={styles.square}>
        <Image source={icon} resizeMode="contain" style={styles.icon} />
      </View>
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { width: 90, alignItems: 'center' },
  square: {
    width: 90,
    height: 90,
    backgroundColor: '#f4f4f4',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { width: 42, height: 42 },
  label: { marginTop: 6, fontSize: 14, fontWeight: '500', color: '#000' },
});

export default MobileMainCard;
