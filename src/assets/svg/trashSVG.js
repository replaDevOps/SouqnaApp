import Svg, { Path } from 'react-native-svg';

const TrashSVG = ({ color = '#FFFFFF', ...props }) => (
  <Svg
    width="800px"
    height="800px"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1zM9 2H6v1h3V2zM4 13h7V4H4v9zm2-8H5v7h1V5zm1 0h1v7H7V5zm2 0h1v7H9V5z"
    />
  </Svg>
);

export default TrashSVG;
