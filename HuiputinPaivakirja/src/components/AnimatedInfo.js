import { View, Text, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import styles from '../styles/Styles';

export default function AnimatedInfo({ showNotification, setShowNotification, text }) {
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
    <Animated.View style={[styles.notification, { opacity: fadeAnim }]}>
          <Text style={styles.notificationText}>{text}</Text>
    </Animated.View>
  )
}