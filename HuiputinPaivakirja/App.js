import React from 'react';
import { ThemeProvider } from './src/theme/CustomTheme'; // Import ThemeProvider
import Navigation from './src/Navigation';

export default function App() {
  return (
  
    <ThemeProvider>
        <Navigation />
    </ThemeProvider>
  );
}