// import React from 'react';
// import { View } from 'react-native';
// import MobileMainCard from './MobileMainCard';

// const objectIcon = require('../assets/object.png');
// const ingredientIcon = require('../assets/ingredient.png');
// const combinationIcon = require('../assets/combination.png');
// const alarmIcon = require('../assets/alarm.png');

// const NavSection = () => {
//   return (
//     <View className="py-4 items-center">
//       <View className="flex-row space-x-4">
//         <MobileMainCard title="목적별" icon={objectIcon} to="Object" />
//         <MobileMainCard title="성분별" icon={ingredientIcon} to="Ingredient" />
//         <MobileMainCard title="조합" icon={combinationIcon} to="Combination" />
//         <MobileMainCard title="섭취알림" icon={alarmIcon} to="Alarm" />
//       </View>
//     </View>
//   );
// };

// export default NavSection;

import React from 'react';
import { View, StyleSheet } from 'react-native';
import MobileMainCard from './MobileMainCard';

const objectIcon = require('../assets/object.png');
const ingredientIcon = require('../assets/ingredient.png');
const combinationIcon = require('../assets/combination.png');
const alarmIcon = require('../assets/alarm.png');

const NavSection = () => {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <MobileMainCard title="목적별" icon={objectIcon} to="Object" />
        <MobileMainCard title="성분별" icon={ingredientIcon} to="Ingredient" />
        <MobileMainCard title="조합" icon={combinationIcon} to="Combination" />
        <MobileMainCard title="섭취알림" icon={alarmIcon} to="Alarm" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingVertical: 16, alignItems: 'center' },
  row: { flexDirection: 'row', columnGap: 16 },
});

export default NavSection;
