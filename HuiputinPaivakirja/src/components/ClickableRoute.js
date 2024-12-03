import { View, Text } from 'react-native'
import React from 'react'
import Svg, { Polygon } from 'react-native-svg'
import styles from '../styles/Styles'

export default function ClickableRoute({data, onPress}) {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  
  return (
    <View style={styles.inputContainer}>
        <Text style={styles.basicText}>Route: {data.route.routeName}</Text>
        <Text style={styles.basicText}>Grade: {data.route.votedGrade}</Text>
        <Text style={styles.basicText}>Sent At: {formatDate(data.send.sentAt)}</Text>
        <Text style={styles.basicText}>Tries: {data.send.tries}</Text>
    </View>
  )
}