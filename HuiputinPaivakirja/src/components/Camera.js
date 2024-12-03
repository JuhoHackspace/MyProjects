import { View } from 'react-native'
import React from 'react'
import { CameraView } from 'expo-camera'
import Button from './Button'
import styles from '../styles/CameraAndImageStyles'

export default function Camera({ cameraRef, cameraType, flashMode, takePicture, toggleCameraType, toggleFlashMode}) {
  return (
    // Display the camera view with the take picture, flash, and rotate buttons on top
    <CameraView
          style={styles.camera}
          ref={cameraRef}
          facing={cameraType} 
          flash={flashMode} 
    > 
        <View style={styles.buttonsContainer}>
            <View style={styles.cameraButtonContainer}>
                <Button title="Take a picture" icon="camera" onPress={takePicture} />
            </View>
            {/*  Jätetään flash ja etu kamera käyttämättä tässä mutta jäävät tänne säilöön jos joskus tarvitaan
            <View style={styles.flashButtonContainer}>
                <Button
                title={flashMode === 'off' ? 'Flash Off' : 'Flash On'}
                icon="flash"
                onPress={toggleFlashMode}
                color={flashMode === 'off' ? 'red' : 'white'}
                />
              
            </View>
            <View style={styles.rotateButtonContainer}>
                <Button
                title={cameraType === 'back' ? 'Front Camera' : 'Back Camera'}
                icon="cycle"
                onPress={toggleCameraType}
                />
            </View>*/}
        </View>
        
    </CameraView>
  )
}