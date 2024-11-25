import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper'
import Map from '../components/Map';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/Styles'
import { useTheme } from 'react-native-paper';
import DrawerButton from '../components/DrawerButton';
import { listenToMarkers } from '../firebase/FirebaseMethods';

const MapScreen = ({setMarker, setShowMap, setShowCamera, showRouteAddedNotification, setShowRouteAddedNotification}) => {

  const [addingMarker, setAddingMarker] = useState(false);
  const [newMarker, setNewMarker] = useState(null);
  const { colors } = useTheme()
  const [showNotification, setShowNotification] = useState(false)
  const navigation = useNavigation();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToMarkers(setMarkers);
    return () => unsubscribe();
  }, []);

  const handleAddNewRoute = () => {
    setAddingMarker(true);
    setShowNotification(true)
  };

  const handleMapLongPress = (event) => {
    if (addingMarker) {
      try {
        const { x, y } = event;
        console.log('X', x, 'Y', y);
        setNewMarker({ x: x, y: y });
      } catch (error) {
        console.log('Error in handleMapLongPress: ', error);
      }
    }
  };

  const handleSetMarker = () => {
    setMarker(newMarker) // Open CameraScreen after setting the marker
    setShowMap(false)
    setShowCamera(true)
  };

  const handleCancelMarker = () => {
    setAddingMarker(false);
    setNewMarker(null);
    setShowNotification(false)
  };

  return (
    <View style={styles.screenBaseContainer}>

      {/* Include the DrawerButton */}
      <DrawerButton navigation={navigation} />

      <Map 
        handleLongPress={handleMapLongPress} 
        newMarker={newMarker} 
        markers={markers}
        showNotification={showNotification} 
        setShowNotification={setShowNotification}
        showRouteAddedNotification={showRouteAddedNotification}
        setShowRouteAddedNotification={setShowRouteAddedNotification} 
      />
      <View style={styles.containerBottom}>
        {newMarker && (
          <View style={styles.buttonContainerHorizontal}>
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleSetMarker}
              buttonColor={colors.accent}
            >Set</Button>
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleCancelMarker}
              buttonColor={colors.accent}
            >Cancel</Button>
          </View>
        )}
        {!addingMarker && (
          <View style={styles.buttonContainerHorizontal}>
            <Button
              style={styles.buttonLong}
              mode="contained"
              onPress={handleAddNewRoute}
              buttonColor={colors.accent}
            >Add new route</Button>
          </View>
        )}
      </View>
    </View>
  );
};

export default MapScreen;