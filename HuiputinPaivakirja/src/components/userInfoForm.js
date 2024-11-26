import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useTheme, TextInput, Button } from 'react-native-paper';
import styles from '../styles/Styles';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../firebase/AuthProvider';
import { AddUserInfo,fetchUserData } from '../firebase/FirebaseMethods'
import { ScrollView } from 'react-native-gesture-handler';


export default function UserInfoForm({userData, saveData, setShowForm}) {

    const { colors } = useTheme();
    
    const [name, setName] = useState(userData? userData.name : "")
    const [age, setAge] = useState(userData? userData.age : "")
    const [country, setCountry] = useState(userData? userData.country : "")
    const [height, setHeight] = useState(userData? userData.height : "")
    const [weight, setWeight] = useState(userData? userData.weight : "")
    const [apeIndex, setApeIndex] = useState(userData? userData.apeindex : "")
    const [gender, setGender] = useState(userData? userData.gender : "")
    const [sends, setSends] = useState(userData? userData.sends : "")

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

    return (
        
        <ScrollView style={styles.inputContainer}>
            <Text style={styles.basicText}>Update user information:</Text>
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
      >
        <Picker.Item label="Gender" value={null} />
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
                    style={styles.button}
                    mode='contained'
                    buttonColor={colors.accent}
                    onPress={() => saveData(newUserData)}
                >Save</Button>
                <Button
                    style={styles.button}
                    mode='contained'
                    buttonColor={colors.accent}
                    onPress={() => setShowForm(false)}
                >Cancel</Button>
            </View>
        </ScrollView>
    )
}