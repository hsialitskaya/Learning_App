import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import coursesData from "../assets/courses.json";

// Reducer do zarządzania stanem kursów
const coursesReducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTERED_COURSES":
      return { ...state, filteredCourses: action.payload };
    case "SET_TOP_RATED_COURSES":
      return { ...state, topRatedCourses: action.payload };
    default:
      return state;
  }
};

const CoursesFeature = () => {
  const [state, dispatch] = useReducer(coursesReducer, {
    filteredCourses: [],
    topRatedCourses: [],
  });

  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    keywords: [],
    difficulty: "",
    duration: "",
    minRating: 0,
  });
  const [preferencesApplied, setPreferencesApplied] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleKeywordsChange = (e) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      keywords: value.split(",").map((keyword) => keyword.trim()),
    }));
  };

  const applyUserPreferences = () => {
    const currentUserId = JSON.parse(localStorage.getItem("currentUser"));
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = storedUsers.find(
      (user) => user.id === parseInt(currentUserId.id)
    );

    if (preferencesApplied) {
      // Jeśli preferencje zostały już zastosowane, resetujemy filtry, by pokazać wszystkie kursy
      setFilters({
        category: "",
        keywords: [],
        difficulty: "",
        duration: "",
        minRating: 0,
      });
      setPreferencesApplied(false); // Zmieniamy stan, bo klikamy ponownie
    } else {
      // Jeśli preferencje nie zostały jeszcze zastosowane, ustawiamy filtry na preferencje użytkownika
      if (currentUser && currentUser.preferences) {
        setFilters({
          category: "",
          keywords: currentUser.preferences || [],
          difficulty: "",
          duration: "",
          minRating: 0,
        });
        setPreferencesApplied(true); // Zmieniamy stan na "zastosowane"
      } else {
        alert("Nie znaleziono preferencji użytkownika.");
      }
    }
  };
  const goToMain = () => {
    navigate("/main");
  };

  const myCourse = () => {
    navigate("/course_creator");
  };

  const getAverageRating = (ratings) => {
    const total = ratings.reduce((acc, rating) => acc + rating, 0);
    const average = total / ratings.length;
    return parseFloat(average.toFixed(2));
  };

  useEffect(() => {
    const filterCourses = ({
      category = "",
      keywords = [],
      difficulty = "",
      duration = "",
      minRating = 0,
    }) => {
      return coursesData.filter((course) => {
        const courseAvgRating = getAverageRating(course.oceny);

        const matchesCategory = category
          ? course.kategoria.toLowerCase().includes(category.toLowerCase())
          : true;
        const matchesKeywords =
          keywords.length > 0
            ? keywords.some((keyword) =>
                course.slowa_kluczowe.some((word) =>
                  word.toLowerCase().includes(keyword.toLowerCase())
                )
              )
            : true;
        const matchesDifficulty = difficulty
          ? course.poziom_trudnosci.toLowerCase() === difficulty.toLowerCase()
          : true;
        const matchesDuration = duration
          ? course.czas_trwania.toLowerCase().includes(duration.toLowerCase())
          : true;
        const matchesRating = courseAvgRating >= minRating;

        return (
          matchesCategory &&
          matchesKeywords &&
          matchesDifficulty &&
          matchesDuration &&
          matchesRating
        );
      });
    };

    const filtered = filterCourses(filters);
    dispatch({ type: "SET_FILTERED_COURSES", payload: filtered });

    // Jeśli filtry są puste lub minimalne, nie zmieniaj Top 3
    if (Object.values(filters).some((value) => value !== "" && value !== 0)) {
      const topRated = [...filtered]
        .sort((a, b) => getAverageRating(b.oceny) - getAverageRating(a.oceny))
        .slice(0, 3);
      dispatch({ type: "SET_TOP_RATED_COURSES", payload: topRated });
    } else {
      // Jeśli filtry są puste, ustaw Top 3 z całej bazy
      const topRated = [...coursesData]
        .sort((a, b) => getAverageRating(b.oceny) - getAverageRating(a.oceny))
        .slice(0, 3);
      dispatch({ type: "SET_TOP_RATED_COURSES", payload: topRated });
    }
  }, [filters]);

  const handleCourseClick = (courseId) => {
    navigate(`/courses-search/${courseId}`);
  };

  const handleCourseFeedbackClick = (courseId) => {
    navigate(`/courses-search/${courseId}/feedback-course`);
  };

  const handleInstructorFeedbackClick = (courseId) => {
    navigate(`/courses-search/${courseId}/feedback-instructor`);
  };

  return (
    <>
      <h1 className="title" style={{ textAlign: "center", marginTop: "10px" }}>
        Zaawansowane wyszukiwanie kursów
      </h1>
      <div className="main-content">
        <div className="main-buttons ">
          <button onClick={applyUserPreferences} className="btn btn-course">
            Pokaż kursy zgodnie z moimi preferencjami
          </button>
          <button onClick={myCourse} className="btn btn-course">
            Stwórz swój własny kurs
          </button>
          <button onClick={goToMain} className="btn btn-course">
            Wróć do strony głównej
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
          <form className="form form-search" style={{ flex: "1" }}>
            <label>
              Kategoria:
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">Wybierz kategorię</option>
                <option value="Programowanie">Programowanie</option>
                <option value="Web Development">Web Development</option>
                <option value="Sztuczna inteligencja">
                  Sztuczna inteligencja
                </option>
              </select>
            </label>
            <br />

            <label>
              Słowa kluczowe:
              <input
                type="text"
                name="keywords"
                value={filters.keywords.join(", ")}
                onChange={handleKeywordsChange}
                placeholder="Np. JavaScript, React"
              />
            </label>
            <br />

            <label>
              Poziom trudności:
              <select
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
              >
                <option value="">Wybierz poziom</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </label>
            <br />

            <label>
              Czas trwania:
              <input
                type="text"
                name="duration"
                value={filters.duration}
                onChange={handleFilterChange}
                placeholder="Np. 4 tygodnie"
              />
            </label>
            <br />

            <label>
              Minimalna ocena:
              <input
                type="number"
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
                min="0"
                max="5"
              />
            </label>
            <br />
          </form>
          <div className="top-rated-container" style={{ flex: "2" }}>
            <h3 className="title">
              Top 3 kursy według najwyższej oceny zgodne z filtrami
            </h3>
            {state.topRatedCourses.length > 0 ? (
              state.topRatedCourses.map((course, index) => (
                <div key={course.id} className="course-card">
                  <h4>
                    {index + 1}. {course.nazwa}
                  </h4>
                  <p>
                    <strong>Średnia ocena:</strong>{" "}
                    {getAverageRating(course.oceny)}
                  </p>
                </div>
              ))
            ) : (
              <p>Brak danych do wyświetlenia.</p>
            )}
          </div>
        </div>
      </div>
      <div className="courses-container">
        <h2 className="title">Wyniki wyszukiwania</h2>

        {state.filteredCourses.length > 0 ? (
          state.filteredCourses.map((course, index) => (
            <div key={index} className="course-card">
              <h3>{course.nazwa}</h3>
              <p>
                <strong>Kategoria:</strong> {course.kategoria}
              </p>
              <p>
                <strong>Poziom trudności:</strong> {course.poziom_trudnosci}
              </p>
              <p>
                <strong>Czas trwania:</strong> {course.czas_trwania}
              </p>
              <p>
                <strong>Średnia ocena:</strong> {getAverageRating(course.oceny)}
              </p>
              <p>
                <strong>Opis:</strong> {course.opis}
              </p>
              <div className="main-buttons ">
                <button
                  onClick={() => handleCourseClick(course.id)}
                  className="btn btn-course"
                >
                  Więcej o kursie
                </button>
                <button
                  onClick={() => handleCourseFeedbackClick(course.id)}
                  className="btn btn-course"
                >
                  Opinie o kursie
                </button>
                <button
                  onClick={() => handleInstructorFeedbackClick(course.id)}
                  className="btn btn-course"
                >
                  Opinie o prowadzącym
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Brak wyników pasujących do podanych kryteriów.</p>
        )}
      </div>
    </>
  );
};

export default CoursesFeature;
