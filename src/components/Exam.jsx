import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import Question from "./Question";

function Exam() {
  const initialTime = 1300; // Set the initial time for the exam (in seconds)
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading = true
  const [timeLeft, setTimeLeft] = useState(initialTime); // Use initial time
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(""); // For modal input
  const [score, setScore] = useState(0); // Store score here
  const [selectedAnswers, setSelectedAnswers] = useState({}); // To store selected answers
  const [examCompleted, setExamCompleted] = useState(false); // Track if exam is completed
  const [examStarted, setExamStarted] = useState(false); // Track if exam has started
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

  // Check the current time and update the state accordingly
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const targetTime = new Date();
      targetTime.setHours(21, 45, 0); // Set to 9:45 PM

      if (now >= targetTime) {
        setExamStarted(true); // Start the exam
        setTimeLeft(initialTime); // Reset time for exam
      } else {
        const countdownTime = targetTime - now; // Calculate remaining time
        setTimeLeft(Math.max(0, Math.floor(countdownTime / 1000))); // Convert to seconds
      }
    };

    checkTime(); // Initial check
    const timer = setInterval(checkTime, 1000); // Check every second

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [initialTime]);

  useEffect(() => {
    if (timeLeft > 0 && examStarted) {
      // Timer starts only after exam has started
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && examStarted) {
      handleTimeOver(); // Handle time over
    }
  }, [timeLeft, examStarted]);

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
        navigate("/scores");
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
          {examStarted ? (
            <>
              Time Left: {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </>
          ) : (
            <>
              Time Remaining: {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </>
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        {examStarted &&
          !examCompleted &&
          questions.map((question) => (
            <Question
              key={question._id}
              question={question}
              onAnswerChange={handleAnswerChange}
              selectedAnswer={selectedAnswers[question._id]} // Pass selected answer to the Question component
            />
          ))}
        {examStarted && !examCompleted && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Submit
            </button>
          </div>
        )}
        {!examStarted && (
          <div className="flex justify-center items-center h-48">
            <h2 className="text-xl font-bold">
              The exam will start at 9:45 PM.
            </h2>
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
