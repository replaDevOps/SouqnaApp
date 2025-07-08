import * as React from 'react';
import Svg, {Line, Polyline, Path} from 'react-native-svg';
const uploadSVG = props => (
  <Svg
    fill="#000000"
    width="80px"
    height="80px"
    viewBox="0 0 24 24"
    id="upload"
    data-name="Line Color"
    xmlns="http://www.w3.org/2000/svg"
    className="icon line-color"
    {...props}>
    <Line
      id="secondary"
      x1={12}
      y1={16}
      x2={12}
      y2={3}
      style={{
        fill: 'none',
        stroke: '#008e91',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
    <Polyline
      id="secondary-2"
      data-name="secondary"
      points="16 7 12 3 8 7"
      style={{
        fill: 'none',
        stroke: '#008e91',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
    <Path
      id="primary"
      d="M20,16v4a1.08,1.08,0,0,1-1.14,1H5.14A1.08,1.08,0,0,1,4,20V16"
      style={{
        fill: 'none',
        stroke: '#008e91',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
  </Svg>
);
export default uploadSVG;
