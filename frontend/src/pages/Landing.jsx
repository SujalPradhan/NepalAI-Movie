import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  useEffect(() => {
    const handleScroll = () => {
      // Change navbar style on scroll
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Update active section based on scroll position
      const sections = ['home', 'about', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #000000 0%, #0C1821 25%, #1B2A41 50%, #324A5F 75%, #324A5F 100%)',
      backgroundAttachment: 'fixed',
      color: 'white',
      minHeight: '100vh'
    }}>
      {/* Redesigned Navbar */}
      <header style={{
        position: 'fixed',
        width: '100%',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(12, 24, 33, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.2)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(50, 74, 95, 0.15)' : 'none',
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: scrolled ? '0.8rem 1.5rem' : '1.2rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease'
        }}>
          {/* Logo */}
          <Link to="/" style={{ 
            background: 'linear-gradient(to right, #fff, #a2c4e0)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            fontWeight: '700',
            fontSize: '1.6rem',
            textDecoration: 'none',
            textShadow: '0 0 20px rgba(12, 24, 33, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 5px rgba(162, 196, 224, 0.5))' }}>
              <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V16" stroke="url(#paint1_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12H16" stroke="url(#paint2_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF"/>
                  <stop offset="1" stopColor="#A2C4E0"/>
                </linearGradient>
                <linearGradient id="paint1_linear" x1="12" y1="8" x2="13" y2="16" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF"/>
                  <stop offset="1" stopColor="#A2C4E0"/>
                </linearGradient>
                <linearGradient id="paint2_linear" x1="8" y1="12" x2="16" y2="13" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF"/>
                  <stop offset="1" stopColor="#A2C4E0"/>
                </linearGradient>
              </defs>
            </svg> */}
            NepalAI Movie
          </Link>
          
          {/* Desktop Menu */}
          <nav style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '3rem',
            '@media (max-width: 768px)': {
              display: 'none'
            } 
          }} className="d-none d-md-flex">
            <ul style={{ 
              display: 'flex', 
              gap: '2rem', 
              listStyle: 'none', 
              margin: 0, 
              padding: 0 
            }}>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
                  style={{
                    color: activeSection === 'home' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '0.5rem 0',
                    fontSize: '0.95rem',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Home
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: activeSection === 'home' ? '100%' : '0%',
                    height: '2px',
                    borderRadius: '5px',
                    background: 'linear-gradient(to right, rgba(255, 255, 255, 0.7), #a2c4e0)',
                    transition: 'all 0.3s ease'
                  }}></span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
                  style={{
                    color: activeSection === 'about' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '0.5rem 0',
                    fontSize: '0.95rem',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  About
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: activeSection === 'about' ? '100%' : '0%',
                    height: '2px',
                    borderRadius: '5px',
                    background: 'linear-gradient(to right, rgba(255, 255, 255, 0.7), #a2c4e0)',
                    transition: 'all 0.3s ease'
                  }}></span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
                  style={{
                    color: activeSection === 'contact' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontWeight: '500',
                    padding: '0.5rem 0',
                    fontSize: '0.95rem',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Contact
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: activeSection === 'contact' ? '100%' : '0%',
                    height: '2px',
                    borderRadius: '5px',
                    background: 'linear-gradient(to right, rgba(255, 255, 255, 0.7), #a2c4e0)',
                    transition: 'all 0.3s ease'
                  }}></span>
                </a>
              </li>
            </ul>
            
            {/* Auth buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link 
                to="/login" 
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '30px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  background: 'transparent',
                  color: 'white',
                  border: '1.5px solid rgba(162, 196, 224, 0.5)',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(162, 196, 224, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(162, 196, 224, 0.8)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(162, 196, 224, 0.5)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 17L15 12L10 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 12H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Login
              </Link>
              
              <Link 
                to="/register" 
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '30px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
                  color: 'white',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  border: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #324A5F 0%, #1B2A41 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 8V14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 11H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Register
              </Link>
            </div>
          </nav>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMenu}
            aria-expanded={isMenuOpen ? "true" : "false"}
            aria-label="Toggle navigation"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              zIndex: 1002,
              '@media (max-width: 768px)': {
                display: 'block'
              }
            }}
            className="d-md-none"
          >
            <div style={{
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              margin: '5px 0',
              transition: 'all 0.3s ease',
              transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
            }}></div>
            <div style={{
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              margin: '5px 0',
              transition: 'all 0.3s ease',
              opacity: isMenuOpen ? 0 : 1
            }}></div>
            <div style={{
              width: '24px',
              height: '2px',
              backgroundColor: 'white',
              margin: '5px 0',
              transition: 'all 0.3s ease',
              transform: isMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
            }}></div>
          </button>
        </div>
        
        {/* Mobile Menu Overlay */}
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.97) 0%, rgba(12, 24, 33, 0.97) 100%)',
            backdropFilter: 'blur(10px)',
            zIndex: 1001,
            display: isMenuOpen ? 'flex' : 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            transition: 'all 0.3s ease'
          }}
          className="d-md-none"
        >
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 2rem 0',
            width: '100%',
            maxWidth: '300px',
            textAlign: 'center'
          }}>
            <li style={{ marginBottom: '1.5rem' }}>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
                style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  textDecoration: 'none',
                  fontWeight: activeSection === 'home' ? '600' : '400',
                  display: 'block',
                  padding: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                Home
              </a>
            </li>
            <li style={{ marginBottom: '1.5rem' }}>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
                style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  textDecoration: 'none',
                  fontWeight: activeSection === 'about' ? '600' : '400',
                  display: 'block',
                  padding: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                About
              </a>
            </li>
            <li style={{ marginBottom: '2.5rem' }}>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
                style={{
                  color: 'white',
                  fontSize: '1.5rem',
                  textDecoration: 'none',
                  fontWeight: activeSection === 'contact' ? '600' : '400',
                  display: 'block',
                  padding: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                Contact
              </a>
            </li>
          </ul>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            width: '100%', 
            maxWidth: '300px' 
          }}>
            <Link 
              to="/login" 
              style={{
                padding: '1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                background: 'transparent',
                color: 'white',
                border: '1.5px solid rgba(162, 196, 224, 0.5)',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
            >
              Login
            </Link>
            
            <Link 
              to="/register" 
              style={{
                padding: '1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
                color: 'white',
                border: 'none',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
              }}
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" style={{ 
          minHeight: '100vh',
          paddingTop: '120px',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(12, 24, 33, 0.8) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated background elements */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            opacity: 0.4,
            background: 'radial-gradient(circle at 20% 80%, rgba(50, 74, 95, 0.4) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(50, 74, 95, 0.4) 0%, transparent 40%)'
          }}></div>
          
          <div className="container text-center position-relative" style={{ zIndex: 1 }}>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <h1 style={{
                  fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                  lineHeight: '1.1',
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(to right, #fff, #a2c4e0)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: '700',
                  textShadow: '0 5px 30px rgba(12, 24, 33, 0.8)',
                  animation: 'fadeIn 1s ease-out'
                }}>
                  Discover Nepali Cinema
                </h1>
                <p style={{
                  fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                  marginBottom: '2.5rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  maxWidth: '800px',
                  margin: '0 auto 2.5rem',
                  animation: 'fadeIn 1s ease-out 0.2s both'
                }}>
                  Explore and find personalized movie recommendations powered by AI
                </p>
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  animation: 'fadeIn 1s ease-out 0.4s both'
                }}>
                  <Link to="/register" style={{
                    padding: '0.8rem 2rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
                    color: 'white',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #324A5F 0%, #1B2A41 100%)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
                  }}>
                    Get Started
                  </Link>
                  
                  <button 
                    onClick={() => scrollToSection('about')} 
                    style={{
                      padding: '0.8rem 2rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                      background: 'transparent',
                      color: 'white',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" style={{ padding: '7rem 0' }}>
          <div className="container">
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              textAlign: 'center',
              marginBottom: '4rem',
              background: 'linear-gradient(to right, #fff, #a2c4e0)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              fontWeight: '700'
            }}>About NepalAI Movie</h2>
            <div className="row g-4">
              <div className="col-md-4">
                <div style={{
                  height: '100%',
                  background: 'rgba(12, 24, 33, 0.4)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(50, 74, 95, 0.2)',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }} 
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
                }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🎬</div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                    background: 'linear-gradient(to right, #fff, #a2c4e0)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: '600'
                  }}>AI-Powered Recommendations</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                    Our artificial intelligence analyzes your preferences to suggest Nepali movies you'll love.
                  </p>
                </div>
              </div>
              
              <div className="col-md-4">
                <div style={{
                  height: '100%',
                  background: 'rgba(12, 24, 33, 0.4)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(50, 74, 95, 0.2)',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }} 
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
                }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🔍</div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                    background: 'linear-gradient(to right, #fff, #a2c4e0)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: '600'
                  }}>Smart Search</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                    Find the perfect Nepali movie with our intelligent search features.
                  </p>
                </div>
              </div>
              
              <div className="col-md-4">
                <div style={{
                  height: '100%',
                  background: 'rgba(12, 24, 33, 0.4)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(50, 74, 95, 0.2)',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }} 
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
                }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>📱</div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                    background: 'linear-gradient(to right, #fff, #a2c4e0)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: '600'
                  }}>User-Friendly Interface</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                    Enjoy a seamless experience with our modern and intuitive design.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" style={{ 
          padding: '7rem 0',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(12, 24, 33, 0.3) 100%)',
          position: 'relative'
        }}>
          <div className="container">
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              textAlign: 'center',
              marginBottom: '4rem',
              background: 'linear-gradient(to right, #fff, #a2c4e0)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              fontWeight: '700'
            }}>Contact Us</h2>
            
            <div className="row">
              <div className="col-md-5 mb-4 mb-md-0">
                <div style={{
                  height: '100%',
                  background: 'rgba(12, 24, 33, 0.4)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(50, 74, 95, 0.2)',
                  padding: '2.5rem',
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(to right, #fff, #a2c4e0)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    fontWeight: '600'
                  }}>Get in Touch</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.05rem', marginBottom: '2rem' }}>
                    Have questions or feedback about NepalAI Movie? We'd love to hear from you!
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '1.25rem',
                    color: 'rgba(255, 255, 255, 0.9)' 
                  }}>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      marginRight: '1rem',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(50, 74, 95, 0.4)',
                    }}>📧</div>
                    <p style={{ margin: 0 }}>rp.sujal28@gmail.com</p>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'rgba(255, 255, 255, 0.9)' 
                  }}>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      marginRight: '1rem',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(50, 74, 95, 0.4)',
                    }}>📍</div>
                    <p style={{ margin: 0 }}>Darjeeling, India</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-7">
                <div style={{
                  background: 'rgba(12, 24, 33, 0.4)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(50, 74, 95, 0.2)',
                  padding: '2.5rem',
                }}>
                  <form>
                    <div className="mb-3">
                      <input type="text" 
                        style={{
                          width: '100%',
                          padding: '1rem',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '1rem'
                        }}
                        placeholder="Your Name" 
                      />
                    </div>
                    <div className="mb-3">
                      <input type="email" 
                        style={{
                          width: '100%',
                          padding: '1rem',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '1rem'
                        }}
                        placeholder="Your Email" 
                      />
                    </div>
                    <div className="mb-4">
                      <textarea 
                        style={{
                          width: '100%',
                          padding: '1rem',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '1rem',
                          minHeight: '120px'
                        }}
                        placeholder="Your Message" 
                        rows="4"
                      ></textarea>
                    </div>
                    <button type="submit" style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1.05rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #324A5F 0%, #1B2A41 100%)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)';
                    }}>
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '3rem 0',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(50, 74, 95, 0.2)'
      }}>
        <div className="container">
          {/* <div className="row align-items-center">
            <div className="col-md-4 text-center text-md-start mb-4 mb-md-0">
              <h5 style={{
                background: 'linear-gradient(to right, #fff, #a2c4e0)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                fontWeight: '600',
                fontSize: '1.25rem'
              }}>NepalAI Movie</h5>
            </div>
            <div className="col-md-4 text-center mb-4 mb-md-0">
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                <a href="#" onClick={() => scrollToSection('home')} style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }}>Home</a>
                
                <a href="#" onClick={() => scrollToSection('about')} style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }}>About</a>
                
                <a href="#" onClick={() => scrollToSection('contact')} style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }}>Contact</a>
              </div>
            </div>
            <div className="col-md-4 text-center text-md-end">
              <div style={{ display: 'flex', justifyContent: 'center', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/login" style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  background: 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}>Login</Link>
                
                <Link to="/register" style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
                  color: 'white',
                  border: 'none',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #324A5F 0%, #1B2A41 100%)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)';
                }}>Register</Link>
              </div>
            </div>
          </div> */}
          <hr style={{ margin: '1.5rem 0', borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <div className="text-center">
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
              &copy; {new Date().getFullYear()} NepalAI Movie. All rights reserved. <span style={{ opacity: 0.7 }}>Created by Sujal</span>
            </p>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default Landing;