/** @format */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user")); // { userId, username }

  useEffect(() => {
    fetch("https://bollywood-backend.onrender.com/leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaders(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🏆 Leaderboard</h2>
      <ol style={styles.list}>
        {leaders.map((u, idx) => {
          const isCurrentUser = currentUser && u.id === currentUser.userId;

          return (
            <li
              key={idx}
              style={{
                ...styles.listItem,
                ...(idx === 0
                  ? styles.gold
                  : idx === 1
                  ? styles.silver
                  : idx === 2
                  ? styles.bronze
                  : {}),
                ...(isCurrentUser ? styles.currentUser : {}),
              }}>
              <span style={styles.rank}>#{idx + 1}</span>
              <span>
                {u.username} {isCurrentUser && "👑"}
              </span>
              <span style={styles.score}>{u.score}</span>
            </li>
          );
        })}
      </ol>
      <Link to='/' style={styles.backButton}>
        🔙 Back to Game
      </Link>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "480px",
    margin: "40px auto",
    padding: "24px",
    textAlign: "center",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    marginBottom: "24px",
    fontSize: "26px",
    fontWeight: "700",
    color: "#ff5722",
  },
  list: {
    listStyleType: "none",
    paddingLeft: "0",
    marginBottom: "24px",
  },
  listItem: {
    margin: "12px 0",
    fontSize: "18px",
    padding: "12px 18px",
    borderRadius: "10px",
    background: "#f8f9fa",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.3s ease",
  },
  rank: {
    fontWeight: "bold",
    marginRight: "10px",
    color: "#555",
  },
  score: {
    fontWeight: "600",
    color: "#444",
  },
  gold: {
    background: "linear-gradient(90deg, #ffd700, #ffec8b)",
    fontWeight: "bold",
  },
  silver: {
    background: "linear-gradient(90deg, #c0c0c0, #e6e6e6)",
    fontWeight: "bold",
  },
  bronze: {
    background: "linear-gradient(90deg, #cd7f32, #e3a66f)",
    fontWeight: "bold",
    color: "#fff",
  },
  currentUser: {
    border: "2px solid #4CAF50",
    background: "#e8f5e9",
    fontWeight: "700",
    color: "#2e7d32",
    transform: "scale(1.05)",
  },
  backButton: {
    display: "inline-block",
    padding: "12px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
};

export default Leaderboard;
