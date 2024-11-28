import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import CameraScreen from './CameraScreen'
import MapScreen from './MapScreen'
import styles from '../styles/Styles'
import { addRouteAndMarker } from '../firebase/FirebaseMethods'
import LoadingIcon from '../components/LoadingIcon'
import { useNotification } from '../context/NotificationContext'
/**
 * This component is the main controller for viewing routes and adding new routes
 * It keeps track of the current state of the app and manages the transitions
 * between the MapScreen and CameraScreen (and in the future, the BoulderScreen)
 * It manages the state of the marker and image (and in the future, the route information)
 * and calls the addRouteAndMarker function to add the route and marker to the database
 * @returns MainViewController component
 */
export default function MainViewController() {
  const [showCamera, setShowCamera] = useState(false)
  const [showMap, setShowMap] = useState(true)
  const [marker, setMarker] = useState(null)
  const [image, setImage] = useState(null)
  const [id, setId] = useState(null)
  const [loading, setLoading] = useState(false)
  const showNotification = useNotification()

  // This function is called when the user hides the camera screen. This is called once we have the marker
  // data and the imageUri. This function could set the boulderScreen visible. Another async function
  // defined here, could be called from the boulderScreen to finally add the route to the database.
  const handleHideCamera = async (imageUri) => {
    setShowCamera(false)
    setLoading(true)
    setImage(imageUri)
    try {
        // This hard coded route object represents the actual information that the user will input
        // in the boulderScreen. We can add additional information also.
        const route = { name: 'Orangatang', grade: 'pink', holdColor: 'orange' }
        // This function will upload the image and add the route and marker to the database
        const id = await addRouteAndMarker(imageUri, route, marker)
        console.log("Adding route and marker with image: ", imageUri, " route: ", route, " marker: ", marker)
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
// Once the marker and image are set, the idea is to render boulderScreen
// for the user to add more information about the route
// Once all information is added, we can call addRouteAndMarker to add the route to the database
// AddRouteAndMarker will return the id of the marker for demonstration purposes only, there is no real
// need for it in the app.
// We can create a state variable and implement setters for the route information. The setters will be called
// from the boulderScreen to set the route information. After all this is done, the idea is to return to the
// mapScreen to view routes or add new ones. We can display loading while the route is being added to the database
// Juho, 19-11-2024
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
        {loading && (
            <LoadingIcon/>
        )}
    </View>
)
}