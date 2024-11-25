import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import styles from '../styles/Styles';
import { useAuth } from '../firebase/AuthProvider';
import DrawerButton from '../components/DrawerButton';
import UserInfo from '../components/UserInfo';
import ModalView from '../components/ModalView';

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { user, reauthenticateUser, deleteAccount } = useAuth(); // Import the reauthenticateUser and deleteAccount functions from the AuthProvider
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");

  const handleDeleteAccount = async () => {
    try {
      // Reauthenticate user before deleting the account (required by Firebase)
      await reauthenticateUser(password);

      // Delete the account
      await deleteAccount();

      Alert.alert("Account Deleted", "Your account has been successfully deleted.");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setModalVisible(false);
      setPassword(""); 
    }
  };

  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>
      {/* Include the DrawerButton */}
      <DrawerButton navigation={navigation} />

      <Text style={{ color: colors.text, fontSize: 24 }}>
        Hello {user?.displayName || "User"}! This is your profile.
      </Text>
      <UserInfo />

      {/* Delete Account Button */}
      <View style={styles.deleteButtonContainer}>
        <Button
          mode="contained"
          onPress={() => setModalVisible(true)}
          icon="trash-can"
          buttonColor={colors.accent}
          style={styles.button}
        >
          Delete my account
        </Button>
      </View>

      {/* ModalView */}
      <ModalView
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onDelete={handleDeleteAccount}
        deleteConfirmation={true}
        password={password}
        setPassword={setPassword}
      />
    </View>
  );
}