import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SwitchSvg = (props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M16.5 6H7.5C4.18629 6 1.5 8.68629 1.5 12C1.5 15.3137 4.18629 18 7.5 18H16.5C19.8137 18 22.5 15.3137 22.5 12C22.5 8.68629 19.8137 6 16.5 6Z"
      stroke="#081428"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.5 15C10.1569 15 11.5 13.6569 11.5 12C11.5 10.3431 10.1569 9 8.5 9C6.84315 9 5.5 10.3431 5.5 12C5.5 13.6569 6.84315 15 8.5 15Z"
      stroke="#081428"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SwitchSvg;
