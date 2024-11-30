import {jwtDecode} from 'jwt-decode';

export const isTokenExpired = token => {
  if (!token) return true; // Token is invalid if not provided

  const {exp} = jwtDecode(token); // Decode the token to get expiration time
  return exp * 1000 < Date.now(); // Convert exp to milliseconds and compare
};
