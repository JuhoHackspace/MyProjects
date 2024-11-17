import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function DrawerButton({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      onPress={() => navigation.getParent().openDrawer()}
      style={[styles.button, { top: insets.top + 10 }]} // Safe area adjustment
    >
      <MaterialCommunityIcons name="menu" size={24} color="black" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 15,
    zIndex: 100,
  },
});

export default DrawerButton;