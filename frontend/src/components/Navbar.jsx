import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

const Navbar = ({ username, onLogout, transparent = false }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      sessionStorage.removeItem(ACCESS_TOKEN);
      sessionStorage.removeItem(REFRESH_TOKEN);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg ${transparent ? 'navbar-transparent' : 'navbar-dark'}`} 
         style={{ 
           background: transparent ? 'transparent' : 'linear-gradient(135deg, #0C1821 0%, #1B2A41 100%)',
           boxShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
           borderBottom: '1px solid rgba(50, 74, 95, 0.2)',
           backdropFilter: 'blur(15px)'
         }}>
      <div className="container">
        <Link className="navbar-brand" to={username ? "/home" : "/"} style={{ 
          background: 'linear-gradient(to right, #fff, #a2c4e0)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: '700',
          fontSize: '1.5rem',
          textShadow: '0 0 20px rgba(12, 24, 33, 0.3)'
        }}>
          NepalAI Movie
        </Link>
        
 
        
        <div className="collapse navbar-collapse" id="navbarContent">
          {username ? (
            // Logged in user navigation
            <div className="ms-auto d-flex align-items-center">
              <span className="navbar-text me-3" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                 <span style={{ fontWeight: '600' }}>{username}</span>
              </span>
              <button 
                className="btn logout-button"
                onClick={handleLogout}
                style={{
                  background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  border: 'none'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #324A5F 0%, #1B2A41 100%)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)'}
              >
                Logout
              </button>
            </div>
          ) : (
            // Guest navigation
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#contact">Contact</Link>
              </li>
              <li className="nav-item ms-lg-2">
                <Link to="/login" className="btn btn-outline-light">Login</Link>
              </li>
              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                <Link to="/register" className="btn btn-light">Register</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;