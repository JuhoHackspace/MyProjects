import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black', // Custom primary color
    accent: '#c30f1b',  // Custom accent color
    background: '#d3d3d3', // Custom background color
    text: '#000000', // Custom text color
  },
};

export default customTheme;