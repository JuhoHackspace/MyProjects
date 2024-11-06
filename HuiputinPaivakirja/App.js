import { PaperProvider } from 'react-native-paper';
import React from 'react';
import ApplicationRoutes from './src/ApplicationRoutes';
import CustomTheme from './src/theme/CustomTheme';

export default function App() {
  return (
    <PaperProvider theme={CustomTheme}>
      <ApplicationRoutes/>
    </PaperProvider>
  );
}
