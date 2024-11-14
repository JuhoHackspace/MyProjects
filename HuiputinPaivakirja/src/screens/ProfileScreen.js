import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import styles from '../styles/Styles';
import { useAuth } from '../firebase/AuthProvider';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text, fontSize: 24 }}>
        Hello {user?.displayName}! This is your profile.
      </Text>
    </View>
  );
}
