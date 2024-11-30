import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For React Native
import agentReducer from './slices/agentSlice';
import settingsReducer from './slices/settingsSlice';

import {combineReducers} from 'redux';

// Persist configuration
const persistConfig = {
  key: 'root', // Root key for storage
  storage: AsyncStorage, // Use AsyncStorage for React Native
  whitelist: ['agent'], // Add only the slices you want to persist
};

// Combine reducers
const rootReducer = combineReducers({
  agent: agentReducer,
  settings: settingsReducer,
});

// Wrap reducers with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist
    }),
});

// Export persistor
export const persistor = persistStore(store);

export default store;
