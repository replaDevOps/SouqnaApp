import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";
const EditSvg = (props) => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect
      x={0.5}
      y={0.5}
      width={31}
      height={31}
      rx={11.5}
      stroke="#C2C1CD"
      strokeOpacity={0.3}
    />
    <Path
      d="M17.3733 14L18 14.6267L11.9467 20.6667H11.3333V20.0533L17.3733 14ZM19.7733 10C19.6067 10 19.4333 10.0667 19.3067 10.1933L18.0867 11.4133L20.5867 13.9133L21.8067 12.6933C22.0667 12.4333 22.0667 12 21.8067 11.7533L20.2467 10.1933C20.1133 10.06 19.9467 10 19.7733 10ZM17.3733 12.1267L10 19.5V22H12.5L19.8733 14.6267L17.3733 12.1267Z"
      fill="black"
    />
  </Svg>
);
export default EditSvg;
