import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useTheme, TextInput, Button } from 'react-native-paper';
import styles from '../styles/Styles';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../firebase/AuthProvider';
import { AddUserInfo,fetchUserData } from '../firebase/FirebaseMethods'
import { ScrollView } from 'react-native-gesture-handler';


export default function UserInfoForm() {

    useEffect(() => {
        const fetchData = async (userId) => {
            try {
                const userData = await fetchUserData(userId);
                if (userData) {
                    setFormStates(userData);
                    setDataExists(true);
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        }
        if (userId) {
            fetchData(userId);
        }
    }, [userId])

    const { colors } = useTheme();
    const { user } = useAuth();
    const userId = user?.uid;
    const [dataExists, setDataExists] = useState(false)
    
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [country, setCountry] = useState('')
    const [height, setHeight] = useState('')
    const [weight, setWeight] = useState('')
    const [apeIndex, setApeIndex] = useState('')
    const [gender, setGender] = useState(null)
    const [sends, setSends] = useState([])
    const setFormStates = (data) => {
        setName(data.name || '')
        setAge(data.age || '')
        setCountry(data.country || '')
        setHeight(data.height || '')
        setWeight(data.weight || '')
        setApeIndex(data.apeindex || '')
        setGender(data.gender || null)
        setSends(data.sends || []) // Tähän tulee lista objekteja reiteistä jotka lähetetty: {routeId: '123', tries: 3}
    };

   

    const userData = {
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
            <Text style={{fontSize: 18 }}>User information:</Text>
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
        <Picker.Item label="Men" value="Male" />
        <Picker.Item label="Women" value="Female" />
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
            <View style={styles.buttonContainerHorizontal}>
                <Button
                    style={styles.button}
                    mode='contained'
                    buttonColor={colors.accent}
                    onPress={() => AddUserInfo(userId, userData)}
                >Save</Button>
            </View>
        </ScrollView>
    )
}