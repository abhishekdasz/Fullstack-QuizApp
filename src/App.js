import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import QuizComponent from './components/QuizComponent';
import QuizReport from './components/QuizReport';
import UserRegistration from './components/UserRegistration'; // Import the UserRegistration component

function App() {
  const [quizStarted, setQuizStarted] = useState(false);

  // Function to start the quiz
  const onStartQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Route for UserRegistration */}
        <Route
          path="/"
          element={
            quizStarted ? (
              <QuizComponent />
            ) : (
              <UserRegistration onStartQuiz={onStartQuiz} />
            )
          }
        />
        <Route path="/report" element={<QuizReport />} />
        {/* Define more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
