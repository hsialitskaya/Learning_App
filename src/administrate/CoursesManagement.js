import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import coursesData from "../assets/courses.json";

const CoursesManagement = () => {
  const navigate = useNavigate();
  const courses = useRef([...coursesData]);

  const handleDeleteCourse = async (id) => {
    try {
      const response = await fetch(`http://localhost:5002/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Nie udało się usunąć kursu.");
      }

      courses.current = courses.current.filter((course) => course.id !== id);

      alert("Kurs usunięty pomyślnie!");
    } catch (error) {
      console.error("Błąd podczas usuwania kursu:", error);
      alert("Wystąpił błąd podczas usuwania kursu.");
    }
  };

  return (
    <>
      <div className="container">
        <h2 className="title">Zarządzanie Kursami</h2>
        <ul>
          {courses.current.map((course) => (
            <li key={course.id}>
              <strong>{course.nazwa}</strong> ({course.kategoria}){" "}
              {!course.createdBy && (
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="btn btn-course w-[70%]"
                >
                  Usuń
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => navigate("/admin")}
        className="fixed bottom-8 right-8 bg-[#86dce9] text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-[#6fced1] transition-colors"
      >
        Wróć do panelu administracyjnego
      </button>
    </>
  );
};

export default CoursesManagement;
