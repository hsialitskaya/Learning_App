import React, { useState, useEffect } from "react";
import MyCoursesFeature from "../my_courses/MyCoursesFeature";
import { useNavigate } from "react-router-dom";
import coursesData from "../assets/courses.json";

const MyCoursesPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [savedCourses, setSavedCourses] = useState([]);

  useEffect(() => {
    const currentUserId = JSON.parse(localStorage.getItem("currentUser"));

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = storedUsers.find(
      (user) => user.id === parseInt(currentUserId.id, 10)
    );

    if (!currentUser) {
      alert(
        "Nie znaleziono użytkownika o podanym identyfikatorze. Proszę się zalogować."
      );
      navigate("/");
      return;
    }

    setUserData(currentUser);
    setSavedCourses(currentUser.courses || []);
  }, [navigate]);

  // Funkcja do rozpoczęcia kursu
  const handleStartCourse = (courseId) => {
    navigate(`/my_courses/${courseId}`);
  };

  // Funkcja do usunięcia kursu
  const handleRemoveCourse = (courseId) => {
    const updatedCourses = savedCourses.filter((elem) => elem.id !== courseId);
    setSavedCourses(updatedCourses);

    const currentUserId = JSON.parse(localStorage.getItem("currentUser"));
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUserIndex = storedUsers.findIndex(
      (user) => user.id === parseInt(currentUserId.id)
    );

    if (currentUserIndex !== -1) {
      storedUsers[currentUserIndex].courses = updatedCourses;
      localStorage.setItem("users", JSON.stringify(storedUsers));
    }

    alert("Kurs został usunięty.");
  };

  // Pobieranie szczegółów kursu
  const getCourseDetails = (courseId) => {
    return coursesData.find((course) => course.id === courseId);
  };

  const main = () => {
    navigate("/main");
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="container">
      <MyCoursesFeature
        savedCourses={savedCourses}
        savedCoursesDetails={savedCourses
          .map((elem) => elem.id)
          .map(getCourseDetails)
          .filter(Boolean)}
        onStartCourse={handleStartCourse}
        onRemoveCourse={handleRemoveCourse}
        goToMain={main}
      />
    </div>
  );
};

export default MyCoursesPage;
