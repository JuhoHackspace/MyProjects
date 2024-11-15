import React from 'react';
import { ThemeProvider } from './src/theme/CustomTheme';
import Navigation from './src/navigation/Navigation';

export default function App() {
  return (
  
    <ThemeProvider>
        <Navigation />
    </ThemeProvider>
  );
}