import React, { useState, useEffect } from 'react';

function Scores() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Fetch scores from API
    fetch('http://localhost:3000/api/scores')
      .then((response) => response.json())
      .then((data) => {
        setScores(data);
      })
      .catch((error) => {
        console.error('Error loading scores:', error);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Your Scores</h1>
      <table className="mt-4 w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Score</th>
            <th className="px-4 py-2">Time Taken (Seconds)</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{score.name}</td>
              <td className="px-4 py-2">{score.score}</td>
              <td className="px-4 py-2">{Math.abs(score.time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Scores;
