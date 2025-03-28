import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// OMDb API Key
const API_KEY = '7579fb49'; 

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle search term input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Fetch movie data from OMDb API
  const fetchMovies = async () => {
    if (searchTerm.trim() === '') return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://www.omdbapi.com/?s=${searchTerm}&apikey=${API_KEY}`);
      if (response.data.Response === "True") {
        setMovies(response.data.Search);
      } else {
        setMovies([]);
        setError(response.data.Error);
      }
    } catch (err) {
      setError('Failed to fetch movies');
    }
    setLoading(false);
  };

  // Show movie details when clicked
  const handleMovieClick = async (movieId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}`);
      setSelectedMovie(response.data);
    } catch (err) {
      setError('Failed to fetch movie details');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Movie Search App</h1>
      <div>
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={fetchMovies}>Search</button>
      </div>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {selectedMovie ? (
        <div className="movie-detail">
          <h2>{selectedMovie.Title}</h2>
          <p>{selectedMovie.Plot}</p>
          <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
          <p><strong>Year:</strong> {selectedMovie.Year}</p>
          <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
          <button onClick={() => setSelectedMovie(null)}>Back to Search</button>
        </div>
      ) : (
        <div className="movie-list">
          {movies.map((movie) => (
            <div className="movie-item" key={movie.imdbID} onClick={() => handleMovieClick(movie.imdbID)}>
              <img src={movie.Poster} alt={movie.Title} />
              <h3>{movie.Title}</h3>
              <p>{movie.Year}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
