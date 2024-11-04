import { PaperProvider } from 'react-native-paper';
import React from 'react';
import Application from './src/Application';

export default function App() {
  return (
    <PaperProvider>
      <Application/>
    </PaperProvider>
  );
}
