import React from 'react'
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/Styles'

export default function GradePicker({newRouteGrade, setNewRouteGrade}) {
  return (
    <Picker
        selectedValue={newRouteGrade}
        style={styles.input}
        onValueChange={(itemValue) => setNewRouteGrade(itemValue)}
    >
        <Picker.Item label="4b" value="4b" />
        <Picker.Item label="4c" value="4c" />
        <Picker.Item label="5a" value="5a" />
        <Picker.Item label="5a+" value="5a+" />
        <Picker.Item label="5b" value="5b" />
        <Picker.Item label="5b+" value="5b+" />
        <Picker.Item label="5c" value="5c" />
        <Picker.Item label="5c+" value="5c+" />
        <Picker.Item label="6a" value="6a" />
        <Picker.Item label="6a+" value="6a+" />
        <Picker.Item label="6b" value="6b" />
        <Picker.Item label="6b+" value="6b+" />
        <Picker.Item label="6c" value="6c" />
        <Picker.Item label="6c+" value="6c+" />
        <Picker.Item label="7a" value="7a" />
        <Picker.Item label="7a+" value="7a+" />
        <Picker.Item label="7b" value="7b" />
        <Picker.Item label="7b+" value="7b+" />
        <Picker.Item label="7c" value="7c" />
        <Picker.Item label="7c+" value="7c+" />
        <Picker.Item label="8a" value="8a" />
        <Picker.Item label="8a+" value="8a+" />
        <Picker.Item label="8b" value="8b" />
        <Picker.Item label="8b+" value="8b+" />
        <Picker.Item label="8c" value="8c" />
        <Picker.Item label="8c+" value="8c+" />
        <Picker.Item label="9a" value="9a" />
        <Picker.Item label="9a+" value="9a+" />
        <Picker.Item label="9b" value="9b" />
        <Picker.Item label="9b+" value="9b+" />
    </Picker>
  )
}