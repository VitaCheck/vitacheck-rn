// import React from 'react';
// import { View, Text, Image } from 'react-native';

// const logo = require('../assets/logo.png');
// const character = require('../assets/main.png');

// const MainTop = () => {
//   return (
//     <View className="flex-row items-center justify-between px-6 py-4 bg-[#FFE88D]">
//       <View className="flex-1 pr-3">
//         <Text className="text-[22px] font-semibold text-gray-700">
//           건강한 선택을 돕는
//         </Text>
//         <Image
//           source={logo}
//           resizeMode="contain"
//           className="w-[220px] h-[52px] mt-2"
//         />
//       </View>
//       <View className="items-end">
//         <Image source={character} resizeMode="contain" className="w-40 h-40" />
//       </View>
//     </View>
//   );
// };

// export default MainTop;

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const logo = require('../assets/logo.png');
const character = require('../assets/main.png');

const MainTop = () => {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Text style={styles.title}>건강한 선택을 돕는</Text>
        <Image source={logo} resizeMode="contain" style={styles.logo} />
      </View>
      <View style={styles.right}>
        <Image
          source={character}
          resizeMode="contain"
          style={styles.character}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFE88D',
  },
  left: { flex: 1, paddingRight: 12 },
  title: { fontSize: 22, fontWeight: '600', color: '#4B5563' },
  logo: { width: 220, height: 52, marginTop: 8 },
  right: { alignItems: 'flex-end' },
  character: { width: 160, height: 160 },
});

export default MainTop;
