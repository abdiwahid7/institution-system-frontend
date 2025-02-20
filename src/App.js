import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ManageAssignmentsAndStudents from './components/ManageAssignmentsAndStudents';
import AssignmentForm from './components/Assignments/AssignmentForm';


import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import { AuthProvider, AuthContext } from './components/context/AuthContext';
import { AssignmentProvider } from './components/context/AssignmentContext';


const App = () => {
  const { user } = useContext(AuthContext);

  if (user === undefined) {
    return null; // or a loading spinner
  }

  return (
    <AuthProvider>
      <AssignmentProvider>
        <Header />
        <Routes>
          {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-assignment" element={<AssignmentForm />} />
                    <Route path="/manage" element={user?.role === 'admin' ? <ManageAssignmentsAndStudents /> : <Navigate to="/dashboard" />} />
        
        </Routes>
        <Footer />
      </AssignmentProvider>
    </AuthProvider>
  );
};

export default App;