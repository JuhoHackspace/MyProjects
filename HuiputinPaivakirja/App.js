import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/theme/CustomTheme'; // Import ThemeProvider
import ApplicationRoutes from './src/ApplicationRoutes';

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <ApplicationRoutes />
      </NavigationContainer>
    </ThemeProvider>
  );
}