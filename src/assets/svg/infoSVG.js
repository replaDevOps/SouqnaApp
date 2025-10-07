import * as React from 'react';
import Svg, {Rect, Circle} from 'react-native-svg';

const InfoSVG = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    width="20px" // Adjust the width for the icon
    height="20px" // Adjust the height for the icon
    fill="none"
    {...props}>
    <Rect x={15} y={14} width={2} height={4} />
    <Rect x={15} y={10} width={2} height={2} />
    <Circle
      fill="none"
      stroke="#000000"
      strokeWidth={2}
      strokeMiterlimit={10}
      cx={16}
      cy={16}
      r={12}
    />
  </Svg>
);

export default InfoSVG;
