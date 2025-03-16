import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CoursesModuleFeature from "./CoursesModuleFeature"; // Import komponentu kursu
import coursesData from "../assets/courses.json"; // Import danych kursów

const CoursesModulePage = () => {
  const navigate = useNavigate();

  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);

  // Pobranie użytkownika z localStorage
  useEffect(() => {
    const currentUserId = JSON.parse(localStorage.getItem("currentUser")); // Pobieramy tylko ID użytkownika
    let currentUser = null;
    if (currentUserId) {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      currentUser = storedUsers.find(
        (user) => user.id === parseInt(currentUserId.id)
      );
      if (currentUser) {
        setUser(currentUser);
      }
    }
  }, []);

  useEffect(() => {
    const courseData = coursesData.find((course) => course.id === courseId);

    if (!courseData) {
      console.error("Kurs nie znaleziony.");
      return;
    }
    setCourse(courseData);
  }, [courseId]);

  const handleLessonStart = (lessonId) => {
    navigate(`/my_courses/${courseId}/${lessonId}`);
  };

  const main = () => {
    navigate("/my_courses");
  };

  const quiz = () => {
    navigate(`/quiz/${courseId}`);
  };

  const certificate = () => {
    navigate(`/my_courses/${courseId}/certificate`);
  };

  if (!course) return <p>Ładowanie kursu...</p>;

  return (
    <div>
      <CoursesModuleFeature
        course={course}
        onStartLesson={handleLessonStart}
        user={user}
        goBack={main}
        goToQuiz={quiz}
        downloadCertificate={certificate}
      />
    </div>
  );
};

export default CoursesModulePage;
