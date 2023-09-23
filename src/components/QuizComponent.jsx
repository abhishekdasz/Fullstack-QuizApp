import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory
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

// Initial quiz data with shuffled options
const initialQuizData = {
  response_code: 0,
  results: [
    {
      category: 'Entertainment: Television',
      type: 'multiple',
      difficulty: 'medium',
      question: "In the original Doctor Who series (1963), fourth doctor Tom Baker's scarf was how long?",
      correct_answer: '7 Meters',
      incorrect_answers: ['10 Meters', '2 Meters', '5 Meters'],
    },
    {
      category: 'Entertainment: Video Games',
      type: 'multiple',
      difficulty: 'hard',
      question: 'In "Halo", what is the name of the planet which Installation 04 orbits?',
      correct_answer: 'Threshold',
      incorrect_answers: ['Substance', 'Sanghelios', 'Te'],
    },
    {
      category: 'Politics',
      type: 'boolean',
      difficulty: 'easy',
      question: 'Donald Trump won the popular vote in the 2016 United States presidential election.',
      correct_answer: 'False',
      incorrect_answers: ['True'],
    },
  ],
};

const QuizComponent = () => {
  const [quizData, setQuizData] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [scores, setScores] = useState(Array(initialQuizData.results.length).fill(0));
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(initialQuizData.results.length).fill(''));
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [viewingReport, setViewingReport] = useState(false);

  useEffect(() => {
    // Initialize quiz data with the hardcoded initialQuizData and shuffle options
    const shuffledQuizData = initialQuizData.results.map((question) => ({
      ...question,
      options: shuffleArray([question.correct_answer, ...question.incorrect_answers]),
    }));
    setQuizData(shuffledQuizData);
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

  const handleSubmitQuiz = () => {
    // Update the user's answer for the current question
    const newUserAnswers = [...userAnswers];
    newUserAnswers[questionIndex] = selectedOption;
    setUserAnswers(newUserAnswers);

    // Calculate the score for the current question and update it
    const newScores = [...scores];
    if (selectedOption === quizData[questionIndex].correct_answer) {
      newScores[questionIndex] = 1;
    }
    setScores(newScores);

    // Calculate the total score across all questions
    const totalScore = newScores.reduce((acc, score) => acc + score, 0);
    setScore(totalScore);

    setQuizCompleted(true);
  };

  const handleFinishQuiz = () => {
    const totalScore = calculateTotalScore();
    setScore(totalScore);
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
    if (selectedOption === currentQuestion.correct_answer) {
      newScores[questionIndex] = 1;
    } else {
      newScores[questionIndex] = 0;
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

  useEffect(() => {
    // Generate an array of correct answers based on the shuffled options
    const correctAnswersArray = quizData.map((question) => question.correct_answer);
    setCorrectAnswers(correctAnswersArray);
  }, [quizData]);

  const handleNavigateToQuestion = (index) => {
    setQuestionIndex(index);
    setSelectedOption(userAnswers[index]);
  };

  return (
    <div className="container">
      {!viewingReport && (
        <div className="navigation-container">
          <h2 className="navigation-header">Navigation Panel</h2>
          <ul className="navigation">
            {quizData.map((_, index) => (
              <li key={index}>
                <button onClick={() => handleNavigateToQuestion(index)} className={`navigation-button ${questionIndex === index ? 'active' : ''}`}>
                  Question {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h1 className="header">Timer: {timer} seconds</h1>
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
