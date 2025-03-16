import React, { useState, useEffect } from "react";
import coursesData from "../assets/courses.json";
import { useNavigate } from "react-router-dom";

const EffectiveFeature = () => {
  const [rankings, setRankings] = useState({
    topRated: [],
    topEnrolled: [],
    topCompleted: [],
    topQuizAccuracy: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const topRated = getTopRatedCourses(coursesData);
    const topEnrolled = getTopEnrolledCourses(coursesData, users);
    const topCompleted = getTopCompletedCourses(coursesData, users);
    const topQuizAccuracy = getTopQuizAccuracyCourses(coursesData, users);

    setRankings({
      topRated,
      topEnrolled,
      topCompleted,
      topQuizAccuracy,
    });
  }, []);

  // Ranking kursów po średniej ocenie
  const getTopRatedCourses = (courses) => {
    const coursesWithAverageRating = courses.map((course) => {
      const averageRating =
        course.oceny.reduce((sum, rating) => sum + rating, 0) /
        course.oceny.length;
      return { ...course, averageRating };
    });

    coursesWithAverageRating.sort((a, b) => b.averageRating - a.averageRating);
    return coursesWithAverageRating.slice(0, 5);
  };

  // Ranking kursów po liczbie zapisanych osób
  const getTopEnrolledCourses = (courses, users) => {
    const coursesWithEnrollments = courses.map((course) => {
      const enrolledUsers = users.filter(
        (user) =>
          user.courses &&
          user.courses.some((userCourse) => userCourse.id === course.id)
      ).length;
      return { ...course, enrolledUsers };
    });

    coursesWithEnrollments.sort((a, b) => b.enrolledUsers - a.enrolledUsers);
    return coursesWithEnrollments.slice(0, 5);
  };

  // Ranking kursów po liczbie ukończeń
  const getTopCompletedCourses = (courses, users) => {
    const coursesWithCompleted = courses.map((course) => {
      const completedUsers = users.filter(
        (user) =>
          user.courses &&
          user.courses.some(
            (userCourse) =>
              userCourse.id === course.id && userCourse.progress === 100
          )
      ).length;
      return { ...course, completedUsers };
    });

    coursesWithCompleted.sort((a, b) => b.completedUsers - a.completedUsers);
    return coursesWithCompleted.slice(0, 5);
  };

  // Ranking kursów z najwyższym wskaźnikiem poprawności odpowiedzi w quizach
  const getTopQuizAccuracyCourses = (courses, users) => {
    const coursesWithQuizAccuracy = courses.map((course) => {
      const totalCorrectAnswers = users.reduce((sum, user) => {
        if (user.courses && Array.isArray(user.courses)) {
          const userCourse = user.courses.find(
            (userCourse) => userCourse.id === course.id
          );
          if (userCourse && userCourse.quiz_score !== null) {
            return sum + userCourse.quiz_score;
          }
        }
        return sum;
      }, 0);

      const averageAccuracy = (totalCorrectAnswers / users.length).toFixed(2);

      return { ...course, averageAccuracy };
    });

    coursesWithQuizAccuracy.sort(
      (a, b) => b.averageAccuracy - a.averageAccuracy
    );
    return coursesWithQuizAccuracy.slice(0, 5);
  };

  return (
    <div className="container">
      <h1 className="title">Efektywność Kursów</h1>
      <div className="effectiveness">
        <h3
          className="subtitle"
          style={{ color: "#86dce9", fontWeight: "bold" }}
        >
          Top 5 Kursów z Najwyższą Średnią Oceną
        </h3>
        {rankings.topRated.map((course, index) => (
          <div key={course.id}>
            <p>
              {index + 1}. {course.nazwa} - Średnia Ocena:{" "}
              {course.averageRating}
            </p>
          </div>
        ))}
      </div>

      <div className="effectiveness">
        <h3
          className="subtitle"
          style={{ color: "#86dce9", fontWeight: "bold" }}
        >
          Top 5 Kursów po Liczbie Zapisanych Osób
        </h3>
        {rankings.topEnrolled.map((course, index) => (
          <div key={course.id}>
            <p>
              {index + 1}. {course.nazwa} - Liczba Zapisanych:{" "}
              {course.enrolledUsers}
            </p>
          </div>
        ))}
      </div>

      <div className="effectiveness">
        <h3
          className="subtitle"
          style={{ color: "#86dce9", fontWeight: "bold" }}
        >
          Top 5 Kursów po Liczbie Ukończeń
        </h3>
        {rankings.topCompleted.map((course, index) => (
          <div key={course.id}>
            <p>
              {index + 1}. {course.nazwa} - Liczba Ukończeń:{" "}
              {course.completedUsers}
            </p>
          </div>
        ))}
      </div>

      <div className="effectiveness">
        <h3
          className="subtitle"
          style={{ color: "#86dce9", fontWeight: "bold" }}
        >
          Top 5 Kursów z Najwyższym Wskaźnikiem Poprawności Odpowiedzi w Quizach
        </h3>
        {rankings.topQuizAccuracy.map((course, index) => (
          <div key={course.id}>
            <p>
              {index + 1}. {course.nazwa} - Wskaźnik Poprawności:{" "}
              {course.averageAccuracy}%
            </p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/main")} className="btn">
        Wróć do strony głównej
      </button>
    </div>
  );
};

export default EffectiveFeature;
