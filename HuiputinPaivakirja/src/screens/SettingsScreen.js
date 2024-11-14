import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import styles from '../styles/Styles';

export default function SettingsScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text, fontSize: 24 }}>Settings</Text>
    </View>
  );
}
