import React from 'react';
import { ThemeProvider } from './src/theme/CustomTheme';
import Navigation from './src/navigation/Navigation';
import { NotificationProvider } from './src/context/NotificationContext';

export default function App() {
  return (
  
    <ThemeProvider>
      <NotificationProvider>
        <Navigation />
      </NotificationProvider>
    </ThemeProvider>
  );
}