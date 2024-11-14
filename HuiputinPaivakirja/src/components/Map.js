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
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const Map = ({ handleLongPress, newMarker, showNotification, setShowNotification }) => {
  
  const fadeAnim = useRef(new RnAnimated.Value(0)).current;

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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: 1 }],
      transformOrigin: 'center',
      translateX: 0,
      translateY: 0,
    };
  })

  const longPress = Gesture.LongPress()
    .onEnd((e) => {
      try {
        console.log('Long press ended event: ', e);
        handleLongPress(e);
      }catch (error) {
        console.log('Error in long press event: ', error);
      }
    })
    .runOnJS(true);

  return (
    <GestureHandlerRootView style={styles.screenBaseContainer}>
      {showNotification && (
        <RnAnimated.View style={[styles.notification, { opacity: fadeAnim }]}>
          <Text style={styles.notificationText}>Press long to add new route</Text>
        </RnAnimated.View>
      )}  
          <GestureDetector gesture={longPress}>
            <Animated.View style={[styles.mapImage]}>
              <Animated.Image
                source={require('../../assets/BoulderMap.png')}
                style={[styles.mapImage, animatedStyle]}
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