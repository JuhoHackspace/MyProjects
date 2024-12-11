import { View, Text as Text, Pressable } from 'react-native'
import React from 'react'
import styles from '../styles/Styles'
import RoutePolygon from './RoutePolygon';
import { routes } from '../firebase/Config';

/**
 * ClickableRoute displays a route in the boulder history list.
 */

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
    <Pressable onPress={onPress}> 
    {/*Pressable route component within boulder history list*/}  
    {({ pressed }) => (
        <View style={[styles.ClickableRouteContainer, { backgroundColor: pressed ? 'lightgray' : 'white' }]}>
            <RoutePolygon gradeColor={data.route.routeGradeColor} holdColor={data.route.routeHoldColor} votedGrade={data.route.votedGrade}/>
            <View style={styles.verticalContainerRouteInfo}>
                <Text style={styles.smallText}>{data.route.routeName}</Text>
                <Text style={styles.smallText}>{formatDate(data.send.sentAt)}</Text>
            </View>
            <View style={styles.routeTriesContainer}>
                <Text style={styles.routeTriesIndicator}>{data.send.tries}</Text>
            </View>
        </View>
    )}
    </Pressable>
  )
}