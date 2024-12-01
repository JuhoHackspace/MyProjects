import React, { useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/Styles'

export default function ColorPicker({value, setValue, isGrade}) {
  useEffect(() => {
    // Set the first value as the default value if newRouteGrade is not set
    if (!value) {
        setValue('yellow');
    }
  }, [value, setValue]);
  
  return (
    <Picker
        selectedValue={value}
        style={styles.input}
        onValueChange={(itemValue) => setValue(itemValue)}
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