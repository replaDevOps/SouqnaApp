import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";
const MarkerSVG = (props) => (
  <Svg
    width="800px"
    height="800px"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <Rect width={16} height={16} id="icon-bound" fill="none" />
    <Path d="M8,0C4.688,0,2,2.688,2,6c0,6,6,10,6,10s6-4,6-10C14,2.688,11.312,0,8,0z M8,8C6.344,8,5,6.656,5,5s1.344-3,3-3s3,1.344,3,3 S9.656,8,8,8z" />
  </Svg>
);
export default MarkerSVG;
