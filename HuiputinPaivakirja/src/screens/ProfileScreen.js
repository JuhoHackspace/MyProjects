import React, { useState } from 'react';
import { View, Text,} from 'react-native';
import { useTheme } from 'react-native-paper';
import styles from '../styles/Styles';
import { useAuth } from '../firebase/AuthProvider';
import DrawerButton from '../components/DrawerButton';
import UserInfoForm from '../components/userInfoForm';

export default function ProfileScreen({ navigation }) {
  const { colors, fonts } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  return (
    <View style={[styles.screenBaseContainer, { backgroundColor: colors.background }]}>

      {/* Include the DrawerButton */}
      <DrawerButton navigation={navigation} />
      <View style={styles.headerContainer}>
        <Text style={{fontFamily: fonts.special.fontFamily, fontSize: 28}}>
          Profile
        </Text>
      </View>
      <UserInfoForm />
    </View>
  );
}
