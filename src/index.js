import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Import the CSS file
import { AuthProvider } from './components/context/AuthContext';
import { AssignmentProvider } from './components/context/AssignmentContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AssignmentProvider>
          <App />
        </AssignmentProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);