// import React from 'react';
// import { ScrollView, View } from 'react-native';
// import MainTop from '../components/MainTop';
// import NavSection from '../components/NavSection';
// import ProductList from '../components/ProductList';

// const MainScreen = () => {
//   return (
//     <ScrollView className="flex-1 bg-white">
//       <View className="pb-6">
//         <MainTop />
//         <NavSection />
//         <ProductList />
//       </View>
//     </ScrollView>
//   );
// };

// export default MainScreen;

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import MainTop from '../components/MainTop';
import NavSection from '../components/NavSection';
import ProductList from '../components/ProductList';

const MainScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <MainTop />
      <NavSection />
      <ProductList />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingBottom: 24 },
});

export default MainScreen;
