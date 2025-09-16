// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import MainScreen from '../screens/MainScreen';
// import BestSupplementScreen from '../screens/BestSupplementScreen';
// import ObjectScreen from '../screens/ObjectScreen';
// import IngredientScreen from '../screens/IngredientScreen';
// import CombinationScreen from '../screens/CombinationScreen';
// import AlarmScreen from '../screens/AlarmScreen';

// export type RootStackParamList = {
//   Main: undefined;
//   BestSupplement: undefined;
//   Object: undefined;
//   Ingredient: undefined;
//   Combination: undefined;
//   Alarm: undefined;
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// const RootNavigator = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="Main"
//         component={MainScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="BestSupplement"
//         component={BestSupplementScreen}
//         options={{ title: '인기 영양제' }}
//       />
//       <Stack.Screen
//         name="Object"
//         component={ObjectScreen}
//         options={{ title: '목적별 검색' }}
//       />
//       <Stack.Screen
//         name="Ingredient"
//         component={IngredientScreen}
//         options={{ title: '성분별 검색' }}
//       />
//       <Stack.Screen
//         name="Combination"
//         component={CombinationScreen}
//         options={{ title: '조합 분석' }}
//       />
//       <Stack.Screen
//         name="Alarm"
//         component={AlarmScreen}
//         options={{ title: '섭취 알림' }}
//       />
//     </Stack.Navigator>
//   );
// };

// export default RootNavigator;

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screens/MainScreen';
import BestSupplementScreen from '../screens/BestSupplementScreen';
import ObjectScreen from '../screens/ObjectScreen';
import IngredientScreen from '../screens/IngredientScreen';
import CombinationScreen from '../screens/CombinationScreen';
import AlarmScreen from '../screens/AlarmScreen';

export type RootStackParamList = {
  Main: undefined;
  BestSupplement: undefined;
  Object: undefined;
  Ingredient: undefined;
  Combination: undefined;
  Alarm: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BestSupplement"
        component={BestSupplementScreen}
        options={{ title: '인기 영양제' }}
      />
      <Stack.Screen
        name="Object"
        component={ObjectScreen}
        options={{ title: '목적별 검색' }}
      />
      <Stack.Screen
        name="Ingredient"
        component={IngredientScreen}
        options={{ title: '성분별 검색' }}
      />
      <Stack.Screen
        name="Combination"
        component={CombinationScreen}
        options={{ title: '조합 분석' }}
      />
      <Stack.Screen
        name="Alarm"
        component={AlarmScreen}
        options={{ title: '섭취 알림' }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
