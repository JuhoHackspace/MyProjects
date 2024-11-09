import { View, Text } from 'react-native';
import React, { useState } from 'react';
import styles from '../styles/Styles';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../firebase/AuthProvider';

export default function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Login</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          style={styles.input}
        />
      </View>
      <View style={styles.buttonContainerVertical}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => login(email, password)}
          buttonColor={colors.accent}
        >
          Login
        </Button>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => navigation.navigate('CreateAccount')}
          buttonColor={colors.accent}
        >
          Create Account
        </Button>
      </View>
    </View>
  );
}