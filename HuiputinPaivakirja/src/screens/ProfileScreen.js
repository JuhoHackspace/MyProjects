import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import styles from '../styles/Styles';
import { useAuth } from '../firebase/AuthProvider';
import DrawerButton from '../components/DrawerButton';

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>

      {/* Include the DrawerButton */}
      <DrawerButton navigation={navigation} />

      <Text style={{ color: colors.text, fontSize: 24 }}>
        Hello {user?.displayName}! This is your profile.
      </Text>
    </View>
  );
}
