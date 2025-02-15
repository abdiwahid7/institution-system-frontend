import React, { useContext, useEffect, useState } from 'react';
import { AssignmentContext } from '../context/AssignmentContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const ManageAssignments = () => {
  const { assignments, getAssignments, searchAssignments } = useContext(AssignmentContext);
  const { token } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAssignments(token);
  }, [getAssignments, token]);

  const handleSearch = (e) => {
    e.preventDefault();
    searchAssignments(searchTerm, token);
  };

  const handleDeleteAssignment = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/api/assignments/${id}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      getAssignments(token);
    } catch (err) {
      console.error('Error deleting assignment:', err);
    }
  };

  return (
    <div className="container">
      <h2>Manage Assignments</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search assignments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment._id}>
            <div>
              <strong>{assignment.title}</strong>
              <p>{assignment.description}</p>
              <a href={`http://localhost:4001/uploads/${assignment.file}`} target="_blank" rel="noopener noreferrer">Open File</a>
              <button onClick={() => handleDeleteAssignment(assignment._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageAssignments;