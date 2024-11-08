import React, { useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Map from '../components/Map';
import { useNavigation } from '@react-navigation/native';

const MapScreen = () => {
  const navigation = useNavigation();
  const [addingMarker, setAddingMarker] = useState(false);
  const [newMarker, setNewMarker] = useState(null);

  const handleAddNewRoute = () => {
    setAddingMarker(true);
  };

  const handleMapLongPress = (event) => {
    if (addingMarker) {
      const { locationX, locationY } = event.nativeEvent;
      setNewMarker({ x: locationX, y: locationY });
    }
  };

  const handleSetMarker = () => {
    setAddingMarker(false);
    navigation.navigate('Camera'); // Open CameraScreen after setting the marker
  };

  const handleCancelMarker = () => {
    setAddingMarker(false);
    setNewMarker(null);
  };

  return (
    <View style={styles.container}>
      <Map onLongPress={handleMapLongPress} newMarker={newMarker} />
      {!addingMarker && (
        <Button title="Add New Route" onPress={handleAddNewRoute} />
      )}
      {newMarker && (
        <View style={styles.markerControls}>
          <Button title="Set" onPress={handleSetMarker} />
          <Button title="Cancel" onPress={handleCancelMarker} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markerControls: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MapScreen;