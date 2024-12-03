import { View, Text, Animated } from 'react-native'
import React, { useEffect, useRef, useState, useContext, createContext } from 'react'
import styles from '../styles/Styles';

const NotificationContext = createContext();

export const NotificationProvider = ({children}) => {
    const [notification, setNotification] = useState({visible: false, text: '', delay: 3000});
    const fadeAnim = useRef(new Animated.Value(0)).current;

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
    
    const showNotification = (text, delay) => {
        setNotification({visible: true, text, delay});
    }

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      {notification.visible && (
        <Animated.View style={[styles.notification, { opacity: fadeAnim }]}>
          <Text style={styles.notificationText}>{notification.text}</Text>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext);