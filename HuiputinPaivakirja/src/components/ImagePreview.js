import React, { useRef, useState } from 'react';
import { View, ImageBackground } from 'react-native';
import Button from './Button';
import styles from '../styles/CameraAndImageStyles';
import { captureRef } from 'react-native-view-shot';
import DrawLine from './DrawLine';

/**
 * ImagePreview component to display the image taken by the camera.
 * Enables the user to re-take the picture, save it or draw a route on top of it.
 */

export default function ImagePreview({ image, setImage, savePicture}) { // -N
  const captureRefView = useRef(null);
  const [hideButtons, setHideButtons] = useState(true);

  // Capture the image and the drawn line and save it
  const handleSavePic = async () => {
    setHideButtons(false);
    try {
      const picAndLines = await captureRef(captureRefView, {
        format: 'png',
        quality: 0.8,
      });
      savePicture(picAndLines); // picAndLines is the image with the drawn line
    } catch (error) {
      console.error('failed to capture image', error);
    }
  };

  return (
    // Display the image in the background with the retake and save buttons on top
    <View ref={captureRefView} style={styles.SnappiContainer}>
    <ImageBackground source={{ uri: image }} style={styles.SnappiContainer}>
      {/*Draw the route on top of the route image */}
      <DrawLine
      hideButtons={hideButtons}
      />
      </ImageBackground>

      {hideButtons && ( // Hide the buttons when the image is being saved
        <View style={styles.buttonsContainer}>
          
          <View style={styles.retakeButtonContainer}>
            <Button title="Re-take" icon="retweet" onPress={() => setImage(null)} />
          </View>
          <View style={styles.saveButtonContainer}>
            <Button title="Save" icon="check" onPress={handleSavePic} />
          </View>
        </View>
         )}
        </View>
      
  );
}
