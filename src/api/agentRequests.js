import API from '../services/api'; // Import your configured Axios instance

// Login request for agent
export const loginAgent = async (email, password) => {
  const response = await API.post('/agents/login', {
    email,
    password,
  });
  return response; // Return the agent data, including token
};

export const loginRfidAgent = async rfid_card => {
  const response = await API.post('/agents/login-rfid', {
    rfid_card,
  });
  return response; // Return the agent data, including token
};
