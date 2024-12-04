import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Switch } from 'react-native-paper';
import styles from '../styles/Styles';
import { useAuth } from '../firebase/AuthProvider';
import DrawerButton from '../components/DrawerButton';
import { useCustomTheme } from '../theme/CustomTheme';

export default function SettingsScreen({ navigation }) {
  const { colors, fonts } = useTheme();
  const { user } = useAuth();
  const { isDarkTheme, toggleTheme } = useCustomTheme();

  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>
      {/* Include the DrawerButton directly */}
      <DrawerButton navigation={navigation} />
      
      <View style={styles.headerContainer}>
        <Text style={{
          fontFamily: fonts.special.fontFamily,
          fontSize: 28,
          textAlign: 'center',
          color: fonts.special.color
        }}>
          Settings
        </Text>
      </View>

      {/* Theme Switch Section */}
      <View style={{ padding: 16 }}>
        <Text style={{ color: colors.text, fontSize: 22, marginBottom: 10 }}>Theme</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.text, marginRight: 15, fontSize: 18 }}>Light</Text>
          <Switch
            value={isDarkTheme}
            onValueChange={toggleTheme}
            color={colors.accent}
            style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
          />
          <Text style={{ color: colors.text, marginLeft: 15, fontSize: 18 }}>Dark</Text>
        </View>
      </View>
    </View>
  );
}
