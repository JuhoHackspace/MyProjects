import { View, Text } from 'react-native'
import React from 'react'
import styles from '../styles/Styles'

export default function LoginScreen() {
  return (
    <View style={styles.screenBaseContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Login</Text>
      </View>
    </View>
  )
}