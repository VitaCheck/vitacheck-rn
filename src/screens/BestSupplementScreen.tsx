// import React from 'react';
// import { View, Text } from 'react-native';

// const BestSupplementScreen = () => {
//   return (
//     <View className="flex-1 p-6">
//       <Text className="text-[18px] font-bold">인기 영양제 더보기</Text>
//     </View>
//   );
// };

// export default BestSupplementScreen;

import React from 'react';
import { View, Text } from 'react-native';

const BestSupplementScreen = () => {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>
        인기 영양제 더보기
      </Text>
    </View>
  );
};

export default BestSupplementScreen;
