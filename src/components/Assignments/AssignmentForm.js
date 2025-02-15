import React, { useState, useContext } from 'react';
import { AssignmentContext } from '../context/AssignmentContext';
import { AuthContext } from '../context/AuthContext';

const AssignmentForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isForAllUsers, setIsForAllUsers] = useState(false);
  const [specificStudents, setSpecificStudents] = useState('');
  const { createAssignment } = useContext(AssignmentContext);
  const { token } = useContext(AuthContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);
    formData.append('isForAllUsers', isForAllUsers);
    if (specificStudents) {
      formData.append('specificStudents', specificStudents);
    }

    try {
      await createAssignment(formData, token);
      setTitle('');
      setDescription('');
      setFile(null);
      setIsForAllUsers(false);
      setSpecificStudents('');
    } catch (err) {
      console.error(err);
      alert('Failed to create assignment. Please try again.');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Create Assignment</h2>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>File:</label>
          <input type="file" onChange={handleFileChange} required />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isForAllUsers}
              onChange={(e) => setIsForAllUsers(e.target.checked)}
            />
            For All Users
          </label>
        </div>
        <div>
          <label>Specific Students (comma separated IDs):</label>
          <input
            type="text"
            value={specificStudents}
            onChange={(e) => setSpecificStudents(e.target.value)}
            disabled={isForAllUsers}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default AssignmentForm;