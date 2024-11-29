import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Alert, ActivityIndicator, ScrollView,Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { fetchRouteData, voteForDelete, setRouteInvisible } from '../firebase/FirebaseMethods';
import LoadingIcon from '../components/LoadingIcon';
import styles from '../styles/Styles';
import { useTheme } from 'react-native-paper';
import { useAuth } from '../firebase/AuthProvider';

const BoulderScreen = ({ route, setNewRouteData, imageUri }) => {
  const  marker = route != undefined ? route.params.marker: null;
  const [settingRouteData, setSettingRouteData] = useState(route != undefined ? false : true);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(route != undefined ? true : false);
  const [imageLoading, setImageLoading] = useState(route != undefined ? true : false);
  const [showMarkAsSent, setShowMarkAsSent] = useState(false);
  const [gradeVote, setGradeVote] = useState('');
  const [tryCount, setTryCount] = useState('');
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteGrade, setNewRouteGrade] = useState('yellow');
  const [newRouteHoldColor, setNewRouteHoldColor] = useState('yellow');
  const { colors } = useTheme();
  const { user } = useAuth();
  const userId = user?.uid;

  useEffect(() => {
      let unsubscribe;
      if (route != undefined) {
        unsubscribe = fetchRouteData(marker.routeId, setRouteData, setLoading);
      }
      return () => {
        if(unsubscribe) {
          unsubscribe();
        }
      };
  }, []);

  const calculateAverageGrade = () => {
    if (!routeData?.routeGradeVotes?.length) return 'No votes yet';
    const total = routeData.routeGradeVotes.reduce((sum, grade) => sum + parseInt(grade, 10), 0);
    return (total / routeData.routeGradeVotes.length).toFixed(1);
  };

  const handleCreateRoute = () => {
      setNewRouteData({name: newRouteName, grade: newRouteGrade, holdColor: newRouteHoldColor});
  }

  const handleVoteForDelete = async () => {
    /*if (routeData.votedForDelete.some(vote => vote.votedBy === userId)) {
      Alert.alert('Error', 'You have already voted for delete.');
      return;
    }*/
    try {
      await voteForDelete(marker.routeId);
      if(routeData.votedForDelete.length + 1 === 3) {
        await setRouteInvisible(marker.id);
        Alert.alert('Success', 'Route will be deleted');
      }else {
        Alert.alert('Success', 'Voted for delete successfully!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to vote for delete.');
    }
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
  const handleImageLoad = () => {
        setImageLoading(false);
  };
  
  if (loading) {
    return (
      <LoadingIcon/>
    );
  }

  return (
    <ScrollView>
        <Image
            source={{ uri: settingRouteData ? imageUri : routeData?.routeImageUrl }}
            style={!imageLoading ? styleS.image: {display: 'none'}}
            onLoad={handleImageLoad}
            onError={() => Alert.alert('Error', 'Failed to load the image.')}
        />
        {imageLoading && ( 
          <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <LoadingIcon/>
          </View>
      )}
      {settingRouteData && (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Route Name"
              value={newRouteName}
              onChangeText={setNewRouteName}
            />
            <Text>Route Tag Color</Text>
            <Picker
              selectedValue={newRouteGrade}
              style={styleS.picker}
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
              style={styleS.picker}
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
          </View>
        </>
      )}
      {!settingRouteData && !imageLoading && (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.basicText}>Route Name: {routeData?.routeName}</Text>
            <Text style={styles.basicText}>Sent By: {routeData?.sentBy.join(', ')}</Text>
            <Text style={styles.basicText}>Average Grade: {calculateAverageGrade()}</Text>
            <Text style={styles.basicText}>Route Hold Color: {routeData?.routeHoldColor}</Text>
            <Text style={styles.basicText}>Route Grade Color: {routeData?.routeGradeColor}</Text>
          </View>
          {showMarkAsSent && (
            <View style={styles.inputContainer}>
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
            </View>
          )}
        </>
      )}
      {!imageLoading &&
        <View style={styles.buttonContainerVertical}>
          {!settingRouteData && (
            <Button
              mode="contained"
              style={styles.buttonLonger}
              buttonColor= {colors.accent}
              onPress={() => setShowMarkAsSent(!showMarkAsSent)}
            >
              {showMarkAsSent ? "Cancel" : "Mark as sent"}
            </Button>
          )}
          {(showMarkAsSent || settingRouteData) &&
            <Button
              mode="contained"
              style={styles.buttonLonger}
              buttonColor= {colors.accent}
              onPress={() => {
                if (settingRouteData) {
                  handleCreateRoute();
                } else {
                  handleSave();
                }
              }}
            >{settingRouteData ? "Create" : "Save"}</Button>
          }
          {!showMarkAsSent && !settingRouteData && (
            <Button
              mode="contained"
              style={styles.buttonLonger}
              buttonColor= {colors.accent}
              onPress={handleVoteForDelete}
            >Vote for delete {routeData?.votedForDelete.length}/3</Button>
          )}
        </View>
      }
    </ScrollView>
  );
};

const styleS = StyleSheet.create({
  image: { width: '100%', height: 700, resizeMode: 'contain', marginTop: 32, marginBottom: 16 },
  picker: { height: 50, width: '100%' },
});

export default BoulderScreen;