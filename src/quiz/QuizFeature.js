import React, { useState, useEffect } from "react";
import coursesData from "../assets/courses.json"; // Pobierz dane kursów z JSON

const QuizFeature = ({ courseId, user, goBack }) => {
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Znajdź kurs po ID i pobierz quiz
    const course = coursesData.find((course) => course.id === courseId);

    if (course && course.quiz) {
      setQuizData(course.quiz);

      const userCourse = user.courses.find((course) => course.id === courseId);

      console.log(typeof userCourse.quiz_score);

      if (
        userCourse &&
        userCourse.quiz_score !== null &&
        Number(userCourse.quiz_score) !== 0.0
      ) {
        setQuizCompleted(true);

        const wynik = Math.round(
          (userCourse.quiz_score / 100) * course.quiz.pytania.length
        );

        setScore(wynik);
        setSelectedAnswers(userCourse.selectedAnswers || []);
      }
    }
  }, [courseId, user]);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    if (quizCompleted) {
      return; // Zablokuj możliwość zmiany odpowiedzi po ukończeniu quizu
    }

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleSubmit = () => {
    let score = 0;
    quizData.pytania.forEach((question, index) => {
      if (selectedAnswers[index] === question.poprawna_odpowiedz) {
        score++;
      }
    });

    setScore(score);
    setQuizCompleted(true);
    updateQuizScore(score);
  };

  const updateQuizScore = (score) => {
    // Skopiowanie użytkownika z localStorage
    const updatedUser = { ...user };

    // Znalezienie kursu użytkownika
    const courseIndex = updatedUser.courses.findIndex(
      (course) => course.id === courseId
    );

    if (courseIndex !== -1) {
      const courseToUpdate = updatedUser.courses[courseIndex];
      courseToUpdate.quiz_score = (
        (score / quizData.pytania.length) *
        100
      ).toFixed(1);
      courseToUpdate.selectedAnswers = selectedAnswers; // Zapisanie wybranych odpowiedzi
    }

    // Zapisanie zaktualizowanego użytkownika w localStorage
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUserIndex = savedUsers.findIndex(
      (storedUser) => storedUser.id === updatedUser.id
    );

    if (currentUserIndex !== -1) {
      savedUsers[currentUserIndex] = updatedUser;
    }

    localStorage.setItem("users", JSON.stringify(savedUsers));
  };

  if (!quizData) {
    return <p>Ładowanie quizu...</p>;
  }

  return (
    <div className="container">
      <h1 className="titile">Quiz</h1>
      <div>
        {quizCompleted ? (
          <div>
            <h2>
              Twój wynik: {score}/{quizData.pytania.length}
            </h2>
            <button onClick={goBack} className="btn">
              Wróć
            </button>
          </div>
        ) : (
          // Wyświetlenie pytań, jeśli quiz nie został ukończony
          <>
            <div className="form form-container">
              {quizData.pytania.map((question, questionIndex) => (
                <div key={`question-${questionIndex}`}>
                  <ul
                    style={{
                      color: "#556677",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    <li>{question.pytanie}</li>
                  </ul>

                  <div className="checkbox-group">
                    {question.odpowiedzi.map((answer, answerIndex) => (
                      <div key={`answer-${questionIndex}-${answerIndex}`}>
                        <input
                          type="checkbox"
                          name={`question-${questionIndex}`}
                          value={answerIndex}
                          onChange={() =>
                            handleAnswerSelect(questionIndex, answerIndex)
                          }
                          checked={
                            selectedAnswers[questionIndex] === answerIndex
                          }
                        />
                        <label>{answer}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSubmit} className="btn">
              Wyślij odpowiedzi
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizFeature;
