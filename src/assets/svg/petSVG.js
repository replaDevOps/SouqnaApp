import * as React from 'react';
import Svg, {G, Rect, Path} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: title */
const PetSVG = props => (
  <Svg
    width="800px"
    height="800px"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G id="Layer_2" data-name="Layer 2">
      <G id="invisible_box" data-name="invisible box">
        <Rect width={48} height={48} fill="none" />
        <Rect width={48} height={48} fill="none" />
        <Rect width={48} height={48} fill="none" />
      </G>
      <G id="icons_Q2" data-name="icons Q2">
        <Path d="M7,27H7a4,4,0,0,1-4-4V17a4,4,0,0,1,4-4H7a4,4,0,0,1,4,4v6A4,4,0,0,1,7,27ZM22,14V8a4,4,0,0,0-4-4h0a4,4,0,0,0-4,4v6a4,4,0,0,0,4,4h0A4,4,0,0,0,22,14ZM41,27h0a4,4,0,0,0,4-4V17a4,4,0,0,0-4-4h0a4,4,0,0,0-4,4v6A4,4,0,0,0,41,27ZM30,18h0a4,4,0,0,0,4-4V8a4,4,0,0,0-4-4h0a4,4,0,0,0-4,4v6A4,4,0,0,0,30,18ZM14.1,43.9s6.9-1,9.8-1,10.8,1,10.8,1c5.5,0,8.2-6.3,4.4-9.9L28.2,21.8a6.6,6.6,0,0,0-8.7,0L8.7,34C4.8,37.6,8.6,43.9,14.1,43.9Z" />
      </G>
    </G>
  </Svg>
);
export default PetSVG;
