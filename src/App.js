import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import AssignmentForm from './components/Assignments/AssignmentForm';
import ManageUsers from './components/Admin/ManageUsers';
import ManageAssignments from './components/Admin/ManageAssignments';
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
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-assignment" element={<AssignmentForm />} />
          <Route path="/manage-users" element={user?.role === 'admin' ? <ManageUsers /> : <Navigate to="/dashboard" />} />
          <Route path="/manage-assignments" element={user?.role === 'admin' ? <ManageAssignments /> : <Navigate to="/dashboard" />} />
        </Routes>
        <Footer />
      </AssignmentProvider>
    </AuthProvider>
  );
};

export default App;