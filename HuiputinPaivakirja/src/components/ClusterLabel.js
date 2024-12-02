import React from 'react';
import Svg, { Circle, Text, Rect } from 'react-native-svg';
import { useTheme } from 'react-native-paper';

const ClusterLabel = ({ cluster, sector }) => {
  const { colors } = useTheme();
  const CIRCLE_RADIUS = 11;

  return (
    <React.Fragment>
      <Rect
        x={sector.xMin}
        y={sector.yMin}
        width={sector.xMax - sector.xMin}
        height={sector.yMax - sector.yMin}
        fill="rgba(128, 128, 128, 0.2)"
        //stroke={colors.accent}
        strokeWidth="1"
        rx="8"
        ry="8"
      />
      <Circle
        cx={cluster.x}
        cy={cluster.y}
        r={CIRCLE_RADIUS}
        fill={colors.accent}
      />
      <Text
        x={cluster.x}
        y={cluster.y + 1}
        fill="white"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {cluster.name.split(' ')[1]}
      </Text>
      <Text
        x={cluster.x}
        y={cluster.y + CIRCLE_RADIUS + 10}
        fill={colors.accent}
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
      >
        {cluster.count}
      </Text>
    </React.Fragment>
  );
};

export default ClusterLabel;