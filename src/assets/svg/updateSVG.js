import * as React from 'react';
import Svg, {Path, Polyline} from 'react-native-svg';
const UpdateSVG = props => (
  <Svg
    fill="#FFFFFF"
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    id="update"
    data-name="Flat Line"
    xmlns="http://www.w3.org/2000/svg"
    className="icon flat-line"
    {...props}>
    <Path
      id="primary"
      d="M4,12A8,8,0,0,1,18.93,8"
      style={{
        fill: 'none',
        stroke: '#FFFFFF',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
    <Path
      id="primary-2"
      data-name="primary"
      d="M20,12A8,8,0,0,1,5.07,16"
      style={{
        fill: 'none',
        stroke: '#FFFFFF',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
    <Polyline
      id="primary-3"
      data-name="primary"
      points="14 8 19 8 19 3"
      style={{
        fill: 'none',
        stroke: '#FFFFFF',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
    <Polyline
      id="primary-4"
      data-name="primary"
      points="10 16 5 16 5 21"
      style={{
        fill: 'none',
        stroke: '#FFFFFF',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
  </Svg>
);
export default UpdateSVG;
