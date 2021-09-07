package com.test_vision_camera;

import android.graphics.Point;
import android.graphics.Rect;
import android.media.Image;
import android.annotation.SuppressLint;
import androidx.camera.core.ImageProxy;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.android.gms.tasks.Tasks;
import com.mrousavy.camera.frameprocessor.FrameProcessorPlugin;
import com.google.mlkit.vision.barcode.Barcode;
import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.barcode.BarcodeScannerOptions;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.common.InputImage;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.OnFailureListener;
import android.util.Log;
import java.util.List;

public class QRcodeFrameProcessor extends FrameProcessorPlugin {
  @Override
  public Object callback(ImageProxy frame, Object[] params) {
      Image mediaImage = frame.getImage();

      if (mediaImage == null) {
          return null;
      }

      return scanBarcodes(image);
      InputImage image = InputImage.fromMediaImage(mediaImage, frame.getImageInfo().getRotationDegrees());
  }

  private WritableNativeArray scanBarcodes(InputImage image) {
      BarcodeScannerOptions options = new BarcodeScannerOptions
              .Builder()
              .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
              .build();

      BarcodeScanner scanner = BarcodeScanning.getClient(options);

      Task<List<Barcode>> task = scanner.process(image);

      // this is what is being returned to the Frame processor in JS land
      WritableNativeArray array =  new WritableNativeArray();
      try {
          List<Barcode> barcodes = Tasks.await(task); // synchronous
        /* there is an async option...we could consider implementing that if synchronous turns out to be slow */

          WritableMap map = new WritableNativeMap();
          for(Barcode barcode: barcodes) {
              int valueType = barcode.getValueType();

              // only check for barcode of type text
              if(valueType == Barcode.TYPE_TEXT) {
                  String rawValue = barcode.getRawValue();
                  map.putString("barcode", rawValue);
              }
          }

          array.pushMap(map);
          return array;
      } catch (Exception e) {
          e.printStackTrace();
      }

      return null;
  }

  QRcodeFrameProcessor() {
    super("scanQRcodes");
  }
}
