import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MainViewController from '../screens/MainViewController';
import BoulderScreen from '../screens/boulderScreen';


const Stack = createNativeStackNavigator();

// This stack navigator is used to navigate between the Home, Map, Camera, Profile, and Settings screens.

function MainStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MainViewController" component={MainViewController} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="BoulderScreen" component={BoulderScreen} />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;