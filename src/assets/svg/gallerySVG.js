import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const GallerySvg = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_750_16402)">
      <Path
        d="M11.6667 6.66667H11.6751M1.66675 5C1.66675 4.33696 1.93014 3.70107 2.39898 3.23223C2.86782 2.76339 3.50371 2.5 4.16675 2.5H14.1667C14.8298 2.5 15.4657 2.76339 15.9345 3.23223C16.4034 3.70107 16.6667 4.33696 16.6667 5V15C16.6667 15.663 16.4034 16.2989 15.9345 16.7678C15.4657 17.2366 14.8298 17.5 14.1667 17.5H4.16675C3.50371 17.5 2.86782 17.2366 2.39898 16.7678C1.93014 16.2989 1.66675 15.663 1.66675 15L1.66675 5Z"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1.66675 13.3334L5.83341 9.16677C6.60675 8.4226 7.56008 8.4226 8.33341 9.16677L12.5001 13.3334"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.8335 11.6666L11.6668 10.8333C12.4402 10.0891 13.3935 10.0891 14.1668 10.8333L16.6668 13.3333"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_750_16402">
        <Rect width={20} height={20} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default GallerySvg;