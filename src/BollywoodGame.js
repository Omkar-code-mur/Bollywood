/** @format */

import React, { useState, useEffect } from "react";

// Fetching movie data from SQLite database via Node.js backend
const BollywoodGame = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [guessesLeft, setGuessesLeft] = useState(9);
  const [userGuesses, setUserGuesses] = useState({
    movie: "",
    song: "",
    actor: "",
    actress: "",
  });
  const [correctGuesses, setCorrectGuesses] = useState({
    movie: false,
    song: false,
    actor: false,
    actress: false,
  });

  // Fetch movie data from backend (SQLite via Node.js API)
  useEffect(() => {
    fetch("http://localhost:5000/movies")
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movie data:", error));
  }, []);

  const currentMovie = movies[currentIndex] || {};

  const handleGuess = (category) => {
    if (guessesLeft === 0) return; // No more guesses allowed

    const guess = userGuesses[category].trim().toLowerCase();
    const correctAnswer = currentMovie[category]?.toLowerCase();

    if (guess === correctAnswer) {
      setCorrectGuesses({ ...correctGuesses, [category]: true });
    } else {
      setGuessesLeft(guessesLeft - 1);
    }
  };

  const handleNext = () => {
    setShowHint(false);
    setGuessesLeft(9); // Reset guesses for next round
    setUserGuesses({ movie: "", song: "", actor: "", actress: "" });
    setCorrectGuesses({
      movie: false,
      song: false,
      actor: false,
      actress: false,
    });
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

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
                {correctGuesses.movie ? (
                  <span style={styles.correct}>
                    {currentMovie.movie_letter}
                  </span>
                ) : (
                  <span
                    style={styles.letter}
                    onClick={() => handleGuess("movie")}>
                    {currentMovie.movie_letter}
                  </span>
                )}
              </td>
              <td style={styles.cell}>
                <strong>Song</strong>
                <br />
                {correctGuesses.song ? (
                  <span style={styles.correct}>{currentMovie.song_letter}</span>
                ) : (
                  <span
                    style={styles.letter}
                    onClick={() => handleGuess("song")}>
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
      </div>

      {/* Input Fields for User's Guess */}
      <div style={styles.inputFields}>
        <div>
          <input
            type='text'
            value={userGuesses.movie}
            onChange={(e) =>
              setUserGuesses({ ...userGuesses, movie: e.target.value })
            }
            placeholder='Guess Movie'
            style={styles.input}
          />
          <button
            onClick={() => handleGuess("movie")}
            style={styles.inputButton}>
            Guess
          </button>
        </div>
        <div>
          <input
            type='text'
            value={userGuesses.song}
            onChange={(e) =>
              setUserGuesses({ ...userGuesses, song: e.target.value })
            }
            placeholder='Guess Song'
            style={styles.input}
          />
          <button
            onClick={() => handleGuess("song")}
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
          <p>Release Year: {currentMovie.releaseYear}</p>
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
    borderCollapse: "collapse", // Ensures internal borders are present
  },
  cell: {
    width: "150px",
    height: "150px",
    border: "1px solid #ccc", // Internal border
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
