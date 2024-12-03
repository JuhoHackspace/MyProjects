import { View, Text, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import styles from '../styles/Styles'
import { useTheme } from 'react-native-paper'
import LoadingIcon from '../components/LoadingIcon'
import { retrieveBoulderHistory } from '../firebase/FirebaseMethods'
import ClickableRoute from '../components/ClickableRoute'

export default function BoulderHistoryScreen() {
  const { colors, fonts } = useTheme()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
        const data = await retrieveBoulderHistory();
        if (data) {
            // Sort the sends list by sentAt field in descending order
            const sortedSends = data.sort((a, b) => new Date(b.send.sentAt) - new Date(a.send.sentAt));
            // Take the last five sends
            const lastFiveSends = sortedSends.slice(0, 5);
            setHistory(lastFiveSends);
            setLoading(false);
        }
    };

    fetchHistory();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  if (loading) {
    return (
        <LoadingIcon/>
    )
  }

  return (
    <View style={styles.screenBaseContainer}>
      <View style={styles.headerContainer}>
        <Text style={{fontFamily: fonts.special.fontFamily, fontSize: 28 }}>Boulder History</Text>
      </View>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ClickableRoute data={item} onPress={() => {}} />
        )}
      />
    </View>
  )
}