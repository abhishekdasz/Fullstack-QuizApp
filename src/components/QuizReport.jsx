import React from 'react';

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
                <td>{question.options.find(option => option === question.correct_answer)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  

export default QuizReport;
