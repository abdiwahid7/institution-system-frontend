import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AssignmentContext = createContext();

export const AssignmentProvider = ({ children }) => {
  const [assignments, setAssignments] = useState([]);

  const getAssignments = async (token) => {
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

  const createAssignment = async (formData, token) => {
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

  const searchAssignments = async (title, token) => {
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