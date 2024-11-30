import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isTokenExpired} from '../../utils/tokenUtils'; // Import the utility function

const initialState = {
  info: null,
  token: null,
  isAuthenticated: false,
};

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    login: (state, action) => {
      const {info, token} = action.payload;
      state.info = info;
      state.token = token;
      state.isAuthenticated = true;

      // Persist token and info in storage
      AsyncStorage.setItem('agentToken', token);
      AsyncStorage.setItem('agentInfo', JSON.stringify(info));
    },
    logout: state => {
      state.info = null;
      state.token = null;
      state.isAuthenticated = false;

      // Remove token and info from storage
      AsyncStorage.removeItem('agentToken');
      AsyncStorage.removeItem('agentInfo');
    },
    loadAgentFromStorage: (state, action) => {
      const {info, token} = action.payload;
      if (!isTokenExpired(token)) {
        // Check if token is valid
        state.info = info;
        state.token = token;
        state.isAuthenticated = true;
      } else {
        state.info = null;
        state.token = null;
        state.isAuthenticated = false; // Invalid token
      }
    },
  },
});

export const {login, logout, loadAgentFromStorage} = agentSlice.actions;
export default agentSlice.reducer;
