import { View, Text } from 'react-native';
import React, { useState } from 'react';
import styles from '../styles/Styles';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../firebase/AuthProvider';
import { useCustomTheme } from '../theme/CustomTheme';

export default function LoginScreen({ navigation }) {
  const { colors, fonts } = useTheme();
  const { isDarkTheme } = useCustomTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={{
          fontFamily: fonts.special.fontFamily,
          fontSize: 28,
          textAlign: 'center',
          color: fonts.special.color
        }}>Login</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={[styles.input, { backgroundColor: isDarkTheme ? colors.background : 'white' }]}
          textColor={colors.text}
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.text,
              background: isDarkTheme ? colors.background : 'white',
              onSurfaceVariant: colors.text,
            }
          }}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          style={[styles.input, { backgroundColor: isDarkTheme ? colors.background : 'white' }]}
          textColor={colors.text}
          theme={{
            colors: {
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.text,
              background: isDarkTheme ? colors.background : 'white',
              onSurfaceVariant: colors.text,
            }
          }}
        />
      </View>
      <View style={styles.buttonContainerVertical}>
        <Button
          style={styles.buttonLonger}
          mode="contained"
          onPress={() => login(email, password)}
          buttonColor={colors.accent}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          icon="login"
        >
          Login
        </Button>
        <Button
          style={styles.buttonLonger}
          mode="contained"
          onPress={() => navigation.navigate('CreateAccount')}
          buttonColor={colors.accent}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          icon="account-plus"
        >
          Create Account
        </Button>
      </View>
    </View>
  );
}