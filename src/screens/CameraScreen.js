import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';

export default class CameraScreen extends PureComponent {
  constructor(props) {
    super(props);
  }

  takePicture = async () => {
    if(this.camera) {
      const options = { quality:0.5, base64:true };
      const data = await this.camera.takePictureAsync(options);
      console.log('data: ', data.uri);
    }
  }

  render() {
    const { navigation } = this.props;

    if(navigation.isFocused()) {
      return (
        <View style={styles.container}>
          <RNCamera 
            ref={ref => { this.camera = ref }}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
                message: 'Camera permissions required',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
            }}
            onGoogleVisionBarcodesDetected={({ barcodes }) => {
              console.log('barcodes ', barcodes);
            }}
            captureAudio={false}
            />
        <View style={{ flex:0, flexDirection:'row', justifyContent:'center' }}>
          <TouchableOpacity 
            onPress={this.takePicture}
            style={styles.capture}>
            <Text style={{ fontSize:14 }}>Snap</Text>
          </TouchableOpacity>
        </View>
      </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: { 
    flex:1,
    backgroundColor: 'black',
  },
  preview: {
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'center'
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
})
