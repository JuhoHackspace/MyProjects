import React from 'react'
import styles from '../styles/Styles'
import { View, ActivityIndicator } from 'react-native';

export default function LoadingIcon() {
  return (
    <View style={styles.centeredbaseContainer}>
        <ActivityIndicator size="large" color='gray'/>
    </View>
  )
}