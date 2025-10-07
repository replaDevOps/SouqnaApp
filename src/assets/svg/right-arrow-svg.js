import * as React from "react";
import Svg, { Path } from "react-native-svg";
const RightArrowSvg = (props) => (
  <Svg
    width={7}
    height={14}
    viewBox="0 0 7 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M0.5 1L6.5 7L0.5 13"
      stroke="#081428"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default RightArrowSvg;
