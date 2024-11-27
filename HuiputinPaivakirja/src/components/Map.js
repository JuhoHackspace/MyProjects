import React, { useState, useEffect } from 'react';
import Svg, { Circle, Rect, Text } from 'react-native-svg';
import styles from '../styles/Styles'
import { Gesture,
         GestureDetector, 
         GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import sectors from '../Helpers/Sectors';

const Map = ({ handleLongPress, newMarker, markers }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const initialScale = useSharedValue(1);
  const initialTranslateX = useSharedValue(0);
  const initialTranslateY = useSharedValue(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [showMarkers, setShowMarkers] = useState(false);
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    setClusters(clusterMarkersBySectors(markers));
  }, [markers]);

  // Cluster markers by sectors. Creates a cluster for each sector and counts the markers in each sector.
  const clusterMarkersBySectors = (markers) => {
    const clusters = sectors.map(sector => {
      const sectorMarkers = markers.filter(marker => 
        marker.x >= sector.xMin && marker.x <= sector.xMax &&
        marker.y >= sector.yMin && marker.y <= sector.yMax
      );
      const centerX = (sector.xMin + sector.xMax) / 2;
      const centerY = (sector.yMin + sector.yMax) / 2;
      return {
        id: sector.id,
        name: sector.name,
        x: centerX,
        y: centerY,
        count: sectorMarkers.length,
        visible: sectorMarkers.length > 0,
        markers: sectorMarkers,
      };
    });
    console.log('Clusters: ', clusters);
    return clusters;
  };

  // Gesture handlers

  // Long press gesture handler. This handler is used for adding a new route to the map.
  const longPress = Gesture.LongPress()
    .onStart((e) => {
      try {
        //console.log('Long press ended event: ', e);
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
      //console.log('Pinch move event: ', e);
    })
    .onBegin((e) => {
      //console.log('Pinch begin event: ', e);
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
        //console.log('Pinch update event: ', e);
        scale.value = initialScale.value * e.scale;
        //console.log('Scale value: ', scale.value);
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
      //console.log('Pan begin event: ', e);
      initialTranslateX.value = translateX.value;
      initialTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      try {
        if(e.numberOfPointers > 1) return;
        //console.log('Pan update event: ', e);
        translateX.value = initialTranslateX.value + e.translationX / scale.value;
        translateY.value = initialTranslateY.value + e.translationY / scale.value;
        //console.log('TranslateX value: ', translateX.value);
        //console.log('TranslateY value: ', translateY.value);
      } catch (error) {
        console.log('Error in pan event: ', error);
      }
    }
  )
  
  .onEnd(() => {
    //console.log('Pan end event')
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

  return (
    <GestureHandlerRootView style={[styles.centeredbaseContainer]}>
        <GestureDetector gesture={Gesture.Race(pinch, pan, longPress)}>
          <Animated.View style={[styles.mapImage, {transform: [{scale: scale}, {translateX: translateX}, {translateY: translateY}]}]}>
            <Animated.Image
              source = {require('../../assets/BoulderMap_transformed_2.png')}
              style = {[styles.mapImage]}
              onLayout = {(event) => {
                const { width, height } = event.nativeEvent.layout;
                setImageWidth(width);
                setImageHeight(height);
              }}
            />
            {newMarker && (
              <Svg style={styles.svgOverlay} onPress={(e)=> {console.log("Press event")}}>
                <Circle cx={newMarker.x} cy={newMarker.y} r={8} fill="red" />
              </Svg>
            )}
            {clusters.length > 0 && !showMarkers && clusters.map(cluster => {
              if(cluster) {
                return (
                <Svg key={cluster.id} style={styles.svgOverlay}>
                  <Rect x={cluster.x-30} y={cluster.y-12} width={60} height={15} fill="red" />
                  <Text x={cluster.x} y={cluster.y} fill="white" fontSize="12" textAnchor="middle">
                      {cluster.name}
                  </Text>
                  <Text x={cluster.x} y={cluster.y+15} fill="red" fontSize="12" textAnchor="middle">
                      {cluster.count}
                  </Text>
                </Svg>
              )}
            })}
            {markers.length > 0 && showMarkers && markers.map((marker) => (
              <Svg key={markers.routeId} style={styles.svgOverlay} onPress={(e)=> {console.log("Press event")}}>
                <Circle cx={marker.x} cy={marker.y} r={8} fill={marker.gradeColor} />
                <Circle cx={marker.x} cy={marker.y} r={5.5} fill={marker.holdColor} />
              </Svg>
            ))}
          </Animated.View>
        </GestureDetector>
    </GestureHandlerRootView>
  );
};


export default Map;