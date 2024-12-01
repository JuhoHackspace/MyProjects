import React from 'react'
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/Styles'

export default function ColorPicker({value, setValue, isGrade}) {
  return (
    <Picker
        selectedValue={newRouteGrade}
        style={styles.input}
        onValueChange={(itemValue) => setNewRouteGrade(itemValue)}
    >
        <Picker.Item label="Yellow" value="yellow" />
        <Picker.Item label="Green" value="green" />
        <Picker.Item label="Blue" value="blue" />
        <Picker.Item label="Pink" value="pink" />
        {!isGrade && <Picker.Item label="Orange" value="orange" />}
        <Picker.Item label="Red" value="red" />
        <Picker.Item label="Purple" value="purple" />
        <Picker.Item label="Black" value="black" />
        <Picker.Item label="White" value="white" />
    </Picker>
  )
}