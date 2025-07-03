// components/svgs/TickSVG.js
import React from 'react';
import Svg, {Path} from 'react-native-svg';

const TickSVG = ({width = 20, height = 20, color = '#007bff'}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17l-5-5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default TickSVG;
