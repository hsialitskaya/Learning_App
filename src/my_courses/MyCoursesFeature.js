import React from "react";

const MyCoursesFeature = ({
  savedCourses,
  savedCoursesDetails,
  onStartCourse,
  onRemoveCourse,
  goToMain,
}) => {
  // Gdy użytkownik nie ma zapisanych kursów
  if (savedCourses.length === 0) {
    return (
      <div>
        <p className="subtitle">Nie masz zapisanych kursów.</p>
        <button onClick={goToMain} className="btn">
          Wróć do strony głównej
        </button>
      </div>
    );
  }

  return (
    <div className="courses-list">
      <h1 className="title">Moje Kursy</h1>
      {savedCoursesDetails.map((course) => (
        <div key={course.id} className="course-item">
          <h2>{course.nazwa}</h2>
          <p>
            <strong>Prowadzący:</strong> {course.informacje_o_prowadzacym.imie}{" "}
            {course.informacje_o_prowadzacym.nazwisko}
          </p>
          <p>
            <strong>Plan lekcji:</strong> {course.plan_lekcji}
          </p>
          <p>
            <strong>Procent ukończenia:</strong>{" "}
            {savedCourses.find((elem) => elem.id === course.id).progress} %
          </p>
          <div className="course-actions">
            <button
              onClick={() => onStartCourse(course.id)}
              className="btn btn-course"
            >
              Start
            </button>
            <button
              onClick={() => onRemoveCourse(course.id)}
              className="btn btn-course"
            >
              Usuń z moich kursów
            </button>
          </div>
        </div>
      ))}
      <button onClick={goToMain} className="btn">
        Wróć do strony głównej
      </button>
    </div>
  );
};

export default MyCoursesFeature;
