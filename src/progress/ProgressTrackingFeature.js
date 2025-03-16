import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import allCourses from "../assets/courses.json";

// Funkcja do przypisania odznak na podstawie ukończonych kursów
const getBadges = (completedCourses) => {
  const badges = [];
  if (completedCourses >= 1) {
    badges.push("Beginner Badge");
  }
  if (completedCourses >= 3) {
    badges.push("Intermediate Badge");
  }
  if (completedCourses >= 6) {
    badges.push("Advanced Badge");
  }
  return badges;
};

// Funkcja do znajdowania nazwy kursu na podstawie jego ID
const getCourseName = (courseId) => {
  const course = allCourses.find((course) => course.id === courseId);
  return course ? course.nazwa : `Kurs ${courseId}`;
};

const useProgressTracking = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [completedCourses, setCompletedCourses] = useState(0);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userData = users.find((user) => user.id === currentUser.id);

    if (!userData) {
      alert("Nie znaleziono użytkownika o podanym identyfikatorze.");
      navigate("/");
      return;
    }

    setUser(userData);

    const userCourses = userData.courses || [];
    const completed = userCourses.filter(
      (course) => course.progress === 100
    ).length;

    setCompletedCourses(completed);
  }, [navigate]);

  // Użycie useMemo do zapamiętania odznak
  const badges = useMemo(() => getBadges(completedCourses), [completedCourses]);

  return {
    user,
    badges,
    completedCourses,
  };
};

const renderCourses = (courses) => {
  return courses.map((course) => {
    const courseName = getCourseName(course.id);
    return (
      <div key={course.id} className="course-item">
        <h4>Kurs "{courseName}"</h4>
        <p>Postęp:</p>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <span style={{ width: `${course.progress}%` }}></span>
          </div>
          <span className="progress-text">{course.progress}%</span>
        </div>
      </div>
    );
  });
};

const renderCompletedCourses = (courses) => {
  if (!courses || courses.length === 0) {
    return <p>Brak ukończonych kursów</p>;
  }
  return courses
    .filter((course) => course.progress === 100)
    .map((course) => {
      const courseName = getCourseName(course.id);
      return (
        <div key={course.id} className="course-item">
          <h4>
            Kurs {courseName},
            {course.quiz_score !== null ? (
              <> wynik z quizu {course.quiz_score}%</>
            ) : (
              <> quiz nie ukończony</>
            )}
          </h4>
        </div>
      );
    });
};

export { useProgressTracking, renderCourses, renderCompletedCourses };
