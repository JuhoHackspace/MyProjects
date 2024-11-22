import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet,} from 'react-native';
import { useTheme } from 'react-native-paper';
import styles from '../styles/Styles';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../firebase/AuthProvider';
import { AddUserInfo,fetchUserData } from '../firebase/FirebaseMethods'


export default function UserInfo() {

    useEffect(() => {
        fetchUserData(userId, setFormStates);
    }, [userId])

    const { colors } = useTheme();
    const { user } = useAuth();
    const userId = user?.uid;

    
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [country, setCountry] = useState('')
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [apeIndex, setApeIndex] = useState('')
    const [gender, setGender] = useState(null)

    const setFormStates = (data) => {
        setName(data.name || '')
        setAge(data.age || '')
        setCountry(data.country || '')
        setHeight(data.height || '')
        setWeight(data.weight || '')
        setApeIndex(data.apeindex || '')
        setGender(data.gender || null)
    };

   

    const userData = {
        name: name,
        age: age,
        gender: gender,
        country: country,
        height: height,
        weight: weight,
        apeindex: apeIndex,
    }

    return (
        
        <View >
            <Text style={{fontSize: 18 }}>User information:</Text>
            <TextInput
                style={[localStyles.input, { borderColor: colors.primary }]}
                placeholder="Name"
                placeholderTextColor={colors.placeholder}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={[localStyles.input, { borderColor: colors.primary }]}
                placeholder="Age"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
            />
            
      <Picker
        selectedValue={gender}
        onValueChange={(itemValue) => setGender(itemValue)}
        placeholder="Gender"

      >
        <Picker.Item label="Everything else" value={null} />
        <Picker.Item label="Man" value="Men" />
        <Picker.Item label="Woman" value="Women" />
      </Picker>
            <TextInput
                style={[localStyles.input, { borderColor: colors.primary }]}
                placeholder="Country"
                placeholderTextColor={colors.placeholder}
                value={country}
                onChangeText={setCountry}
            />

            <TextInput
                style={[localStyles.input, { borderColor: colors.primary }]}
                placeholder="Height"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
            />
            <TextInput
                style={[localStyles.input, { borderColor: colors.primary }]}
                placeholder="Weight"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
            />
            <TextInput
                style={[localStyles.input, { borderColor: colors.primary }]}
                placeholder="Ape index"
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
                value={apeIndex}
                onChangeText={setApeIndex}
            />

            <Button
                title={'Save Profile'}
                color={colors.primary}
                onPress={() => AddUserInfo(userId, userData)}
            />
        </View>
    )
}


const localStyles = StyleSheet.create({
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        fontSize: 16,
    },
});