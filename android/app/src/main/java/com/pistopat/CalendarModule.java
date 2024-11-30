package com.pistopat;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.view.KeyEvent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.text.DecimalFormat;
import java.util.Map;
import java.util.HashMap;

import com.facebook.react.bridge.WritableNativeMap;
import com.handheld.uhfr.UHFRManager;
import com.uhf.api.cls.Reader;
import cn.pda.serialport.Tools;

import com.pistopat.Util;
import static com.pistopat.Util.context;

import static com.pistopat.Util.context;
import static com.pistopat.Util.play;

import androidx.annotation.Nullable;

import com.pistopat.Util;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class CalendarModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    public static UHFRManager mUhfrManager;
    private static ReactApplicationContext reactContext;


    CalendarModule(ReactApplicationContext context) {


        super(context);
        this.reactContext = context;
        reactContext.addActivityEventListener(this);
        IntentFilter filter = new IntentFilter();
        filter.addAction("android.rfid.FUN_KEY");
        this.getReactApplicationContext().registerReceiver(keyReceiver,filter);
    }
    @Override
    public String getName() {
        return "CalendarModule";
    }

    @ReactMethod
    public void sayHello( Callback callback){

        Util.initSoundPool(getReactApplicationContext());//Init sound pool
        Reader.READER_ERR er = Reader.READER_ERR.MT_OK_ERR;
        mUhfrManager = UHFRManager.getInstance();// Init Uhf module
        byte[] readBytes = new byte[1*12];
        byte[] accessBytes = Tools.HexString2Bytes("00000000") ;
        er = mUhfrManager.getTagData(1,2,6,readBytes,accessBytes,(short) 1000);

       Util.play(1,0);

        if(er== Reader.READER_ERR.MT_OK_ERR&&readBytes!=null){
            String hexValue = Tools.Bytes2HexString(readBytes, readBytes.length);
            String cardNumber = hexValue.substring(hexValue.length() - 6);
            String bin = HexToBinary(cardNumber);
            String Tableau[] = bin.split("");
            int oddParity = 0;
            
            callback.invoke(null,hexValue);

            // for (int i = 0;i < bin.length();i++){
            //     if (Tableau[i] == "1"){
            //         oddParity++;
            //     }
            // }
            // if ( ( oddParity % 2 ) == 0 ) {
            //     //Is even
            //     cardNumber = cardNumber + "0100000000";
            // } else {
            //     //Is odd
            //     cardNumber = cardNumber + "0000000000";
            // }
            // try{
            //     Long wg = Long.parseLong(cardNumber, 16);
            //     DecimalFormat df = new DecimalFormat("00000000000000000000");
            //     // callback.invoke(null,df.format(wg));
            //     callback.invoke(null,hexValue);

            // }catch (Exception e){

            //     callback.invoke(null,"-1");

            // }






        }else{
            String message = "-1";

            callback.invoke(null,message);
        }
//        try{
//            String message = "wa hisham rani fandriod  "+name;
//            callback.invoke(null,message);
//
//        }catch(Exception e){
//            callback.invoke(e,null);
//
//        }
    }

    String HexToBinary(String Hex) {
        int i = Integer.parseInt(Hex, 16);
        String Bin = Integer.toBinaryString(i);
        return Bin;
    }


    @Override
    public void onActivityResult(Activity activity, int i, int i1, @Nullable Intent intent) {

    }

    @Override
    public void onNewIntent(Intent intent) {

    }
    @ReactMethod
    public void addListener(String eventName) {
        // Set up any upstream listeners or background tasks as necessary
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Remove upstream listeners, stop unnecessary background tasks
    }
    private void sendEvent(
                           String eventName,
                           @Nullable WritableMap params) {
//        DeviceEventManagerModule.RCTDeviceEventEmitter.class
        while (reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class) == null);  // Busy wait.
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
    private long startTime = 0;
    private boolean keyUpFalg = true;
    private final BroadcastReceiver keyReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            int keyCode = intent.getIntExtra("keyCode", 0);
            if (keyCode == 0) {//H941
                keyCode = intent.getIntExtra("keycode", 0);
            }
//            Log.e("key ","keyCode = " + keyCode) ;
            boolean keyDown = intent.getBooleanExtra("keydown", false);
//			Log.e("key ", "down = " + keyDown);
            if (keyUpFalg && keyDown && System.currentTimeMillis() - startTime > 500) {
                keyUpFalg = false;

                WritableMap params = Arguments.createMap();

//                Reader start
//                Util.initSoundPool(getReactApplicationContext());//Init sound pool
                Reader.READER_ERR er = Reader.READER_ERR.MT_OK_ERR;
                mUhfrManager = UHFRManager.getInstance();// Init Uhf module
                byte[] readBytes = new byte[1*12];
                byte[] accessBytes = Tools.HexString2Bytes("00000000") ;
                er = mUhfrManager.getTagData(1,2,6,readBytes,accessBytes,(short) 1000);

//                Util.play(1,0);

                if(er== Reader.READER_ERR.MT_OK_ERR&&readBytes!=null){
                    String hexValue = Tools.Bytes2HexString(readBytes, readBytes.length);
                    String cardNumber = hexValue.substring(hexValue.length() - 6);
                    String bin = HexToBinary(cardNumber);
                    String Tableau[] = bin.split("");
                    int oddParity = 0;

                    params.putString("eventProperty", hexValue);

                }else{
                    String message = "-1";
                    params.putString("eventProperty", message);

                }
                //                Reader end


                sendEvent("EventReminder", params);
                startTime = System.currentTimeMillis();
                if ((//keyCode == KeyEvent.KEYCODE_F1 || keyCode == KeyEvent.KEYCODE_F2
                        keyCode == KeyEvent.KEYCODE_F3 ||
//                                 keyCode == KeyEvent.KEYCODE_F4 ||
                                keyCode == KeyEvent.KEYCODE_F4  || keyCode == KeyEvent.KEYCODE_F7)) {
                    Log.e("key ","inventory.... " ) ;

                }
                return;
            } else if (keyDown) {
                startTime = System.currentTimeMillis();

            } else {
                Log.i("KEY Release","OK");
                keyUpFalg = true;
//                WritableMap params = Arguments.createMap();
//                params.putString("eventProperty", "someValue");

            }
        }
    };


}