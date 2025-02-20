import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const AssignmentContext = createContext();

export const AssignmentProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);

  const getAssignments = async () => {
    try {
      const res = await axios.get('http://localhost:4001/api/assignments', {
        headers: {
          'x-auth-token': token,
        },
      });
      setAssignments(res.data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  };

  const createAssignment = async (formData) => {
    try {
      const res = await axios.post('http://localhost:4001/api/assignments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      });
      setAssignments([...assignments, res.data]);
    } catch (err) {
      console.error('Error creating assignment:', err);
      throw err;
    }
  };

  const searchAssignments = async (title) => {
    try {
      const res = await axios.get(`http://localhost:4001/api/assignments/search?title=${title}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      setAssignments(res.data);
    } catch (err) {
      console.error('Error searching assignments:', err);
    }
  };

  return (
    <AssignmentContext.Provider value={{ assignments, getAssignments, createAssignment, searchAssignments }}>
      {children}
    </AssignmentContext.Provider>
  );
};