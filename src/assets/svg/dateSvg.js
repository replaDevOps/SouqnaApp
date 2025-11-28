import * as React from "react";
import Svg, { Path } from "react-native-svg";
const DateSvg = (props) => (
  <Svg
    width={12}
    height={14}
    viewBox="0 0 12 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M6 8.00033H9.33333V11.3337H6V8.00033ZM10.6667 2.00033H10V0.666992H8.66667V2.00033H3.33333V0.666992H2V2.00033H1.33333C0.6 2.00033 0 2.60033 0 3.33366V12.667C0 13.4003 0.6 14.0003 1.33333 14.0003H10.6667C11.4 14.0003 12 13.4003 12 12.667V3.33366C12 2.60033 11.4 2.00033 10.6667 2.00033ZM10.6667 3.33366V4.66699H1.33333V3.33366H10.6667ZM1.33333 12.667V6.00033H10.6667V12.667H1.33333Z"
      fill="#081428"
      fillOpacity={0.5}
    />
  </Svg>
);
export default DateSvg;
