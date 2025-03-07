import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {colors} from '../../util/color';
const CloseSvg = props => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M20 20L4 4.00003M20 4L4.00002 20"
      stroke="#21490A"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);
export default CloseSvg;
