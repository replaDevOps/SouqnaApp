import * as React from "react";
import Svg, { Path } from "react-native-svg";
const WareSvg = (props) => (
  <Svg
    width={16}
    height={14}
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M1.33333 12.8333H3.83333V6.16663H12.1667V12.8333H14.6667V3.95829L8 1.29163L1.33333 3.95829V12.8333ZM0.5 13.6666V3.39413L8 0.397461L15.5 3.39413V13.6666H11.3333V6.99996H4.66667V13.6666H0.5ZM5.965 13.6666V12.385H7.24667V13.6666H5.965ZM7.35917 11.1666V9.88496H8.64083V11.1666H7.35917ZM8.75333 13.6666V12.385H10.035V13.6666H8.75333Z"
      fill="black"
    />
  </Svg>
);
export default WareSvg;
