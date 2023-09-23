import React, { useState, useEffect } from 'react';

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
    {
      category: 'Entertainment: Japanese Anime & Manga',
      type: 'multiple',
      difficulty: 'medium',
      question: 'Aoi Miyamori is the production manager of what anime in "Shirobako"?',
      correct_answer: 'The Third Aerial Girls Squad',
      incorrect_answers: ['Exodus!', 'Andes Chucky', 'Angel Beats!'],
    },
    {
      category: 'General Knowledge',
      type: 'multiple',
      difficulty: 'hard',
      question: 'The word "astasia" means which of the following?',
      correct_answer: 'The inability to stand up',
      incorrect_answers: [
        'The inability to make decisions',
        'The inability to concentrate on anything',
        "A feverish desire to rip one's clothes off",
      ],
    },
  ],
};

const QuizComponent = () => {
  const [quizData, setQuizData] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(Array(initialQuizData.results.length).fill(null));
  const [scores, setScores] = useState(Array(initialQuizData.results.length).fill(0));
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);

  const handleSubmitQuiz = () => {
    const totalScore = scores.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    setScore(totalScore);
    setQuizCompleted(true);
  };

  useEffect(() => {
    setQuizData(initialQuizData.results);
  }, []);

  useEffect(() => {
    let timerInterval;

    if (!quizCompleted && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      handleSubmitQuiz();
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [quizCompleted, timer]);

  const handleOptionChange = (option) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[questionIndex] = option;
    setSelectedOptions(newSelectedOptions);

    const currentQuestion = quizData[questionIndex];
    const newScores = [...scores];
    if (option === currentQuestion.correct_answer) {
      newScores[questionIndex] = 1;
    } else {
      newScores[questionIndex] = 0;
    }
    setScores(newScores);
  };

  const handleNextQuestion = () => {
    if (questionIndex < quizData.length - 1) {
      setQuestionIndex((prevQuestionIndex) => prevQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prevQuestionIndex) => prevQuestionIndex - 1);
    }
  };

  const handleNavigateToQuestion = (index) => {
    setQuestionIndex(index);
  };

  return (
    <div>
      <div>
        <h1>Timer: {timer} seconds</h1>
      </div>
      <div>
        {quizData.length > 0 && !quizCompleted ? (
          <div>
            <h1>Quiz Question</h1>
            <h3>{quizData[questionIndex].question}</h3>
            <ul>
              {quizData[questionIndex].incorrect_answers.map((option, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedOptions[questionIndex] === option}
                      onChange={() => handleOptionChange(option)}
                    />
                    {option}
                  </label>
                </li>
              ))}
              <li>
                <label>
                  <input
                    type="radio"
                    name="answer"
                    value={quizData[questionIndex].correct_answer}
                    checked={selectedOptions[questionIndex] === quizData[questionIndex].correct_answer}
                    onChange={() => handleOptionChange(quizData[questionIndex].correct_answer)}
                  />
                  {quizData[questionIndex].correct_answer}
                </label>
              </li>
            </ul>
            <button onClick={handlePreviousQuestion} disabled={questionIndex === 0}>
              Previous
            </button>
            {questionIndex === quizData.length - 1 ? (
              <button onClick={handleSubmitQuiz}>Submit</button>
            ) : (
              <button onClick={handleNextQuestion}>Next</button>
            )}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
