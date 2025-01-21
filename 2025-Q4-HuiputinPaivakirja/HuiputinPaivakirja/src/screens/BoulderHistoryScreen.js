import { View, Text, FlatList, Pressable, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import styles from '../styles/Styles'
import { useTheme } from 'react-native-paper'
import LoadingIcon from '../components/LoadingIcon'
import { retrieveBoulderHistory } from '../firebase/FirebaseMethods'
import ClickableRoute from '../components/ClickableRoute'
import DrawerButton from '../components/DrawerButton'
import { useNavigation } from '@react-navigation/native'
import RoutePictureModal from '../components/RoutePictureModal'

/**
 * BoulderHistoryScreen displays the user's boulder history.
 * @returns {JSX.Element}
 */

export default function BoulderHistoryScreen() {
  const { colors, fonts } = useTheme()
  const [history, setHistory] = useState([])
  const [allHistory, setAllHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [seeAllHistory, setSeeAllHistory] = useState(false)
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false)
  const [imageUri, setImageUri] = useState(null)
  
  // Fetch the user's boulder history
  useEffect(() => {
    const fetchHistory = async () => {
        const data = await retrieveBoulderHistory();
        if (data) {
            // Sort the sends list by sentAt field in descending order
            const sortedSends = data.sort((a, b) => new Date(b.send.sentAt) - new Date(a.send.sentAt));
            // Take the last five sends
            setAllHistory(sortedSends);
            const lastFiveSends = sortedSends.slice(0, 5);
            setHistory(lastFiveSends);
            setLoading(false);
        }
    };

    fetchHistory();
  }, []);
  
  const handleRoutePress = (imageUrl) => {
    console.log('Image URL: ', imageUrl);
    setImageUri(imageUrl);
    setModalVisible(true);
  };

  if (loading) {
    return (
        <LoadingIcon/>
    )
  }

  return (
    <View style={[styles.screenBaseContainer,{backgroundColor: colors.background}]}>
      {/*Modal that opens a picture of the route*/}
      <RoutePictureModal visible={modalVisible} onClose={()=>{setModalVisible(false)}} routeImageUrl={imageUri} />
      <DrawerButton navigation={navigation} />
      <View style={styles.headerContainer}>
        <Text style={{
          fontFamily: fonts.special.fontFamily,
          fontSize: 28,
          textAlign: 'center',
          color: fonts.special.color
        }}>Boulder History</Text>
      </View>
      <View style={styles.horizontalSpaceBetween}>
        <Text style={[styles.basicText, styles.bold, { color: colors.text }]}>Your last sends:</Text>
        {/*Show the "See all" button only if there are more than 5 sends*/}
        {history.length != allHistory.length && <Pressable onPress={() => setSeeAllHistory(!seeAllHistory)}>
            <Text style={[styles.basicText, styles.bold, styles.marginLeft16, { color: colors.accent2 }]}>
                {!seeAllHistory ? "See all" : "See less"}
            </Text>
        </Pressable>}
      </View>
      <ScrollView style={styles.inputContainer}>
        {/*Show the last 5 sends or all sends depending on the seeAllHistory state*/}
        {!seeAllHistory && history.length > 0 && history.map((item, index) => (
            <ClickableRoute key={index} data={item} onPress={() => {handleRoutePress(item.route.routeImageUrl)}} />
        ))}
        {seeAllHistory && allHistory.length > 0 && allHistory.map((item, index) => (
            <ClickableRoute key={index} data={item} onPress={() => {handleRoutePress(item.route.routeImageUrl)}} />
        ))}
      </ScrollView>
    </View>
  )
}