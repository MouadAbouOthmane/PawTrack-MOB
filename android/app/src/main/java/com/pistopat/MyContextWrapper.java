package com.pistopat;

import android.content.Context;
import android.content.ContextWrapper;
import android.provider.Settings;

public class MyContextWrapper extends ContextWrapper {

    public MyContextWrapper(Context base) {
        super(base);
    }

    public boolean isAirplaneModeOn() {
        return Settings.System.getInt(getContentResolver(),
                Settings.System.AIRPLANE_MODE_ON, 0) != 0;
    }
}
