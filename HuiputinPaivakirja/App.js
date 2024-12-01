import React from 'react';
import { ThemeProvider } from './src/theme/CustomTheme';
import Navigation from './src/navigation/Navigation';
import { NotificationProvider } from './src/context/NotificationProvider';
import MarkerProvider from './src/context/MarkerProvider';

export default function App() {
  return (
  
    <ThemeProvider>
      <NotificationProvider>
        <MarkerProvider>
          <Navigation />
        </MarkerProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}