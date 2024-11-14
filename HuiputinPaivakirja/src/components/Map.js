import React, { useRef, useState, useEffect } from 'react';
import { Image, View, StyleSheet, Animated as RnAnimated, Pressable, TouchableWithoutFeedback, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import styles from '../styles/Styles'
import { Gesture,
         GestureDetector, 
         GestureHandlerRootView, 
         LongPressGestureHandler,
         PanGestureHandler,
         PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { runOnUI, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const Map = ({ handleLongPress, newMarker, showNotification, setShowNotification }) => {
  const fadeAnim = useRef(new RnAnimated.Value(0)).current;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const initialScale = useSharedValue(1);
  const initialTranslateX = useSharedValue(0);
  const initialTranslateY = useSharedValue(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const threshold = 100;

  useEffect(() => {
    if (showNotification) {
      fadeAnim.setValue(0); // Reset the animation value
      RnAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        RnAnimated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setShowNotification(false));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showNotification, fadeAnim, setShowNotification]);

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
    if (scale.value < 1) {
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

  const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        transformOrigin: 'center',
        translateX: translateX.value,
        translateY: translateY.value,
  }));

  return (
    <GestureHandlerRootView style={[styles.screenBaseContainer, styles.mapContainer]}>
      {showNotification && (
        <RnAnimated.View style={[styles.notification, { opacity: fadeAnim }]}>
          <Text style={styles.notificationText}>Press long to add new route</Text>
        </RnAnimated.View>
      )}  
          <GestureDetector gesture={Gesture.Race(pinch, pan, longPress)}>
            <Animated.View style={[styles.mapImage, {transform: [{scale: scale}, {translateX: translateX}, {translateY: translateY}]}]}>
              <Animated.Image
                source={require('../../assets/BoulderMap.png')}
                style={[styles.mapImage]}
                onLayout={(event) => {
                  const { width, height } = event.nativeEvent.layout;
                  setImageWidth(width);
                  setImageHeight(height);
                }}
              />
              {newMarker && (
                <Svg style={styles.svgOverlay}>
                  <Circle cx={newMarker.x} cy={newMarker.y} r={10} fill="red" />
                </Svg>
              )}
            </Animated.View>
          </GestureDetector>
    </GestureHandlerRootView>
  );
};


export default Map;