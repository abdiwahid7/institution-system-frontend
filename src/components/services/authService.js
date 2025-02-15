import axios from 'axios';

const API_URL = 'http://localhost:4001/api';

export const loginService = async (email, password) => {
  const res = await axios.post(`${API_URL}/auth`, { email, password });
  return res.data;
};

export const registerService = async (name, email, password) => {
  await axios.post(`${API_URL}/users`, { name, email, password });
};