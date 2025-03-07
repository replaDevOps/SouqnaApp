import * as React from 'react';
import Svg, {Circle, Polygon} from 'react-native-svg';

const CrossIconSVG = props => (
  <Svg width="24px" height="24px" viewBox="0 0 512 512" {...props}>
    <Circle
      cx="256"
      cy="256"
      r="256"
      fill="#A4A4A4" // Black background for circle
      stroke="#A4A4A4" // Black border
      strokeWidth="20" // Border thickness
    />
    <Polygon
      points="335.188,154.188 256,233.375 176.812,154.188 154.188,176.812 233.375,256 154.188,335.188 176.812,357.812 256,278.625 335.188,357.812 357.812,335.188 278.625,256 357.812,176.812 "
      fill="#ffffff" // White "X"
    />
  </Svg>
);

export default CrossIconSVG;
