import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import LoginScreen from './screens/LoginScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import CameraScreen from './screens/CameraScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

import { AuthProvider, useAuth } from './firebase/AuthProvider';
import { useTheme, Drawer } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const DrawerNavigator = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const { navigation } = props;

  return (
    <DrawerContentScrollView {...props}>
      <Drawer.Section>
        <Drawer.Item
          label="Home"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          )}
          onPress={() => navigation.navigate('Home')}
        />
        <Drawer.Item
          label="Profile"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="account-outline" color={color} size={size} />
          )}
          onPress={() => navigation.navigate('Profile')}
        />
        <Drawer.Item
          label="Settings"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
          )}
          onPress={() => navigation.navigate('Settings')}
        />
        <Drawer.Item
          label="Logout"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="logout" color={color} size={size} />
          )}
          onPress={logout}
        />
      </Drawer.Section>
    </DrawerContentScrollView>
  );
}

function AuthStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
    </Stack.Navigator>
  );
}

function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
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

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <DrawerNavigator.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerPosition="right"
      screenOptions={{
        headerShown: false,
      }}
    >
      {!user ? (
        <DrawerNavigator.Screen name="AuthStack" component={AuthStackNavigator} />
      ) : (
        <DrawerNavigator.Screen name="MainStack" component={MainStackNavigator} />
      )}
    </DrawerNavigator.Navigator>
  );
}

export default Navigation;
