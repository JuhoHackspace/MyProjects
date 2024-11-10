import React from 'react';
import { ThemeProvider } from './src/theme/CustomTheme'; // Import ThemeProvider
import ApplicationRoutes from './src/ApplicationRoutes';

export default function App() {
  return (
  
    <ThemeProvider>
        <ApplicationRoutes />
    </ThemeProvider>
  );
}