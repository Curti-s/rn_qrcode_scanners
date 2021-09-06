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
    Log.d("ExampleFrameProcessor", frame.getWidth() + " x " + frame.getHeight() + " Image with format #" + frame.getFormat() + ". Logging " + params.length + " parameters:");

    for (Object param : params) {
      Log.d("ExampleFrameProcessor", "  -> " + (param == null ? "(null)" : param.toString() + " (" + param.getClass().getName() + ")"));
    }
    
    @SuppressLint("UnsafeOptInUsageError")
    Image mediaImage = frame.getImage();

    WritableNativeMap map = new WritableNativeMap();
    map.putString("example_str", "Test");
    map.putBoolean("example_bool", true);
    map.putDouble("example_double", 5.3);

    WritableNativeArray array = new WritableNativeArray();
    array.pushString("Hello!");
    array.pushBoolean(true);
    array.pushDouble(17.38);

    map.putArray("example_array", array);
    return map;


    // return scanBarcodes(mediaImage, frame);
  }

  private WritableNativeArray scanBarcodes(Image mediaImage, ImageProxy frame) {
    if(mediaImage != null) {
      InputImage image = InputImage.fromMediaImage(mediaImage, frame.getImageInfo().getRotationDegrees());
      // start detector options
      BarcodeScannerOptions options = new BarcodeScannerOptions
              .Builder()
              .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
              .build();
      // end detector options

      // start get detector
      BarcodeScanner scanner = BarcodeScanning.getClient(options);
      // end get_detector

      try {
        // start run_detector
        Task<List<Barcode>>result = scanner.process(image)
          .addOnSuccessListener(new OnSuccessListener<List<Barcode>>() {
            @Override
            public void onSuccess(List<Barcode> barcodes) {
              // task completed successfully
              for (Barcode barcode: barcodes) {
                Rect bounds = barcode.getBoundingBox();
                Point[] corners = barcode.getCornerPoints();
                String rawValue = barcode.getRawValue();
                int valueType = barcode.getValueType();

                switch(valueType) {
                  case Barcode.TYPE_URL:
                    String title = barcode.getUrl().getTitle();
                    String url = barcode.getUrl().getUrl();
                    break;
                }
              }
            }
          })
        .addOnFailureListener(new OnFailureListener() {
          @Override
          public void onFailure(@NonNull Exception e) {
            // task failed
            e.printStackTrace();
          }
        });
        // end run_detector
        return result;
      } catch(Exception e) {
        e.printStackTrace();
      }
    }
    return null;
  }

  QRcodeFrameProcessor() {
    super("scanQRcodes");
  }
}
