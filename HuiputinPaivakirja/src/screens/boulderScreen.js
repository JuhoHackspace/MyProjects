import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Alert, ActivityIndicator, ScrollView,Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { fetchRouteData, voteForDelete, setRouteInvisible, markRouteAsSent } from '../firebase/FirebaseMethods';
import LoadingIcon from '../components/LoadingIcon';
import styles from '../styles/Styles';
import { useTheme } from 'react-native-paper';
import { useAuth } from '../firebase/AuthProvider';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { useNavigation } from '@react-navigation/native';
import { useNotification } from '../context/NotificationProvider';
import GradePicker from '../components/GradePicker';
import ColorPicker from '../components/ColorPicker';

/** 
 * BoulderScreen component serves two purposes: Creating a new route and displaying an existing route.
 * When creating a new route, the user can input the route name, grade, and hold color.
 * When displaying an existing route, the user can mark the route as sent, save the data, and vote for delete.
 * @param {Object} route - The route object containing the marker data.
 * @param {Function} setNewRouteData - Function to set the new route data.
 * @param {String} imageUri - The uri of the image taken by the user. This is displayed when creating a new route.
 * @returns BoulderScreen component
*/

const BoulderScreen = ({ route, setNewRouteData, imageUri }) => {
  const  marker = route != undefined ? route.params.marker: null;
  const [settingRouteData, setSettingRouteData] = useState(route != undefined ? false : true); // Set to true when creating a new route
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
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const showNotification = useNotification();
  const notificationshown = useRef(false);

  // Fetch route data and listen to it continuously when the screen is loaded
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

  // Show a notification if the route has no sends
  useEffect(() => {
    if (routeData?.sentBy.length === 0 && !notificationshown.current) {
      showNotification('Be the first to send this route!', 4000);
      notificationshown.current = true;
    }
  }, [routeData]);

  // Function to handle creating a new route
  const handleCreateRoute = () => {
      setNewRouteData({name: newRouteName, grade: newRouteGrade, holdColor: newRouteHoldColor});
  }

  // Function to handle voting for delete
  const handleVoteForDelete = async () => {
    // Check if the user has already voted for delete
    if (routeData.votedForDelete.some(vote => vote.votedBy === userId)) {
      Alert.alert('Error', 'You have already voted for delete.');
      return;
    }
    try {
      if(routeData.votedForDelete.length + 1 === 3) {
        setModalVisible(true); // Show the modal to confirm the delete on the last vote
      } else {
        await voteForDelete(marker.routeId);
        Alert.alert('Success', 'Voted for delete successfully!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to vote for delete.');
    }
  }

  // Function to handle deleting a route from the map
  const onDeleteRoute = async () => {
    setModalVisible(false);
    try {
      await voteForDelete(marker.routeId); // Add a vote before deleting the route
      await setRouteInvisible(marker.id); // Set the route invisible
      showNotification('Route deleted successfully!', 4000); // Show a notification
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete route.');
    }
  }
  
  // Function to handle saving the route as sent
  const handleSave = async () => {
    if (!gradeVote.trim() || !tryCount.trim()) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
    // Check if the user has already marked the route as sent
    if(routeData.sentBy.some(sentBy => sentBy.senderId === userId)) {
      setShowMarkAsSent(false);
      Alert.alert('Error', 'You have already marked this route as sent.');
      return;
    }
    try {
      await markRouteAsSent(marker.routeId, gradeVote, tryCount); // Mark the route as sent
      showNotification('Route marked as sent successfully!', 4000); // Show a notification
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to mark route as sent.');
    }  
  };

  // Function to handle image load
  const handleImageLoad = () => {
        setImageLoading(false);
  };
  
  // Function to show or hide the mark as sent form
  const handleShowMarkAsSent = () => {
    if(!showMarkAsSent) {
      setGradeVote('');
      setTryCount('');
      setShowMarkAsSent(true);
    }else {
      setShowMarkAsSent(false);
    }
  }

  if (loading) {
    return (
      <LoadingIcon/>
    );
  }

  return (
    <>
    {/* Modal to confirm the delete */}
    {modalVisible && <ConfirmDeleteModal visible={modalVisible} onClose={() => setModalVisible(false)} onDelete={onDeleteRoute}/>}
    <ScrollView>
        {/* Display the image of the route. Uses uri given as props or url from route data, depending on the settingRouteData variable */}
        <Image
            source={{ uri: settingRouteData ? imageUri : routeData?.routeImageUrl }}
            style={!imageLoading ? styles.image: {display: 'none'}}
            onLoad={handleImageLoad}
            onError={() => Alert.alert('Error', 'Failed to load the image.')}
        />
        {/* Show a loading icon while the image is loading */}
        {imageLoading && ( 
          <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <LoadingIcon/>
          </View>
      )}
      {/* Show the input fields for setting new route data */}
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
            <ColorPicker value={newRouteGrade} setValue={setNewRouteGrade} isGrade={true}/>
            <Text>Route Hold Color</Text>
            <ColorPicker value={newRouteHoldColor} setValue={setNewRouteHoldColor} isGrade={false}/>
          </View>
        </>
      )}
      {/* Show the route data when an existing route is opened */}
      {!settingRouteData && !imageLoading && (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.basicText}>Route Name: {routeData?.routeName}</Text>
            <Text style={styles.basicText}>Sent By: {routeData?.sentBy.map(entry => entry.senderName).join(', ')}</Text>
            <Text style={styles.basicText}>Average Grade: {routeData?.votedGrade}</Text>
            <Text style={styles.basicText}>Route Hold Color: {routeData?.routeHoldColor}</Text>
            <Text style={styles.basicText}>Route Grade Color: {routeData?.routeGradeColor}</Text>
          </View>
          {showMarkAsSent && (
            <View style={styles.inputContainer}>
              <GradePicker newRouteGrade={gradeVote} setNewRouteGrade={setGradeVote}/>
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
          {/* Show the buttons for marking as sent, saving, and voting for delete */}
          {!settingRouteData && (
            <Button
              mode="contained"
              style={styles.buttonLonger}
              buttonColor= {colors.accent}
              icon={showMarkAsSent ? "cancel" : "check"}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              onPress={handleShowMarkAsSent}
            >
              {showMarkAsSent ? "Cancel" : "Mark as sent"}
            </Button>
          )}
          {(showMarkAsSent || settingRouteData) &&
            <Button
              mode="contained"
              style={styles.buttonLonger}
              buttonColor= {colors.accent}
              icon="content-save"
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
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
              icon="vote"
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              onPress={handleVoteForDelete}
            >Vote for delete {routeData?.votedForDelete.length}/3</Button>
          )}
        </View>
      }
    </ScrollView>
    </>
  );
};

export default BoulderScreen;