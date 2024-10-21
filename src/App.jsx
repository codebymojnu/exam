import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Exam from './components/Exam';
import Scores from './components/Scores';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Exam />} />
        <Route path="/scores" element={<Scores />} />
      </Routes>
    </Router>
  );
}

export default App;
