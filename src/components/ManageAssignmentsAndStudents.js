import React, { useContext, useState } from 'react';
import { AssignmentContext } from './context/AssignmentContext';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';

const ManageAssignmentsAndStudents = () => {
  const { assignments, getAssignments } = useContext(AssignmentContext);
  const { user, token } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

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
    if (user.role !== 'admin') {
      console.error('User does not have permission to delete assignments');
      return;
    }

    try {
      await axios.delete(`http://localhost:4001/api/assignments/${id}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      getAssignments(token); // Refresh the assignments list after deletion
    } catch (err) {
      console.error('Error deleting assignment:', err);
    }
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setEditTitle(assignment.title);
    setEditDescription(assignment.description);
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    if (!editingAssignment) return;

    if (user.role !== 'admin') {
      console.error('User does not have permission to update assignments');
      return;
    }

    try {
      await axios.put(`http://localhost:4001/api/assignments/${editingAssignment._id}`, {
        title: editTitle,
        description: editDescription,
      }, {
        headers: {
          'x-auth-token': token,
        },
      });
      setEditingAssignment(null);
      getAssignments(token); // Refresh the assignments list after update
    } catch (err) {
      console.error('Error updating assignment:', err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:4001/api/users/${id}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      handleStudentSearch(); // Refresh the students list after deletion
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div className="manage-container">
      <h2>Manage Assignments and Students</h2>
      <ul className="assignment-list">
        {assignments.map((assignment) => (
          <li key={assignment._id} className="assignment-item">
            <div>
              <strong>{assignment.title}</strong>
              <p>{assignment.description}</p>
              <a href={`http://localhost:4001/uploads/${assignment.file}`} target="_blank" rel="noopener noreferrer">Open File</a>
              {user.role === 'admin' && (
                <>
                  <button onClick={() => handleEditAssignment(assignment)}>Edit</button>
                  <button onClick={() => handleDeleteAssignment(assignment._id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      {editingAssignment && (
        <form onSubmit={handleUpdateAssignment} className="edit-assignment-form">
          <h3>Edit Assignment</h3>
          <input
            type="text"
            placeholder="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditingAssignment(null)}>Cancel</button>
        </form>
      )}
      {user.role === 'admin' && (
        <>
          <h2>Search Students</h2>
          <form onSubmit={handleStudentSearch} className="search-form">
            <input
              type="text"
              placeholder="Search students by name..."
              value={studentSearchTerm}
              onChange={(e) => setStudentSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <ul className="student-list">
            {students.map((student) => (
              <li key={student._id} className="student-item">
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

export default ManageAssignmentsAndStudents;