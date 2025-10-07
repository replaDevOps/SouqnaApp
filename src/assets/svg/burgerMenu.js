import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
const SVGComponent = props => (
  <Svg
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G clipPath="url(#clip0_429_11066)">
      <Path
        d="M3 6.00092H21M3 12.0009H21M3 18.0009H21"
        stroke="#008e91"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_429_11066">
        <Rect
          width={24}
          height={24}
          fill="white"
          transform="translate(0 0.000915527)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SVGComponent;
