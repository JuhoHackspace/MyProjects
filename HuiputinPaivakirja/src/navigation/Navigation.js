import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { useAuth } from '../firebase/AuthProvider';
import CustomDrawerContent from './CustomDrawerContent';
import AuthStackNavigator from './AuthStackNavigator';
import MainStackNavigator from './MainStackNavigator';
import LoadingIcon from '../components/LoadingIcon';

const Drawer = createDrawerNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    // Show loading indicator while checking if user is logged in
    return (
      <LoadingIcon />
    );
  }

  if (!user) {
    // When user is not logged in, show AuthStackNavigator
    return <AuthStackNavigator />;
  }

  // User logged in, show MainStackNavigator and Drawer
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        swipeEnabled: false, // Disable drawer gesture
        gestureEnabled: false // Disable all drawer gestures
      }}
    >
      <Drawer.Screen name="MainStack" component={MainStackNavigator} />
    </Drawer.Navigator>
  );
}

function Navigation() {
  return (
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
  );
}

export default Navigation;
