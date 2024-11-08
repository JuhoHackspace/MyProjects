import { View, Text } from 'react-native';
import React, { useState } from 'react';
import styles from '../styles/Styles';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { auth } from '../firebase/Config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function CreateAccountScreen({ navigation }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  /*const createAccount = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    // Create a new user account with the email and password provided using Firebase authentication.
    // then update the user's profile with the username provided.
    createUserWithEmailAndPassword(auth, email.trim(), password)
      .then((userCredential) => {
        const user = userCredential.user;
        return updateProfile(user, {
          displayName: username,
        });
      })
      .catch((error) => {
        alert('Account creation failed: ' + error.message);
      });
  };*/

  const createAccount = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      navigation.navigate('Home');
    } catch (error) {
      alert('Account creation failed: ' + error.message);
    }
  };

  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Create Account</Text>
      </View>
      <View style={styles.inputContainer}>
      <TextInput
          label="Username"
          value={username}
          onChangeText={text => setUsername(text)}
          style={styles.input}
        />
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
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)}
          secureTextEntry
          style={styles.input}
        />
      </View>
      <View style={styles.buttonContainerVertical}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={createAccount}
          buttonColor={colors.accent}
        >
          Submit
        </Button>
      </View>
    </View>
  );
}