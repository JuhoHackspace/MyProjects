import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Map from '../components/Map';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/Styles';
import { useTheme } from 'react-native-paper';
import DrawerButton from '../components/DrawerButton';
import { listenToMarkers } from '../firebase/FirebaseMethods';
import { useNotification } from '../context/NotificationProvider';
import { useMarkers } from '../context/MarkerProvider';
/**
 * MapScreen displays the map with boulder markers and allows the user to add new markers.
 * @param {Function} setMarker - Function to set the new marker data
 * @param {Function} setShowMap - Function to show or hide the map screen
 * @param {Function} setShowCamera - Function to show or hide the camera screen
 */
const MapScreen = ({ setMarker, setShowMap, setShowCamera }) => {
  const [addingMarker, setAddingMarker] = useState(false);
  const [newMarker, setNewMarker] = useState(null);
  const { colors } = useTheme();
  const navigation = useNavigation();
  const showNotification = useNotification();
  const { markers, clusters } = useMarkers();
  const [scaleFactors, setScaleFactors] = useState({ scaleFactorX: 1, scaleFactorY: 1 });

  const handleAddNewRoute = () => {
    setAddingMarker(true);
    showNotification('Long press on the map to add a new route', 3000);
  };

  // Handle long press on the map to add a new marker
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

  // Handle setting the new marker and scaling the coordinates
  const handleSetMarker = () => {
    const { scaleFactorX = 1, scaleFactorY = 1 } = scaleFactors;
    
    // Convert the coordinates to the original coordinate system before saving
    const originalX = newMarker.x / scaleFactorX;
    const originalY = newMarker.y / scaleFactorY;
    
    setMarker({ 
      x: originalX, 
      y: originalY 
    });
    setShowMap(false);
    setShowCamera(true);
  };

  // Handle canceling the new marker
  const handleCancelMarker = () => {
    setAddingMarker(false);
    setNewMarker(null);
  };

  // Handle marker press.
  const handleMarkerPress = (marker) => {
    navigation.navigate('BoulderScreen', { marker }); // Navigate to BoulderScreen and pass marker data
  };

  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>
      <DrawerButton navigation={navigation} />
      <Map
        handleLongPress={handleMapLongPress}
        newMarker={newMarker}
        markers={markers}
        clusters={clusters}
        handleMarkerPress={handleMarkerPress}
        setScaleFactors={setScaleFactors}
      />
      <View style={styles.containerBottom}>
        {newMarker && (
          <View style={styles.buttonContainerHorizontal}>
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleSetMarker}
              buttonColor={colors.accent}
            >
              Set
            </Button>
            <Button
              style={styles.button}
              mode="contained"
              onPress={handleCancelMarker}
              buttonColor={colors.accent}
            >
              Cancel
            </Button>
          </View>
        )}
        {!addingMarker && (
          <View style={styles.buttonContainerHorizontal}>
            <Button
              style={styles.buttonLong}
              mode="contained"
              onPress={handleAddNewRoute}
              icon="plus"
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              buttonColor={colors.accent}
            >
              New route
            </Button>
          </View>
        )}
      </View>
    </View>
  );
};

export default MapScreen;