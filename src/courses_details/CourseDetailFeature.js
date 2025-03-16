import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import coursesData from "../assets/courses.json";

const CourseDetailFeature = ({ courseId, onSave }) => {
  const navigate = useNavigate();
  const course = coursesData.find((course) => course.id === courseId); // Search for the course by ID

  if (!course) {
    return <p>Kurs nie został znaleziony.</p>;
  }

  // Function to navigate back to courses page
  const handleBackToCourses = () => {
    navigate("/courses-search"); // Navigate back to the courses page
  };

  return (
    <div className="container">
      <h1 className="title">{course.nazwa}</h1>
      <p className="subtitle">
        <strong>Opis:</strong> {course.opis}
      </p>
      <p>
        <strong>Plan lekcji:</strong>{" "}
      </p>
      <ul>
        {course.plan_lekcji.map((lekcja, index) => (
          <li key={index}>{lekcja}</li>
        ))}
      </ul>

      <p style={{ paddingTop: "20px" }}>
        <strong>Prowadzący:</strong>
      </p>
      <ul>
        <li>
          <strong>Imię i nazwisko:</strong>{" "}
          {course.informacje_o_prowadzacym.imie}
        </li>
        <li>
          <strong>Doświadczenie:</strong>{" "}
          {course.informacje_o_prowadzacym.doswiadczenie}
        </li>
        <li>
          <strong>Certyfikaty:</strong>
          <ul>
            {course.informacje_o_prowadzacym.certyfikaty.map(
              (certyfikat, index) => (
                <li key={index}>{certyfikat}</li>
              )
            )}
          </ul>
        </li>
      </ul>

      <p style={{ paddingTop: "20px" }}>
        <strong>Recenzje:</strong>
      </p>
      <div>
        <ul>
          {["5", "4", "3", "2", "1"].map((ratingValue) => {
            // Count how many times each rating appears
            const count = course.oceny.filter(
              (rating) => rating === parseInt(ratingValue)
            ).length;

            return count > 0 ? (
              <li key={ratingValue}>
                Ocenę {ratingValue} zaznaczyło {count} użytkownik(a/ów)
              </li>
            ) : null;
          })}
        </ul>
      </div>

      <button onClick={() => onSave(course.id)} className="btn">
        Zapisz się na kurs
      </button>
      <button onClick={handleBackToCourses} className="btn">
        Wróć do kursów
      </button>
    </div>
  );
};

export default CourseDetailFeature;
