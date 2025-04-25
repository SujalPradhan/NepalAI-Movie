import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`api/movies/detail/${id}/`);
        setMovie(response.data);
        if (response.data.related_movies) {
          setRelatedMovies(response.data.related_movies);
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" 
           style={{
             background: 'linear-gradient(135deg, #000000 0%, #0C1821 25%, #1B2A41 50%, #324A5F 75%, #324A5F 100%)',
             backgroundAttachment: 'fixed'
           }}>
        <div className="spinner-border" role="status" style={{ color: '#a2c4e0' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #0C1821 25%, #1B2A41 50%, #324A5F 75%, #324A5F 100%)',
        backgroundAttachment: 'fixed',
        color: 'white',
        padding: '3rem 0'
      }}>
        <div className="container py-5">
          <div style={{
            background: 'rgba(12, 24, 33, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(50, 74, 95, 0.2)',
            padding: '2rem',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            {error || 'Movie not found'}
          </div>
          <Link to="/home" className="btn mt-3" style={{
            background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
            color: 'white',
            border: 'none',
            marginTop: '1rem'
          }}>Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #0C1821 25%, #1B2A41 50%, #324A5F 75%, #324A5F 100%)',
      backgroundAttachment: 'fixed',
      color: 'white'
    }}>

      <div className="container py-5">
        <div className="row">
          <div className="col-12 mb-4">
            <Link to="/home" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'white',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              background: 'rgba(12, 24, 33, 0.4)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(50, 74, 95, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(50, 74, 95, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(12, 24, 33, 0.4)';
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
              </svg>
              Back to Movies
            </Link>
          </div>
        </div>

        <div style={{
          background: 'rgba(12, 24, 33, 0.4)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(50, 74, 95, 0.2)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div className="row">
            <div className="col-md-4 mb-4">
              {movie.poster_image ? (
                <div className="position-relative" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)' }}>
                  <img
                    src={movie.poster_image}
                    alt={movie.title}
                    className="img-fluid"
                    style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
                  />
                  {movie.rating && (
                    <div className="position-absolute top-0 end-0 m-3">
                      <span style={{
                        background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        padding: '0.7rem 1rem',
                        borderRadius: '25px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                        {movie.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  aspectRatio: '2/3',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #0C1821 0%, #1B2A41 100%)',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  <span className="fs-5">No Image Available</span>
                </div>
              )}

              {movie.poster_viewer && (
                <a
                  href={movie.poster_viewer}
                  style={{
                    display: 'block',
                    marginTop: '1rem',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontWeight: '500',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View on IMDB
                </a>
              )}
            </div>

            <div className="col-md-8">
              <h1 style={{
                marginBottom: '1rem',
                background: 'linear-gradient(to right, #fff, #a2c4e0)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                fontWeight: '600',
                fontSize: '2.5rem'
              }}>
                {movie.title}
              </h1>
              
              <div className="mb-4 d-flex flex-wrap gap-2">
                {movie.year && (
                  <span style={{
                    background: 'rgba(50, 74, 95, 0.6)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    color: 'white',
                    display: 'inline-block',
                  }}>
                    {movie.year}
                  </span>
                )}
                
                {movie.runtime && (
                  <span style={{
                    background: 'rgba(12, 24, 33, 0.6)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    color: 'white',
                    display: 'inline-block',
                  }}>
                    {movie.runtime}
                  </span>
                )}
                
                {movie.genre && (
                  <span style={{
                    background: 'rgba(27, 42, 65, 0.6)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    color: 'white',
                    display: 'inline-block',
                  }}>
                    {movie.genre}
                  </span>
                )}
              </div>
              
              <div style={{
                background: 'rgba(12, 24, 33, 0.5)',
                backdropFilter: 'blur(5px)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                border: '1px solid rgba(50, 74, 95, 0.2)',
              }}>
                <h5 style={{
                  fontSize: '1.1rem',
                  marginBottom: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '600'
                }}>Plot</h5>
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem',
                  lineHeight: '1.7',
                  marginBottom: '0'
                }}>
                  {movie.plot}
                </p>
              </div>
              
              {movie.votes && (
                <div className="mb-4" style={{
                  background: 'rgba(12, 24, 33, 0.5)',
                  backdropFilter: 'blur(5px)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(50, 74, 95, 0.2)',
                }}>
                  <h5 style={{
                    fontSize: '1.1rem',
                    marginBottom: '1rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: '600'
                  }}>Ratings</h5>
                  <div className="d-flex align-items-center">
                    <div className="me-4" style={{ position: 'relative' }}>
                      <span style={{
                        fontSize: '3rem',
                        fontWeight: '700',
                        background: 'linear-gradient(to right, #fff, #a2c4e0)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                      }}>
                        {movie.rating?.toFixed(1)}
                      </span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem' }}>/10</span>
                    </div>
                    <div>
                      <p style={{ 
                        marginBottom: '0', 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.95rem'
                      }}>
                        Based on {movie.votes.toLocaleString()} votes
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {relatedMovies.length > 0 && (
          <div style={{
            background: 'rgba(12, 24, 33, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(50, 74, 95, 0.2)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '1.5rem',
              background: 'linear-gradient(to right, #fff, #a2c4e0)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              fontWeight: '600'
            }}>Related Movies</h3>
            
            <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-3">
              {relatedMovies.map(relatedMovie => (
                <div className="col" key={relatedMovie.id}>
                  <Link 
                    to={`/movie/${relatedMovie.id}`} 
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      background: 'rgba(12, 24, 33, 0.5)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(50, 74, 95, 0.2)',
                      height: '100%',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                    }}>
                      {relatedMovie.poster_image ? (
                        <img 
                          src={relatedMovie.poster_image} 
                          alt={relatedMovie.title}
                          style={{ 
                            width: '100%', 
                            aspectRatio: '2/3', 
                            objectFit: 'cover' 
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div style={{
                          aspectRatio: '2/3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #0C1821 0%, #1B2A41 100%)',
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                          padding: '0.5rem',
                          textAlign: 'center'
                        }}>
                          No Image
                        </div>
                      )}
                      <div style={{ padding: '0.75rem' }}>
                        <h5 style={{
                          fontSize: '0.95rem',
                          marginBottom: '0.3rem',
                          color: 'white',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {relatedMovie.title}
                        </h5>
                        {relatedMovie.year && (
                          <p style={{ 
                            marginBottom: '0', 
                            fontSize: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.7)'
                          }}>
                            {relatedMovie.year}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <footer className="py-4 mt-5" style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(50, 74, 95, 0.2)'
      }}>
        <div className="container text-center">
          <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            &copy; {new Date().getFullYear()} NepalAI Movie. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MovieDetail;