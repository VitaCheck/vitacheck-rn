// import React from 'react';
// import { TouchableOpacity, Image, Text } from 'react-native';

// interface Props {
//   id: number | string;
//   imageSrc: string;
//   name: string;
//   onPress?: (id: number | string) => void;
// }

// const ProductCard = ({ id, imageSrc, name, onPress }: Props) => {
//   return (
//     <TouchableOpacity className="w-[110px]" onPress={() => onPress?.(id)}>
//       <Image
//         source={{ uri: imageSrc }}
//         resizeMode="cover"
//         className="w-[110px] h-[100px] rounded-lg bg-[#EEE]"
//       />
//       <Text numberOfLines={2} className="mt-[6px] text-[15px] font-medium">
//         {name}
//       </Text>
//     </TouchableOpacity>
//   );
// };

// export default ProductCard;

import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

interface Props {
  id: number | string;
  imageSrc: string;
  name: string;
  onPress?: (id: number | string) => void;
}

const ProductCard = ({ id, imageSrc, name, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(id)}>
      <Image
        source={{ uri: imageSrc }}
        resizeMode="cover"
        style={styles.image}
      />
      <Text numberOfLines={2} style={styles.name}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { width: 110 },
  image: { width: 110, height: 100, borderRadius: 8, backgroundColor: '#EEE' },
  name: { marginTop: 6, fontSize: 15, fontWeight: '500' },
});

export default ProductCard;
