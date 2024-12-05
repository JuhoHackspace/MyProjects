import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Drawer as PaperDrawer } from 'react-native-paper';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../firebase/AuthProvider';

function CustomDrawerContent(props) {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const { navigation } = props;

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: colors.background }}>
      <PaperDrawer.Section theme={{ colors: { text: colors.text } }}>
        <PaperDrawer.Item
          label="Map"
          icon={({ size }) => (
            <MaterialCommunityIcons name="map-outline" color={colors.text} size={size} />
          )}
          onPress={() => navigation.navigate('MainViewController')}
          theme={{ colors: { text: colors.text, onSurfaceVariant: colors.text } }}
        />
        <PaperDrawer.Item
          label="Profile"
          icon={({ size }) => (
            <MaterialCommunityIcons name="account-outline" color={colors.text} size={size} />
          )}
          onPress={() => navigation.navigate('Profile')}
          theme={{ colors: { text: colors.text, onSurfaceVariant: colors.text } }}
        />
        <PaperDrawer.Item
          label="Settings"
          icon={({ size }) => (
            <MaterialCommunityIcons name="cog-outline" color={colors.text} size={size} />
          )}
          onPress={() => navigation.navigate('Settings')}
          theme={{ colors: { text: colors.text, onSurfaceVariant: colors.text } }}
        />
        <PaperDrawer.Item
          label="Logout"
          icon={({ size }) => (
            <MaterialCommunityIcons name="logout" color={colors.text} size={size} />
          )}
          onPress={logout}
          theme={{ colors: { text: colors.text, onSurfaceVariant: colors.text } }}
        />
      </PaperDrawer.Section>
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;
