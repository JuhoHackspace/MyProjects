import React from 'react'
import Svg, { Polygon, Text } from 'react-native-svg'

export default function RoutePolygon({gradeColor, holdColor, votedGrade}) {
  return (
    <Svg height="60" width="60">
        <Polygon
            points="30,0 60,30 30,60 0,30"
            fill={gradeColor}
        />
        <Polygon
            points="30,10 50,30 30,50 10,30"
            fill={holdColor}
        />
        <Text
            x="30"
            y="30"
            fill="white"
            fontSize="15"
            textAnchor="middle"
            fontWeight="bold"
            alignmentBaseline="middle"
        >{votedGrade}
        </Text>
    </Svg>
  )
}