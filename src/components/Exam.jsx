import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import Question from "./Question";

function Exam() {
  const initialTime = 1000; // Set the initial time for the exam (in seconds)
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading = true
  const [timeLeft, setTimeLeft] = useState(initialTime); // Use initial time
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(""); // For modal input
  const [score, setScore] = useState(0); // Store score here
  const [selectedAnswers, setSelectedAnswers] = useState({}); // To store selected answers
  const [examCompleted, setExamCompleted] = useState(false); // Track if exam is completed
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch questions from API
    fetch("https://online-exam-server-teal.vercel.app/api/questions/")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false); // Data is loaded, stop loading
      })
      .catch((error) => {
        console.error("Error loading questions:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !loading) {
      // Timer starts only after loading is false
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleTimeOver(); // Handle time over
    }
  }, [timeLeft, loading]); // Depend on loading state

  const handleAnswerChange = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setExamCompleted(true);
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
      time: initialTime - timeLeft, // Calculate the actual time taken
    };

    // Save score to API
    fetch("https://online-exam-server-teal.vercel.app/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scoreData),
    })
      .then(() => {
        navigate("/scores");
      })
      .catch((error) => {
        console.error("Error saving score:", error);
      });
  };

  const handleTimeOver = () => {
    const calculatedScore = calculateScore(); // Calculate the score based on selected answers
    setScore(calculatedScore); // Set the calculated score

    const scoreData = {
      name: "Time_Over", // Default name when time is up
      score: calculatedScore, // Use the calculated score
      time: initialTime - timeLeft, // Calculate the actual time taken
    };

    // Save score to API
    fetch("https://online-exam-server-teal.vercel.app/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scoreData),
    })
      .then(() => {
        setShowModal(true); // Show the modal to display the score
        navigate("./scores");
      })
      .catch((error) => {
        console.error("Error saving score:", error);
      });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Physics Exam</h1>
        <div className="font-bold">
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        {!examCompleted &&
          questions.map((question) => (
            <Question
              key={question._id}
              question={question}
              onAnswerChange={handleAnswerChange}
              selectedAnswer={selectedAnswers[question._id]} // Pass selected answer to the Question component
            />
          ))}
        {!examCompleted && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Submit
            </button>
          </div>
        )}
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
