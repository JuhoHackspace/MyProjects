import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, Button, Alert } from 'react-native';
import { addRouteToFirebase } from '../firebase/FirebaseMethods';
import { useNavigation } from '@react-navigation/native';

const BoulderScreen = ({ route }) => {
  const { imageUri, marker } = route.params;
  const [grade, setGrade] = useState('');
  const [tries, setTries] = useState('');
  const navigation = useNavigation();

  const handleConfirm = async () => {
    if (!grade || !tries) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      await addRouteToFirebase(marker, imageUri, grade, parseInt(tries, 10));
      Alert.alert('Success', 'Route saved successfully!');
      navigation.navigate('MapScreen');
    } catch (error) {
      Alert.alert('Error', 'Failed to save the route.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <TextInput
        style={styles.input}
        placeholder="Suggested Grade"
        value={grade}
        onChangeText={setGrade}
      />
      <TextInput
        style={styles.input}
        placeholder="Tries"
        keyboardType="numeric"
        value={tries}
        onChangeText={setTries}
      />
      <Button title="Confirm" onPress={handleConfirm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  input: {
    width: '80%',
    padding: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
  },
});

export default BoulderScreen;