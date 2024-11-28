import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '../firebase/AuthProvider'
import styles from '../styles/Styles'

export default function UserInfo({userData}) {
  const { user } = useAuth()

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.basicText}>Display name: {user.displayName}</Text>
      <Text style={styles.basicText}>User email: {user.email} </Text>
      {userData && (
        <View>
            <Text style={styles.basicText}>Name: {userData.name}</Text>
            <Text style={styles.basicText}>Age: {userData.age}</Text>
            <Text style={styles.basicText}>Gender: {userData.gender}</Text>
            <Text style={styles.basicText}>Country: {userData.country}</Text>
            <Text style={styles.basicText}>Height: {userData.height}</Text>
            <Text style={styles.basicText}>Weight: {userData.weight}</Text>
            <Text style={styles.basicText}>Ape index: {userData.apeindex}</Text>         
        </View>
      )}
    </View>
  )
}