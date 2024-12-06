import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Alert, ActivityIndicator, ScrollView, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { fetchRouteData, voteForDelete, setRouteInvisible, markRouteAsSent, getRouteTries, cancelRouteAsSent } from '../firebase/FirebaseMethods';
import LoadingIcon from '../components/LoadingIcon';
import styles from '../styles/Styles';
import { useTheme } from 'react-native-paper';
import { useCustomTheme } from '../theme/CustomTheme';
import { useAuth } from '../firebase/AuthProvider';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { useNavigation } from '@react-navigation/native';
import { useNotification } from '../context/NotificationProvider';
import GradePicker from '../components/GradePicker';
import ColorPicker from '../components/ColorPicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
  const [tryCount, setTryCount] = useState(1);
  const [newRouteName, setNewRouteName] = useState('');
  const [newRouteGrade, setNewRouteGrade] = useState('yellow');
  const [newRouteHoldColor, setNewRouteHoldColor] = useState('yellow');
  const { colors } = useTheme();
  const { isDarkTheme } = useCustomTheme();
  const { user } = useAuth();
  const userId = user?.uid;
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const showNotification = useNotification();
  const notificationshown = useRef(false);
  const [routeFlashed, setRouteFlashed] = useState(false);
  const [routeDone, setRouteDone] = useState(false);
  const [doneRouteTryCount, setDoneRouteTryCount] = useState(0);
  const [doneRouteSentAt, setDoneRouteSentAt] = useState(null);
  const [flashPressed, setFlashPressed] = useState(false);

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
    async function getTries() {
      try {
        setRouteDone(false);
        setRouteFlashed(false);
        if(routeData?.sentBy.some(sentBy => sentBy.senderId === userId)) {
          const tries = await getRouteTries(marker.routeId);
          const sentAt = routeData.sentBy.find(sentBy => sentBy.senderId === userId).sentAt;
          setDoneRouteSentAt(sentAt);
          console.log(tries);
          if(parseInt(tries) == 1) {
            setRouteFlashed(true);
            setDoneRouteTryCount(tries);
            setFlashPressed(false);
            console.log('Route flashed');
          } else if(parseInt(tries) > 1) {
            setRouteDone(true);
            setDoneRouteTryCount(tries);
            setFlashPressed(false);
            console.log('Route done');
          }
        }else {
          setFlashPressed(false);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to get tries.');
      }
    }
    getTries();
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
  
  // Function to handle saving the route as flashed (climbed with one try)
  const handleRouteFlashed = async () => {
    console.log('Try count: ', tryCount);
    if(!flashPressed) {
      setFlashPressed(true);
      console.log('Flash pressed');
    }
    try {
      if(routeFlashed) {
        setTryCount(1);
        await cancelRouteAsSent(marker.routeId, doneRouteTryCount, doneRouteSentAt ); // Cancel the route as flashed
      } else if(routeDone) {
        setTryCount(1);
        await cancelRouteAsSent(marker.routeId, doneRouteTryCount, doneRouteSentAt ); // Cancel the route as sent
        await markRouteAsSent(marker.routeId, 1); // Mark the route as sent
        showNotification('Route marked as sent successfully!', 4000); // Show a notification
      } else {
        await markRouteAsSent(marker.routeId, tryCount); // Mark the route as sent
        showNotification('Route marked as sent successfully!', 4000); // Show a notification
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to mark route as sent.');
    }  
  };
  // Function to set the route as done
  const handleRouteDone = async () => {
    console.log('Try count: ', tryCount);
    try {
      if(routeDone) {
        setTryCount(1);
        await cancelRouteAsSent(marker.routeId, doneRouteTryCount, doneRouteSentAt ); // Cancel the route as sent
      } else if(routeFlashed) {
        await cancelRouteAsSent(marker.routeId, doneRouteTryCount, doneRouteSentAt ); // Cancel the route as flashed
        await markRouteAsSent(marker.routeId, tryCount); // Mark the route as sent
        showNotification('Route marked as sent successfully!', 4000); // Show a notification
      } else {
        await markRouteAsSent(marker.routeId, tryCount); // Mark the route as sent
        showNotification('Route marked as sent successfully!', 4000); // Show a notification
      }
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
      setTryCount(1);
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
    <ScrollView style={{ backgroundColor: colors.background }}>
      {modalVisible && (
        <ConfirmDeleteModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onDelete={onDeleteRoute}
        />
      )}
      <Image
        source={{ uri: settingRouteData ? imageUri : routeData?.routeImageUrl }}
        style={!imageLoading ? styles.image : { display: 'none' }}
        onLoad={handleImageLoad}
        onError={() => Alert.alert('Error', 'Failed to load the image.')}
      />
      {imageLoading && (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <LoadingIcon />
        </View>
      )}
      {settingRouteData && (
        <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
          <TextInput
            mode="outlined"
            style={[styles.input, { backgroundColor: isDarkTheme ? colors.background : 'white' }]}
            placeholder="Route Name"
            value={newRouteName}
            onChangeText={setNewRouteName}
            placeholderTextColor={colors.text}
            textColor={colors.text}
            outlineColor={colors.text}
            activeOutlineColor={colors.accent}
            theme={{
              colors: {
                text: colors.text,
                placeholder: colors.text,
                primary: colors.accent,
              },
            }}
          />
          <Text style={{ color: colors.text }}>Route Tag Color</Text>
          <ColorPicker value={newRouteGrade} setValue={setNewRouteGrade} isGrade={true} />
          <Text style={{ color: colors.text, marginTop: 10 }}>Route Hold Color</Text>
          <ColorPicker value={newRouteHoldColor} setValue={setNewRouteHoldColor} isGrade={false} />
        </View>
      )}
      {!settingRouteData && !imageLoading && (
        <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.basicText, { color: colors.text }]}>Route Name: {routeData?.routeName}</Text>
          <Text style={[styles.basicText, { color: colors.text }]}>Sent By: {routeData?.sentBy.map(entry => entry.senderName).join(', ')}</Text>
          <Text style={[styles.basicText, { color: colors.text }]}>Average Grade: {routeData?.votedGrade}</Text>
          <Text style={[styles.basicText, { color: colors.text }]}>Route Hold Color: {routeData?.routeHoldColor}</Text>
          <Text style={[styles.basicText, { color: colors.text }]}>Route Grade Color: {routeData?.routeGradeColor}</Text>
          {routeDone || routeFlashed && <Text style={[styles.basicText, { color: colors.text }]}>Suggest a grade:</Text>}
          {routeDone || routeFlashed && <GradePicker newRouteGrade={gradeVote} setNewRouteGrade={setGradeVote} />}
        </View>
      )}
      {showMarkAsSent && (
        <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
          <TextInput
            mode="outlined"
            style={[styles.input, { 
              backgroundColor: isDarkTheme ? colors.background : 'white',
              marginTop: 16 
            }]}
            placeholder="Try Count"
            value={tryCount}
            keyboardType="numeric"
            onChangeText={setTryCount}
            placeholderTextColor={colors.text}
            textColor={colors.text}
            outlineColor={colors.text}
            activeOutlineColor={colors.accent}
            theme={{
              colors: {
                text: colors.text,
                placeholder: colors.text,
                primary: colors.accent,
              },
            }}
          />
        </View>
      )}
      {!imageLoading && (
        <View style={[styles.buttonContainerVertical, { backgroundColor: colors.background }]}>
          {!settingRouteData && (
            <View style={styles.buttonContainerHorizontal}>
            {!showMarkAsSent && 
              <Button
                mode="contained"
                style={styles.buttonLong}
                buttonColor={colors.accent}
                textColor="white"
                icon={() => (
                  <Icon name='check' size={20} color={!showMarkAsSent && routeFlashed ? 'green' : 'white'} />
                )}
                iconColor='green'
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                onPress={() => {
                  if(!flashPressed) {
                    handleRouteFlashed()
                  }
                }}
              >
                Flash
              </Button>
            }
            <Button
              mode="contained"
              style={styles.buttonLong}
              buttonColor={colors.accent}
              textColor="white"
              icon={() => (
                <Icon name={showMarkAsSent ? 'cancel' : 'check'} size={20} color={!showMarkAsSent && routeDone ? 'green' : 'white'} />
              )}
              iconColor={!showMarkAsSent && routeDone ? 'green' : 'white'}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              onPress={() => {
                if(routeDone && !showMarkAsSent) {
                  handleRouteDone();
                }else {
                  handleShowMarkAsSent();
                }
              }}
            >
              {showMarkAsSent ? "Cancel" : "Done"}
            </Button>
            </View>
          )}
          {(showMarkAsSent || settingRouteData) && (
            <Button
              mode="contained"
              style={styles.buttonLong}
              buttonColor={colors.accent}
              textColor="white"
              icon="content-save"
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              onPress={() => {
                if (settingRouteData) {
                  handleCreateRoute();
                } else {
                  setShowMarkAsSent(false);
                  handleRouteDone();
                }
              }}
            >
              {settingRouteData ? "Create" : "Save"}
            </Button>
          )}
          {!showMarkAsSent && !settingRouteData && (
            <Button
              mode="contained"
              style={styles.buttonLonger}
              buttonColor={colors.accent}
              textColor="white"
              icon="vote"
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              onPress={handleVoteForDelete}
            >
              Vote for delete {routeData?.votedForDelete.length}/3
            </Button>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default BoulderScreen;