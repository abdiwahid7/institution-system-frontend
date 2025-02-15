import React, { useState } from 'react';
import axios from 'axios';

const StudentSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:4001/api/users/search?name=${searchTerm}`);
      setStudents(res.data);
    } catch (err) {
      console.error('Error searching students:', err);
    }
  };

  return (
    <div className="container">
      <h2>Search Students</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search students by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {students.map((student) => (
          <li key={student._id}>{student.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default StudentSearch;