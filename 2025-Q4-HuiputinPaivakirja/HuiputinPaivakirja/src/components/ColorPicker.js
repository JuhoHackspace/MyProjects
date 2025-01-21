import React, { useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import { useTheme } from 'react-native-paper';
import { useCustomTheme } from '../theme/CustomTheme';
import { View } from 'react-native';

/**
 * ColorPicker is a component that allows the user to select a color from a dropdown menu.
 */

export default function ColorPicker({ value, setValue, isGrade }) {
  const { colors } = useTheme();
  const { isDarkTheme } = useCustomTheme();

  useEffect(() => {
    // Set the first value as the default value if newRouteGrade is not set
    if (!value) {
      setValue('yellow');
    }
  }, [value, setValue]);

  return (
    <View style={{
      backgroundColor: isDarkTheme ? colors.background : 'white'
    }}>
      <Picker
        selectedValue={value}
        style={{
          color: colors.text,
          backgroundColor: isDarkTheme ? colors.background : 'white',
          height: 50,
          width: '100%'
        }}
        dropdownIconColor={colors.text}
        onValueChange={(itemValue) => setValue(itemValue)}
        
      >
        <Picker.Item label="Yellow" value="yellow" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="Green" value="green" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="Blue" value="blue" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="Pink" value="pink" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        {!isGrade && <Picker.Item label="Orange" value="orange" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />}
        <Picker.Item label="Red" value="red" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="Purple" value="purple" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="Black" value="black" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="White" value="white" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
      </Picker>
    </View>
  )
}