import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
} from 'react-native';
import ScanPlugin from '@hmscore/react-native-hms-scan';

export default function HmsScanScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [barcodeInfo, setBarcodeInfo] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const isMounted = useRef(false);

  useEffect(() => {
    // track mounted state
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    }
  }, []);

  useEffect(() => {
    // call requestCameraAndStoragePermission API
    if(isMounted.current) {
      ScanPlugin.Permission.requestCameraAndStoragePermission()
        .then(res => setHasPermission(res))
        .catch(err => console.error(`Permission request failed: ${JSON.stringify(err)}`));
    }
  }, [hasPermission]);

  useEffect(() => {
    return () => {
      if(isMounted.current) {
        ScanPlugin.CustomizedView.allListenersRemove();
      }
    }
  })

  const customizedViewRequest = {
    scanType: 0, // ScanPlugin.ScanType.All
    additionalScanTypes: [],
    rectHeight: 200,
    rectWidth: 200,
    continuouslyScan: false,
    isFlashAvailable: true,
    flashOnLightChange: false,
    isGalleryAvailable: false,
  };

  const startCustomizedView = () => {
    if(hasPermission) {
      ScanPlugin.CustomizedView.startCustomizedView(customizedViewRequest)
        .then(res => {
          const startTime = Date.now();
          setBarcodeInfo(res);
          const elapsedTime = Date.now() - startTime;
          setTimeTaken(elapsedTime);
        })
        .catch(err => console.error(`CustomizedView failed: ${JSON.stringify(err)}`));
    }
  }

  return (
    <View style={{ flex:1 }}>
      <View style={{ flex:0.1, paddingTop:20 }}>
        <Text style={styles.txt}>Barcode: {!!barcodeInfo?.originalValue && barcodeInfo.originalValue} Elapsed time: {!!timeTaken ? timeTaken : 0}[ms]</Text>
      </View>
      <View style={{ flex:0.1, flexDirection:'row', alignSelf:'center'}}>
        <Pressable style={styles.btn} onPress={startCustomizedView}>
          <Text style={styles.txt}>Start scanning</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  btn: {
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: 16,
  },
})
