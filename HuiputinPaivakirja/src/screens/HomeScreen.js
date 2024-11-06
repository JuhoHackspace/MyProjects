import { View, Text } from 'react-native';
import React from 'react';
import styles from '../styles/Styles';
import { useTheme } from 'react-native-paper';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Home</Text>
      </View>
    </View>
  );
}