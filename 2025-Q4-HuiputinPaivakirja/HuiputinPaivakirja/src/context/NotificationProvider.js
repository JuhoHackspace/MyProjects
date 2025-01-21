import { View, Text, Animated } from 'react-native'
import React, { useEffect, useRef, useState, useContext, createContext } from 'react'
import styles from '../styles/Styles';

/**
 * NotificationProvider is a context provider that provides a notification context to its children.
 * The notification context is used to show notifications to the user.
 * @param {Object} children - The children components that will be wrapped by the NotificationProvider.
 * @returns {Object} - The NotificationProvider component.
 */
const NotificationContext = createContext();

export const NotificationProvider = ({children}) => {
    const [notification, setNotification] = useState({visible: false, text: '', delay: 3000});
    const fadeAnim = useRef(new Animated.Value(0)).current; // Opacity value for the fade animation

    // Show the notification when the notification state changes
    useEffect(() => {
        if (notification.visible) {
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
            }).start(() => setNotification({ ...notification, visible: false }));
            }, notification.delay);

            return () => clearTimeout(timer);
        }
    }, [notification, fadeAnim]);
    
    // Function to show a notification with a text and a delay
    const showNotification = (text, delay) => {
        setNotification({visible: true, text, delay});
    }

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      {notification.visible && ( // Show the notification if it is visible
        <Animated.View style={[styles.notification, { opacity: fadeAnim }]}>
          <Text style={styles.notificationText}>{notification.text}</Text>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext);