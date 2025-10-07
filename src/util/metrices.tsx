import {Dimensions, PixelRatio} from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
const guidelineBaseWidth = 393;
const guidelineBaseHeight = 852;
const xdHeight = (xdHeight: number) => {
  const heightPercent = Math.round((xdHeight / guidelineBaseHeight) * 100);
  return PixelRatio.roundToNearestPixel((height * heightPercent) / 100);
};
const xdWith = (xdWidth: number) => {
  const widthPercent = Math.round((xdWidth / guidelineBaseWidth) * 100);
  return PixelRatio.roundToNearestPixel((width * widthPercent) / 100);
};
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const vs = (size: number) => (height / guidelineBaseHeight) * size;
const ms = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;
const mvs = (size: number, factor = 0.5) => size + (vs(size) - size) * factor;
export {scale, vs, ms, mvs, height, width, xdHeight, xdWith};
