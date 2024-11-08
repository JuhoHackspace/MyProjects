import React from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';

const Map = ({ onLongPress, newMarker }) => {
  const [zoom, setZoom] = React.useState(1);
  const scaleRef = React.useRef(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  const handlePinch = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      let newZoom = scaleRef.current * nativeEvent.scale;
      setZoom(newZoom);
    } else if (nativeEvent.state === State.END) {
      scaleRef.current = zoom;
    }
  };

  const handlePan = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      setOffset({ x: nativeEvent.translationX, y: nativeEvent.translationY });
    } else if (nativeEvent.state === State.END) {
      setOffset({ x: offset.x + nativeEvent.translationX, y: offset.y + nativeEvent.translationY });
    }
  };

  return (
    <PanGestureHandler onGestureEvent={handlePan}>
      <PinchGestureHandler onGestureEvent={handlePinch}>
        <View style={styles.container}>
          <TouchableOpacity onLongPress={onLongPress} style={styles.mapTouch}>
            <Image
              source={require('../assets/BoulderMap.png')}
              style={[
                styles.mapImage,
                {
                  transform: [
                    { scale: zoom },
                    { translateX: offset.x },
                    { translateY: offset.y },
                  ],
                },
              ]}
            />
            <Svg style={styles.svgOverlay}>
              {newMarker && (
                <Circle
                  cx={newMarker.x}
                  cy={newMarker.y}
                  r={10}
                  fill="blue"
                />
              )}
            </Svg>
          </TouchableOpacity>
        </View>
      </PinchGestureHandler>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  svgOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  mapTouch: {
    flex: 1,
  },
});

export default Map;