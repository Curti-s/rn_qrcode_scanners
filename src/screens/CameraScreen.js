import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RNCamera} from 'react-native-camera';

export default function CameraScreen({navigation}) {
  if (!navigation.isFocused()) {
    return null;
  }

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'Camera permissions required',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onGoogleVisionBarcodesDetected={({barcodes}) => {
          console.log('barcodes ', barcodes.map((i) => i.data));
        }}
        captureAudio={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
