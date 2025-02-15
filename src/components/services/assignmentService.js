import axios from 'axios';

const API_URL = 'http://localhost:4001/api';

export const getAssignmentsService = async (token) => {
  const res = await axios.get(`${API_URL}/assignments`, {
    headers: {
      'x-auth-token': token,
    },
  });
  return res.data;
};

export const createAssignmentService = async (assignment, token) => {
  const res = await axios.post(`${API_URL}/assignments`, assignment, {
    headers: {
      'x-auth-token': token,
    },
  });
  return res.data;
};