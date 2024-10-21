import React from 'react';

function Question({ question, onAnswerChange, selectedAnswer }) {
  const { question: text, options, _id } = question;

  return (
    <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{text}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <div key={index} className="flex items-center">
            <input
              type="radio"
              id={`option-${index}-${_id}`}
              name={_id}
              value={`option${index + 1}`}
              checked={selectedAnswer === `option${index + 1}`} // Check if this option is selected
              onChange={() => onAnswerChange(_id, `option${index + 1}`)} // Call the handler
              className="mr-2 accent-indigo-600"
            />
            <label htmlFor={`option-${index}-${_id}`} className="text-gray-800">{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Question;
