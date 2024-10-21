import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Question from './Question';
import Modal from './Modal';

function Exam() {
  const [questions, setQuestions] = useState([{ "_id": "65055ad1d27e20e0aad35c55", "subject": "Physics 1st Paper", "chapter": "Chater 1", "topic": "", "question": "রবি ঠাকুর কত সালে নোবেল পান?", "options": ["১৯৪৫", "১৯১৩", "২০১৩", "431"], "correctAnswer": "option2", "__v": 0 }, {
    "_id": "65055ad1d27e20e0aad35c56",
    "subject": "Physics 1st Paper",
    "chapter": "Chapter 2",
    "topic": "",
    "question": "মৌলিক কণিকা কোনটি?",
    "options": ["ইলেকট্রন", "প্রোটন", "নিউট্রন", "সবগুলি"],
    "correctAnswer": "option4",
    "__v": 0
  }, {
    "_id": "6505620fd04b003b9da57639",
    "subject": "Physics 1st Paper",
    "chapter": "Chapter 4",
    "topic": "",
    "question": "পদার্থের তিনটি অবস্থা কি কি?",
    "options": ["জল, বরফ, বাষ্প", "গ্যাস, তরল, কঠিন", "দূষিত, বিশুদ্ধ, গ্যাস", "সাধারণ, বিশেষ, সমান"],
    "correctAnswer": "option2",
    "__v": 0
  }]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 10 minutes
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(''); // For modal input
  const [score, setScore] = useState(0); // Store score here
  const [selectedAnswers, setSelectedAnswers] = useState({}); // To store selected answers

  const navigate = useNavigate();

  // useEffect(() => {
  //   // Fetch questions from API
  //   fetch('http://localhost:3000/api/questions/')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setQuestions(data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error('Error loading questions:', error);
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setShowModal(true);
    }
  }, [timeLeft]);

  const handleAnswerChange = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setShowModal(true);
  };

  const calculateScore = () => {
    let totalScore = 0;
    const pointsPerQuestion = 5; // Points for each correct answer

    questions.forEach((question) => {
      const selectedAnswer = selectedAnswers[question._id];
      if (selectedAnswer === question.correctAnswer) {
        totalScore += pointsPerQuestion;
      }
    });

    return totalScore;
  };

  const handleModalSubmit = (name) => {
    const scoreData = {
      name,
      score,
      time: 600 - timeLeft,
    };

    // Save score to API
    fetch('http://localhost:3000/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData),
    })
      .then(() => {
        navigate('/scores');
      })
      .catch((error) => {
        console.error('Error saving score:', error);
      });
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Physics Exam</h1>
        <div className="font-bold">Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        {questions.map((question) => (
          <Question
            key={question._id}
            question={question}
            onAnswerChange={handleAnswerChange}
            selectedAnswer={selectedAnswers[question._id]} // Pass selected answer to the Question component
          />
        ))}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </div>
      </div>
      {showModal && (
        <Modal
          score={score}
          onSubmit={handleModalSubmit}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}

export default Exam;
