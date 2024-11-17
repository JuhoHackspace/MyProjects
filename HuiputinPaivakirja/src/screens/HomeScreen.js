import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from '../styles/Styles';
import { Button, useTheme } from 'react-native-paper';
import { getUserDisplayName } from '../firebase/FirebaseMethods';
import { useAuth } from '../firebase/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import WithDrawerButton from '../components/DrawerButton';

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
      <View style={styles.buttonTopRight}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={logout}
          buttonColor={colors.accent}
        >
          Logout
        </Button>
      </View>
      <View style={styles.greetingContainer}>
        {username ? (
          <Text style={[styles.greetingText, { color: colors.text }]}>
            Hello {username}! Ready to climb?
          </Text>
        ) : null}
      </View>
      <View style={styles.toMapButtonContainer}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => navigation.navigate('Map')}
          buttonColor={colors.accent}
        >
          To Map
        </Button>
      </View>
    </View>
  );
}
