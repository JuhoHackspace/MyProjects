import React from 'react';
import Svg, { Circle, Text } from 'react-native-svg';
import { useTheme } from 'react-native-paper';

const ClusterLabel = ({ cluster }) => {
  const { colors } = useTheme();
  const CIRCLE_RADIUS = 12;
  
  return (
    <React.Fragment>
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
      {cluster.count > 0 && (
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
      )}
    </React.Fragment>
  );
};

export default ClusterLabel;