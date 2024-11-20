import React, { useState } from 'react';
import Svg, { Circle, G } from 'react-native-svg';
import styles from '../styles/Styles'
import { Gesture,
         GestureDetector, 
         GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import AnimatedInfo from './AnimatedInfo';

const Map = ({ handleLongPress, newMarker, showNotification, setShowNotification, showRouteAddedNotification, setShowRouteAddedNotification }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const initialScale = useSharedValue(1);
  const initialTranslateX = useSharedValue(0);
  const initialTranslateY = useSharedValue(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

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
      try {
        //console.log('Pinch update event: ', e);
        scale.value = initialScale.value * e.scale;
        //console.log('Scale value: ', scale.value);
      } catch (error) {
        console.log('Error in pinch event: ', error);
      }
    })
  
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
      {showNotification &&
         <AnimatedInfo 
            showNotification={showNotification} 
            setShowNotification={setShowNotification} 
            text="Long press to add a new route" 
         />
      }
      {showRouteAddedNotification &&
         <AnimatedInfo 
            showNotification={showRouteAddedNotification} 
            setShowNotification={setShowRouteAddedNotification} 
            text="Route succesfully added" 
         />
      }
        <GestureDetector gesture={Gesture.Race(pinch, pan, longPress)}>
          <Animated.View style={[styles.mapImage, {transform: [{scale: scale}, {translateX: translateX}, {translateY: translateY}]}]}>
            <Animated.Image
              source = {require('../../assets/BoulderMap_transformed.png')}
              style = {[styles.mapImage]}
              onLayout = {(event) => {
                const { width, height } = event.nativeEvent.layout;
                setImageWidth(width);
                setImageHeight(height);
              }}
            />
            {newMarker && (
              <Svg style={styles.svgOverlay} onPress={(e)=> {console.log("Press event")}}>
                <Circle cx={newMarker.x} cy={newMarker.y} r={10} fill="red" />
              </Svg>
            )}
          </Animated.View>
        </GestureDetector>
    </GestureHandlerRootView>
  );
};


export default Map;