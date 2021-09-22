import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import {
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';

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
    focusDepth: 0,
    flash: 'off',
    zoom: 0,
    ratio:'4:3',
  };

  onRead = ({ barcodes }) => {
    const { navigation } = this.props;

    if (!navigation.isFocused()) return null;

    const startTime = Date.now();
    console.log();
    const info = `Elapsed Time: ${Date.now() - startTime}'[ms], barcodes: ${barcodes.map((i) => i.data)}`;
    if (barcodes.length) {
      this.setState({ barcodeData: info, barcodes });
      // console.log(info);
    }
  }

  toggleAutoFocus = () => this.setState({ autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on' });
  toggleFocusDepth = () => {
    this.setState({ autoFocus: 'off', focusDepth: this.state.focusDepth + 0.5 });
    if (this.state.focusDepth === 1.0) this.setState({ autoFocus: 'on', focusDepth: 0 });
  }
  toggleFlashMode = () => this.setState({ flash: this.state.flash === 'off' ? 'torch' : 'off' });
  toggleZoom = () => {
    this.setState({ zoom: this.state.zoom + 0.5 });
    if (this.state.zoom === 1.0) this.setState({ zoom: 0 });
  }
  onTapToFocus = (event) => {
    const { absoluteX, absoluteY, state, } = event.nativeEvent;
    const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
    const isPortrait = screenHeight > screenWidth;

    // normalising coords in portrait mode for RNCamera see: https://gist.github.com/Craigtut/6632a9ac7cfff55e74fb561862bc4edb
    let x, y, maxDeltaY;
    if (state === State.ACTIVE) {
      if (!isPortrait) {
        x = absoluteX / screenWidth;
        y = absoluteY / screenHeight;
      } else {
        x = absoluteY / screenHeight;
        y = -(absoluteX / screenWidth) + 1;
      }
      maxDeltaY = screenHeight - 100.0;
      this.setState({ autoFocusPointOfInterest: { normalised: { x, y }, drawRectPosition: { x: absoluteX, y: absoluteY < maxDeltaY && absoluteY } }, maxDeltaY });
    }
  }

  renderBarcodes = () => {
    return (
      <View style={styles.barcodeContainer}>
      {!!this.state.barcodes && this.state.barcodes.map(this.renderBarcode)}
      </View>
    );
  }

  renderBarcode = ({ bounds, data }) => {
    return (
      <React.Fragment key={data + bounds.size}>
        <View
          style={[
            styles.barcodeTextWrapper,
            {
              ...bounds.size,
            },
          ]}>
          <Text style={styles.barcodeText}>{`${data}`}</Text>
        </View>
      </React.Fragment>
    );
  }

  render() {
    const drawFocusRingPosition = {
      top: this.state.autoFocusPointOfInterest.drawRectPosition.y - 100,
      left: this.state.autoFocusPointOfInterest.drawRectPosition.x - 42,
    };

    return (
      <TapGestureHandler onHandlerStateChange={this.onTapToFocus} numberOfTaps={1} maxDeltaY={this.state.maxDeltaY}>
        <View style={styles.container}>
          <View style={{ alignSelf:'center' }}>
            <Text style={styles.txt}>Tap to focus</Text>
          </View>
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
            googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.QR_CODE}
            googleVisionBarcodeMode={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeMode.ALTERNATE}
            captureAudio={false}
            autoFocus={this.state.autoFocus}
            autoFocusPointOfInterest={this.state.autoFocusPointOfInterest.normalised}
            focusDepth={this.state.focusDepth}
            flashMode={this.state.flash}
            zoom={this.state.zoom}
            ratio={this.state.ratio}
          />
          <View style={StyleSheet.absoluteFill}>
            <View style={[styles.autoFocusBox, drawFocusRingPosition]} />
            <View style={{ flex: 1 }} />
          </View>
          <View style={{
            flex: 0.1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignSelf: 'flex-end'
          }}>
            <Pressable
              style={[styles.btn, { alignSelf: 'flex-end' }]} onPress={this.toggleAutoFocus} disabled={this.state.focusDepth}>
              <Text style={[styles.txt]}>Auto Focus: {this.state.autoFocus}</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, { alignSelf: 'flex-end' }]} onPress={this.toggleFocusDepth}>
              <Text style={[styles.txt]}>Focus Depth: {this.state.focusDepth}</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, { alignSelf: 'flex-end' }]} onPress={this.toggleZoom}>
              <Text style={[styles.txt]}>Zoom: {this.state.zoom}</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, { alignSelf: 'flex-end' }]} onPress={this.toggleFlashMode}>
              <Text style={[styles.txt]}>Flash: {this.state.flash}</Text>
            </Pressable>
          </View>
          {this.renderBarcodes()}
        </View>
      </TapGestureHandler>
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
    color: 'white',
    fontSize: 10,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  autoFocusBox: {
    position: 'absolute',
    height: 100,
    width: 100,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
    borderStyle: 'dashed',
    opacity: 0.4,
  },
  barcodeContainer: {
    position: 'absolute',
    alignSelf:'center'
  },
  barcodeTextWrapper: {
    padding: 2,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#F00',
    justifyContent: 'center',
  },
  barcodeText: {
    color: '#F00',
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize:16,
  },
});
