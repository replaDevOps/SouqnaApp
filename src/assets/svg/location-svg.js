import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
const LocationSvg = props => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Circle
      cx={12}
      cy={10}
      r={3}
      stroke="#FFFFFF"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 2C7.58172 2 4 5.58172 4 10C4 11.8919 4.40209 13.1304 5.5 14.5L12 22L18.5 14.5C19.5979 13.1304 20 11.8919 20 10C20 5.58172 16.4183 2 12 2Z"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default LocationSvg;
