import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CourseDetailFeature from "./CourseDetailFeature";

const CourseDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleSave = (courseId) => {
    // Pobierz dane bieżącego użytkownika
    const currentUserId = JSON.parse(localStorage.getItem("currentUser"));

    // Pobierz listę użytkowników z localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = storedUsers.find(
      (user) => user.id === parseInt(currentUserId.id)
    );

    if (!currentUser) {
      alert(
        "Nie znaleziono użytkownika o podanym identyfikatorze. Proszę się zalogować."
      );
      navigate("/");
      return;
    }

    // Kursy jako obiekty [{ id, progress }]
    let updatedCourses = currentUser.courses || [];

    // Sprawdź, czy kurs już istnieje na liście
    const courseExists = updatedCourses.some(
      (course) => course.id === courseId
    );

    if (!courseExists) {
      updatedCourses.push({
        id: courseId,
        finish: [],
        progress: 0,
        quiz_score: null,
      });

      // Zaktualizuj dane użytkownika
      const updatedUser = {
        ...currentUser,
        courses: updatedCourses,
      };

      // Znajdź indeks użytkownika i zaktualizuj w tablicy
      const userIndex = storedUsers.findIndex(
        (user) => user.id === currentUser.id
      );
      storedUsers[userIndex] = updatedUser;

      // Zapisz zaktualizowaną listę użytkowników w localStorage
      localStorage.setItem("users", JSON.stringify(storedUsers));

      // Powiadom użytkownika o zapisaniu
      alert("Zostałeś zapisany do kursu.");
    } else {
      alert("Już jesteś zapisany na ten kurs.");
    }
  };

  return (
    <div>
      <CourseDetailFeature courseId={id} onSave={handleSave} />{" "}
    </div>
  );
};

export default CourseDetailPage;
