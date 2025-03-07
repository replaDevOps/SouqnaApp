import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style */
const ForwardSVG = props => (
  <Svg
    id="Uploaded to svgrepo.com"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="800px"
    height="800px"
    viewBox="0 0 32 32"
    xmlSpace="preserve"
    {...props}>
    <Path
      className="afiado_een"
      d="M22.314,16l-8.485,8.485L11,21.657L16.657,16L11,10.343l2.828-2.828L22.314,16z"
    />
  </Svg>
);
export default ForwardSVG;
