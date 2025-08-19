/** @format */

import React from "react";
import BollywoodGame from "./BollywoodGame";
import Leaderboard from "./LeaderBoardComponent";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css"; // ✅ make sure CSS is imported

function App() {
  return (
    <Router>
      <div className='App'>
        <nav className='navbar'>
          <div className='nav-left'>
            <Link to='/' className='nav-link'>
              🏠 Home
            </Link>
            <Link to='/leaderboard' className='nav-link'>
              🏆 Leaderboard
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path='/' element={<BollywoodGame />} />
          <Route path='/leaderboard' element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
