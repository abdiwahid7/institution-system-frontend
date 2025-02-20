import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const AssignmentContext = createContext();

export const AssignmentProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

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
      throw new Error('Failed to fetch assignments. Please try again.');
    }
  };

  const createAssignment = async (formData) => {
    try {
      setUploadError(null);
      setUploadProgress(0);

      const res = await axios.post('http://localhost:4001/api/assignments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setAssignments([...assignments, res.data]);
      return res.data;
    } catch (err) {
      let errorMessage = 'Failed to upload assignment. Please try again.';
      if (err.response) {
        if (err.response.status === 413) {
          errorMessage = 'File size is too large. Maximum size is 10MB.';
        } else if (err.response.status === 415) {
          errorMessage = 'Invalid file type. Only PDF, DOCX, and ZIP files are allowed.';
        }
      }
      setUploadError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploadProgress(0);
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
      throw new Error('Failed to search assignments. Please try again.');
    }
  };

  const updateAssignment = async (id, updatedData) => {
    try {
      const res = await axios.put(
        `http://localhost:4001/api/assignments/${id}`,
        updatedData,
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      setAssignments(assignments.map(assignment => 
        assignment._id === id ? res.data : assignment
      ));
      return res.data;
    } catch (err) {
      console.error('Error updating assignment:', err);
      throw new Error('Failed to update assignment. Please try again.');
    }
  };


  return (
    <AssignmentContext.Provider
      value={{
        assignments,
        getAssignments,
        createAssignment,
        searchAssignments,
        uploadProgress,
        uploadError,
        updateAssignment,

      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
};
