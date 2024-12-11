import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme, TextInput, Button } from 'react-native-paper';
import styles from '../styles/Styles';
import { Picker } from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';
import { useCustomTheme } from '../theme/CustomTheme';

/**
 * Form for updating user information
 */

export default function UserInfoForm({userData, saveData, setShowForm}) {

    const { colors } = useTheme();
    const { isDarkTheme } = useCustomTheme();
    const [name, setName] = useState(userData.name? userData.name : "")
    const [age, setAge] = useState(userData.age? userData.age : "")
    const [country, setCountry] = useState(userData.country? userData.country : "")
    const [height, setHeight] = useState(userData.height? userData.height : "")
    const [weight, setWeight] = useState(userData.weight? userData.weight : "")
    const [apeIndex, setApeIndex] = useState(userData.apeindex? userData.apeindex : "")
    const [gender, setGender] = useState(userData.gender? userData.gender : "")
    const [sends, setSends] = useState(userData.sends? userData.sends : "")

    const handleSave = () => {
        const newUserData = {
            name: name,
            age: age,
            gender: gender,
            country: country,
            height: height,
            weight: weight,
            apeindex: apeIndex,
            sends: sends
        }

        const filteredData = Object.fromEntries(Object.entries(newUserData).filter(([key, value]) => value !== ""));
        saveData(filteredData);
    }

    return (
        
        <ScrollView style={styles.inputContainer}>
            <Text style={[styles.basicText, { color: colors.text }]}>Update user information:</Text>
            <TextInput
                style={[styles.input, { borderColor: colors.primary }]}
                placeholder="Name"
                placeholderTextColor={colors.placeholder}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={[styles.input, { borderColor: colors.primary }]}
                placeholder="Age"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
            />
            
            <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={[styles.input,{
                    color: colors.text,
                    backgroundColor: colors.background,
                }]}
            >
                <Picker.Item label="Gender" value="Unspecified" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
            </Picker>
            <TextInput
                style={[styles.input, { borderColor: colors.primary }]}
                placeholder="Country"
                placeholderTextColor={colors.placeholder}
                value={country}
                onChangeText={setCountry}
            />

            <TextInput
                style={[styles.input, { borderColor: colors.primary }]}
                placeholder="Height"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
            />
            <TextInput
                style={[styles.input, { borderColor: colors.primary }]}
                placeholder="Weight"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
            />
            <TextInput
                style={[styles.input, { borderColor: colors.primary }]}
                placeholder="Ape index"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
                value={apeIndex}
                onChangeText={setApeIndex}
            />
            <View style={styles.buttonContainerVertical}>
                <Button
                    style={styles.buttonLong}
                    mode='contained'
                    buttonColor={colors.accent}
                    icon = "content-save"
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                    onPress={handleSave}
                >Save</Button>
                <Button
                    style={styles.buttonLong}
                    mode='contained'
                    buttonColor={colors.accent}
                    icon = "cancel"
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                    onPress={() => setShowForm(false)}
                >Cancel</Button>
            </View>
        </ScrollView>
    )
}