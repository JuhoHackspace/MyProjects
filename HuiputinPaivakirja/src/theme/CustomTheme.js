import React, {useEffect, createContext, useContext, useState} from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { PermanentMarker_400Regular } from '@expo-google-fonts/permanent-marker';
import * as Font from 'expo-font';

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
    accent: '#c30f1b',
    background: '#d3d3d3',
    text: '#000000',
  },
  fonts: {
    ...DefaultTheme.fonts,
    special: {
      fontFamily: 'PermanentMarker-Regular',
      fontWeight: 'normal',
      color: '#000000',
    },
  }
};

const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'white',
    accent: '#c30f1b',
    background: '#121212',
    text: '#ffffff',
  },
  fonts: {
    ...DefaultTheme.fonts,
    special: {
      fontFamily: 'PermanentMarker-Regular',
      fontWeight: 'normal',
      color: '#ffffff',
    },
  }
};

// Create theme context
const ThemeContext = createContext();

export const useCustomTheme = () => useContext(ThemeContext);

// ThemeProvider component with background image
const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const theme = isDarkTheme ? darkTheme : lightTheme;

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'PermanentMarker-Regular': PermanentMarker_400Regular,
        });
      } catch (error) {
        console.error('Error loading fonts: ', error);
      }
    }

    loadFonts();
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      <PaperProvider theme={theme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
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
    backgroundColor: lightTheme.colors.background, 
  },
});

export { lightTheme, darkTheme, ThemeProvider };