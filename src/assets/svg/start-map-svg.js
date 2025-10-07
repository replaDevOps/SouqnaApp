import * as React from "react";
import Svg, { Circle } from "react-native-svg";
const StartMapSvg = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={10} cy={10} r={7} stroke="#1B1368" strokeWidth={6} />
  </Svg>
);
export default StartMapSvg;
