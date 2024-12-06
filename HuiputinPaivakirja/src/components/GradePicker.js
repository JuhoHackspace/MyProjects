import React, { useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import { useTheme } from 'react-native-paper';
import { useCustomTheme } from '../theme/CustomTheme';
import { View } from 'react-native';

export default function GradePicker({newRouteGrade, setNewRouteGrade, initialGrade}) {
  const { colors } = useTheme();
  const { isDarkTheme } = useCustomTheme();

  /*useEffect(() => {
    // Set the first value as the default value if newRouteGrade is not set
    if (!newRouteGrade) {
      setNewRouteGrade('4b');
    }
  }, [newRouteGrade, setNewRouteGrade]);*/

  const handleChange = (itemValue) => {
    if(itemValue !== ''){
      setNewRouteGrade(itemValue);
      initialGrade.current = ''
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
        <Picker.Item label="4b" value="4b" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="4c" value="4c" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="5a" value="5a" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="5a+" value="5a+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="5b" value="5b" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="5b+" value="5b+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="5c" value="5c" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
        <Picker.Item label="5c+" value="5c+" color={isDarkTheme ? '#ffffff' : '#000000'} style={{backgroundColor: isDarkTheme ? '#121212' : 'white'}} />
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