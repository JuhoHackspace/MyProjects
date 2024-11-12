import React, { useRef, useState, useEffect } from 'react';
import { Image, View, StyleSheet, Animated, Pressable, TouchableWithoutFeedback, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import styles from '../styles/Styles'

const Map = ({ handleLongPress, newMarker, showNotification, setShowNotification }) => {
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showNotification) {
      fadeAnim.setValue(0); // Reset the animation value
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setShowNotification(false));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showNotification, fadeAnim, setShowNotification]);

  return (
    <View style={styles.screenBaseContainer}>
      {showNotification && (
        <Animated.View style={[styles.notification, { opacity: fadeAnim }]}>
          <Text style={styles.notificationText}>Press long to add new route</Text>
        </Animated.View>
      )}
      <ReactNativeZoomableView
        maxZoom={4}
        minZoom={0.5}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={true}
        style={styles.container}
        captureEvent={true}
      >      
          <Pressable onLongPress={handleLongPress} style={styles.mapImage}>
            <View style={styles.mapImage}>
              <Image
                source={require('../../assets/BoulderMap.png')}
                style={styles.mapImage}
              />
              {newMarker && (
                <Svg style={styles.svgOverlay}>
                  <Circle cx={newMarker.x} cy={newMarker.y} r={10} fill="red" />
                </Svg>
              )}
            </View>
          </Pressable>
      </ReactNativeZoomableView>
    </View>
  );
};


export default Map;