import React from 'react';
import { useTheme, Drawer as PaperDrawer } from 'react-native-paper';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../firebase/AuthProvider';

function CustomDrawerContent(props) {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const { navigation } = props;

  return (
    <DrawerContentScrollView {...props}>
      <PaperDrawer.Section>
        <PaperDrawer.Item
          label="Home"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          )}
          onPress={() => navigation.navigate('Home')}
        />
        <PaperDrawer.Item
          label="Profile"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="account-outline" color={color} size={size} />
          )}
          onPress={() => navigation.navigate('Profile')}
        />
        <PaperDrawer.Item
          label="Settings"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
          )}
          onPress={() => navigation.navigate('Settings')}
        />
        <PaperDrawer.Item
          label="Logout"
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="logout" color={color} size={size} />
          )}
          onPress={logout}
        />
      </PaperDrawer.Section>
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;
