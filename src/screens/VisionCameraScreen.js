import React, { useState, useEffect, useCallback } from 'react';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Text,
  TouchableOpacity,
} from 'react-native';
import Reanimated, { useSharedValue, useAnimatedProps, withSpring } from 'react-native-reanimated';
import { scanQRcodes } from '../frameprocessors/QRcodeFrameProcessor';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({ zoom:true });


export default function VisionCameraScreen() {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    Camera.requestCameraPermission().then(status => {
      if(status === 'authorized') {
        setHasPermission(true);
      } else {
        Linking.openSettings();
        setHasPermission(hasPermission);
      }
    })
  }, []);

  const devices = useCameraDevices();
  const backCamera = devices.back;
  // const frontCamera = devices.front;
  const device = backCamera;

  // zoom
  const zoom = useSharedValue(0);
  const onRandomZoomPress = useCallback(() => {
    zoom.value = withSpring(Math.random() * 10);
    console.log('onRandomPress ', zoom.value);
  }, []);
  const animatedProps = useAnimatedProps(() => {
    return { zoom: zoom.value };
  }, [zoom]);


  // frameProcessor
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';

    try {
      console.log('frame arrived');
      const qrCodes = scanQRcodes(frame);
      console.log('frameProcessor: ', qrCodes);
    } catch(err) {
      console.error(`Frameprocessor failed: ${err}`);
    }
  }, []);

  if(!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>No permission</Text>
      </View>
    );
  }

  if(!backCamera) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Reanimated.View style={StyleSheet.absoluteFill}>
        <ReanimatedCamera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true} 
          animatedProps={animatedProps}
          frameProcessor={frameProcessor}
          />
          <TouchableOpacity 
          style={styles.zoomButton}
          device={device}
          onPress={onRandomZoomPress}>
          <Text style={styles.zoomText}>Zoom randomly</Text>
        </TouchableOpacity>
      </Reanimated.View>
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
  zoomButton: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  zoomText: {
    color: 'black', 
    fontSize: 12,
    textAlign: 'center'
  }
});
