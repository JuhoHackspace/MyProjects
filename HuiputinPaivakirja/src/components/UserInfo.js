import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '../firebase/AuthProvider'
import styles from '../styles/Styles'
import { useTheme } from 'react-native-paper'

export default function UserInfo({userData}) {
  const { user } = useAuth()
  const { colors } = useTheme()

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.basicText, { color: colors.text }]}>Display name: {user.displayName}</Text>
      <Text style={[styles.basicText, { color: colors.text }]}>User email: {user.email} </Text>
      {userData && (
        <View>
            <Text style={[styles.basicText, { color: colors.text }]}>Name: {userData.name}</Text>
            <Text style={[styles.basicText, { color: colors.text }]}>Age: {userData.age}</Text>
            <Text style={[styles.basicText, { color: colors.text }]}>Gender: {userData.gender}</Text>
            <Text style={[styles.basicText, { color: colors.text }]}>Country: {userData.country}</Text>
            <Text style={[styles.basicText, { color: colors.text }]}>Height: {userData.height}</Text>
            <Text style={[styles.basicText, { color: colors.text }]}>Weight: {userData.weight}</Text>
            <Text style={[styles.basicText, { color: colors.text }]}>Ape index: {userData.apeindex}</Text>         
        </View>
      )}
    </View>
  )
}