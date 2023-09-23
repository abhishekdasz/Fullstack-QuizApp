import React, { useState, useEffect } from 'react';

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

const QuizReport = ({ userAnswers, correctAnswers, questions }) => {
  return (
    <div>
      <h1>Quiz Report</h1>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Your Answer</th>
            <th>Correct Answer</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, index) => (
            <tr key={index}>
              <td>{question.question}</td>
              <td>{userAnswers[index]}</td>
              <td>{question.correct_answer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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

  const handleSubmitQuiz = () => {
    // Calculate the total score
    const totalScore = scores.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    setScore(totalScore);
    setQuizCompleted(true);
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
    <div>
      <div>
        <h1>Timer: {timer} seconds</h1>
      </div>
      <div>
        {!viewingReport ? (
          quizData.length > 0 && !quizCompleted ? (
            <div>
              <h1>Quiz Question</h1>
              <h3>{quizData[questionIndex].question}</h3>
              <ul>
                {quizData[questionIndex].options.map((option, index) => (
                  <li key={index}>
                    <label>
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={selectedOption === option}
                        onChange={() => handleOptionChange(option)}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
              <div>
                <button onClick={handlePreviousQuestion} disabled={questionIndex === 0}>
                  Previous
                </button>
                {questionIndex === quizData.length - 1 ? (
                  <button onClick={handleSubmitQuiz}>Submit</button>
                ) : (
                  <button onClick={handleNextQuestion}>Next</button>
                )}
              </div>
              <div>
                <h2>Navigation Panel</h2>
                <ul>
                  {quizData.map((_, index) => (
                    <li key={index}>
                      <button onClick={() => handleNavigateToQuestion(index)}>
                        Question {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <h1>Quiz Completed</h1>
              <p>Your Score: {score} / {quizData.length}</p>
              <button onClick={handleFinishQuiz}>View Report</button>
            </div>
          )
        ) : (
          <QuizReport userAnswers={userAnswers} correctAnswers={correctAnswers} questions={quizData} />
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
