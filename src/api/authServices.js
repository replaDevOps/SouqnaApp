import API from './apiServices'; // your axios instance

export const loginUser = async (email, password) => {
  const response = await API.post('login', {email, password});
  return response.data;
};
