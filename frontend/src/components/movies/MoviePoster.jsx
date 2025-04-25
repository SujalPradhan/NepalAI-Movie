import React from 'react';
import { Link } from 'react-router-dom';

const MoviePoster = ({ movie }) => {
  return (
    <div className="card h-100" style={{
      background: 'rgba(12, 24, 33, 0.4)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(50, 74, 95, 0.2)',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      maxWidth: '100%',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-10px)';
      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
    }}>
      {movie.poster_image ? (
        <div className="position-relative">
          <img 
            src={movie.poster_image} 
            className="card-img-top" 
            alt={movie.title}
            style={{ 
              height: '240px', 
              objectFit: 'cover',
              aspectRatio: '2/3'
            }}
            loading="lazy"
          />
          {movie.rating && (
            <div className="position-absolute top-0 end-0 m-2">
              <span style={{
                background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.4rem 0.6rem',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                {movie.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          height: '240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0C1821 0%, #1B2A41 100%)',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          <span className="fs-6">No Image Available</span>
        </div>
      )}
      <div className="card-body" style={{ padding: '1rem' }}>
        <h5 style={{
          fontSize: '1.1rem',
          marginBottom: '0.6rem',
          background: 'linear-gradient(to right, #fff, #a2c4e0)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {movie.title}
        </h5>
        <div className="mb-2">
          <p className="mb-1" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(50, 74, 95, 0.6)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: 'white'
            }}>
              {movie.year || 'N/A'}
            </span>
            <span style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '0.8rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '150px'
            }}>
              {movie.genre}
            </span>
          </p>
        </div>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.8rem',
          lineHeight: '1.4',
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: '3',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxHeight: '3.4rem'
        }}>
          {movie.plot ? movie.plot : 'No plot available'}
        </p>
      </div>
      <div style={{ 
        padding: '0 1rem 1rem 1rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.5rem' 
      }}>
        {movie.poster_viewer && (
          <a 
            href={movie.poster_viewer} 
            style={{
              padding: '0.5rem',
              borderRadius: '6px',
              textDecoration: 'none',
              textAlign: 'center',
              fontWeight: '500',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              fontSize: '0.85rem'
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

        <Link 
          to={`/movie/${movie.id}`} 
          style={{
            padding: '0.5rem',
            borderRadius: '6px',
            textDecoration: 'none',
            textAlign: 'center',
            fontWeight: '500',
            background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: 'none',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            fontSize: '0.85rem'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #324A5F 0%, #1B2A41 100%)';
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.25)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MoviePoster;