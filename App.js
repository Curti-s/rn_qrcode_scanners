/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
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
    justifyContent: 'center'
  },
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
  const device = devices.back;

  if(!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No permission</Text>
      </View>
    );
  }

  if(device == null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View>
      <Camera style={StyleSheet.absoluteFill} device={device} />
    </View>
  );
}
