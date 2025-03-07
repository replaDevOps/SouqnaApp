import * as React from 'react';
import Svg, {G, Circle, Path, Defs} from 'react-native-svg';
const BackIcon = props => (
  <Svg
    width={80}
    height={80}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G filter="url(#filter0_d_694_2724)">
      <Circle cx={40} cy={38} r={20} fill="white" />
    </G>
    <Path
      d="M33 39H49"
      stroke="#000314"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M38 44C38 44 33 40.3176 33 39C33 37.6824 38 34 38 34"
      stroke="#000314"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Defs></Defs>
  </Svg>
);
export default BackIcon;
