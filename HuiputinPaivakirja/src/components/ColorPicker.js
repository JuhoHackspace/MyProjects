import React, { useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import styles from '../styles/Styles'
import { useCustomTheme } from '../theme/CustomTheme';
import { useTheme } from 'react-native-paper';
import { View } from 'react-native';

export default function ColorPicker({value, setValue, isGrade}) {
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
      backgroundColor: colors.background,
      borderColor: colors.text,
      borderWidth: 1,
      borderRadius: 5,
      marginVertical: 5,
    }}>
      <Picker
          selectedValue={value}
          style={[styles.input, { 
            backgroundColor: colors.background,
            color: colors.text,
            margin: 0,
            padding: 0,
          }]}
          dropdownIconColor={colors.text}
          onValueChange={(itemValue) => setValue(itemValue)}
          itemStyle={{ backgroundColor: colors.background }}
      >
          <Picker.Item 
            label="Yellow" 
            value="yellow" 
            color={isDarkTheme ? '#ffffff' : '#000000'} 
          />
          <Picker.Item 
            label="Green" 
            value="green" 
            color={isDarkTheme ? '#ffffff' : '#000000'} 
          />
          <Picker.Item 
            label="Blue" 
            value="blue" 
            color={isDarkTheme ? '#ffffff' : '#000000'} 
          />
          <Picker.Item 
            label="Pink" 
            value="pink" 
            color={isDarkTheme ? '#ffffff' : '#000000'} 
          />
          {!isGrade && (
            <Picker.Item 
              label="Orange" 
              value="orange" 
              color={isDarkTheme ? '#ffffff' : '#000000'} 
            />
          )}
          <Picker.Item 
            label="Red" 
            value="red" 
            color={isDarkTheme ? '#ffffff' : '#000000'} 
          />
          <Picker.Item 
            label="Purple" 
            value="purple" 
            color={isDarkTheme ? '#ffffff' : '#000000'} 
          />
          <Picker.Item 
            label="Black" 
            value="black" 
            color={isDarkTheme ? '#ffffff' : '#000000'} 
          />
          <Picker.Item 
            label="White" 
            value="white" 
            color={isDarkTheme ? '#ffffff' : '#000000'} 
          />
      </Picker>
    </View>
  )
}