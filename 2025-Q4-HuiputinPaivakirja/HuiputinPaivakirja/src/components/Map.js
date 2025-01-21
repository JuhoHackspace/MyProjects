import React, { useState, useEffect } from 'react';
import Svg, { Circle, Rect, Text } from 'react-native-svg';
import styles from '../styles/Styles'
import { Gesture,
         GestureDetector, 
         GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import sectors from '../Helpers/Sectors';
import SectorOverlay from './SectorOverlay';
import { ORIGINAL_IMAGE_WIDTH, ORIGINAL_IMAGE_HEIGHT } from '../Helpers/Sectors';
import { useTheme } from 'react-native-paper';
import { useCustomTheme } from '../theme/CustomTheme';

/**
 * Map component displays the map image with markers and sectors.
 * @param {Function} handleLongPress - Function to handle long press on the map
 * @param {Object} newMarker - Object with the new marker data
 * @param {Array} markers - Array of markers provided by the MarkerProvider
 * @param {Array} clusters - Array of clusters provided by the MarkerProvider
 * @param {Function} handleMarkerPress - Function to handle marker press
 * @param {Function} setScaleFactors - Function to set the scale factors
 */

const Map = ({ handleLongPress, newMarker, markers, clusters, handleMarkerPress, setScaleFactors }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const initialScale = useSharedValue(1);
  const initialTranslateX = useSharedValue(0);
  const initialTranslateY = useSharedValue(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [showMarkers, setShowMarkers] = useState(false);
  const [scaleFactorX, setScaleFactorX] = useState(1);
  const [scaleFactorY, setScaleFactorY] = useState(1);
  const { isDarkTheme } = useCustomTheme();
  const { colors } = useTheme();
  

  // Scalefactor from the MapScreen component
  useEffect(() => {
    setScaleFactors({ 
      scaleFactorX, 
      scaleFactorY 
    });
  }, [scaleFactorX, scaleFactorY]);

  // Gesture handlers

  // Long press gesture handler. This handler is used for adding a new route to the map.
  const longPress = Gesture.LongPress()
    .onStart((e) => {
      try {
        handleLongPress(e);
      }catch (error) {
        console.log('Error in long press event: ', error);
      }
    })
    .runOnJS(true);

  // Pinch gesture handler. This handler is used for zooming in and out of the map.
  const pinch = Gesture.Pinch()
    .onTouchesMove((e) => {
      if(e.numberOfTouches !==2 ) return;
    })
    .onBegin((e) => {
      initialScale.value = scale.value;
    })
    .onUpdate((e) => {
      if(initialScale.value * e.scale < 0.8 || initialScale.value * e.scale > 5.0 ) return;
      if(initialScale.value * e.scale > 1.75) {
        setShowMarkers(true);
      }else {
        setShowMarkers(false);
      }
      try {
        scale.value = initialScale.value * e.scale;
      } catch (error) {
        console.log('Error in pinch event: ', error);
      }
    })
    .runOnJS(true);
  
  // Pan gesture handler. This handler is used for moving the map around.
  const pan = Gesture.Pan()
    .maxPointers(1)
    .onBegin((e) => {
      if(e.numberOfPointers > 1) return;
      initialTranslateX.value = translateX.value;
      initialTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      try {
        if(e.numberOfPointers > 1) return;
        translateX.value = initialTranslateX.value + e.translationX / scale.value;
        translateY.value = initialTranslateY.value + e.translationY / scale.value;
      } catch (error) {
        console.log('Error in pan event: ', error);
      }
    }
  )
  
  .onEnd(() => {
    if (scale.value <= 1) {
      const scaledWidth = imageWidth * scale.value;
      const scaledHeight = imageHeight * scale.value;
      const maxTranslateX = (scaledWidth - imageWidth) / 2;
      const maxTranslateY = (scaledHeight - imageHeight) / 2;

      if (Math.abs(translateX.value) > maxTranslateX || Math.abs(translateY.value) > maxTranslateY) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    }else {
      const halfImageWidth = imageWidth / 2;
      const halfImageHeight = imageHeight / 2;

      if (translateX.value > halfImageWidth) {
        translateX.value = withSpring(halfImageWidth);
      } else if (translateX.value < -halfImageWidth) {
        translateX.value = withSpring(-halfImageWidth);
      }

      if (translateY.value > halfImageHeight) {
        translateY.value = withSpring(halfImageHeight);
      } else if (translateY.value < -halfImageHeight) {
        translateY.value = withSpring(-halfImageHeight);
      }
    }
  })

  // This calculates how much we need to scale coordinates based on the actual rendered image size.
  const handleImageLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setImageWidth(width);
    setImageHeight(height);
    
    // Calculate scale factors
    setScaleFactorX(width / ORIGINAL_IMAGE_WIDTH);
    setScaleFactorY(height / ORIGINAL_IMAGE_HEIGHT);
  };

  // Function to scale coordinates
  const scaleCoordinates = (x, y) => ({
    x: x * scaleFactorX,
    y: y * scaleFactorY
  });

  return (
    <GestureHandlerRootView style={[styles.centeredbaseContainer, { backgroundColor: colors.background }]}>
        <GestureDetector gesture={Gesture.Race(pinch, pan, longPress)}>
          <Animated.View style={[styles.mapImage, {
            transform: [{scale: scale}, {translateX: translateX}, {translateY: translateY}],
            backgroundColor: colors.background
          }]}>
            <Animated.Image
              source = {require('../../assets/BoulderMap_transformed_2.png')}
              style = {[styles.mapImage, { tintColor: isDarkTheme ? '#ffffff' : undefined }]}
              onLayout = {handleImageLayout}
            />
            <Svg style={styles.svgOverlay}>
              {newMarker && (
                  <Circle cx={newMarker.x} cy={newMarker.y} r={8} fill="red"/>
              )}
            {clusters.length > 0 && !showMarkers && clusters.map(cluster => {
              const sector = sectors.find(s => s.id === cluster.id);
              const scaledCluster = {
                ...cluster,
                x: cluster.x * scaleFactorX,
                y: cluster.y * scaleFactorY
              };
              const scaledSector = {
                ...sector,
                xMin: sector.xMin * scaleFactorX,
                xMax: sector.xMax * scaleFactorX,
                yMin: sector.yMin * scaleFactorY,
                yMax: sector.yMax * scaleFactorY
              };
              return <SectorOverlay key={cluster.id} cluster={scaledCluster} sector={scaledSector} />;
            })}
              {markers.length > 0 && showMarkers && markers.map((marker) => {
                if(marker.visible) {  
                  const scaled = scaleCoordinates(marker.x, marker.y);
                  return (
                  <Svg key={marker.id} style={{position: 'absolute', left: scaled.x - 4, top: scaled.y - 4, width: 8, height: 8, zIndex: 100 }} onPress={() => handleMarkerPress(marker)}>
                    <Circle cx={scaled.x} cy={scaled.y} r={8} fill={marker.gradeColor} onPress={() => {}}/>
                    <Circle cx={scaled.x} cy={scaled.y} r={5.5} fill={marker.holdColor}/>
                  </Svg>
                  )
                }
              })}
            </Svg>
          </Animated.View>
        </GestureDetector>
    </GestureHandlerRootView>
  );
};


export default Map;