import React from 'react';
import { View, StyleSheet } from 'react-native';
import DrawerButton from './DrawerButton';

// This component is not in use, I'll try to use it in the future if possible

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