import { useState, useRef, useEffect } from 'react';
import api from '../api';

const ChatBox = ({ onResultsReceived }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const chatboxRef = useRef(null);
  const inputRef = useRef(null);

  // Close chatbox when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatboxRef.current && !chatboxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when chatbox opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await api.post('api/movies/ai-search/', {
        query: query.trim()
      });
      
      if (onResultsReceived) {
        onResultsReceived(response.data);
      }
      
      setIsOpen(false);
      setQuery('');
    } catch (err) {
      console.error('AI search error:', err);
      setError(err.response?.data?.error || 'Failed to get results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chatbox-container" ref={chatboxRef}>
      {/* Chat button */}
      <button
        className="ai-chat-button"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI chat"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          transform: isOpen ? 'scale(0)' : 'scale(1)',
          opacity: isOpen ? 0 : 1,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16 13H13V16C13 16.55 12.55 17 12 17C11.45 17 11 16.55 11 16V13H8C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11H11V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V11H16C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13Z" fill="white"/>
        </svg>
      </button>

      {/* Chatbox popup */}
      {isOpen && (
        <div
          className="ai-chatbox-popup"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            width: '350px',
            borderRadius: '16px',
            background: 'rgba(12, 24, 33, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'fadeIn 0.3s ease-out',
            border: '1px solid rgba(50, 74, 95, 0.3)',
          }}
        >
          <div
            className="ai-chatbox-header"
            style={{
              padding: '15px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>AI Movie Search</h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.5rem',
                lineHeight: 1,
                padding: '0',
              }}
            >
              &times;
            </button>
          </div>

          <div style={{ padding: '20px' }}>
            <p style={{ margin: '0 0 15px', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
              Ask me anything about Nepali movies. Try queries like "romantic comedies" or "movies about family relationships"
            </p>

            {error && (
              <div
                style={{
                  padding: '10px',
                  marginBottom: '15px',
                  backgroundColor: 'rgba(233, 69, 96, 0.15)',
                  color: '#E94560',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What kind of movie are you looking for?"
                  style={{
                    flex: 1,
                    padding: '12px 15px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.95rem',
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '0 20px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
                    color: 'white',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isLoading ? (
                    <span className="spinner" style={{ 
                      display: 'inline-block',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      borderTop: '2px solid white',
                      borderRight: '2px solid transparent',
                      animation: 'spin 0.8s linear infinite'
                    }}></span>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ChatBox;