import * as React from "react";
import Svg, { Path } from "react-native-svg";
const PowerOffSVG = (props) => (
  <Svg
    width="800px"
    height="800px"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path d="M8 0a1 1 0 00-1 1v6a1 1 0 002 0V1a1 1 0 00-1-1z" fill="#000000" />
    <Path
      d="M12.665 2.781a1 1 0 10-1.333 1.491 5 5 0 11-6.665.001 1 1 0 00-1.333-1.49 7 7 0 109.331-.002z"
      fill="#000000"
    />
  </Svg>
);
export default PowerOffSVG;
