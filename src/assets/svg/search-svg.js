import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SearchSvg = props => (
  <Svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M7.66671 1.33325C11.1667 1.33325 14 4.16659 14 7.66659C14 11.1666 11.1667 13.9999 7.66671 13.9999C4.16671 13.9999 1.33337 11.1666 1.33337 7.66659C1.33337 5.19992 2.74004 3.06659 4.80004 2.01992M14.6667 14.6666L13.3334 13.3333"
      stroke="#081428"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SearchSvg;
