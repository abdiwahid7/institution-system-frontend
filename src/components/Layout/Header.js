import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header>
      <h1>Your Institution</h1>
      <nav>
        <ul>
          {user ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              {user.role === 'admin' && <li><Link to="/create-assignment">Create Assignment</Link></li>}
              <li><button onClick={logout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;