import { PaperProvider } from 'react-native-paper';
import React from 'react';
import Application from './src/Application';
import CustomTheme from './src/theme/CustomTheme';

export default function App() {
  return (
    <PaperProvider theme={CustomTheme}>
      <Application/>
    </PaperProvider>
  );
}
