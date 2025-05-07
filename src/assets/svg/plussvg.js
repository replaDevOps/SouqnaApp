import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

const PlusSvg = ({color = '#282E68'}) => (
  <Svg
    width={42}
    height={42}
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Rect width={42} height={42} rx={21} fill="white" />
    <Rect
      x={0}
      y={0}
      width={41}
      height={41}
      rx={20.5}
      stroke="#C2C1CD"
      strokeOpacity={0.3}
    />
    <Path
      d="M26 21.8332H21.8333V25.9998C21.8333 26.4582 21.4583 26.8332 21 26.8332C20.5417 26.8332 20.1667 26.4582 20.1667 25.9998V21.8332H16C15.5417 21.8332 15.1667 21.4582 15.1667 20.9998C15.1667 20.5415 15.5417 20.1665 16 20.1665H20.1667V15.9998C20.1667 15.5415 20.5417 15.1665 21 15.1665C21.4583 15.1665 21.8333 15.5415 21.8333 15.9998V20.1665H26C26.4583 20.1665 26.8333 20.5415 26.8333 20.9998C26.8333 21.4582 26.4583 21.8332 26 21.8332Z"
      fill={color} // Apply the color prop here
    />
  </Svg>
);

export default PlusSvg;
