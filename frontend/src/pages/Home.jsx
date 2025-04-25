import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import MoviePoster from '../components/movies/MoviePoster';
import Navbar from '../components/Navbar';
import ChatBox from '../components/ChatBox';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

function Home() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [moviesByGenre, setMoviesByGenre] = useState({});
    const [highestRatedMovies, setHighestRatedMovies] = useState([]);
    const [aiResults, setAiResults] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [animating, setAnimating] = useState(false);
    const navigate = useNavigate();
    
    // Hard-coded genre list in desired display order
    const genres = [
        "Comedy", 
        "Drama", 
        "Romance", 
        "Action", 
        "Adventure",
        "Documentary", 
        "History",
        "Family",
        "Crime",
        "Thriller"
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('api/user/info/');
                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching user data', error);
                navigate('/login');
            }
        };

        const fetchMovies = async () => {
            try {
                const response = await api.get('api/movies/');
                const allMovies = response.data;
                setMovies(allMovies);
                setFilteredMovies(allMovies);
                
                // Get highest rated movies (top 8)
                const sortedByRating = [...allMovies].sort((a, b) => b.rating - a.rating);
                setHighestRatedMovies(sortedByRating.slice(0, 8));
                
                // Group movies by hard-coded genres
                const genreMap = {};
                
                // Initialize genre categories
                genres.forEach(genre => {
                    genreMap[genre] = [];
                });
                
                // Categorize movies by genre
                allMovies.forEach(movie => {
                    // Check each genre in the movie's genre field
                    const movieGenres = movie.genre.split(/[,\s]+/).map(g => g.trim()).filter(g => g);
                    
                    // Add movie to all matching genre categories
                    movieGenres.forEach(movieGenre => {
                        // Check if this genre matches any of our hard-coded genres (case insensitive)
                        const matchedGenre = genres.find(g => 
                            g.toLowerCase() === movieGenre.toLowerCase()
                        );
                        
                        if (matchedGenre && genreMap[matchedGenre]) {
                            genreMap[matchedGenre].push(movie);
                        }
                    });
                });
                
                // Sort movies within each genre by rating
                Object.keys(genreMap).forEach(genre => {
                    genreMap[genre].sort((a, b) => b.rating - a.rating);
                });
                
                setMoviesByGenre(genreMap);
            } catch (error) {
                console.error('Error fetching movies', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchMovies();
    }, [navigate]);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.trim() === '') {
            setFilteredMovies(movies);
        } else {
            const filtered = movies.filter(movie => 
                movie.title.toLowerCase().includes(query.toLowerCase()) ||
                movie.genre.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredMovies(filtered);
        }
        
        // Clear AI results when manually searching
        setAiResults(null);
    };

    const handleSearchSubmit = async () => {
        if (searchQuery.trim() === '') {
            setFilteredMovies(movies);
            return;
        }
        
        try {
            const response = await api.get(`api/movies/search/?q=${searchQuery}`);
            setFilteredMovies(response.data);
            setAiResults(null); // Clear AI results when using traditional search
        } catch (error) {
            console.error('Error searching movies', error);
        }
    };

    const handleAiResults = (results) => {
        if (results && results.movies) {
            setFilteredMovies(results.movies);
            setAiResults(results);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem(ACCESS_TOKEN);
        sessionStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem('token');  // Make sure to clear localStorage token
        navigate('/login');
    };

    const handleViewAllGenre = (genre) => {
        setAnimating(true);
        setTimeout(() => {
            setSelectedGenre(genre);
            setSearchQuery('');
            setAiResults(null);
            setAnimating(false);
        }, 300);
    };

    const handleBackToHome = () => {
        setAnimating(true);
        setTimeout(() => {
            setSelectedGenre(null);
            setAnimating(false);
        }, 300);
    };

    // Movie card component for reuse
    const MovieCard = ({ movie }) => (
        <div className="col-md-3 col-sm-6 mb-4" style={{ width: '25%', padding: '0 15px' }}>
            <div className="card h-100" style={{
                background: 'rgba(12, 24, 33, 0.4)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(50, 74, 95, 0.2)',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                width: '100%',
            }}>
                <div className="position-relative" style={{ height: '280px' }}>
                    {movie.poster_image ? (
                        <img 
                            src={movie.poster_image} 
                            alt={movie.title} 
                            className="card-img-top"
                            style={{ 
                                height: '100%', 
                                objectFit: 'cover',
                                objectPosition: 'center' 
                            }}
                        />
                    ) : (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.9rem',
                            padding: '20px',
                            textAlign: 'center'
                        }}>
                            No poster available
                        </div>
                    )}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                        padding: '30px 15px 10px',
                    }}>
                        <h6 className="m-0 text-white">{movie.title}</h6>
                        <small style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{movie.year}</small>
                    </div>
                </div>
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge" style={{ 
                            background: 'rgba(50, 74, 95, 0.5)', 
                            color: 'white',
                            padding: '5px 10px',
                            fontSize: '0.75rem',
                            borderRadius: '4px'
                        }}>
                            {movie.genre.split(' ').slice(0, 2).join(' ')}
                        </span>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '0.85rem'
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>{movie.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <p className="card-text text-truncate mb-0" style={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.85rem'
                    }}>
                        {movie.plot}
                    </p>
                    <div className="mt-3 d-grid">
                        <a href={`/movie/${movie.id}`} className="btn btn-sm" style={{
                            background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            fontSize: '0.85rem'
                        }}>
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );

    // Section component for movie categories
    const MovieSection = ({ title, movieList }) => {
        // Don't render empty sections
        if (!movieList || movieList.length === 0) {
            return null;
        }
        
        return (
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 style={{
                        background: 'linear-gradient(to right, #fff, #a2c4e0)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        fontWeight: '600',
                        fontSize: '1.5rem'
                    }}>
                        {title}
                    </h3>
                    {movieList.length > 4 && (
                        <a 
                            href="#" 
                            onClick={(e) => {
                                e.preventDefault();
                                handleViewAllGenre(title);
                            }}
                            style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '0.9rem',
                                textDecoration: 'none'
                            }}
                        >
                            View All
                        </a>
                    )}
                </div>
                <div className="row">
                    {movieList.slice(0, 4).map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        );
    };

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

    return (
        <div className="min-vh-100" style={{
            background: 'linear-gradient(135deg, #000000 0%, #0C1821 25%, #1B2A41 50%, #324A5F 75%, #324A5F 100%)',
            backgroundAttachment: 'fixed',
            color: 'white'
        }}>
            <Navbar username={username} onLogout={handleLogout} />
            
            <main className="container py-5">
                <div className="row mb-5">
                    <div className="col-12 text-center">
                        <h1 style={{
                            background: 'linear-gradient(to right, #fff, #a2c4e0)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            fontWeight: '600',
                            fontSize: '2.5rem',
                            marginBottom: '1rem',
                            textShadow: '0 0 20px rgba(12, 24, 33, 0.5)'
                        }}>Nepali Movies AI Recommendation</h1>
                        <p className="lead" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            Discover Nepali movies based on your preferences
                        </p>
                    </div>
                </div>
                
                <div className="row mb-5">
                    <div className="col-12 col-md-8 offset-md-2">
                        <div className="card" style={{
                            background: 'rgba(12, 24, 33, 0.3)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '16px',
                            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
                            border: '1px solid rgba(50, 74, 95, 0.2)',
                        }}>
                            <div className="card-body p-4">
                                <h3 className="card-title mb-4" style={{
                                    background: 'linear-gradient(to right, #fff, #a2c4e0)',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text',
                                    color: 'transparent',
                                    fontWeight: '600'
                                }}>Search for Movies</h3>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        placeholder="Enter movie title or genre"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.15)',
                                            border: 'none',
                                            borderRadius: '8px 0 0 8px',
                                            padding: '0.8rem 1rem',
                                            color: 'white',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            backdropFilter: 'blur(5px)'
                                        }}
                                    />
                                    <button 
                                        className="btn"
                                        type="button"
                                        onClick={handleSearchSubmit}
                                        style={{
                                            background: 'linear-gradient(135deg, #1B2A41 0%, #324A5F 100%)',
                                            color: 'white',
                                            borderRadius: '0 8px 8px 0',
                                            padding: '0.8rem 1.5rem',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            border: 'none'
                                        }}
                                    >
                                        Search
                                    </button>
                                </div>
                                
                                <p className="mt-3 mb-0 text-center" style={{ 
                                    fontSize: '0.9rem', 
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }}>
                                    Or use the AI assistant in the bottom right corner for more advanced searches.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* AI Results Banner */}
                {aiResults && (
                    <div className="row mb-4">
                        <div className="col-12">
                            <div style={{
                                background: 'rgba(50, 74, 95, 0.3)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '12px',
                                padding: '15px 20px',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                                border: '1px solid rgba(50, 74, 95, 0.3)',
                                animation: 'fadeInDown 0.5s ease-out'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '10px'
                                }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #324A5F 0%, #1B2A41 100%)',
                                        borderRadius: '50%',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.5 14.5L11.5 12.5L13.5 14.5L16.5 11.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M16.5 11.5H13.5V8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <h5 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>AI Search Results</h5>
                                </div>
                                
                                <p style={{ 
                                    margin: '0 0 10px', 
                                    padding: '0 0 0 42px',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.5'
                                }}>
                                    {aiResults.explanation || "Here are some movies that match your search."}
                                </p>
                                
                                {aiResults.search_parameters && (
                                    <div style={{
                                        margin: '15px 0 5px 42px',
                                        padding: '12px 15px',
                                        background: 'rgba(12, 24, 33, 0.5)',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontFamily: 'monospace'
                                    }}>
                                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                            {JSON.stringify(aiResults.search_parameters, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Show regular dashboard with genre-based sections when not searching */}
                {!searchQuery && !aiResults ? (
                    selectedGenre ? (
                        // Genre specific view
                        <div className={`genre-view ${animating ? 'fade-out' : 'fade-in'}`}>
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h2 style={{
                                        background: 'linear-gradient(to right, #fff, #a2c4e0)',
                                        WebkitBackgroundClip: 'text',
                                        backgroundClip: 'text',
                                        color: 'transparent',
                                        fontWeight: '600',
                                        fontSize: '2rem'
                                    }}>
                                        {selectedGenre === "Highest Rated Movies" ? selectedGenre : `${selectedGenre} Movies`}
                                    </h2>
                                    <button 
                                        onClick={handleBackToHome}
                                        className="btn btn-sm back-button"
                                        style={{
                                            background: 'rgba(50, 74, 95, 0.3)',
                                            color: 'white',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            borderRadius: '8px',
                                            padding: '0.5rem 1rem',
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Back to Home
                                    </button>
                                </div>
                                <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '1.5rem 0' }} />
                            </div>
                            <div className="row movie-grid">
                                {selectedGenre === "Highest Rated Movies" ? (
                                    highestRatedMovies.map(movie => (
                                        <MovieCard key={movie.id} movie={movie} />
                                    ))
                                ) : (
                                    (moviesByGenre[selectedGenre] || []).map(movie => (
                                        <MovieCard key={movie.id} movie={movie} />
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        // Regular home view with genres
                        <div className={`home-view ${animating ? 'fade-out' : 'fade-in'}`}>
                            {/* Highest Rated Movies Section */}
                            <MovieSection title="Highest Rated Movies" movieList={highestRatedMovies} />
                            
                            {/* Genre-based Sections */}
                            {genres.map(genre => (
                                <MovieSection 
                                    key={genre} 
                                    title={genre} 
                                    movieList={moviesByGenre[genre] || []} 
                                />
                            ))}
                        </div>
                    )
                ) : (
                    // Search Results
                    <div className="row">
                        <div className="col-12 mb-4">
                            <h3 style={{
                                background: 'linear-gradient(to right, #fff, #a2c4e0)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                fontWeight: '600',
                                fontSize: '1.5rem'
                            }}>
                                Search Results
                            </h3>
                        </div>
                        
                        {filteredMovies.length > 0 ? (
                            filteredMovies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <div className="alert" style={{
                                    background: 'rgba(12, 24, 33, 0.4)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                                    border: '1px solid rgba(50, 74, 95, 0.2)',
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }}>
                                    No movies found matching your search.
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
            
            <footer className="py-4 mt-5" style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(50, 74, 95, 0.2)'
            }}>
                <div className="container text-center">
                    <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        &copy; {new Date().getFullYear()} NepalAI Movie. All rights reserved. Created by Sujal.
                    </p>
                </div>
            </footer>
            
            {/* AI Chat Component */}
            <ChatBox onResultsReceived={handleAiResults} />
            
            {/* Add animations */}
            <style jsx="true">{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                
                @keyframes slideIn {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .fade-in {
                    animation: fadeIn 0.4s ease forwards;
                }
                
                .fade-out {
                    animation: fadeOut 0.3s ease forwards;
                }
                
                .movie-grid > div {
                    opacity: 0;
                    animation: slideIn 0.6s ease forwards;
                }
                
                /* Ensure consistent width during and after animations */
                .movie-grid, .genre-view, .home-view {
                    width: 100%;
                }
                
                /* Fix for maintaining card widths */
                .col-md-3 {
                    flex: 0 0 25%;
                    max-width: 25%;
                }
                
                @media (max-width: 992px) {
                    .col-md-3 {
                        flex: 0 0 33.333%;
                        max-width: 33.333%;
                    }
                }
                
                @media (max-width: 768px) {
                    .col-md-3 {
                        flex: 0 0 50%;
                        max-width: 50%;
                    }
                }
                
                @media (max-width: 576px) {
                    .col-md-3 {
                        flex: 0 0 100%;
                        max-width: 100%;
                    }
                }
                
                /* Fix row containing the cards */
                .row {
                    display: flex;
                    flex-wrap: wrap;
                    margin-right: -15px;
                    margin-left: -15px;
                    width: 100%;
                }
                
                .movie-grid > div:nth-child(1) { animation-delay: 0.1s; }
                .movie-grid > div:nth-child(2) { animation-delay: 0.15s; }
                .movie-grid > div:nth-child(3) { animation-delay: 0.2s; }
                .movie-grid > div:nth-child(4) { animation-delay: 0.25s; }
                .movie-grid > div:nth-child(5) { animation-delay: 0.3s; }
                .movie-grid > div:nth-child(6) { animation-delay: 0.35s; }
                .movie-grid > div:nth-child(7) { animation-delay: 0.4s; }
                .movie-grid > div:nth-child(8) { animation-delay: 0.45s; }
                .movie-grid > div:nth-child(n+9) { animation-delay: 0.5s; }
                
                .back-button:hover {
                    background: rgba(50, 74, 95, 0.5) !important;
                    transform: translateX(-5px);
                }
            `}</style>
        </div>
    );
}

export default Home;