import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";
const DrawerSvg = (props) => (
  <Svg
    width={42}
    height={42}
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={42} height={42} rx={21} fill="white" />
    <Rect
      x={0.5}
      y={0.5}
      width={41}
      height={41}
      rx={20.5}
      stroke="#C2C1CD"
      strokeOpacity={0.3}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.5 17.6667V16H28.5V17.6667H13.5ZM13.5 21.8333H28.5V20.1667H13.5V21.8333ZM13.5 26H28.5V24.3333H13.5V26Z"
      fill="#081428"
    />
  </Svg>
);
export default DrawerSvg;
