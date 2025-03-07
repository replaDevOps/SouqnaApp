import * as React from "react";
import Svg, { Circle } from "react-native-svg";
const EndMapSvg = (props) => (
  <Svg
    width={17}
    height={18}
    viewBox="0 0 17 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={8.5} cy={9} r={7.75} stroke="#282E68" strokeWidth={1.5} />
    <Circle cx={8.49926} cy={9.00023} r={4.45238} fill="#1B1368" />
  </Svg>
);
export default EndMapSvg;
