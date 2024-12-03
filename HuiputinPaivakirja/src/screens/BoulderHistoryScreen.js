import { View, Text } from 'react-native'
import React from 'react'
import styles from '../styles/Styles'
import { useTheme } from 'react-native-paper'

export default function BoulderHistoryScreen() {
  const { colors, fonts } = useTheme()

  return (
    <View style={styles.screenBaseContainer}>
      <View style={styles.headerContainer}>
        <Text style={{fontFamily: fonts.special.fontFamily, fontSize: 28 }}>Boulder History</Text>
      </View>
    </View>
  )
}