import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

// This component is a button that opens the drawer when pressed, implement to screens that need a drawer button

function DrawerButton({ navigation }) {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            onPress={() => navigation.getParent().openDrawer()}
            style={[styles.button, { top: insets.top + 10 }]} // Safe area adjustment
        >
            <MaterialCommunityIcons name="menu" size={34} color={colors.text} />
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