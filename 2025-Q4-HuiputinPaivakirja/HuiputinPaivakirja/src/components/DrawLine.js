import React, { useState } from 'react';
import { View } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import styles from '../styles/CameraAndImageStyles';
import Button from './Button';

/**
 * DrawLine component is used to draw a line on top of an image using SVG Path.
 */

export default function DrawLine({ hideButtons}) {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  const gradeColors = ['yellow', 'green', 'blue', 'pink', 'red', 'purple', 'black', 'white'];
  const [lineColor, nextLineColor] = useState(0);

  // Called when the user lifts their finger
  const OnTouchEnd = () => {
    setPaths([...paths, currentPath]); // Lisää nykyinen viiva listaan
    setCurrentPath([]); // Tyhjennetään nykyinen viiva
  };

  // Called when the user moves their finger
  const onTouchMove = (event) => {
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    const newPoint = `${currentPath.length === 0 ? 'M' : 'L'}${locationX.toFixed(0)},${locationY.toFixed(0)}`;
    setCurrentPath((prevPath) => [...prevPath, newPoint]);
  };

  // Called when the user presses the clear button
  const handleClearButtonClick = () => {
    if (paths.length > 0) {
      const updatePaths = paths.slice(0, -1); // Poistaa viimeisen viivan
      setPaths(updatePaths);
    }
  };

  // Called when the user long presses the clear button
  const handleClearButtonLongClick = () => {
    setPaths([]);
    setCurrentPath([]);
  };

  // Called when the user presses the change line color button
  const changeLineColor = () => {

    nextLineColor((prevIndex) => (prevIndex + 1) % gradeColors.length)
}


  return (
    <View style={styles.DrawLineContainer} onTouchMove={onTouchMove} onTouchEnd={OnTouchEnd}>
       {/* Draw the route on top of the route image using Path from SVG */}
      <Svg>
        {paths.map((path, index) => (
          <Path
            key={`path-${index}`}
            d={path.join('')}
            stroke={gradeColors[lineColor]}
            fill={'transparent'}
            strokeWidth={3}
            strokeLinejoin={'round'}
            strokeLinecap={'round'}
          />
        ))}
        <Path
          d={currentPath.join('')}
          stroke={gradeColors[lineColor]}
          fill={'transparent'}
          strokeWidth={3}
          strokeLinejoin={'round'}
          strokeLinecap={'round'}
        />
      </Svg>
      {/*Hide these buttons when the image is being saved. State is received from the parent component */}
      {hideButtons && (
        <View style={styles.buttonsContainer}>
          <View style={styles.clearButtonContainer}>
            <Button title="Clear" icon="trash" onPress={handleClearButtonClick} onLongPress={handleClearButtonLongClick} />
          </View>
          <View style={styles.ColorPaletteContainer}>
            <Button title="GradeColor" icon="pencil" color={gradeColors[lineColor]} onPress={changeLineColor} />
          </View>
        </View>
      )}
    </View>
  );
}