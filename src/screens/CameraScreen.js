import React, { useState } from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {RNCamera} from 'react-native-camera';

export default function CameraScreen({navigation}) {
  const [barcodeData, setBarcodeData] = useState(null);

  if (!navigation.isFocused()) {
    return null;
  }

  const onRead = ({ barcodes }) => {
    const startTime = Date.now();
    console.log();
    const info = `Elapsed Time: ${Date.now() - startTime}'[ms], barcodes: ${barcodes.map((i) => i.data)}`;
    if(barcodes.length) {
      setBarcodeData(info);
      console.log(info);
    }
  }

  return (
    <View style={styles.container}>
      {barcodeData && <Text style={styles.barcodeDataInfo}>{barcodeData}</Text>}
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'Camera permissions required',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onGoogleVisionBarcodesDetected={onRead}
        captureAudio={false}
        useNativeZoom
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
  barcodeDataInfo: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'center',
  },
});
