import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {colors} from '../../util/color';

const ChatSVG2 = ({color = '#8899A6'}) => (
  <Svg
    fill="none"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    id="chat"
    xmlns="http://www.w3.org/2000/svg"
    className="icon line-color">
    <Path
      d="M18.81,16.23,20,21l-4.95-2.48A9.84,9.84,0,0,1,12,19c-5,0-9-3.58-9-8s4-8,9-8,9,3.58,9,8A7.49,7.49,0,0,1,18.81,16.23Z"
      fill="none"
      stroke={'#8899A6'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </Svg>
);

export default ChatSVG2;
