import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function ApplicationRoutes() {
  return (
    <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}  
          />
        </Stack.Navigator>
      </NavigationContainer>
  )
}