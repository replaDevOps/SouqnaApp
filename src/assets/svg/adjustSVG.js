import * as React from "react";
import Svg, { Path, G } from "react-native-svg";
const AdjustSVG = (props) => (
  <Svg
    width="800px"
    height="800px"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path d="M0 0h48v48H0z" fill="none" />
    <G id="Shopicon">
      <Path d="M44,14H25.738C24.848,10.551,21.726,8,18,8s-6.848,2.551-7.738,6H4v4h6.262c0.889,3.449,4.011,6,7.738,6 s6.848-2.551,7.738-6H44V14z M18,20c-2.206,0-4-1.794-4-4c0-2.206,1.794-4,4-4s4,1.794,4,4C22,18.206,20.206,20,18,20z" />
      <Path d="M44,30h-6.262c-0.889-3.449-4.011-6-7.738-6s-6.848,2.551-7.738,6H4v4h18.262c0.889,3.449,4.011,6,7.738,6 s6.848-2.551,7.738-6H44V30z M30,36c-2.206,0-4-1.794-4-4c0-2.206,1.794-4,4-4s4,1.794,4,4C34,34.206,32.206,36,30,36z" />
    </G>
  </Svg>
);
export default AdjustSVG;
