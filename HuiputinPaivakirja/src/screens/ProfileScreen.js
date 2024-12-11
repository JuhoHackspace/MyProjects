import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import styles from '../styles/Styles';
import { useAuth } from '../firebase/AuthProvider';
import DrawerButton from '../components/DrawerButton';
import UserInfoForm from '../components/userInfoForm';
import UserInfo from '../components/UserInfo';
import { AddUserInfo, fetchUserData } from '../firebase/FirebaseMethods'
import LoadingIcon from '../components/LoadingIcon';
import ModalView from '../components/ModalView';

export default function ProfileScreen({ navigation }) {
  const { colors, fonts } = useTheme();
  const { user, reauthenticateUser, deleteAccount } = useAuth(); // Import the reauthenticateUser and deleteAccount functions from the AuthProvider;
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const userId = user?.uid;
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
  
  // Listen for changes in the user's data
  useEffect(() => {
      const unsubscribe = fetchUserData(userId, (data) => {
          setUserData(data);
          setLoading(false);
      });
      return () => unsubscribe();
  }, [userId])

  // Save the user data when the form is submitted
  const saveData = async (userData) => {
    setLoading(true);
    setShowForm(false);
    try {
        await AddUserInfo(userId, userData);
        setLoading(false);
    } catch (error) {
        console.error("Error saving user data: ", error);
        Alert.alert("Error saving user data. Please try again.");
    }
  }
  
  // Navigate to the BoulderHistoryScreen
  const handleBoulderHistory = () => {
    navigation.navigate('BoulderHistoryScreen');
  }

  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>
      {/* Include the DrawerButton */}
      <DrawerButton navigation={navigation} />
      <View style={styles.headerContainer}>
        <Text style={{
          fontFamily: fonts.special.fontFamily,
          fontSize: 28,
          textAlign: 'center',
          color: fonts.special.color
        }}>
          Profile
        </Text>
      </View>
      {loading ? <LoadingIcon /> :
      <>
      {!showForm && <UserInfo userData={userData}/>}
      {showForm && <UserInfoForm userData={userData} saveData={saveData} setShowForm={setShowForm}/>}
      {!showForm && <View style={styles.buttonContainerVertical}> 
        <Button 
          style={styles.buttonLonger} 
          mode="contained" 
          icon="account-edit"
          buttonColor = {colors.accent}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          onPress = {() => setShowForm(true)}
        >
            Update Profile  
        </Button>
        <Button
          mode="contained"
          onPress={() => setModalVisible(true)}
          icon="trash-can"
          buttonColor={colors.accent}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          style={styles.buttonLonger}
        >
          Delete my account
        </Button>
        <Button
          mode="contained"
          onPress={handleBoulderHistory}
          icon="history"
          buttonColor={colors.accent}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          style={styles.buttonLonger}
        >
          Boulder History
        </Button>
      </View>}
      </>}
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