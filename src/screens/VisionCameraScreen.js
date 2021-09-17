import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
  FrameProcessorPerformanceSuggestion,
} from 'react-native-vision-camera';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Text,
} from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedGestureHandler,
  Extrapolate,
  interpolate,
} from 'react-native-reanimated';
import {
  PinchGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import {scanQRcodes} from '../frameprocessors/QRcodeFrameProcessor';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({zoom: true});

const SCALE_FULL_ZOOM = 3;
const MAX_ZOOM_FACTOR = 20;
export default function VisionCameraScreen() {
  const camera = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const zoom = useSharedValue(0);

  // check if screen is focused
  const isFocused = useIsFocused();
  const isActive = isFocused || false;

  useEffect(() => {
    Camera.requestCameraPermission().then(status => {
      if (status === 'authorized') {
        setHasPermission(true);
      } else {
        Linking.openSettings();
        setHasPermission(hasPermission);
      }
    });
  }, []);

  const devices = useCameraDevices();
  const backCamera = devices.back;
  const device = backCamera;

  // frameProcessor
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    try {
      const startTime = Date.now();
      const qrCodes = scanQRcodes(frame);
      console.log('Elapsed time: ', Date.now() - startTime, '[ms]' ,'frameProcessor results: ', qrCodes);
    } catch (err) {
      console.error(`Frameprocessor failed: ${err}`);
    }
  }, []);

  // zoom
  const animatedProps = useAnimatedProps(() => {
    return {zoom: zoom.value};
  }, [zoom]);

  //#region Animated Zoom
  // This just maps the zoom factor to a percentage value.
  // so e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);
  //#endregion

  //#region Effects
  const neutralZoom = device?.neutralZoom ?? 1;
  useEffect(() => {
    // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);
  //#endregion

  //#region Pinch to Zoom Gesture
  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  const onPinchGesture = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(event.scale, [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM], [-1, 0, 1], Extrapolate.CLAMP);
      zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP);
    },
  });
  //#endregion

  // focus
  const onTapToFocus = useCallback(async event => {
    try {
      if(event.nativeEvent.state === State.ACTIVE && device?.supportsFocus) {
        await camera.current.focus({ x:event.nativeEvent.absoluteX, y:event.nativeEvent.absoluteY });
      }
    } catch(err) {
      console.error(`focusing: error occurred ${err}`);
    }
  });
  // end focus

  const onFrameProcessorSuggestionAvailable = useCallback((suggestion: FrameProcessorPerformanceSuggestion) => {
    console.log(`Suggestion available! ${suggestion.type}: Can do ${suggestion.suggestedFrameProcessorFps} FPS`);
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>No permission</Text>
      </View>
    );
  }

  if (!backCamera) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
        <Reanimated.View style={StyleSheet.absoluteFill}>
          <TapGestureHandler onHandlerStateChange={onTapToFocus} numberOfTaps={1}>
            <ReanimatedCamera
              ref={camera}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={isActive}
              animatedProps={animatedProps}
              frameProcessor={frameProcessor}
              frameProcessorFps={60}
              fps={5}
              animatedProps={cameraAnimatedProps}
              onFrameProcessorSuggestionAvailable={onFrameProcessorSuggestionAvailable}/>
          </TapGestureHandler>
        </Reanimated.View>
      </PinchGestureHandler>
      <Text style={styles.zoomAndTapInfo}>Pinch to zoom, Tap to focus</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  textStyle: {
    justifyContent: 'center',
  },
  zoomAndTapInfo: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
