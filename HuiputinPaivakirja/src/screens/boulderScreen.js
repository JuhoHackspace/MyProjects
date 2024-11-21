import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, StyleSheet, Button, Alert, ActivityIndicator, ScrollView,Text } from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { routes } from '../firebase/Config';

const BoulderScreen = ({ route }) => {
  const { marker } = route.params;
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gradeVote, setGradeVote] = useState('');
  const [tryCount, setTryCount] = useState('');

  useEffect(() => {
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
  }, [marker.routeId]);

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
        source={{ uri: routeData.routeImageUrl }}
        style={styles.image}
        onError={() => Alert.alert('Error', 'Failed to load the image.')}
      />
      <View>
        <Text>Average Grade: {calculateAverageGrade()}</Text>
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
      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: { width: '100%', height: 200, resizeMode: 'contain' },
  input: { borderWidth: 1, marginVertical: 8, padding: 8 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default BoulderScreen;