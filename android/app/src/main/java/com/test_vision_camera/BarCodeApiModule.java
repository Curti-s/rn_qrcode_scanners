package com.test_vision_camera;

import android.annotation.SuppressLint;
import android.graphics.Point;
import android.graphics.Rect;
import android.media.Image;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.camera.core.ImageProxy;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.mlkit.vision.barcode.Barcode;
import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.barcode.BarcodeScannerOptions;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.common.InputImage;

import java.util.List;

public class BarCodeApiModule extends ReactContextBaseJavaModule {

    BarCodeApiModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "BarCodeApiModule";
    }

    @ReactMethod
    private Task<List<Barcode>> scanBarcodes(ImageProxy frame) {
        @SuppressLint("UnsafeOptInUsageError")
        Image mediaImage = frame.getImage();

        if (mediaImage == null) {
            return null;
        }

        InputImage image = InputImage.fromMediaImage(mediaImage, frame.getImageInfo().getRotationDegrees());

        BarcodeScannerOptions options = new BarcodeScannerOptions
                .Builder()
                .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
                .build();

        BarcodeScanner scanner = BarcodeScanning.getClient(options);

        Task<List<Barcode>> tasks = scanner.process(image);
        return tasks;
    }

    @ReactMethod
    public void addScannerListener(Task<List<Barcode>> tasks) {
        // this is what is being returned to the Frame processor in JS land
        WritableNativeArray array =  new WritableNativeArray();

        tasks.addOnSuccessListener(new OnSuccessListener<List<Barcode>>() {
            @Override
            public void onSuccess(@NonNull List<Barcode> barcodes) {
                for(Barcode barcode: barcodes) {
                    WritableMap map = new WritableNativeMap();
                    int valueType = barcode.getValueType();

                    // only check for barcode of type text
                    if(valueType == Barcode.TYPE_TEXT) {
                        String rawValue = barcode.getRawValue();
                        map.putString("barcode", rawValue);
                    }
                    // TODO data to be returned
                    // [{"bounds": {"origin": [Object], "size": [Object]}, "data": "CYL-6-2020-A-0", "dataRaw": "CYL-6-2020-A-0", "format": "QR_CODE", "type": "TEXT"}]
                    array.pushMap(map);
                }
            }
        });
    }
    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("Barcode detected", params);
    }
}
