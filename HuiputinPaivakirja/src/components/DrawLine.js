import React, { useState } from "react"
import { View, } from "react-native"
import { Svg, Path } from 'react-native-svg'
import styles from "../styles/CameraAndImageStyles"
import Button from './Button'


export default function DrawLine() {
    const [paths, setPaths] = useState([])
    const [currentPath, setCurrentPath] = useState([])

    const OnTouchEnd = () => {
        setPaths([...paths, currentPath]) // Lisää nykynen viiva listaan
        setCurrentPath([]) // Tyhjennetään nykynen viiva

    }
    const onTouchMove = (event) => {
        const locationX = event.nativeEvent.locationX
        const locationY = event.nativeEvent.locationY
        const newPoint = `${currentPath.length === 0 ? 'M' : 'L'}${locationX.toFixed(0)},${locationY.toFixed(0)}`
        setCurrentPath((prevPath) => [...prevPath, newPoint])
    }

    const handleClearButtonClick = () => {
        if (paths.length > 0) {
            const updatePaths = paths.slice(0, -1) //pois viimesin path (ei toimi nyt)
            setPaths(updatePaths)
        }
    }

    const handleClearButtonLongClick = () => {
        setPaths([])
        setCurrentPath([])
    }


    return (
        <View
            style={styles.DrawLineContainer}
            onTouchMove={onTouchMove}
            onTouchEnd={OnTouchEnd} >
            <Svg>
                {/* Piirretyt viivat toimii */}
                {paths.map((path, index) => (
                    <Path
                        key={`path-${index}`}
                        d={path.join('')}
                        stroke={'red'}
                        fill={'transparent'}
                        strokeWidth={3}
                        strokeLinejoin={'round'}
                        strokeLinecap={'round'}
                    />
                ))}

                {/* Reaaliaikainen viiva toimii (ehkä)  */}
                <Path
                    d={currentPath.join('')}
                    stroke={'red'}
                    fill={'transparent'}
                    strokeWidth={3}
                    strokeLinejoin={'round'}
                    strokeLinecap={'round'}
                />
            </Svg>
            
            <View style={styles.clearButtonContainer}>
                <Button title="Clear" icon="trash" onPress={handleClearButtonClick} onLongPress={handleClearButtonLongClick} />
            </View>
            
        </View>

    )
}