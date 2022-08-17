import React from 'react';
import type { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

const PlusIcon: FC = (props) => (
  <Svg fill="#000000" viewBox="0 0 24 24" width="24px" height="24px" fill-rule="evenodd" {...props}>
    <Path
      fill-rule="evenodd"
      d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"
    />
  </Svg>
);

export default PlusIcon;
