/** @format */

import React, { useState } from "react";

const MovieForm = () => {
  // State to hold movie data input by the user
  const [movieData, setMovieData] = useState({
    movie_name: "",
    release_year: "",
    genre: "",
    actor: "",
    actress: "",
    song_name: "",
    movie_letter: "",
    song_letter: "",
    actor_letter: "",
    actress_letter: "",
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieData({
      ...movieData,
      [name]: value,
    });
  };

  // Submit data to backend (Node.js server with SQLite)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send POST request to backend
    const response = await fetch("http://localhost:5000/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieData),
    });

    if (response.ok) {
      alert("Movie added successfully!");
      // Clear the form
      setMovieData({
        movie_name: "",
        release_year: "",
        genre: "",
        actor: "",
        actress: "",
        song_name: "",
        movie_letter: "",
        song_letter: "",
        actor_letter: "",
        actress_letter: "",
      });
    } else {
      alert("Error adding movie.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Add a New Movie</h2>
      <form onSubmit={handleSubmit}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Movie Name</th>
              <th>Release Year</th>
              <th>Genre</th>
              <th>Actor</th>
              <th>Actress</th>
              <th>Song Name</th>
              <th>Movie Letter</th>
              <th>Song Letter</th>
              <th>Actor Letter</th>
              <th>Actress Letter</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type='text'
                  name='movie_name'
                  value={movieData.movie_name}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </td>
              <td>
                <input
                  type='number'
                  name='release_year'
                  value={movieData.release_year}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </td>
              <td>
                <input
                  type='text'
                  name='genre'
                  value={movieData.genre}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </td>
              <td>
                <input
                  type='text'
                  name='actor'
                  value={movieData.actor}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </td>
              <td>
                <input
                  type='text'
                  name='actress'
                  value={movieData.actress}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </td>
              <td>
                <input
                  type='text'
                  name='song_name'
                  value={movieData.song_name}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </td>
              <td>
                <input
                  type='text'
                  name='movie_letter'
                  value={movieData.movie_letter}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </td>
              <td>
                <input
                  type='text'
                  name='song_letter'
                  value={movieData.song_letter}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </td>
              <td>
                <input
                  type='text'
                  name='actor_letter'
                  value={movieData.actor_letter}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </td>
              <td>
                <input
                  type='text'
                  name='actress_letter'
                  value={movieData.actress_letter}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type='submit' style={styles.submitButton}>
          Add Movie
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    backgroundColor: "#f0f0f0",
    minHeight: "100vh",
  },
  table: {
    margin: "20px auto",
    borderCollapse: "collapse",
    width: "90%",
  },
  input: {
    padding: "8px",
    fontSize: "1rem",
    width: "150px",
    margin: "5px",
    borderRadius: "5px",
  },
  submitButton: {
    padding: "0.5rem 2rem",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginTop: "20px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default MovieForm;
