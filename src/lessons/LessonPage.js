import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import coursesData from "../assets/courses.json";
import LessonFeature from "./LessonFeature";

const LessonPage = () => {
  const navigate = useNavigate();

  const { courseId, lessonId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUserId = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUserId) {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const currentUser = storedUsers.find(
        (user) => user.id === parseInt(currentUserId.id, 10)
      );
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  const course = coursesData.find((course) => course.id === courseId);

  if (!course) {
    return <p>Kurs nie znaleziony.</p>;
  }

  const totalLessons = course.lekcje.length;

  const lesson = course.lekcje.find(
    (lesson) => lesson.numer === parseInt(lessonId, 10)
  );
  if (!lesson) {
    return <p>Lekcja nie znaleziona.</p>;
  }

  // Funkcja do zakończenia lekcji
  const handleFinishLesson = () => {
    // Skopiowanie użytkownika z localStorage
    const updatedUser = { ...user };

    // Znalezienie kursu użytkownika
    const courseIndex = updatedUser.courses.findIndex(
      (course) => course.id === courseId
    );

    if (courseIndex !== -1) {
      const courseToUpdate = updatedUser.courses[courseIndex];

      // Dodanie ID lekcji do listy ukończonych lekcji
      if (!courseToUpdate.finish.includes(lessonId)) {
        courseToUpdate.finish.push(lessonId);

        courseToUpdate.progress =
          (courseToUpdate.finish.length / totalLessons) * 100;
      }
    }

    // Zapisanie zaktualizowanego użytkownika w localStorage
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUserIndex = savedUsers.findIndex(
      (storedUser) => storedUser.id === updatedUser.id
    );

    if (currentUserIndex !== -1) {
      savedUsers[currentUserIndex] = updatedUser;
    }

    // Zapisanie użytkownika w localStorage
    localStorage.setItem("users", JSON.stringify(savedUsers));

    // Aktualizacja stanu komponentu
    setUser(updatedUser);
    navigate(`/my_courses/${courseId}`);
  };

  return (
    <div className="container">
      <h1 className="title">{lesson.nazwa}</h1>
      <LessonFeature materials={lesson.materiały} />
      <button onClick={handleFinishLesson} className="btn">
        Ukończ lekcję
      </button>
    </div>
  );
};

export default LessonPage;
