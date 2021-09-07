/* global __scanQRcodes */
import type { Frame } from 'react-native-vision-camera';

export function scanQRcodes(frame: Frame): string[] {
  'worklet';
  // @ts-ignore
  return __scanQRcodes(frame);
}
