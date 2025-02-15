import React, { useContext, useEffect, useState } from 'react';
import { AssignmentContext } from '../context/AssignmentContext';
import { AuthContext } from '../context/AuthContext';

const AssignmentList = () => {
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

  return (
    <div className="container">
      <h2>Assignments</h2>
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
          <li key={assignment._id}>{assignment.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default AssignmentList;