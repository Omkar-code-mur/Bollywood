/** @format */
import React, { useState, useEffect } from "react";
import "./BollywoodGame.css";

const BollywoodGame = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [input, setInput] = useState("");
  // Load state from localStorage
  const [wrongGuesses, setWrongGuesses] = useState(() => {
    return parseInt(localStorage.getItem("wrongGuesses")) || 0;
  });

  const [showHint, setShowHint] = useState(false);

  // ✅ Track used movies
  const [usedMovies, setUsedMovies] = useState(
    JSON.parse(localStorage.getItem("usedMovies") || "[]")
  );

  // ✅ Track score from localStorage
  const [score, setScore] = useState(() => {
    return parseInt(localStorage.getItem("score")) || 0;
  });

  const [correctGuesses, setCorrectGuesses] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("correctGuesses")) || {
        actor: false,
        actress: false,
        movie_name: false,
        song_name: false,
      }
    );
  });
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null; // { userId, username }
  });

  useEffect(() => {
    if (!user) {
      const alreadyAsked = localStorage.getItem("askedUsername");
      if (alreadyAsked) return; // ✅ prevent asking twice

      debugger;
      const name = prompt("Enter your username:");
      if (name) {
        const newUser = { username: name };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("askedUsername", "true"); // ✅ mark asked

        fetch("http://localhost:5000/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: name, score: score }),
        })
          .then(async (res) => {
            if (!res.ok) {
              const error = await res.json();
              alert(error.error); // ⚡ Show "Username already taken"
              throw new Error(error.error);
            }
            return res.json();
          })
          .then((data) => {
            const userWithId = { username: name, userId: data.userId };
            setUser(userWithId);
            localStorage.setItem("user", JSON.stringify(userWithId));
          })
          .catch((err) => console.error(err));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateBackendScore = (newScore) => {
    if (!user) return;
    // fetch("https://bollywood-backend.onrender.com/update-score", {

    fetch("http://localhost:5000/update-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.userId, score: newScore }),
    })
      .then((res) => res.text())
      .then((msg) => console.log(msg))
      .catch((err) => console.error("Error updating score:", err));
  };

  const maxGuesses = 9; // BOLLYWOOD has 9 letters

  // 🔹 Normalize strings
  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, "")
      .replace(/\s+/g, " ")
      .trim();

  // 🔹 Levenshtein distance
  const levenshtein = (a, b) => {
    const m = a.length,
      n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
        else
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  };

  // 🔹 Fuzzy comparison
  const isCloseMatch = (guess, answer) => {
    const g = normalize(guess);
    const a = normalize(answer);
    if (!g || !a) return false;
    if (g === a) return true;
    return levenshtein(g, a) <= 2; // allow 2 typos
  };

  // 🔹 Fetch movie data
  useEffect(() => {
    fetch("http://localhost:5000/movies")
      // fetch("https://bollywood-backend.onrender.com/movies")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);

        let lastMovieId = localStorage.getItem("lastMovieId");

        // ✅ Continue with last unfinished movie
        if (lastMovieId && !usedMovies.includes(parseInt(lastMovieId))) {
          const index = data.findIndex((m) => m.id === parseInt(lastMovieId));
          if (index !== -1) {
            setCurrentIndex(index);
            return;
          }
        }

        // ✅ Otherwise, pick a fresh random movie
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
  }, [usedMovies]);

  if (!movies.length) return <div className='loading'>Loading movies...</div>;
  if (currentIndex === null)
    return <div className='loading'>🎉 No more movies left!</div>;

  const currentMovie = movies[currentIndex];

  // 🔹 Handle Guess
  const handleGuess = (e) => {
    e.preventDefault();
    const guess = input.trim();
    if (!guess) return;

    let isCorrect = false;
    const updated = { ...correctGuesses };

    if (!updated.actor && isCloseMatch(guess, currentMovie.actor)) {
      updated.actor = true;
      isCorrect = true;
      updateScore();
    }
    if (!updated.actress && isCloseMatch(guess, currentMovie.actress)) {
      updated.actress = true;
      isCorrect = true;
      updateScore();
    }
    if (!updated.movie_name && isCloseMatch(guess, currentMovie.movie_name)) {
      updated.movie_name = true;
      isCorrect = true;
      updateScore();
    }
    if (!updated.song_name && isCloseMatch(guess, currentMovie.song_name)) {
      updated.song_name = true;
      isCorrect = true;
      updateScore();
    }

    if (!isCorrect) {
      setWrongGuesses((prev) => {
        const newVal = Math.min(prev + 1, maxGuesses);
        localStorage.setItem("wrongGuesses", newVal);
        return newVal;
      });
    }

    setCorrectGuesses(updated);
    localStorage.setItem("correctGuesses", JSON.stringify(updated));

    setInput("");
  };

  // ✅ Update score
  const updateScore = () => {
    const newScore = score + 1;
    setScore(newScore);
    localStorage.setItem("score", newScore);
    updateBackendScore(newScore); // Update backend whenever score changes
  };

  const handleNext = () => {
    const currentMovieId = currentMovie.id;

    // ✅ Track used movies
    const updatedUsedMovies = [...usedMovies, currentMovieId];
    setUsedMovies(updatedUsedMovies);
    localStorage.setItem("usedMovies", JSON.stringify(updatedUsedMovies));

    // ✅ Reset progress for next movie
    setWrongGuesses(0);
    setCorrectGuesses({
      actor: false,
      actress: false,
      movie_name: false,
      song_name: false,
    });
    localStorage.setItem("wrongGuesses", "0");
    localStorage.setItem(
      "correctGuesses",
      JSON.stringify({
        actor: false,
        actress: false,
        movie_name: false,
        song_name: false,
      })
    );

    // ✅ Select next movie
    const availableMovies = movies.filter(
      (m) => !updatedUsedMovies.includes(m.id)
    );
    if (availableMovies.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableMovies.length);
      const nextMovie = availableMovies[randomIndex];
      const nextIndex = movies.findIndex((m) => m.id === nextMovie.id);
      setCurrentIndex(nextIndex);
      localStorage.setItem("lastMovieId", nextMovie.id);
    } else {
      setCurrentIndex(null);
      localStorage.removeItem("lastMovieId");
    }

    setInput("");
    setShowHint(false);
  };

  const gameOver = wrongGuesses >= maxGuesses;
  const allGuessed =
    correctGuesses.actor &&
    correctGuesses.actress &&
    correctGuesses.movie_name &&
    correctGuesses.song_name;

  return (
    <>
      <div className='header'>
        {user && <div className='user-display'>👤 {user.username}</div>}
      </div>

      <div className='game-container'>
        <h1 className='title'>🎬 Bollywood Game</h1>

        {/* Bollywood Strike Status */}
        <div className='bollywood-status'>
          {"BOLLYWOOD".split("").map((letter, index) => (
            <span key={index} className={index < wrongGuesses ? "crossed" : ""}>
              {letter}
            </span>
          ))}
        </div>

        {/* ✅ Score */}
        <div className='score-box'>
          <strong>Score:</strong> {score}
        </div>

        {/* Clues Table */}
        <div className={`card ${allGuessed ? "card-success" : ""}`}>
          <table className='table'>
            <tbody>
              <tr>
                <td
                  className={`square ${correctGuesses.actor ? "correct" : ""}`}>
                  <strong>Actor</strong>
                  <br />
                  <span
                    className={
                      correctGuesses.actor ? "small-letter" : "big-letter"
                    }>
                    {correctGuesses.actor
                      ? currentMovie.actor
                      : currentMovie.actor_letter}
                  </span>
                </td>
                <td
                  className={`square ${
                    correctGuesses.actress ? "correct" : ""
                  }`}>
                  <strong>Actress</strong>
                  <br />
                  <span
                    className={
                      correctGuesses.actress ? "small-letter" : "big-letter"
                    }>
                    {correctGuesses.actress
                      ? currentMovie.actress
                      : currentMovie.actress_letter}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  className={`square ${
                    correctGuesses.movie_name ? "correct" : ""
                  }`}>
                  <strong>Movie</strong>
                  <br />
                  <span
                    className={
                      correctGuesses.movie_name ? "small-letter" : "big-letter"
                    }>
                    {correctGuesses.movie_name
                      ? currentMovie.movie_name
                      : currentMovie.movie_letter}
                  </span>
                </td>
                <td
                  className={`square ${
                    correctGuesses.song_name ? "correct" : ""
                  }`}>
                  <strong>Song</strong>
                  <br />
                  <span
                    className={
                      correctGuesses.song_name ? "small-letter" : "big-letter"
                    }>
                    {correctGuesses.song_name
                      ? currentMovie.song_name
                      : currentMovie.song_letter}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Hint */}
        {!gameOver && !allGuessed && (
          <button className='hint-btn' onClick={() => setShowHint(!showHint)}>
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
        )}
        {showHint && (
          <div className='hint-box'>
            <p>
              <strong>Hint:</strong> {currentMovie.genre} (
              {currentMovie.release_year})
            </p>
          </div>
        )}

        {/* Input */}
        {!gameOver && !allGuessed && (
          <form onSubmit={handleGuess} className='input-box'>
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Guess actor, actress, movie or song...'
            />
            <button type='submit'>Guess</button>
          </form>
        )}

        {/* Game Over / Success */}
        {gameOver && (
          <div className='game-over'>
            ❌ Game Over! The answers were:
            <br />
            🎭 {currentMovie.actor}, 🎭 {currentMovie.actress}
            <br />
            🎬 {currentMovie.movie_name}
            <br />
            🎵 {currentMovie.song_name}
          </div>
        )}
        {allGuessed && (
          <div className='success'>✅ Awesome! You guessed everything!</div>
        )}

        {/* Next + Reset */}
        {(gameOver || allGuessed) && (
          <button className='next-btn' onClick={handleNext}>
            Next Movie →
          </button>
        )}
      </div>
    </>
  );
};

export default BollywoodGame;
