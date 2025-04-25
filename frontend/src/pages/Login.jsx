import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await api.post('api/token/', {
        username: formData.username,
        password: formData.password,
      });
      
      // Save tokens using the proper constants
      sessionStorage.setItem(ACCESS_TOKEN, response.data.access);
      sessionStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      localStorage.setItem('token', response.data.access); // Keep this for App.jsx check
      
      // Set JWT token for API calls
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      
      // Update authentication state
      if (setIsAuthenticated) {
        setIsAuthenticated(true);
      }
      
      // Redirect to home page
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #000000 0%, #0C1821 25%, #1B2A41 50%, #324A5F 75%, #324A5F 100%)',
      backgroundAttachment: 'fixed',
      padding: '2rem 1rem'
    }}>
      <div style={{
        position: 'fixed',
        top: '1.5rem',
        left: '1.5rem',
        zIndex: 10
      }}>
        <Link to="/" style={{
          background: 'linear-gradient(to right, #fff, #a2c4e0)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: '700',
          fontSize: '1.5rem',
          textDecoration: 'none',
          textShadow: '0 0 20px rgba(12, 24, 33, 0.3)'
        }}>
          NepalAI Movie
        </Link>
      </div>

      <div style={{
        maxWidth: '450px',
        width: '100%',
        background: 'rgba(12, 24, 33, 0.3)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(50, 74, 95, 0.2)',
        padding: '2.5rem',
        transition: 'all 0.3s ease',
        animation: 'fadeIn 0.8s ease-out forwards',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative light effect */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(50, 74, 95, 0.6) 0%, transparent 60%)',
          opacity: 0.1,
          transform: 'scale(0.5)',
          animation: 'glow 4s ease-in-out infinite alternate',
          pointerEvents: 'none'
        }}></div>

        <h1 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          background: 'linear-gradient(to right, #fff, #a2c4e0)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: '600',
          fontSize: '2rem',
          letterSpacing: '-0.5px',
          textShadow: '0 0 20px rgba(12, 24, 33, 0.5)'
        }}>
          Login to Your Account
        </h1>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(233, 69, 96, 0.15)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(233, 69, 96, 0.3)',
            color: '#E94560',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="username" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label 
                htmlFor="password" 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}
              >
                Password
              </label>
              <a 
                href="#" 
                style={{
                  color: 'rgba(162, 196, 224, 0.9)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#a2c4e0'}
                onMouseOut={(e) => e.currentTarget.style.color = 'rgba(162, 196, 224, 0.9)'}
              >
                {/* Forgot password? */}
              </a>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
              color: 'white',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #324A5F 0%, #1B2A41 100%)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)';
              }
            }}
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <span style={{ position: 'relative', zIndex: 2 }}>Log In</span>
                <span
                  style={{
                    content: '',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    transition: 'var(--transition)',
                    zIndex: 1
                  }}
                  className="button-shine"
                ></span>
              </>
            )}
          </button>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{
                  color: '#a2c4e0',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'white';
                  const afterElement = e.currentTarget.querySelector('.link-underline');
                  if (afterElement) afterElement.style.width = '100%';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = '#a2c4e0';
                  const afterElement = e.currentTarget.querySelector('.link-underline');
                  if (afterElement) afterElement.style.width = '0';
                }}
              >
                Register here
                <span 
                  className="link-underline"
                  style={{
                    position: 'absolute',
                    width: 0,
                    height: '1.5px',
                    bottom: '-2px',
                    left: 0,
                    background: 'linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(162, 196, 224, 1))',
                    transition: 'all 0.3s ease'
                  }}
                ></span>
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Add animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 0.15; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.8); }
        }
        input:focus {
          outline: none;
          background-color: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(162, 196, 224, 0.5) !important;
          box-shadow: 0 0 0 3px rgba(162, 196, 224, 0.15);
        }
        button:hover .button-shine {
          left: 100%;
          transition: 0.7s;
        }
      `}</style>
    </div>
  );
};

export default Login;