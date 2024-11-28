import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, StyleSheet, Button, Alert, ActivityIndicator, ScrollView,Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { routes } from '../firebase/Config';

const BoulderScreen = ({ route, setNewRouteData, imageUri }) => {
  const  marker = route != undefined ? route.params.marker: null;
  const [settingRouteData, setSettingRouteData] = useState(route != undefined ? false : true);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(route != undefined ? true : false);
  const [gradeVote, setGradeVote] = useState('');
  const [tryCount, setTryCount] = useState('');
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteGrade, setNewRouteGrade] = useState('yellow');
  const [newRouteHoldColor, setNewRouteHoldColor] = useState('yellow');
  const [votedForDelete, setVoteForDelete] = useState('NO');

  useEffect(() => {
    if (route != undefined) {
    const fetchRouteData = async () => {
      try {
        const routeDocRef = doc(routes, marker.routeId);
        const routeDoc = await getDoc(routeDocRef);

        if (routeDoc.exists()) {
          console.log('routeDocData',routeDoc.data());
          setRouteData(routeDoc.data());
        } else {
          Alert.alert('Error', 'Route data not found.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch route data.');
      } finally {
        setLoading(false);
      }
    };
    fetchRouteData();
  }
  }, []);

  const calculateAverageGrade = () => {
    if (!routeData?.routeGradeVotes?.length) return 'No votes yet';
    const total = routeData.routeGradeVotes.reduce((sum, grade) => sum + parseInt(grade, 10), 0);
    return (total / routeData.routeGradeVotes.length).toFixed(1);
  };

  const handleCreateRoute = () => {
      setNewRouteData({name: newRouteName, grade: newRouteGrade, holdColor: newRouteHoldColor});
  }

  const handleSave = async () => {
    if (!gradeVote.trim() || !tryCount.trim()) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      const routeDocRef = doc(routes, marker.routeId);
      await updateDoc(routeDocRef, {
        routeGradeVotes: arrayUnion(gradeVote.trim()),
      });
      Alert.alert('Success', 'Data updated successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save data.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: settingRouteData ? imageUri : routeData?.routeImageUrl }}
        style={styles.image}
        onError={() => Alert.alert('Error', 'Failed to load the image.')}
      />
      {settingRouteData ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Route Name"
            value={newRouteName}
            onChangeText={setNewRouteName}
          />
          <Text>Route Tag Color</Text>
          <Picker
            selectedValue={newRouteGrade}
            style={styles.picker}
            onValueChange={(itemValue) => setNewRouteGrade(itemValue)}
          >
            <Picker.Item label="Yellow" value="yellow" />
            <Picker.Item label="Green" value="green" />
            <Picker.Item label="Blue" value="blue" />
            <Picker.Item label="Pink" value="pink" />
            <Picker.Item label="Red" value="red" />
            <Picker.Item label="Purple" value="purple" />
            <Picker.Item label="Black" value="black" />
            <Picker.Item label="White" value="white" />
          </Picker>
          <Text>Route Hold Color</Text>
          <Picker
            selectedValue={newRouteHoldColor}
            style={styles.picker}
            onValueChange={(itemValue) => setNewRouteHoldColor(itemValue)}
          >
            <Picker.Item label="Yellow" value="yellow" />
            <Picker.Item label="Green" value="green" />
            <Picker.Item label="Blue" value="blue" />
            <Picker.Item label="Pink" value="pink" />
            <Picker.Item label="Red" value="red" />
            <Picker.Item label="Purple" value="purple" />
            <Picker.Item label="Black" value="black" />
            <Picker.Item label="White" value="white" />
          </Picker>
        </>
      ) : (
        <>
          <View>
            <Text>Route Name: {routeData?.routeName}</Text>
            <Text>Sent By: {routeData?.sentBy.join(', ')}</Text>
            <Text>Average Grade: {calculateAverageGrade()}</Text>
            <Text>Route Hold Color: {routeData?.routeHoldColor}</Text>
            <Text>Route Grade Color: {routeData?.routeGradeColor}</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Grade Vote"
            value={gradeVote}
            onChangeText={setGradeVote}
          />
          <TextInput
            style={styles.input}
            placeholder="Try Count"
            value={tryCount}
            keyboardType="numeric"
            onChangeText={setTryCount}
          />
          <Picker
            selectedValue={votedForDelete}
            style={styles.picker}
            onValueChange={(itemValue) => setVoteForDelete(itemValue)}
          >
            <Picker.Item label="NO" value="NO" />
            <Picker.Item label="YES" value="YES" />
          </Picker>
        </>
      )}
      <Button
        title="Save"
        onPress={() => {
          if (settingRouteData) {
            handleCreateRoute();
          } else {
            handleSave();
          }
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: { width: '100%', height: 700, resizeMode: 'contain' },
  input: { borderWidth: 1, marginVertical: 8, padding: 8 },
  picker: { height: 50, width: '100%' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default BoulderScreen;