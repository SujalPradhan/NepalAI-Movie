import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Register = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await api.post('api/user/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      // Redirect to login
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response?.data) {
        // Format Django error messages
        const errors = err.response.data;
        const errorMessages = [];
        
        for (const key in errors) {
          if (Array.isArray(errors[key])) {
            errorMessages.push(`${key}: ${errors[key].join(' ')}`);
          } else if (typeof errors[key] === 'string') {
            errorMessages.push(`${key}: ${errors[key]}`);
          }
        }
        
        setError(errorMessages.join(', ') || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
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
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      {/* Background particle elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(162, 196, 224, 0.4) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '70%',
          right: '15%',
          width: '35px',
          height: '35px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(162, 196, 224, 0.3) 0%, transparent 70%)',
          animation: 'float 12s ease-in-out infinite 1s'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          width: '25px',
          height: '25px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(162, 196, 224, 0.2) 0%, transparent 70%)',
          animation: 'float 10s ease-in-out infinite 2s'
        }}></div>
      </div>

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
        maxWidth: '500px',
        width: '100%',
        background: 'rgba(12, 24, 33, 0.3)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(50, 74, 95, 0.2)',
        padding: '2.5rem',
        transition: 'all 0.3s ease',
        animation: 'fadeIn 0.8s ease-out forwards',
        position: 'relative',
        zIndex: 1
      }}>
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
          Create Your Account
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
              placeholder="Choose a username"
              autoComplete="username"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="email" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
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
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="password" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}
            >
              Password
            </label>
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
              placeholder="Create a password"
              autoComplete="new-password"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label 
              htmlFor="confirmPassword" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
              placeholder="Confirm your password"
              autoComplete="new-password"
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
              <span>Creating account...</span>
            ) : (
              <span>Register</span>
            )}
          </button>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
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
                Login here
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
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        input:focus {
          outline: none;
          background-color: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(162, 196, 224, 0.5) !important;
          box-shadow: 0 0 0 3px rgba(162, 196, 224, 0.15);
        }
      `}</style>
    </div>
  );
};

export default Register;