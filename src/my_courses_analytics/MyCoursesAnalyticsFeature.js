import React from "react";

const MyCoursesAnalyticsFeature = ({ course, onDelete }) => {
  if (course.participants.length === 0) {
    return (
      <div className="course-container">
        <h3>{course.nazwa}</h3>
        <p>Nikt nie jest jeszcze zapisany.</p>
        <button onClick={() => onDelete(course.id)} className="btn  btn-course">
          Usuń kurs
        </button>
      </div>
    );
  }

  return (
    <div className="course-container">
      <h3>{course.nazwa}</h3>
      <p>Liczba zapisanych osób: {course.enrolledCount}</p>
      <p>Liczba osób, które ukończyły ten kurs: {course.completedCount}</p>

      <table>
        <thead>
          <tr>
            <th>Użytkownik</th>
            <th>Postęp (%)</th>
            <th>Wynik</th>
          </tr>
        </thead>
        <tbody>
          {course.participants.map((participant) => {
            const userCourse = participant.courses.find(
              (userCourse) => userCourse.id === course.id
            );
            return (
              <tr key={participant.id}>
                <td>{participant.username}</td>
                <td>{userCourse.progress}</td>
                <td>
                  {userCourse.progress === 100
                    ? `${userCourse.quiz_score || "Brak wyniku"}%`
                    : "Nieukończono"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={() => onDelete(course.id)} className="btn btn-course">
        Usuń kurs
      </button>
    </div>
  );
};

export default MyCoursesAnalyticsFeature;
