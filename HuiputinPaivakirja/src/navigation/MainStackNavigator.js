import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from '../screens/HomeScreen';  // Kept for future use
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MainViewController from '../screens/MainViewController';
import BoulderScreen from '../screens/boulderScreen';
import BoulderHistoryScreen from '../screens/BoulderHistoryScreen';

const Stack = createNativeStackNavigator();

// This stack navigator is used to navigate between the Map, Camera, Profile, and Settings screens.
// HomeScreen is temporarily disabled but kept in codebase for future use

function MainStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainViewController"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      <Stack.Screen name="MainViewController" component={MainViewController} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="BoulderScreen" component={BoulderScreen} />
      <Stack.Screen name="BoulderHistoryScreen" component={BoulderHistoryScreen} />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;