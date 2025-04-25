import {useState, useEffect, useRef} from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

function Form({ method, route }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    // Search and selection state
    const [genres, setGenres] = useState([]);
    const [movies, setMovies] = useState([]);
    const [favoriteGenre, setFavoriteGenre] = useState('');
    const [favoriteMovie, setFavoriteMovie] = useState('');
    
    // Search input state
    const [genreSearch, setGenreSearch] = useState('');
    const [movieSearch, setMovieSearch] = useState('');
    
    // Dropdown states
    const [showGenreDropdown, setShowGenreDropdown] = useState(false);
    const [showMovieDropdown, setShowMovieDropdown] = useState(false);
    
    // Search results
    const [genreResults, setGenreResults] = useState([]);
    const [movieResults, setMovieResults] = useState([]);
    
    // Refs for click outside handling
    const genreRef = useRef(null);
    const movieRef = useRef(null);
    
    const navigate = useNavigate();
    const name = method === 'login' ? 'Login' : 'Register';
    
    useEffect(() => {
        // Fetch genres and popular movies for registration
        if (method === 'register') {
            const fetchOptions = async () => {
                try {
                    const response = await api.get('/register/options/');
                    setGenres(response.data.genres);
                    setMovies(response.data.popular_movies);
                } catch (error) {
                    console.error('Error fetching registration options:', error);
                }
            };
            
            fetchOptions();
        }
    }, [method]);
    
    // Handle clicks outside of the dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (genreRef.current && !genreRef.current.contains(event.target)) {
                setShowGenreDropdown(false);
            }
            if (movieRef.current && !movieRef.current.contains(event.target)) {
                setShowMovieDropdown(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    // Search for genres
    const searchGenres = async (query, setResults) => {
        if (query.length < 2) {
            setResults([]);
            return;
        }
        
        try {
            const response = await api.get(`/register/search/?q=${query}&type=genre`);
            setResults(response.data.genres);
        } catch (error) {
            console.error('Error searching genres:', error);
        }
    };
    
    // Search for movies
    const searchMovies = async (query, setResults) => {
        if (query.length < 2) {
            setResults([]);
            return;
        }
        
        try {
            const response = await api.get(`/register/search/?q=${query}&type=movie`);
            setResults(response.data.movies);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    };
    
    // Handle search input changes with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (genreSearch) searchGenres(genreSearch, setGenreResults);
        }, 300);
        return () => clearTimeout(timer);
    }, [genreSearch]);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (movieSearch) searchMovies(movieSearch, setMovieResults);
        }, 300);
        return () => clearTimeout(timer);
    }, [movieSearch]);
    
    const handleSubmit = async (e) => {
        setLoading(true);
        setErrors({});
        e.preventDefault();

        try {
            const userData = { username, password };
            
            // Add favorite genre and movie for registration
            if (method === 'register') {
                if (favoriteGenre) userData.favorite_genre = favoriteGenre;
                if (favoriteMovie) userData.favorite_movie_id = parseInt(favoriteMovie);
            }
            
            const response = await api.post(route, userData);
            
            if (method === 'login') {
                sessionStorage.setItem(ACCESS_TOKEN, response.data.access);
                sessionStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                localStorage.setItem('token', response.data.access); // Add localStorage for consistency with App.jsx
                navigate('/home'); // Change this to /home instead of /
            } else {
                navigate('/login');
                alert('Registration successful. Please login.');
            }
        }
        catch (error) {
            console.error('Error during authentication', error);
            setLoading(false);
            
            if (error.response && error.response.data) {
                setErrors(error.response.data);
                // Display a more specific error message
                const errorMessage = Object.values(error.response.data)
                    .flat()
                    .join('\n');
                alert(errorMessage || 'Invalid credentials');
            } else {
                alert('An error occurred. Please try again.');
            }
        }
        finally {
            setLoading(false);
        }
    };
    
    // Handle selection of a genre or movie
    const selectGenre = (genre, setter, searchSetter, dropdownSetter) => {
        setter(genre);
        searchSetter(genre);
        dropdownSetter(false);
    };
    
    const selectMovie = (movie, setter, searchSetter, dropdownSetter) => {
        setter(movie.id.toString());
        searchSetter(movie.title);
        dropdownSetter(false);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow border-0">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">{name}</h2>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                        id="username"
                                        placeholder="Enter your username" 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)} 
                                        required 
                                    />
                                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input 
                                        type="password" 
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        placeholder="Enter your password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                </div>

                                {method === 'register' && (
                                    <>
                                        <h5 className="mt-4 mb-3">Your Preferences</h5>
                                        
                                        {/* Favorite Genre Search */}
                                        <div className="mb-3">
                                            <label htmlFor="genre" className="form-label">Favorite Genre</label>
                                            <div className="position-relative" ref={genreRef}>
                                                <input 
                                                    type="text"
                                                    className="form-control"
                                                    id="genre"
                                                    value={genreSearch}
                                                    onChange={(e) => {
                                                        setGenreSearch(e.target.value);
                                                        setShowGenreDropdown(true);
                                                    }}
                                                    onFocus={() => setShowGenreDropdown(true)}
                                                    placeholder="Search for a genre..."
                                                />
                                                {showGenreDropdown && (
                                                    <div className="position-absolute top-100 start-0 w-100 mt-1 border rounded bg-white shadow z-3" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                                        {genreResults.length > 0 ? (
                                                            genreResults.map((genre, index) => (
                                                                <button 
                                                                    key={index} 
                                                                    type="button"
                                                                    className="dropdown-item py-2 px-3 text-start w-100"
                                                                    onClick={() => selectGenre(genre, setFavoriteGenre, setGenreSearch, setShowGenreDropdown)}
                                                                >
                                                                    {genre}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="py-2 px-3 text-muted">
                                                                {genreSearch.length < 2 ? "Type at least 2 characters" : "No genres found"}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Favorite Movie Search */}
                                        <div className="mb-3">
                                            <label htmlFor="movie" className="form-label">Favorite Movie</label>
                                            <div className="position-relative" ref={movieRef}>
                                                <input 
                                                    type="text"
                                                    className="form-control"
                                                    id="movie"
                                                    value={movieSearch}
                                                    onChange={(e) => {
                                                        setMovieSearch(e.target.value);
                                                        setShowMovieDropdown(true);
                                                    }}
                                                    onFocus={() => setShowMovieDropdown(true)}
                                                    placeholder="Search for a movie..."
                                                />
                                                {showMovieDropdown && (
                                                    <div className="position-absolute top-100 start-0 w-100 mt-1 border rounded bg-white shadow z-3" style={{maxHeight: '200px', overflowY: 'auto'}}>
                                                        {movieResults.length > 0 ? (
                                                            movieResults.map((movie) => (
                                                                <button 
                                                                    key={movie.id} 
                                                                    type="button"
                                                                    className="dropdown-item py-2 px-3 text-start w-100"
                                                                    onClick={() => selectMovie(movie, setFavoriteMovie, setMovieSearch, setShowMovieDropdown)}
                                                                >
                                                                    {movie.title} {movie.year ? `(${movie.year})` : ''}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="py-2 px-3 text-muted">
                                                                {movieSearch.length < 2 ? "Type at least 2 characters" : "No movies found"}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                                
                                <div className="d-grid mt-4">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Loading...
                                            </>
                                        ) : name}
                                    </button>
                                </div>
                                
                                <div className="text-center mt-3">
                                    {method === 'login' ? (
                                        <p className="mb-0">Don't have an account? <a href="/register" className="text-primary">Register</a></p>
                                    ) : (
                                        <p className="mb-0">Already have an account? <a href="/login" className="text-primary">Login</a></p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Form;