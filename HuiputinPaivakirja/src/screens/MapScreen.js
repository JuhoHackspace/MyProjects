import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper'
import Map from '../components/Map';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/Styles'
import { useTheme } from 'react-native-paper';

const MapScreen = ({navigation}) => {
  
  const [addingMarker, setAddingMarker] = useState(false);
  const [newMarker, setNewMarker] = useState(null);
  const { colors } = useTheme()
  const [showNotification, setShowNotification] = useState(false)

  const handleAddNewRoute = () => {
    setAddingMarker(true);
    setShowNotification(true)
  };

  const handleMapLongPress = (event) => {
    if (addingMarker) {
      const { locationX, locationY } = event.nativeEvent;
      setNewMarker({ x: locationX, y: locationY });
    }
  };

  const handleSetMarker = () => {
    navigation.navigate('Camera'); // Open CameraScreen after setting the marker
  };

  const handleCancelMarker = () => {
    setAddingMarker(false);
    setNewMarker(null);
    setShowNotification(false)
  };

  return (
    <View style={styles.screenBaseContainer}>
      <Map handleLongPress={handleMapLongPress} newMarker={newMarker} showNotification={showNotification} setShowNotification={setShowNotification}/>
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