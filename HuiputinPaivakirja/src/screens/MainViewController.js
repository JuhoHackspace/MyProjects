import { View, Text, BackHandler } from 'react-native'
import React, { useState, useEffect } from 'react'
import CameraScreen from './CameraScreen'
import MapScreen from './MapScreen'
import styles from '../styles/Styles'
import { addRouteAndMarker } from '../firebase/FirebaseMethods'
import LoadingIcon from '../components/LoadingIcon'
import { useNotification } from '../context/NotificationProvider'
import BoulderScreen from '../screens/boulderScreen'

/**
 * This component is the main controller for adding new routes and viewing the map.
 * It keeps track of the current state of the app and manages the transitions
 * between the MapScreen and CameraScreen and the BoulderScreen.
 * It manages the state of the marker, image and route data
 * and calls the addRouteAndMarker function to add the route and marker to the database
 * @returns MainViewController component
 */

export default function MainViewController() {
  const [showCamera, setShowCamera] = useState(false)
  const [showMap, setShowMap] = useState(true)
  const [showBoulderScreen, setShowBoulderScreen] = useState(false)
  const [marker, setMarker] = useState(null)
  const [image, setImage] = useState(null)
  const [id, setId] = useState(null)
  const [loading, setLoading] = useState(false)
  const showNotification = useNotification()

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      if (showBoulderScreen) {
        setShowBoulderScreen(false);
        setShowMap(true);
        return true; // Prevent default behavior
      }
      if (showCamera) {
        setShowCamera(false);
        setShowMap(true);
        return true; // Prevent default behavior
      }
      return false; // Let default behavior happen (exit app)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [showBoulderScreen, showCamera]);

  // Function to handle hiding the camera screen and showing the boulder screen
  const handleHideCamera = async (imageUri) => {
    setShowCamera(false)
    setImage(imageUri)
    setShowBoulderScreen(true)
  }

  // Function to set the new route data and add the route to the database
  const setNewRouteData = async (routeData) => {
    setShowBoulderScreen(false)
    setLoading(true)
    try {
        // This function will upload the image and add the route and marker to the database
        const id = await addRouteAndMarker(image, routeData, marker)
        console.log("Adding route and marker with image: ", image, " route: ", routeData, " marker: ", marker)
        setId(id)
        console.log('Route and marker added with marker id: ', id)
        setLoading(false)
        // Returning to the mapScreen after adding the route and marker        
        setShowMap(true)
        showNotification('Route successfully added', 3000)
    } catch (error) {
        console.log('Error adding route and marker: ', error)
    }
}

// Return the main view controller component
return (
    <View style={styles.screenBaseContainer}>
        {showMap &&
             <MapScreen 
                setMarker={setMarker} 
                setShowMap={setShowMap} 
                setShowCamera={setShowCamera}
            />
        }
        {showCamera && <CameraScreen setRouteImage={setImage} handleHideCamera={handleHideCamera}/>}
        {showBoulderScreen && <BoulderScreen setNewRouteData={setNewRouteData} imageUri={image}/>}
        {loading && (
          <LoadingIcon/>
        )}
    </View>
)
}