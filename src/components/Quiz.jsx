import React, { useState } from 'react'
import { QuizData } from '../constants/QuizData';
import '../App.css'

const Quiz = () => {
    const [currQueIndex, setCurrQueIndex] = useState(0);
    const currentQue = QuizData[currQueIndex];
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const avg = (score/QuizData.length)*100;

    const isOptionSelected = (option) => {
        return selectedOptions.some((selectedOption) => selectedOption.id === option.id);
    }

    const handleOptionChange = (optIndex) =>{
        const option = currentQue.options[optIndex];
        setSelectedOptions((prevSelectedOptions) => {
            if (isOptionSelected(option)) 
            {
              return prevSelectedOptions.filter((selectedOption) => selectedOption.id !== option.id);
            } 
            else 
            {
              return [...prevSelectedOptions, option];
            }
        })
        // setSelectedOptionIndex(optIndex);
    }
    const handleNextQue = () => {
        const question = QuizData[currQueIndex];
        const allSelectedAreCorrect = selectedOptions.every((option) => option.isCorrect);
        const allCorrectOptionsSelected = selectedOptions.length === question.options.filter(opt => opt.isCorrect).length;
  
        if (allSelectedAreCorrect && allCorrectOptionsSelected) 
        {
            setScore(score + 1);
        }
  
        if (currQueIndex < QuizData.length - 1) 
        {
            setCurrQueIndex(currQueIndex + 1);
            setSelectedOptions([]);
        }
    }

    const handlePreviousQue = () => {
        if (currQueIndex > 0) {
          setCurrQueIndex(currQueIndex - 1);
          setSelectedOptions([]);
        }
      };
      

    const handleSubmitQuiz = () =>{
        if (selectedOptions.length > 0) 
        {
            const allCorrect = selectedOptions.every((option) => option.isCorrect);
      
            if (allCorrect) 
            {
              setScore(score + 1);
            }
        }
        setSubmitted(true);
    }

    if(submitted)
    {
        return(
            <div className='quiz-sec'>
                <div className="score">
                    <p> Final Score: {score}/{QuizData.length} </p> <br />
                    <p> Avg is: {avg}%  </p>
                </div>
            </div>
        )
    }


    
  return (
    <div className='quiz-sec'>
        <div className="quiz-container">
            <div className='instructions'> 
                <p> Instruction: {currentQue.view ==='checkbox-opt' ? <> You can select multiple options </> : <> Choose the correct option only </>}  </p> 
            </div>
            <h3> {currentQue.question} </h3>
            {currentQue.options.map((opt, index) => (
          <label key={opt.id}>
            <input
              type={currentQue.view === 'radio-opt' ? 'radio' : 'checkbox'}
              name='answer'
              value={opt.id}
              checked={isOptionSelected(opt)}
              onChange={() => handleOptionChange(index)}
            />
            {opt.label}
          </label>
        ))}
        <div>
          {currQueIndex > 0 && (
            <button onClick={handlePreviousQue}>Previous</button>
          )}
          {currQueIndex < QuizData.length - 1 ? (
            <button onClick={handleNextQue}>Next</button>
          ) : (
            <button onClick={handleSubmitQuiz}>Submit</button>
          )}
        </div>
            
        </div>
    </div>
  )
}

export default Quiz;
