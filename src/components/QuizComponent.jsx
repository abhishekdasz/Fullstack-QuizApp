import React, { useState, useEffect } from 'react';
import './QuizComponent.css'; // Import the CSS file
import QuizReport from './QuizReport';

// Helper function to shuffle an array randomly
function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

const QuizComponent = () => {
  const [quizData, setQuizData] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [scores, setScores] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(1800); // 30 minutes in seconds
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [viewingReport, setViewingReport] = useState(false);

  useEffect(() => {
    // Fetch quiz data from the API
    async function fetchQuizData() {
      try {
        const response = await fetch('https://opentdb.com/api.php?amount=15');
        if (response.ok) {
          const data = await response.json();
          const fetchedQuizData = data.results.map((question) => ({
            category: question.category,
            type: question.type,
            difficulty: question.difficulty,
            question: question.question,
            correct_answer: question.correct_answer,
            incorrect_answers: question.incorrect_answers,
            options: shuffleArray([question.correct_answer, ...question.incorrect_answers]),
          }));
          setQuizData(fetchedQuizData);
          setScores(Array(fetchedQuizData.length).fill(0));
          setUserAnswers(Array(fetchedQuizData.length).fill(''));
          setCorrectAnswers(fetchedQuizData.map((question) => question.correct_answer));
        } else {
          console.error('Failed to fetch quiz data');
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    }

    fetchQuizData();
  }, []);

  useEffect(() => {
    // Set up the timer interval
    let timerInterval;

    if (!quizCompleted && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      // Auto-submit the quiz when the timer reaches 0
      handleSubmitQuiz();
    }

    // Clean up the timer interval
    return () => {
      clearInterval(timerInterval);
    };
  }, [quizCompleted, timer]);

  const calculateTotalScore = () => {
    return scores.reduce((acc, score) => acc + score, 0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleSubmitQuiz = () => {
    // Update the user's answer for the current question
    const newUserAnswers = [...userAnswers];
    newUserAnswers[questionIndex] = selectedOption;
    setUserAnswers(newUserAnswers);

    // Calculate the score for the current question and update it
    const newScores = [...scores];
    if (selectedOption === correctAnswers[questionIndex]) {
      newScores[questionIndex] = 1;
    }
    setScores(newScores);

    if (questionIndex < quizData.length - 1) {
      setQuestionIndex((prevQuestionIndex) => prevQuestionIndex + 1);
      setSelectedOption(newUserAnswers[questionIndex + 1]); // Set selected option for the next question
    } else {
      const totalScore = calculateTotalScore();
      setScore(totalScore);
      setQuizCompleted(true);
    }
  };

  const handleFinishQuiz = () => {
    setViewingReport(true);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    const currentQuestion = quizData[questionIndex];

    // Update user's answer for the current question
    const newUserAnswers = [...userAnswers];
    newUserAnswers[questionIndex] = selectedOption;
    setUserAnswers(newUserAnswers);

    // Calculate the score for the current question
    const newScores = [...scores];
    if (selectedOption === correctAnswers[questionIndex]) {
      newScores[questionIndex] = 1;
    }
    setScores(newScores);

    if (questionIndex < quizData.length - 1) {
      setQuestionIndex((prevQuestionIndex) => prevQuestionIndex + 1);
      setSelectedOption(newUserAnswers[questionIndex + 1]); // Set selected option for the next question
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prevQuestionIndex) => prevQuestionIndex - 1);
      setSelectedOption(userAnswers[questionIndex - 1]); // Set selected option for the previous question
    }
  };

  const handleNavigateToQuestion = (index) => {
    setQuestionIndex(index);
    setSelectedOption(userAnswers[index]);
  };

  return (
    <div className="container">
      {!viewingReport && (
        <div className="navigation-container">
          {/* <h2 className="navigation-header">Navigation Panel</h2> */}
          <ul className="navigation">
            {quizData.map((_, index) => (
              <li key={index}>
                <button onClick={() => handleNavigateToQuestion(index)} className={`navigation-button ${questionIndex === index ? 'active' : ''}`}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h1 className="header">Time left {formatTime(timer)}</h1>
      </div>
      <div>
        {quizData.length > 0 && !quizCompleted ? (
          <div>
            <h1 className="question">Quiz Question</h1>
            <h3>{quizData[questionIndex].question}</h3>
            <ul className="options">
              {quizData[questionIndex].options.map((option, index) => (
                <li key={index} className="option">
                  <label>
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => handleOptionChange(option)}
                    />
                    <span className="radio"></span>
                    {option}
                  </label>
                </li>
              ))}
            </ul>
            <div className="button-container">
              <button onClick={handlePreviousQuestion} disabled={questionIndex === 0} className="button">
                Previous
              </button>
              {questionIndex === quizData.length - 1 ? (
                <button onClick={handleSubmitQuiz} className="button">Submit</button>
              ) : (
                <button onClick={handleNextQuestion} className="button">Next</button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h1 className="quiz-completed-header">Quiz Completed</h1>
            <p className="quiz-completed-score">Your Score: {score} / {quizData.length}</p>
            {/* Pass the required props to QuizReport */}
            <button onClick={handleFinishQuiz} className="button">View Report</button>
          </div>
        )}
      </div>
      {/* Conditionally render QuizReport */}
      {viewingReport && (
        <QuizReport
          userAnswers={userAnswers}
          correctAnswers={correctAnswers}
          questions={quizData}
          score={score}
        />
      )}
    </div>
  );
};

export default QuizComponent;
