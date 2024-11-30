import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  defaultPrinter: {
    name: null,
    address: null,
  },
  theme: 'light',
  notificationSettings: {
    newOrders: true,
    lowInventory: true,
    customerFeedback: false,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setDefaultPrinterAddress: (state, action) => {
      state.defaultPrinter.name = action.payload.name;
      state.defaultPrinter.address = action.payload.address;

      AsyncStorage.setItem(
        'defaultPrinter',
        JSON.stringify({
          name: action.payload.name,
          address: action.payload.address,
        }),
      );
    },
    loadDefaultPrinterAddress: (state, action) => {
      const {name, address} = action.payload;
      state.defaultPrinter.name = name;
      state.defaultPrinter.address = address;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    updateNotificationSettings: (state, action) => {
      state.notificationSettings = {
        ...state.notificationSettings,
        ...action.payload,
      };
    },
  },
});

export const {
  setDefaultPrinterAddress,
  setTheme,
  updateNotificationSettings,
  loadDefaultPrinterAddress,
} = settingsSlice.actions;
export default settingsSlice.reducer;
