/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Text,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  textStyle: {
    justifyContent: 'center',
  }
});

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);

  React.useEffect(() => {
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
      <Camera style={StyleSheet.absoluteFill} device={backCamera} isActive={true} />
    </View>
  );
}
