import React, { useState } from 'react';
import './UserRegistration.css'; // Import the CSS file

const UserRegistration = ({ onStartQuiz }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleStartQuiz = () => {
    if (userName.trim() !== '' && userEmail.trim() !== '') {
      // Proceed to start the quiz
      onStartQuiz();
    } else {
      alert('Please enter your name and email.');
    }
  };

  return (
    <div className='user-registration-section'>
    <div className='user-registration-container'>
      <h1 className='user-registration-title'>User Registration</h1>
      <div className='reg-inputs'>
        <label className='user-registration-label'>Name:</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className='user-registration-input'
        />
      </div>
      <div className='reg-inputs'>
        <label className='user-registration-label'>Email:</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className='user-registration-input'
        />
      </div>
      <button onClick={handleStartQuiz} className='user-registration-button'>
        Start Quiz
      </button>
    </div>
    </div>
  );
};

export default UserRegistration;
