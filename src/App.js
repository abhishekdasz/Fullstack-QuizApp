import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import QuizComponent from './components/QuizComponent';
import QuizReport from './components/QuizReport';
import NavPage from './components/NavPage';

function App() {
  return (
    <BrowserRouter>
      {/* <NavPage /> */}
      <Routes>
        <Route path="/" element={<QuizComponent />} />
        <Route path="/report" element={<QuizReport />} />
        {/* Define more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
