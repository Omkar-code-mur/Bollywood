/** @format */

import React, { useState, useEffect } from "react";

// Fetching movie data from SQLite database via Node.js backend
const BollywoodGame = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [guessesLeft, setGuessesLeft] = useState(9);

  const [userGuesses, setUserGuesses] = useState({
    movie_name: "",
    song_name: "",
    actor: "",
    actress: "",
  });

  const [correctGuesses, setCorrectGuesses] = useState({
    movie_name: false,
    song_name: false,
    actor: false,
    actress: false,
  });

  // 🎯 Initialize score from localStorage
  const [score, setScore] = useState(() => {
    return parseInt(localStorage.getItem("score")) || 0;
  });

  // 🎯 Track used movies (IDs) in localStorage
  const [usedMovies, setUsedMovies] = useState(() => {
    return JSON.parse(localStorage.getItem("usedMovies")) || [];
  });

  // Fetch movie data
  useEffect(() => {
    fetch("https://bollywood-backend.onrender.com/movies")
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);

        // After fetching movies, decide which movie to start with
        let lastMovieId = localStorage.getItem("lastMovieId");

        // If we have a last movie and it is not used completely yet
        if (
          lastMovieId &&
          !JSON.parse(localStorage.getItem("usedMovies") || "[]").includes(
            parseInt(lastMovieId)
          )
        ) {
          const index = data.findIndex((m) => m.id === parseInt(lastMovieId));
          if (index !== -1) {
            setCurrentIndex(index);
            return;
          }
        }

        // Otherwise, pick a fresh movie that is not in usedMovies
        const availableMovies = data.filter((m) => !usedMovies.includes(m.id));
        if (availableMovies.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * availableMovies.length
          );
          const nextMovie = availableMovies[randomIndex];
          const nextIndex = data.findIndex((m) => m.id === nextMovie.id);
          setCurrentIndex(nextIndex);
          localStorage.setItem("lastMovieId", nextMovie.id);
        }
      })
      .catch((error) => console.error("Error fetching movie data:", error));
  }, []);

  const currentMovie = currentIndex !== null ? movies[currentIndex] : {};

  // 🎯 Guess Handling
  const handleGuess = (category) => {
    if (guessesLeft === 0) return;

    const guess = userGuesses[category].trim().toLowerCase();
    const correctAnswer = currentMovie[category]?.toLowerCase();

    if (guess === correctAnswer) {
      setCorrectGuesses({ ...correctGuesses, [category]: true });

      if (!correctGuesses[category]) {
        const newScore = score + 1;
        setScore(newScore);
        localStorage.setItem("score", newScore);
      }
    } else {
      setGuessesLeft(guessesLeft - 1);
    }
  };

  // 🎯 Pick next movie (skip used ones)
  const handleNext = () => {
    setShowHint(false);
    setGuessesLeft(9);
    setUserGuesses({ movie_name: "", song_name: "", actor: "", actress: "" });
    setCorrectGuesses({
      movie_name: false,
      song_name: false,
      actor: false,
      actress: false,
    });

    if (!currentMovie.id) return;

    // Save current movie to used list
    const updatedUsed = [...usedMovies, currentMovie.id];
    setUsedMovies(updatedUsed);
    localStorage.setItem("usedMovies", JSON.stringify(updatedUsed));

    // Filter available movies
    const availableMovies = movies.filter((m) => !updatedUsed.includes(m.id));

    if (availableMovies.length === 0) {
      // 🎉 Reset if all movies are used
      alert("All movies completed! Starting fresh round.");
      setUsedMovies([]);
      localStorage.removeItem("usedMovies");
      localStorage.removeItem("lastMovieId");
      setCurrentIndex(0);
    } else {
      // Pick next random movie from unused ones
      const randomIndex = Math.floor(Math.random() * availableMovies.length);
      const nextMovie = availableMovies[randomIndex];
      const nextIndex = movies.findIndex((m) => m.id === nextMovie.id);
      setCurrentIndex(nextIndex);

      // Save last movie ID to localStorage
      localStorage.setItem("lastMovieId", nextMovie.id);
    }
  };

  if (!currentMovie.id) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>🎬 Bollywood Guessing Game</h1>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.cell}>
                <strong>Movie</strong>
                <br />
                {correctGuesses.movie_name ? (
                  <span style={styles.correct}>
                    {currentMovie.movie_letter}
                  </span>
                ) : (
                  <span
                    style={styles.letter}
                    onClick={() => handleGuess("movie_name")}>
                    {currentMovie.movie_letter}
                  </span>
                )}
              </td>
              <td style={styles.cell}>
                <strong>Song</strong>
                <br />
                {correctGuesses.song_name ? (
                  <span style={styles.correct}>{currentMovie.song_letter}</span>
                ) : (
                  <span
                    style={styles.letter}
                    onClick={() => handleGuess("song_name")}>
                    {currentMovie.song_letter}
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td style={styles.cell}>
                <strong>Actor</strong>
                <br />
                {correctGuesses.actor ? (
                  <span style={styles.correct}>
                    {currentMovie.actor_letter}
                  </span>
                ) : (
                  <span
                    style={styles.letter}
                    onClick={() => handleGuess("actor")}>
                    {currentMovie.actor_letter}
                  </span>
                )}
              </td>
              <td style={styles.cell}>
                <strong>Actress</strong>
                <br />
                {correctGuesses.actress ? (
                  <span style={styles.correct}>
                    {currentMovie.actress_letter}
                  </span>
                ) : (
                  <span
                    style={styles.letter}
                    onClick={() => handleGuess("actress")}>
                    {currentMovie.actress_letter}
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={styles.guessesLeft}>
        <p>
          <strong>Guesses Left:</strong> {guessesLeft}
        </p>
        <p>
          <strong>Score:</strong> {score}
        </p>
      </div>

      {/* Input Fields for User's Guess */}
      <div style={styles.inputFields}>
        <div>
          <input
            type='text'
            value={userGuesses.movie_name}
            onChange={(e) =>
              setUserGuesses({ ...userGuesses, movie_name: e.target.value })
            }
            placeholder='Guess Movie'
            style={styles.input}
          />
          <button
            onClick={() => handleGuess("movie_name")}
            style={styles.inputButton}>
            Guess
          </button>
        </div>
        <div>
          <input
            type='text'
            value={userGuesses.song_name}
            onChange={(e) =>
              setUserGuesses({ ...userGuesses, song_name: e.target.value })
            }
            placeholder='Guess Song'
            style={styles.input}
          />
          <button
            onClick={() => handleGuess("song_name")}
            style={styles.inputButton}>
            Guess
          </button>
        </div>
        <div>
          <input
            type='text'
            value={userGuesses.actor}
            onChange={(e) =>
              setUserGuesses({ ...userGuesses, actor: e.target.value })
            }
            placeholder='Guess Actor'
            style={styles.input}
          />
          <button
            onClick={() => handleGuess("actor")}
            style={styles.inputButton}>
            Guess
          </button>
        </div>
        <div>
          <input
            type='text'
            value={userGuesses.actress}
            onChange={(e) =>
              setUserGuesses({ ...userGuesses, actress: e.target.value })
            }
            placeholder='Guess Actress'
            style={styles.input}
          />
          <button
            onClick={() => handleGuess("actress")}
            style={styles.inputButton}>
            Guess
          </button>
        </div>
      </div>

      <div style={styles.buttons}>
        <button onClick={() => setShowHint(!showHint)} style={styles.button}>
          {showHint ? "Hide Hint" : "Show Hint"}
        </button>
        <button onClick={handleNext} style={styles.button}>
          Next Movie
        </button>
      </div>

      {showHint && (
        <div style={styles.hintContainer}>
          <p>
            <strong>Hint:</strong>
          </p>
          <p>Genre: {currentMovie.genre}</p>
          <p>Release Year: {currentMovie.release_year}</p>
        </div>
      )}
      {(guessesLeft === 0 || showHint) && (
        <div style={styles.hintContainer}>
          <p>
            <strong>Correct Answers:</strong>
          </p>
          <p>Movie: {currentMovie.movie_name}</p>
          <p>Song: {currentMovie.song_name}</p>
          <p>Actor: {currentMovie.actor}</p>
          <p>Actress: {currentMovie.actress}</p>
          <p>Genre: {currentMovie.genre}</p>
          <p>Release Year: {currentMovie.release_year}</p>
        </div>
      )}
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
  tableContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "2rem",
  },
  table: {
    borderCollapse: "collapse",
  },
  cell: {
    width: "150px",
    height: "150px",
    border: "1px solid #ccc",
    padding: "20px",
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#4CAF50",
    color: "white",
    borderRadius: "10px",
    boxSizing: "border-box",
  },
  letter: {
    cursor: "pointer",
  },
  correct: {
    color: "green",
  },
  guessesLeft: {
    marginTop: "1rem",
  },
  hintContainer: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    color: "#555",
    marginTop: "1rem",
  },
  buttons: {
    marginTop: "1rem",
  },
  button: {
    padding: "0.5rem 2rem",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    margin: "0 0.5rem",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default BollywoodGame;
