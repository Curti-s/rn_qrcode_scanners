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

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({ zoom:true });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  textStyle: {
    justifyContent: 'center',
  },
  zoomButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 60,
    height: 60,
    marginBottom: 15,
    borderRadius: 50 / 2,
    backgroundColor: 'white',
  },
  zoomText: {
    color: 'black', 
    fontSize: 12,
    textAlign: 'center'
  }
});

export default function CameraScreen() {
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
  // const frameProcessor = useFrameProcessor(frame => {
    // 'worklet';
    // console.log('frameProcessor: ', frame);
  // }, []);

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
    <Reanimated.View style={styles.container}>
      <ReanimatedCamera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true} 
        animatedProps={animatedProps}
        />
      <TouchableOpacity 
        style={styles.zoomButton}
        device={device}
        onPress={onRandomZoomPress}>
        <Text style={styles.zoomText}>Zoom randomly</Text>
      </TouchableOpacity>
    </Reanimated.View>
  );
}

