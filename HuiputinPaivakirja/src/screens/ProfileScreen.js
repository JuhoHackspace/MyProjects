import React, { useState } from 'react';
import { View, Text, } from 'react-native';
import { useTheme } from 'react-native-paper';
import styles from '../styles/Styles';
import { useAuth } from '../firebase/AuthProvider';
import DrawerButton from '../components/DrawerButton';
import UserInfo from '../components/UserInfo';
import Button from '../components/Button';
import ModalView from '../components/ModalView';

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  

  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>

      {/* Include the DrawerButton */}
      <DrawerButton navigation={navigation} />

      <Text style={{ color: colors.text, fontSize: 24 }}>
        Hello {user?.displayName}! This is your profile.
      </Text>
      <UserInfo />

      {/* Button to open modalview */}
      <Button
        title="Avaa Modal"
        onPress={() => setModalVisible(true)}
        icon="open-book"
        color={colors.primary}
      />

      {/* ModalView */}
      <ModalView
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}