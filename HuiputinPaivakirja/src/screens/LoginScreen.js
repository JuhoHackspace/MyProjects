import { View, Text } from 'react-native'
import React from 'react'
import styles from '../styles/Styles'
import { Button, useTheme } from 'react-native-paper'

export default function LoginScreen({navigation}) {
  const { colors } = useTheme()

  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Login</Text>
      </View>
      <View style={styles.buttonContainerVertical}>
            <Button 
                style={styles.button} 
                mode="contained" 
                onPress={() => console.log('Login')}
                buttonColor={colors.accent} 
            >
                Login
            </Button>
            <Button 
                style={styles.button} 
                mode="contained" 
                onPress={() => console.log('Register')}
                buttonColor={colors.accent} 
            >
                Register
            </Button>
      </View>
    </View>
  )
}