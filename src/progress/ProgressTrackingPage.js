import React from "react";
import { useNavigate } from "react-router-dom";

import {
  useProgressTracking,
  renderCourses,
  renderCompletedCourses,
} from "./ProgressTrackingFeature";

const ProgressTrackingPage = () => {
  const navigate = useNavigate();
  const main = () => {
    navigate("/main");
  };
  const { user, badges, completedCourses } = useProgressTracking();

  if (!user) {
    return <p>Ładowanie danych użytkownika...</p>;
  }

  return (
    <div className="progress-tracking">
      <h1 className="title">Monitoring Postępów Użytkownika</h1>

      <section>
        <h3>Odznaki:</h3>
        <ul className="badges-list">
          {badges.length > 0 ? (
            badges.map((badge, index) => <li key={index}>{badge}</li>)
          ) : (
            <p>Brak odznak</p>
          )}
        </ul>
      </section>

      {user.courses ? (
        <>
          <section>
            <h3>Wszystkie Kursy:</h3>
            {user.courses && user.courses.length > 0 ? (
              renderCourses(user.courses)
            ) : (
              <p>Nie jesteś zapisany na żadne kursy</p>
            )}
          </section>

          <section>
            <h3>Ukończone Kursy:</h3>
            {user.courses.filter((course) => course.progress === 100).length ===
            0 ? (
              <p>Brak ukończonych kursów</p>
            ) : (
              renderCompletedCourses(user.courses)
            )}
          </section>
        </>
      ) : null}

      <section className="achievements-section">
        <h3>Osiągnięcia:</h3>
        <p>Ukończono {completedCourses} kursów</p>
      </section>

      <button className="btn" onClick={main}>
        Wróć do strony głównej
      </button>
    </div>
  );
};

export default ProgressTrackingPage;
