# Quiz Application

## Overview

The Quiz Application is a web-based quiz platform that allows users to participate in a quiz consisting of 15 questions sourced from the Open Trivia Database API. The application features a timer, navigation options, and a detailed report at the end of the quiz to review user responses.

## Features

1. **Quiz Layout & Flow**
   - Users start by submitting their email address.
   - The application presents 15 quiz questions to the user.
   - A timer counts down from 30 minutes, and the quiz auto-submits when the timer reaches zero.

2. **Navigation**
   - Users can navigate to specific questions using navigation buttons.
   - An overview panel displays all questions, indicating which questions the user has visited and which questions have been attempted.

3. **End of Quiz**
   - After completing the quiz or when the timer ends, users are directed to a report page.
   - The report page displays each question with the user's answer and the correct answer for easy comparison.

4. **Data Source**
   - Quiz questions are fetched from the [Open Trivia Database API](https://opentdb.com/api.php?amount=15).
   - User choices are presented by concatenating the `correct_answer` and `incorrect_answers` parameters.
   - The correct answer for each question is provided in the `correct_answer` parameter.

## Installation

1. Clone the repository:
   git clone
   ```
   https://github.com/your-username/quiz-application.git
   ```
2. Navigate to the project directory:
   ```
   cd quiz-application
   ``` 
3. Install dependencies:
   ```
   npm install
   ``` 
4. Start the development server:
   ```
   npm start
   ``` 
