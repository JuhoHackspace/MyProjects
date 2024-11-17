import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { AuthProvider, useAuth } from '../firebase/AuthProvider';
import CustomDrawerContent from './CustomDrawerContent';
import AuthStackNavigator from './AuthStackNavigator';
import MainStackNavigator from './MainStackNavigator';

import { View, ActivityIndicator } from 'react-native';

const Drawer = createDrawerNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    // Show loading indicator while checking if user is logged in
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
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
        drawerPosition: 'right', // Works as intended
      }}
    >
      <Drawer.Screen name="MainStack" component={MainStackNavigator} />
    </Drawer.Navigator>
  );
}

function Navigation() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default Navigation;
