import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Map from '../components/Map';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/Styles';
import { useTheme } from 'react-native-paper';
import DrawerButton from '../components/DrawerButton';
import { listenToMarkers } from '../firebase/FirebaseMethods';
import { useNotification } from '../context/NotificationContext';

const MapScreen = ({setMarker, setShowMap, setShowCamera}) => {

  const [addingMarker, setAddingMarker] = useState(false);
  const [newMarker, setNewMarker] = useState(null);
  const { colors } = useTheme()
  const navigation = useNavigation();
  const [markers, setMarkers] = useState([]);
  const showNotification = useNotification();

  useEffect(() => {
    const unsubscribe = listenToMarkers(setMarkers);
    return () => unsubscribe();
  }, []);

  const handleAddNewRoute = () => {
    setAddingMarker(true);
    showNotification('Long press on the map to add a new route', 3000);
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
    setMarker(newMarker); // Open CameraScreen after setting the marker
    setShowMap(false);
    setShowCamera(true);
  };

  const handleCancelMarker = () => {
    setAddingMarker(false);
    setNewMarker(null);
    setShowNotification(false);
  };

 
  const handleMarkerPress = (marker) => {
    navigation.navigate('BoulderScreen', { marker }); // Navigoi BoulderScreenille ja välitä markkerin tiedot
  };

  return (
    <View style={styles.screenBaseContainer}>
      {/* Include the DrawerButton */}
      <DrawerButton navigation={navigation} />

      <Map
        handleLongPress={handleMapLongPress}
        newMarker={newMarker}
        markers={markers}
        onMarkerPress={handleMarkerPress}
        handleMarkerPress={handleMarkerPress} // Välitetään painallustoiminto Map-komponentille
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
              buttonColor={colors.accent}
            >
              Add new route
            </Button>
          </View>
        )}
      </View>
    </View>
  );
};

export default MapScreen;