import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, StyleSheet, Button, Alert, ActivityIndicator, ScrollView, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { routes, users } from '../firebase/Config';

const BoulderScreen = ({ route }) => {
  const { marker, mainViewData, mode, imageUri } = route.params;
  const [routeData, setRouteData] = useState(mainViewData || null);
  const [loading, setLoading] = useState(true);
  const [gradeVote, setGradeVote] = useState('');
  const [tryCount, setTryCount] = useState('');
  const [votedForDelete, setVoteForDelete] = useState('NO');

  useEffect(() => {
    if (mode === 'marker' && marker.routeId) {
      const fetchRouteData = async () => {
        try {
          const routeDocRef = doc(routes, marker.routeId);
          const routeDoc = await getDoc(routeDocRef);

          if (routeDoc.exists()) {
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
    } else {
      setLoading(false);
    }
  }, [marker.routeId, mode]);

  const calculateAverageGrade = () => {
    if (!routeData?.routeGradeVotes?.length) return 'No votes yet';
    const total = routeData.routeGradeVotes.reduce((sum, grade) => sum + parseInt(grade, 10), 0);
    return (total / routeData.routeGradeVotes.length).toFixed(1);
  };

  const handleSave = async () => {
    if (!gradeVote.trim() || !tryCount.trim()) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    if (!marker.routeId || !marker.userId) {
      Alert.alert('Error', 'Route ID or User ID is missing.');
      return;
    }

    try {
      const routeDocRef = doc(routes, marker.routeId);
      await updateDoc(routeDocRef, {
        routeGradeVotes: arrayUnion(gradeVote.trim()),
        sentBy: arrayUnion(marker.userId),
      });

      const userDocRef = doc(users, marker.userId);
      await updateDoc(userDocRef, {
        sends: arrayUnion({
          routeId: marker.routeId,
          tryCount: parseInt(tryCount, 10),
          votedForDelete: votedForDelete === 'YES',
        }),
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
      {mode === 'mainView' ? (
        <>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            onError={() => Alert.alert('Error', 'Failed to load the image.')}
          />
          <TextInput
            style={styles.input}
            placeholder="Route Name"
            value={routeData.name}
            onChangeText={(text) => setRouteData({ ...routeData, name: text })}
          />
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
          <Button title="Save" onPress={handleSave} />
        </>
      ) : (
        <>
          <Image
            source={{ uri: routeData?.routeImageUrl }}
            style={styles.image}
            onError={() => Alert.alert('Error', 'Failed to load the image.')}
          />
          <View>
            <Text>Route Name: {routeData?.routeName}</Text>
            <Text>Average Grade: {calculateAverageGrade()}</Text>
            <Text>Route Hold Color: {routeData?.routeHoldColor}</Text>
            <Text>Route Grade Color: {routeData?.routeGradeColor}</Text>
            <Text>Sent By: {routeData?.sentBy}</Text>
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
          <Button title="Save" onPress={handleSave} />
        </>
      )}
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