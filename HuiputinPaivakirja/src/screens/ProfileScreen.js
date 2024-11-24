import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import styles from '../styles/Styles';
import { useAuth } from '../firebase/AuthProvider';
import DrawerButton from '../components/DrawerButton';
import UserInfo from '../components/UserInfo';
import Button from '../components/Button';
import ModalView from '../components/ModalView';
import { auth } from '../firebase/Config'; 
import { deleteUser } from 'firebase/auth';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';


export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");

  // Function to reauthenticate the user before deleting the account (Firebase auth requires recent authentication for ex. account deletion)
  const reauthenticateUser = async () => {
    try {
      const email = user?.email;
      if (!email) throw new Error("User email not found");

      const credential = EmailAuthProvider.credential(email, password); // Luo tunnistetiedot
      await reauthenticateWithCredential(auth.currentUser, credential);
      console.log("Reauthentication successful");
      return true;
    } catch (error) {
      console.error("Error reauthenticating user:", error);
      Alert.alert("Reauthentication Failed", "Please check your password and try again.");
      return false;
    }
  };

  // Function to delete the account and all the data located in Firestore and Storage (using Firebase Delete Data addon
  const handleDeleteAccount = async () => {
    try {
      const isReauthenticated = await reauthenticateUser();
      if (!isReauthenticated) return;

      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
        Alert.alert("Account Deleted", "Your account has been successfully deleted.");
      }
    } catch (error) {
      console.error("Error deleting account: ", error);
      Alert.alert("Error", "There was a problem deleting your account. Please try again.");
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
      <Button
        title="Delete my account"
        onPress={() => setModalVisible(true)}
        icon="trash"
        color={colors.primary}
      />

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