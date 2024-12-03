import React from 'react';
import { ThemeProvider } from './src/theme/CustomTheme';
import Navigation from './src/navigation/Navigation';
import { NotificationProvider } from './src/context/NotificationProvider';
import MarkerProvider from './src/context/MarkerProvider';
import { AuthProvider } from './src/firebase/AuthProvider';

export default function App() {
  return (
  
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <MarkerProvider>
            <Navigation />
          </MarkerProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}