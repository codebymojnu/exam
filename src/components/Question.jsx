import React from 'react';

function Question({ question, onAnswerChange, selectedAnswer }) {
  const { question: text, options, _id } = question;

  return (
    <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h2 className="text-lg font-semibold">{text}</h2>
      <div className="mt-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="radio"
              id={`option-${index}-${_id}`}
              name={_id}
              value={`option${index + 1}`}
              checked={selectedAnswer === `option${index + 1}`} // Check if this option is selected
              onChange={() => onAnswerChange(_id, `option${index + 1}`)} // Call the handler
              className="mr-2"
            />
            <label htmlFor={`option-${index}-${_id}`} className="text-gray-700">{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Question;
