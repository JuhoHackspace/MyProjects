import { View, Text } from 'react-native'
import { Button } from 'react-native-paper'
import React, { useState } from 'react'
import styles from '../styles/Styles'
import { useTheme } from 'react-native-paper'
import { useCustomTheme } from '../theme/CustomTheme'

/**
 * A counter component that allows the user to increment and decrement a count.
 */

export default function TryCountCounter({tryCount, setTryCount}) {
  const { colors } = useTheme()
  const { isDarkTheme } = useCustomTheme()
  const [isChanged, setIsChanged] = useState(false)

  const handleIncrement = () => {
    if(tryCount < 200) {
      setTryCount(tryCount + 1)
    }
  }
  const handleDecrement = () => {
    if(tryCount > 1) {
      setTryCount(tryCount - 1)
    }
  } 
  return (
    <View style={styles.counterContainer}>
        <Button 
            mode="contained" 
            onPress={handleDecrement} 
            buttonColor = {colors.accent}
        >
                -
        </Button>
        <Text style={[styles.basicText, { color: colors.text, marginHorizontal: 10 }]}>
            {tryCount}
        </Text>
        <Button
            mode="contained" 
            onPress={handleIncrement} 
            buttonColor = {colors.accent}
        >
            +
        </Button>
    </View>
  )
}