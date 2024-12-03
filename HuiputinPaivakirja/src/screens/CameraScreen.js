import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import ImagePreview from '../components/ImagePreview';
import Camera from '../components/Camera';

export default function CameraScreen({setRouteImage, handleHideCamera}) {
  const [permission, requestPermission] = useCameraPermissions(); // New hook from expo-camera. It returns the permission status and a function to request the permission
  const [image, setImage] = useState(null); // Image uri
  const [cameraType, setCameraType] = useState('back'); // Camera type (front or back)
  const [flashMode, setFlashMode] = useState('off'); // Flash mode (on or off)
  const cameraRef = useRef(null); // Camera reference

  // Handle permissions not loaded yet
  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  // Handle permissions not granted
  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  // Take a picture with the camera. If the picture is taken succesfully, save the imgage uri in the image variable
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImage(data.uri);
      } catch (error) {
        console.log('Error taking a picture: ', error);
      }
    }
  };

  // Toggle the camera type (front or back)
  const toggleCameraType = () => {
    setCameraType((current) => (current === 'back' ? 'front' : 'back'));
  };

  // Toggle the flash mode (on or off)
  const toggleFlashMode = () => {
    setFlashMode((current) => (current === 'off' ? 'on' : 'off'));
  };

  // Save the picture in the library
  const savePicture = (capturedImageUri) => {
    if (capturedImageUri) {
        setImage(null);
        handleHideCamera(capturedImageUri);
    }
  };

  return (
    <View style={styles.container}>
      {!image ?  // If there is no image, show the camera component
        <Camera 
          cameraRef={cameraRef} 
          cameraType={cameraType} 
          flashMode={flashMode} 
          takePicture={takePicture} 
          toggleCameraType={toggleCameraType} 
          toggleFlashMode={toggleFlashMode}/>
       : // If there is an image, show the image preview component
        <ImagePreview 
          image={image} 
          setImage={setImage} 
          savePicture={savePicture}/>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginBottom: 20,
  },
});