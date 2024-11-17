import React from 'react';
import { View, StyleSheet } from 'react-native';
import DrawerButton from './DrawerButton';

export default function WithDrawerButton(WrappedComponent) {
  return function (props) {
    const { navigation } = props;
    return (
      <View style={styles.container}>
        <DrawerButton navigation={navigation} />
        <WrappedComponent {...props} />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});