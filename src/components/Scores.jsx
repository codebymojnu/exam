import React, { useState, useEffect } from 'react';

function Scores() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Fetch scores from API
    fetch('https://online-exam-server-teal.vercel.app/api/scores')
      .then((response) => response.json())
      .then((data) => {
        setScores(data);
      })
      .catch((error) => {
        console.error('Error loading scores:', error);
      });
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">Your Scores</h1>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white text-left border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-4 border-b bg-indigo-500 text-white">Name</th>
              <th className="px-6 py-4 border-b bg-indigo-500 text-white">Score</th>
              <th className="px-6 py-4 border-b bg-indigo-500 text-white">Time</th>
              <th className="px-6 py-4 border-b bg-indigo-500 text-white">Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score) => {
              const formattedDate = new Date(score.timestamp).toLocaleString();
              return (
                <tr key={score._id} className="hover:bg-indigo-50 transition-colors duration-200">
                  <td className="px-6 py-4 border-b">{score.name}</td>
                  <td className="px-6 py-4 border-b">{score.score}</td>
                  <td className="px-6 py-4 border-b">{Math.abs(score.time)}</td>
                  <td className="px-6 py-4 border-b">{formattedDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="block md:hidden mt-6">
        {scores.map((score) => {
          const formattedDate = new Date(score.timestamp).toLocaleString();
          return (
            <div key={score._id} className="bg-white rounded-lg shadow-md mb-4 p-4">
              <h2 className="text-lg font-semibold text-indigo-600 mb-2">{score.name}</h2>
              <p className="text-gray-700">
                <strong>Score: </strong>{score.score}
              </p>
              <p className="text-gray-700">
                <strong>Time Taken: </strong>{Math.abs(score.time)} seconds
              </p>
              <p className="text-gray-500 text-sm">
                <strong>Date: </strong>{formattedDate}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Scores;
