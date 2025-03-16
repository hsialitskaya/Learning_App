import React, { useState, useEffect } from "react";
import coursesData from "../assets/courses.json";
import { useNavigate } from "react-router-dom";
import MyCoursesAnalyticsFeature from "./MyCoursesAnalyticsFeature";

const MyCoursesAnalyticsPage = () => {
  const [myCourses, setMyCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (currentUser) {
      const filteredCourses = coursesData.filter(
        (course) => Number(course.createdBy) === currentUser.id
      );

      const coursesWithDetails = filteredCourses.map((course) => {
        const participants =
          users && users.length > 0
            ? users.filter(
                (user) =>
                  user.courses &&
                  user.courses.some((userCourse) => userCourse.id === course.id)
              )
            : [];

        const completedCount = participants.filter((participant) =>
          participant.courses.some(
            (userCourse) =>
              userCourse.id === course.id && userCourse.progress === 100
          )
        ).length;

        return {
          ...course,
          participants,
          enrolledCount: participants.length,
          completedCount,
        };
      });

      setMyCourses(coursesWithDetails);
    }
  }, []);

  const handleDeleteCourse = async (id) => {
    try {
      const response = await fetch(`http://localhost:5002/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Nie udało się usunąć kursu.");
      }

      setMyCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id)
      );

      alert("Kurs usunięty pomyślnie!");
    } catch (error) {
      console.error("Błąd podczas usuwania kursu:", error);
      alert("Wystąpił błąd podczas usuwania kursu.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Analiza Moich Kursów</h1>
      {myCourses.length > 0 ? (
        <div>
          {myCourses.map((course) => (
            <div className="course-item" key={course.id}>
              <MyCoursesAnalyticsFeature
                course={course}
                onDelete={handleDeleteCourse}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="subtitle">Brak kursów utworzonych przez Ciebie.</p>
      )}
      <button className="btn" onClick={() => navigate("/main")}>
        Wróć do strony głównej
      </button>
    </div>
  );
};

export default MyCoursesAnalyticsPage;
