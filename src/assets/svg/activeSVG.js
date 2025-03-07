import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const ActiveSVG = props => (
  <Svg
    width="800px"
    height="800px"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="#000000"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.5 2h13l.5.5v5.503a5.006 5.006 0 0 0-1-.583V3H2v9h5a5 5 0 0 0 1 3H4v-1h3v-1H1.5l-.5-.5v-10l.5-.5z"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.778 8.674a4 4 0 1 1 4.444 6.652 4 4 0 0 1-4.444-6.652zm2.13 4.99l2.387-3.182-.8-.6-2.077 2.769-1.301-1.041-.625.78 1.704 1.364.713-.09z"
    />
  </Svg>
);
export default ActiveSVG;
