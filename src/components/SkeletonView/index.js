import {View} from 'react-native';

export const SkeletonView = ({width, height, style}) => (
  <View
    style={[
      {
        width,
        height,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
      },
      style,
    ]}
  />
);

export default SkeletonView;
