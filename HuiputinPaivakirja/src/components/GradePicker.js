import React, { useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/Styles'

export default function GradePicker({newRouteGrade, setNewRouteGrade}) {
  useEffect(() => {
    // Set the first value as the default value if newRouteGrade is not set
    if (!newRouteGrade) {
        setNewRouteGrade('3');
    }
  }, [newRouteGrade, setNewRouteGrade]);
  return (
    <Picker
        selectedValue={newRouteGrade}
        style={styles.input}
        onValueChange={(itemValue) => setNewRouteGrade(itemValue)}
    >
        <Picker.Item label="3" value="3" />
        <Picker.Item label="4" value="4" />
        <Picker.Item label="4+" value="4+" />
        <Picker.Item label="5" value="5" />
        <Picker.Item label="5+" value="5+" />
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