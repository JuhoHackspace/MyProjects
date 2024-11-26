import React, { useState, useEffect } from 'react';
import { View, Text,} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import styles from '../styles/Styles';
import { useAuth } from '../firebase/AuthProvider';
import DrawerButton from '../components/DrawerButton';
import UserInfoForm from '../components/userInfoForm';
import UserInfo from '../components/UserInfo';
import { AddUserInfo, fetchUserData } from '../firebase/FirebaseMethods'
import LoadingIcon from '../components/LoadingIcon';

export default function ProfileScreen({ navigation }) {
  const { colors, fonts } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const userId = user?.uid;

  useEffect(() => {
      const unsubscribe = fetchUserData(userId, (data) => {
          setUserData(data);
          setLoading(false);
      });
      return () => unsubscribe();
  }, [userId])

  const saveData = async (userData) => {
    setLoading(true);
    try {
        await AddUserInfo(userId, userData);
        setLoading(false);
        setShowForm(false);
    } catch (error) {
        console.error("Error saving user data: ", error);
    }
  }

  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>

      {/* Include the DrawerButton */}
      <DrawerButton navigation={navigation} />
      <View style={styles.headerContainer}>
        <Text style={{fontFamily: fonts.special.fontFamily, fontSize: 28}}>
          Profile
        </Text>
      </View>
      {loading && <LoadingIcon />}
      {!showForm && <UserInfo userData={userData}/>}
      {showForm && <UserInfoForm userData={userData} saveData={saveData} setShowForm={setShowForm}/>}
      {!showForm && <View style={styles.buttonContainerHorizontal}> 
        <Button 
          style={styles.buttonLong} 
          mode="contained" 
          buttonColor = {colors.accent}
          onPress = {() => setShowForm(true)}
        >
            Update Profile  
        </Button>
      </View>}
    </View>
  );
}
