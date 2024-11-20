import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, StyleSheet, Button, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { routes } from '../firebase/Config';

const BoulderScreen = ({ route }) => {
  const { marker } = route.params;
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gradeVotes, setGradeVotes] = useState('');
  const [tryCount, setTryCount] = useState('');
  const [voteForDelete, setVoteForDelete] = useState('');

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
        Alert.alert('Error', 'Failed to fetch route data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteData();
  }, [marker.routeId]);

  const handleSave = async () => {
    if (!gradeVotes || !tryCount || !voteForDelete) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      const markerRef = doc(routes, marker.routeId);
      await updateDoc(markerRef, {
        routeGradeVotes: gradeVotes,
        tryCount: parseInt(tryCount, 10),
        voteForDelete,
      });
      Alert.alert('Success', 'Route updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update the route.');
      console.error(error);
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Näytä reitin kuva, jos saatavilla */}
      {routeData?.routeImageUrl ? (
        <Image source={{ uri: routeData.routeImageUrl }} style={styles.image} />
      ) : (
        <View style={styles.noImageContainer}>
          <Button title="No image available" disabled />
        </View>
      )}

      {/* Syöttökentät */}
      <TextInput
        style={styles.input}
        placeholder="Route Grade Votes"
        value={gradeVotes}
        onChangeText={setGradeVotes}
      />
      <TextInput
        style={styles.input}
        placeholder="Try Count"
        keyboardType="numeric"
        value={tryCount}
        onChangeText={setTryCount}
      />
      <TextInput
        style={styles.input}
        placeholder="Vote for Delete (yes/no)"
        value={voteForDelete}
        onChangeText={setVoteForDelete}
      />
      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%', // Kuva täyttää leveydeltä koko ruudun
    height: 700, // Kiinteä korkeus
    resizeMode: 'contain', // Kuva näkyy kokonaan ilman leikkausta
    marginBottom: 16,
  },
  noImageContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#ccc',
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