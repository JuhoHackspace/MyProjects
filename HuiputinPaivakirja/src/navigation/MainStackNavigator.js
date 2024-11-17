import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import CameraScreen from '../screens/CameraScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';


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
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;