import React, {useEffect} from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { PermanentMarker_400Regular } from '@expo-google-fonts/permanent-marker';
import * as Font from 'expo-font';

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',       // Custom primary color
    accent: '#c30f1b',      // Custom accent color
    background: '#d3d3d3',  // Custom background color
    text: '#000000',        // Custom text color
  },
  fonts: {
    ...DefaultTheme.fonts,
    special: {
      fontFamily: 'PermanentMarker-Regular',
      fontWeight: 'normal',
    },
  }
};

// ThemeProvider component with background image
const ThemeProvider = ({ children }) => {
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'PermanentMarker-Regular': PermanentMarker_400Regular,
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts: ', error);
      }
    }

    loadFonts();
  }, []);
  return (
    <PaperProvider theme={customTheme}>
      {children}
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: customTheme.colors.background, 
  },
});

export { customTheme, ThemeProvider };