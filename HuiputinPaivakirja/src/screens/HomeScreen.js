import { View, Text } from 'react-native';
import React from 'react';
import styles from '../styles/Styles';
import { useTheme } from 'react-native-paper';
import { getUserDisplayName } from '../firebase/FirebaseMethods';


export default function HomeScreen() {
  const { colors } = useTheme();

    // Retrieve username using helper function from FirebaseMethods.js
    const username = getUserDisplayName();

  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Home</Text>
      </View>
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>
          Hello {username}! Ready to climb?
        </Text>
      </View>
    </View>
  );
}