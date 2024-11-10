import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { ImageBackground, StyleSheet, View } from 'react-native';

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',       // Custom primary color
    accent: '#c30f1b',      // Custom accent color
    background: '#d3d3d3',  // Custom background color
    text: '#000000',        // Custom text color
  },
};

// ThemeProvider component with background image
const ThemeProvider = ({ children }) => {
  return (
    <PaperProvider theme={customTheme}>
      <ImageBackground
        source={require('../../assets/vuori_valkoinen.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      >
        <View style={styles.overlay}>{children}</View>
      </ImageBackground>
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