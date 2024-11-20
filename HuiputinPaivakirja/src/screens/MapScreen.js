import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Map from '../components/Map';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/Styles';
import { useTheme } from 'react-native-paper';
import DrawerButton from '../components/DrawerButton';
import { onSnapshot } from 'firebase/firestore';
import { markers } from '../firebase/Config'; 
import Svg, { Circle } from 'react-native-svg';

const MapScreen = ({setMarker, setShowMap, setShowCamera, showRouteAddedNotification, setShowRouteAddedNotification}) => {

  const [addingMarker, setAddingMarker] = useState(false);
  const [newMarker, setNewMarker] = useState(null);
  const { colors } = useTheme()
  const [showNotification, setShowNotification] = useState(false)
  const [markerData, setMarkerData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Hae markerit Firebase:sta
    const unsubscribe = onSnapshot(markers, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMarkerData(data);
    });

    return () => unsubscribe();
  }, []);

  const handleAddNewRoute = () => {
    setAddingMarker(true);
    setShowNotification(true);
  };

  const handleMapLongPress = (event) => {
    if (addingMarker) {
      try {
        const { x, y } = event;
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
    // Navigoi BoulderScreeniin ja välitä markerin tiedot
    navigation.navigate('BoulderScreen', { marker });
  };

  return (
    <View style={styles.screenBaseContainer}>
      {/* Include the DrawerButton */}
      <DrawerButton navigation={navigation} />

      {/* Map Component */}
      <Map
        handleLongPress={handleMapLongPress}
        newMarker={newMarker}
        showNotification={showNotification}
        setShowNotification={setShowNotification}
        showRouteAddedNotification={showRouteAddedNotification}
        setShowRouteAddedNotification={setShowRouteAddedNotification}
      />

      {/* Näytä Firebase-markkerit kartalla */}
      <Svg style={styles.svgOverlay}>
        {markerData.map((marker) => (
          <Circle
            key={marker.id}
            cx={marker.x}
            cy={marker.y}
            r={10}
            fill={marker.holdColor}
            onPress={() => handleMarkerPress(marker)} // Navigoi BoulderScreeniin
          />
        ))}
      </Svg>

      {/* Bottom Buttons */}
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
