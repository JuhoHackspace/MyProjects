import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from '../styles/Styles';
import { Button, useTheme } from 'react-native-paper';
import { getUserDisplayName } from '../firebase/FirebaseMethods';
import { useAuth } from '../firebase/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import WithDrawerButton from '../components/DrawerButton';
import DrawerButton from '../components/DrawerButton';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user, logout, loading } = useAuth();
  const navigation = useNavigation();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    setUsername(user?.displayName);
  }, [user?.displayName]);

  if (loading) {
    console.log('Loading...');
    return (
      <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log("HomeScreen with user: ", user);
  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>
      {/* Include the DrawerButton */}
      <DrawerButton navigation={navigation} />

      {/* Greeting */}
      <View style={styles.greetingContainer}>
        {username ? (
          <Text style={[styles.greetingText, { color: colors.text }]}>
            Hello {username}! Ready to climb?
          </Text>
        ) : null}
      </View>

      {/* To Map */}
      <View style={styles.toMapButtonContainer}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => navigation.navigate('MainViewController')}
          buttonColor={colors.accent}
        >
          To Map
        </Button>
      </View>
    </View>
  );
}