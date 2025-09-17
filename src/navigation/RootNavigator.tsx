// src/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AlarmScreen from '../screens/AlarmScreen';

export type RootStackParamList = {
  Alarm: undefined;
  Home: undefined;
  Detail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Alarm"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Alarm" component={AlarmScreen} />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: true, title: 'Home' }}
      />
    </Stack.Navigator>
  );
}
