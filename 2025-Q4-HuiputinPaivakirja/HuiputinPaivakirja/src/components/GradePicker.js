import React from 'react'
import { Picker } from '@react-native-picker/picker';
import { useTheme } from 'react-native-paper';
import { useCustomTheme } from '../theme/CustomTheme';
import { View } from 'react-native';

/**
 * GradePicker is a component that allows the user to select a grade for voting on a routes difficulty.
 */

export default function GradePicker({newRouteGrade, setNewRouteGrade, initialGrade, buttonDisabled}) {
  const { colors } = useTheme();
  const { isDarkTheme } = useCustomTheme();

  const handleChange = (itemValue) => {
    if(itemValue !== '' && itemValue !== initialGrade.current) {
      buttonDisabled(true);
      setNewRouteGrade(itemValue);
    }
  }
  return (
    <View style={{
      backgroundColor: isDarkTheme ? colors.background : 'white'
    }}>
      <Picker
        selectedValue={newRouteGrade}
        style={{
          color: colors.text,
          backgroundColor: isDarkTheme ? colors.background : 'white',
          height: 50,
          width: '100%'
        }}
        dropdownIconColor={colors.text}
        onValueChange={(itemValue) => handleChange(itemValue)}
      >
        <Picker.Item label="Suggest a grade" value="" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="3" value="3" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="4" value="4" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="4+" value="4+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="5" value="5" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="5+" value="5+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="6a" value="6a" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="6a+" value="6a+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="6b" value="6b" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="6b+" value="6b+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="6c" value="6c" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="6c+" value="6c+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="7a" value="7a" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="7a+" value="7a+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="7b" value="7b" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="7b+" value="7b+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="7c" value="7c" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="7c+" value="7c+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="8a" value="8a" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="8a+" value="8a+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="8b" value="8b" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="8b+" value="8b+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="8c" value="8c" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="8c+" value="8c+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="9a" value="9a" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="9a+" value="9a+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="9b" value="9b" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="9b+" value="9b+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
      </Picker>
    </View>
  )
}