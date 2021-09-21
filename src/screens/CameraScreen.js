import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

export default class CameraScreen extends Component {
  state = {
    barcodeData: null,
    autoFocus: 'on',
    autoFocusPointOfInterest: {
      normalised: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
      drawRectPosition: {
        x: Dimensions.get('window').width * 0.5,
        y: Dimensions.get('window').height * 0.5,
      },
    },
    focusDepth:0,
  };

  onRead = ({ barcodes }) => {
    const { navigation } = this.props;

    if (!navigation.isFocused()) return null;

    const startTime = Date.now();
    console.log();
    const info = `Elapsed Time: ${Date.now() - startTime}'[ms], barcodes: ${barcodes.map((i) => i.data)}`;
    if(barcodes.length) {
      this.setState({ barcodeData:info });
      console.log(info);
    }
  }

  toggleAutoFocus = () => this.setState({ autoFocus:this.state.autoFocus === 'on' ? 'off' : 'on' });
  toggleFocusDepth = () => {
    this.setState({ autoFocus:'off', focusDepth:this.state.focusDepth + 0.5 });
    if(this.state.focusDepth === 1.0) this.setState({ autoFocus:'on', focusDepth:0 });
  }

  render() {
    const { barcodeData } = this.state;

    const drawFocusRingPosition = {
      top: this.state.autoFocusPointOfInterest.drawRectPosition.y - 100,
      left: this.state.autoFocusPointOfInterest.drawRectPosition.x - 32,
    };

    return (
      <View style={styles.container}>
        {!!barcodeData && (
          <Text style={styles.code}>{barcodeData}</Text>
        )}
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
          onGoogleVisionBarcodesDetected={this.onRead}
          captureAudio={false}
          autoFocus={this.state.autoFocus}
          autoFocusPointOfInterest={this.state.autoFocusPointOfInterest.normalised}
          focusDepth={this.state.focusDepth}
        />
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.autoFocusBox, drawFocusRingPosition]} />
          <TouchableWithoutFeedback>
            <View style={{ flex:1 }} />
          </TouchableWithoutFeedback>
        </View>
        <View style={{ bottom:0 }}>
          <View
            style={{
              height: 56,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                alignSelf: 'flex-end',
            }}>
              <Pressable
                style={[styles.btn, { alignSelf:'flex-end'} ]} onPress={this.toggleAutoFocus} disabled={this.state.focusDepth}>
                <Text style={[styles.txt]}>Auto Focus: {this.state.autoFocus}</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, { alignSelf:'flex-end'} ]} onPress={this.toggleFocusDepth}>
                <Text style={[styles.txt]}>Focus Depth: {this.state.focusDepth}</Text>
              </Pressable>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  btn: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    color:'white',
    fontSize:12,
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
  code: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'center',
  },
  autoFocusBox: {
    position: 'absolute',
    height: 64,
    width: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.4,
  },
});
