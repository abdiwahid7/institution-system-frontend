import React, { useContext, useEffect, useState } from 'react';
import { AssignmentContext } from '../context/AssignmentContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { assignments, getAssignments, searchAssignments } = useContext(AssignmentContext);
  const { user, token } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');

  useEffect(() => {
    if (token) {
      getAssignments(token);
    }
  }, [getAssignments, token]);

  const handleSearch = (e) => {
    e.preventDefault();
    searchAssignments(searchTerm, token);
  };

  const handleStudentSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:4001/api/users/search?name=${studentSearchTerm}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Error searching students:', err);
    }
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

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/api/users/${id}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      handleStudentSearch();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Show a loading message while user data is being fetched
  }

  return (
    <div className="container">
      <h2>Dashboard</h2>
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
              {user.role === 'admin' && (
                <button onClick={() => handleDeleteAssignment(assignment._id)}>Delete</button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {user.role === 'admin' && (
        <>
          <h2>Search Students</h2>
          <form onSubmit={handleStudentSearch}>
            <input
              type="text"
              placeholder="Search students by name..."
              value={studentSearchTerm}
              onChange={(e) => setStudentSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <ul>
            {students.map((student) => (
              <li key={student._id}>
                {student.name}
                <button onClick={() => handleDeleteUser(student._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Dashboard;