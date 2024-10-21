import React, { useState } from 'react';

function Modal({ score, onSubmit, setShowModal }) {
  const [name, setName] = useState('');

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name);
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold">Exam Finished!</h2>
        <p className="mt-2">Your score: {score}</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="border border-gray-300 p-2 mt-4 w-full rounded"
        />
        <div className="flex justify-between mt-4">
          <button onClick={handleClose} className="text-gray-500">Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Submit Score
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
