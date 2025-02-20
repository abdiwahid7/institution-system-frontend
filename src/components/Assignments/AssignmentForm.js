import React, { useState, useContext } from 'react';
import { AssignmentContext } from '../context/AssignmentContext';
import { AuthContext } from '../context/AuthContext';

const AssignmentForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isForAllUsers, setIsForAllUsers] = useState(false);
  const [specificStudents, setSpecificStudents] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { createAssignment, uploadProgress, uploadError } = useContext(AssignmentContext);
  const { token } = useContext(AuthContext);

  const validFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!validFileTypes.includes(selectedFile.type)) {
      alert('Invalid file type. Please upload PDF, DOCX, or ZIP files only.');
      return;
    }

    if (selectedFile.size > maxFileSize) {
      alert('File size exceeds 10MB limit. Please choose a smaller file.');
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);
    formData.append('isForAllUsers', isForAllUsers);
    if (specificStudents) {
      formData.append('specificStudents', specificStudents);
    }

    try {
      setIsUploading(true);
      await createAssignment(formData, token);
      alert('Assignment uploaded successfully!');
      setTitle('');
      setDescription('');
      setFile(null);
      setIsForAllUsers(false);
      setSpecificStudents('');
    } catch (err) {
      alert(uploadError || 'Failed to upload assignment. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Create Assignment</h2>
        {uploadError && <div className="error">{uploadError}</div>}
        
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        
        <div>
          <label>Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        
        <div>
          <label>File (PDF, DOCX, ZIP - max 10MB):</label>
          <input type="file" onChange={handleFileChange} required />
          {file && <div className="file-info">Selected file: {file.name}</div>}
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
        
        <button type="submit" disabled={isUploading}>
          {isUploading ? `Uploading... ${uploadProgress}%` : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default AssignmentForm;
