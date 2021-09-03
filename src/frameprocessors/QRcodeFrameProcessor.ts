/* global __scanQRcodes */
import type { Frame } from 'react-native-vision-camera';

declare let _WORKLET; true | undefined;

export function scanQRcodes(frame: Frame): string[] {
  'worklet';
  if (!_WORKLET) throw new Error('QRcodeFrameProcessor must be called from a frame processor');
  return __scanQRcodes(frame);
}
