export const isTokenExpired = token => {
  if (!token) return true; // No token means expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    return payload.exp * 1000 < Date.now(); // Compare expiry time
  } catch (error) {
    console.error('⚠️ Error checking token expiry:', error);
    return true; // Assume expired if decoding fails
  }
};
