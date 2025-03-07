import * as React from "react";
import Svg, { Path } from "react-native-svg";
const CopySvg = (props) => (
  <Svg
    width={12}
    height={17}
    viewBox="0 0 12 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M8 3H2C1.17157 3 0.5 3.67157 0.5 4.5V14.5C0.5 15.3284 1.17157 16 2 16H8C8.82843 16 9.5 15.3284 9.5 14.5V4.5C9.5 3.67157 8.82843 3 8 3Z"
      stroke="#081428"
    />
    <Path
      d="M2.5 2.5C2.5 2.10218 2.65804 1.72064 2.93934 1.43934C3.22064 1.15804 3.60218 1 4 1H10C10.3978 1 10.7794 1.15804 11.0607 1.43934C11.342 1.72064 11.5 2.10218 11.5 2.5V12.5C11.5 12.8978 11.342 13.2794 11.0607 13.5607C10.7794 13.842 10.3978 14 10 14"
      stroke="#081428"
    />
  </Svg>
);
export default CopySvg;
