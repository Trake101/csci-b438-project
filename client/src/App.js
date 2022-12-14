import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import Home from "./pages/Home";
import Game from "./pages/Game";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/:roomId" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
