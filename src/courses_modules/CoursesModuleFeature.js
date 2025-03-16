import React from "react";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

const CoursesModuleFeature = ({
  course,
  onStartLesson,
  user,
  goBack,
  goToQuiz,
}) => {
  const navigate = useNavigate();
  if (!user) {
    alert(
      "Nie znaleziono użytkownika o podanym identyfikatorze. Proszę się zalogować."
    );
    navigate("/");
    return;
  }

  const userCourse = user.courses.find((elem) => elem.id === course.id);

  const finish = userCourse.finish;

  const finishAsNumbers = finish.map(Number);
  const lastFinishedLesson =
    finishAsNumbers.length > 0 ? Math.max(...finishAsNumbers) : 0;
  const openLessons = [...finishAsNumbers, lastFinishedLesson + 1];

  // Sprawdzanie, czy wszystkie lekcje zostały ukończone
  const allLessonsFinished = course.lekcje.every((lesson) =>
    finishAsNumbers.includes(lesson.numer)
  );

  const wynik = user.courses.find((elem) => elem.id === course.id)?.quiz_score;

  // Sprawdzanie, czy quiz został ukończony
  const quizCompleted =
    user.courses.find((elem) => elem.id === course.id)?.quiz_score !== null &&
    Number(wynik) !== 0.0;

  // Sprawdzamy, czy wszystkie lekcje i quiz zostały ukończone
  const allCompleted = allLessonsFinished && quizCompleted;

  const generateCertificate = () => {
    const courseName = course.nazwa;
    const quizScore = userCourse.quiz_score;

    const doc = new jsPDF();

    // title
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Certificate", 105, 30, null, null, "center");

    // content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`This certifies that`, 105, 50, null, null, "center");
    doc.setFontSize(20);
    doc.text(`${user.name} ${user.surname}`, 105, 70, null, null, "center");

    doc.setFontSize(16);
    doc.text(
      `has successfully completed the course:`,
      105,
      90,
      null,
      null,
      "center"
    );
    doc.setFontSize(20);
    doc.text(`"${courseName}"`, 105, 110, null, null, "center");

    doc.setFontSize(16);
    doc.text(`with a grade of ${quizScore}%`, 105, 130, null, null, "center");

    doc.setFontSize(14);
    doc.text(
      `We congratulate you on your achievement and wish you continued success!`,
      105,
      150,
      null,
      null,
      "center"
    );

    // Footer with signature
    doc.setFontSize(14);
    doc.text("Organizer's Signature:", 20, 180);
    doc.setLineWidth(0.5);
    doc.line(20, 185, 100, 185);

    // Download the certificate
    doc.save("certificate.pdf");
  };

  return (
    <div className="container">
      <h1 className="title">{course.nazwa}</h1>
      <p className="opis">{course.opis}</p>
      <div>
        {course.lekcje.map((lesson) => {
          // Czy lekcja jest ukończona?
          const isLessonFinished = finishAsNumbers.includes(lesson.numer);

          // Czy lekcja jest otwarta?
          const isLessonOpen = openLessons.includes(lesson.numer);

          return (
            <div key={lesson.numer} className="lesson-card">
              <p className="subtitle">
                Zajęcie {lesson.numer}: {lesson.nazwa}
              </p>
              <button
                className={`btn ${!isLessonOpen ? "disabled" : ""}`}
                disabled={!isLessonOpen}
                onClick={() => onStartLesson(lesson.numer)}
              >
                {isLessonFinished ? "Zakończono" : "Zacznij lekcję"}
              </button>
            </div>
          );
        })}
      </div>
      {allLessonsFinished && (
        <button onClick={goToQuiz} className="btn btn-course">
          Quiz
        </button>
      )}

      {allCompleted && (
        <button onClick={generateCertificate} className="btn btn-course">
          Generuj certyfikat
        </button> // Przyciski do generowania certyfikatu
      )}

      <button onClick={goBack} className="btn">
        Wróć
      </button>
    </div>
  );
};

export default CoursesModuleFeature;
