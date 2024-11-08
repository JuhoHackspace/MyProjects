import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import { AuthProvider, useAuth } from './firebase/AuthProvider';

const Stack = createNativeStackNavigator();

  // The useAuth custom hook is used to access the authentication context in the application.
function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
        // Possible loading screen can be added here.
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'}>
      {!user ? (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateAccount"
            component={CreateAccountScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
                // If the user is authenticated we can jump straight to the Home screen.
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function ApplicationRoutes() {
  return (
     // Whole application is wrapped in the AuthProvider component to provide authentication state globally.
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}