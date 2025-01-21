import React from 'react'
import Svg, { Polygon, Text } from 'react-native-svg'

export default function RoutePolygon({gradeColor, holdColor, votedGrade}) {
  return (
    <Svg height="60" width="60">
        {/*Larger rhombus that represents the grade color of the route*/}
        <Polygon
            points="30,0 60,30 30,60 0,30"
            fill={gradeColor}
        />
        {/*Smaller rhombus that represents the hold color of the route*/}
        <Polygon
            points="30,10 50,30 30,50 10,30"
            fill={holdColor}
        />
        {/*Text that displays the voted grade of the route*/}
        <Text
            x="30"
            y="30"
            fill={holdColor === 'white' || holdColor === 'yellow' || holdColor === 'pink' ? 'black' : 'white'}
            fontSize="15"
            textAnchor="middle"
            fontWeight="bold"
            alignmentBaseline="middle"
        >{votedGrade.split(' ')[0]}
        </Text>
    </Svg>
  )
}