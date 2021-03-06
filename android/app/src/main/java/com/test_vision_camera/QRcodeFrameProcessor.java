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
    Log.d("ExampleFrameProcessor", "width " + frame.getWidth() + " x " + "height " + frame.getHeight() + " Image with format #" + frame.getFormat() + ". Logging " + params.length + " parameters:");
    for (Object param : params) {
      Log.d("ExampleFrameProcessor", "parameters info  -> " + (param == null ? "(null)" : param.toString() + " (" + param.getClass().getName() + ")"));
    }

    @SuppressLint("UnsafeOptInUsageError")
    Image mediaImage = frame.getImage();

    if (mediaImage == null) {
        return null;
    }

    InputImage image = InputImage.fromMediaImage(mediaImage, frame.getImageInfo().getRotationDegrees());
    return scanBarcodes(image);
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

          for(Barcode barcode: barcodes) {
              WritableMap map = new WritableNativeMap();
              int valueType = barcode.getValueType();

              // only check for barcode of type text
              if(valueType == Barcode.TYPE_TEXT) {
                  String rawValue = barcode.getRawValue();
                  map.putString("dataRaw", rawValue);
                  map.putInt("type", valueType);
                  map.putInt("format", Barcode.FORMAT_QR_CODE);
              }
              // TODO data to be returned
              // "bounds":{"size":{"height":81,"width":46.125},"origin":{"y":113,"x":184.78125}},"format":"QR_CODE","dataRaw":"CYL-6-2020-A-0","type":"TEXT","data":"CYL-6-2020-A-0"}
              array.pushMap(map);
          }

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
