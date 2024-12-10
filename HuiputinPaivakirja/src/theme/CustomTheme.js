import React, {useEffect, createContext, useContext, useState} from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { PermanentMarker_400Regular } from '@expo-google-fonts/permanent-marker';
import * as Font from 'expo-font';
import LoadingIcon from '../components/LoadingIcon';

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
    accent: '#c30f1b',
    accent2: '#2196F3',
    background: '#d3d3d3',
    text: '#000000',
    disabled: '#a9a9a9',
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
    accent2: '#2196F3',
    background: '#121212',
    text: '#ffffff',
    disabled: '#555555',
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
  const [fontsLoaded, setFontsLoaded] = useState(false);

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

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  if (!fontsLoaded) {
    return (
      <LoadingIcon />
    )
  }
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