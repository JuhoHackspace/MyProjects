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
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const showNotification = useNotification();
  const notificationshown = useRef(false);

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

  useEffect(() => {
    if (routeData?.sentBy.length === 0 && !notificationshown.current) {
      showNotification('Be the first to send this route!', 4000);
      notificationshown.current = true;
    }
  }, [routeData]);

 /* const calculateAverageGrade = () => {
    if (!routeData?.routeGradeVotes?.length) return 'No votes yet';
    const total = routeData.routeGradeVotes.reduce((sum, grade) => sum + parseInt(grade, 10), 0);
    return (total / routeData.routeGradeVotes.length).toFixed(1);
  };*/

  const handleCreateRoute = () => {
      setNewRouteData({name: newRouteName, grade: newRouteGrade, holdColor: newRouteHoldColor});
  }

  const handleVoteForDelete = async () => {
    if (routeData.votedForDelete.some(vote => vote.votedBy === userId)) {
      Alert.alert('Error', 'You have already voted for delete.');
      return;
    }
    try {
      if(routeData.votedForDelete.length + 1 === 3) {
        setModalVisible(true);
      } else {
        await voteForDelete(marker.routeId);
        Alert.alert('Success', 'Voted for delete successfully!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to vote for delete.');
    }
  }

  const onDeleteRoute = async () => {
    setModalVisible(false);
    try {
      await voteForDelete(marker.routeId);
      await setRouteInvisible(marker.id);
      showNotification('Route deleted successfully!', 4000);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete route.');
    }
  }
  const handleSave = async () => {
    if (!gradeVote.trim() || !tryCount.trim()) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
    if(routeData.sentBy.some(sentBy => sentBy.senderId === userId)) {
      setShowMarkAsSent(false);
      Alert.alert('Error', 'You have already marked this route as sent.');
      return;
    }
    try {
      await markRouteAsSent(marker.routeId, gradeVote, tryCount);
      showNotification('Route marked as sent successfully!', 4000);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to mark route as sent.');
    }  
  };
  const handleImageLoad = () => {
        setImageLoading(false);
  };
  
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
    {modalVisible && <ConfirmDeleteModal visible={modalVisible} onClose={() => setModalVisible(false)} onDelete={onDeleteRoute}/>}
    <ScrollView>
        <Image
            source={{ uri: settingRouteData ? imageUri : routeData?.routeImageUrl }}
            style={!imageLoading ? styles.image: {display: 'none'}}
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
            <ColorPicker value={newRouteGrade} setValue={setNewRouteGrade} isGrade={true}/>
            <Text>Route Hold Color</Text>
            <ColorPicker value={newRouteHoldColor} setValue={setNewRouteHoldColor} isGrade={false}/>
          </View>
        </>
      )}
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