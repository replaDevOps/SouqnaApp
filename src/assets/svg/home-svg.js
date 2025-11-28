import * as React from "react";
import Svg, { Path } from "react-native-svg";
const HomeSvg = (props) => (
  <Svg
    width={8}
    height={12}
    viewBox="0 0 8 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M1.18018 1L6.18018 6L1.18018 11"
      stroke="#000314"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default HomeSvg;
