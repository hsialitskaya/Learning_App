import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const handleChange = (e, setState, path = "") => {
  const { name, value, options } = e.target;

  const arrayFields = [
    "slowa_kluczowe",
    "oceny",
    "lekcje",
    "certyfikaty",
    "preferencje",
  ];

  let updatedValue;

  if (name === "preferencje" && options) {
    updatedValue = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
  } else {
    updatedValue = arrayFields.includes(name)
      ? value.split(",").map((item) => item.trim())
      : value;
  }

  // Sprawdzenie, czy setState jest funkcją
  if (typeof setState !== "function") {
    console.error("setState is not a function");
    return;
  }

  setState((prev) => {
    const keys = path ? [...path.split("."), name] : [name];
    let updated = { ...prev };

    keys.reduce((acc, key, idx) => {
      if (idx === keys.length - 1) {
        if (key === "czas_trwania") {
          const numberValue = updatedValue.replace(/\D/g, "");
          const unit = numberValue === "1" ? "tydzień" : "tygodnie";
          acc[key] = `${numberValue} ${unit}`;
        } else {
          acc[key] = updatedValue;
        }
      } else {
        acc[key] = { ...acc[key] };
      }
      return acc[key];
    }, updated);

    return updated;
  });
};

const CoursesCreatorFeature = ({ onCourseAdded }) => {
  const navigate = useNavigate();
  const [newCourse, setNewCourse] = useState({
    id: "",
    nazwa: "",
    kategoria: "",
    slowa_kluczowe: [],
    czas_trwania: "",
    poziom_trudnosci: "",
    oceny: [5],
    opis: "",

    lekcje: [],
    quiz: {
      pytania: [],
    },
    informacje_o_prowadzacym: {
      id: "",
      imie: "",
      doswiadczenie: "",
      certyfikaty: [],
    },
    preferencje: [],
    createdBy: "",
  });

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("currentUser"));
    if (userId) {
      setNewCourse((prev) => ({ ...prev, createdBy: String(userId.id) }));
    }
  }, []);

  const checkIfCourseExists = async (courseName) => {
    try {
      if (Array.isArray(courseName)) {
        courseName = courseName[0];
      }

      if (typeof courseName !== "string") {
        throw new Error("Nazwa kursu musi być ciągiem znaków.");
      }

      const response = await fetch("http://localhost:5002/courses");
      if (!response.ok) {
        throw new Error("Nie udało się pobrać kursów.");
      }

      const courses = await response.json();

      return courses.some(
        (course) =>
          course.nazwa &&
          typeof course.nazwa === "string" &&
          course.nazwa.toLowerCase() === courseName.toLowerCase()
      );
    } catch (error) {
      console.error("Błąd podczas sprawdzania kursów:", error);
      alert("Wystąpił błąd podczas sprawdzania kursów.");
      return false;
    }
  };

  const checkQuizUniqueness = (questions) => {
    const questionSet = new Set();
    const answerSet = new Set();

    for (const question of questions) {
      // Check if the question already exists in the set
      if (questionSet.has(question.pytanie)) {
        return false;
      }
      questionSet.add(question.pytanie);

      for (const answer of question.odpowiedzi) {
        const answerString = answer.trim().toLowerCase();

        if (answerSet.has(answerString)) {
          return false;
        }
        answerSet.add(answerString);
      }
    }

    return true;
  };

  const handleAddCourse = async () => {
    if (
      !newCourse.kategoria ||
      !newCourse.slowa_kluczowe ||
      !newCourse.czas_trwania ||
      !newCourse.poziom_trudnosci ||
      !newCourse.opis ||
      !newCourse.plan_lekcji ||
      !newCourse.lekcje ||
      !newCourse.quiz.pytania ||
      !newCourse.informacje_o_prowadzacym.imie ||
      !newCourse.informacje_o_prowadzacym.doswiadczenie ||
      !newCourse.informacje_o_prowadzacym.certyfikaty ||
      !newCourse.preferencje
    ) {
      alert("Wszystkie pola są wymagane.");
      return;
    }

    const isQuizValid = checkQuizUniqueness(newCourse.quiz.pytania);
    if (!isQuizValid) {
      alert("Pytania lub odpowiedzi są powtarzające się.");
      return;
    }

    const courseExists = await checkIfCourseExists(newCourse.nazwa);
    if (courseExists) {
      alert("Kurs o tej nazwie już istnieje.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5002/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        throw new Error("Nie udało się dodać kursu.");
      }

      const addedCourse = await response.json();
      onCourseAdded(addedCourse);
      alert("Kurs dodany pomyślnie!");
      setNewCourse({
        id: "",
        nazwa: "",
        kategoria: "",
        slowa_kluczowe: [],
        czas_trwania: "",
        poziom_trudnosci: "",
        oceny: [],
        opis: "",
        lekcje: [],
        quiz: { pytania: [] },
        informacje_o_prowadzacym: {
          id: "",
          imie: "",
          doswiadczenie: "",
          certyfikaty: [],
        },
        preferencje: [],
        createdBy: "",
      });
    } catch (error) {
      console.error("Błąd podczas dodawania kursu:", error);
      alert("Wystąpił błąd podczas dodawania kursu.");
    }
  };

  return (
    <div className="container">
      <h2 className="title" style={{ color: "#86dce9" }}>
        Dodaj Nowy Kurs
      </h2>
      <div onSubmit={(e) => e.preventDefault()} className="form form-container">
        <label>
          Nazwa:
          <input
            type="text"
            name="nazwa"
            value={newCourse.nazwa}
            onChange={(e) => handleChange(e, setNewCourse)}
          />
        </label>

        <label>
          Kategoria:
          <select
            name="kategoria"
            value={newCourse.kategoria}
            onChange={(e) => handleChange(e, setNewCourse)}
          >
            <option value="">Wybierz kategorię</option>
            <option value="Programowanie">Programowanie</option>
            <option value="Web Development">Web Development</option>
            <option value="Sztuczna inteligencja">Sztuczna inteligencja</option>
          </select>
        </label>

        <label>
          Słowa kluczowe (oddziel przecinkami):
          <input
            type="text"
            value={newCourse.slowa_kluczowe.join(", ")}
            onChange={(e) => {
              const updatedValue = e.target.value
                .split(",")
                .map((item) => item.trim());
              setNewCourse((prev) => ({
                ...prev,
                slowa_kluczowe: updatedValue,
              }));
            }}
          />
        </label>

        <label>
          Czas trwania (tygodnie):
          <input
            type="text"
            name="czas_trwania"
            value={newCourse.czas_trwania.split(" ")[0]}
            onChange={(e) => handleChange(e, setNewCourse)}
          />
        </label>

        <label>
          Poziom trudności:
          <select
            name="poziom_trudnosci"
            value={newCourse.poziom_trudnosci}
            onChange={(e) => handleChange(e, setNewCourse)}
          >
            <option value="">Wybierz poziom</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>

        <label>
          Opis:
          <textarea
            name="opis"
            value={newCourse.opis}
            onChange={(e) => handleChange(e, setNewCourse)}
            className="textarea-field"
          />
        </label>

        <div className="preferences">
          <label>
            <p className="subtitle">Preferencje:</p>
            <div className="checkbox-group">
              {[
                "JavaScript",
                "Python",
                "Java",
                "C++",
                "C#",
                "Ruby",
                "PHP",
                "Go",
                "Swift",
                "Kotlin",
                "HTML",
                "CSS",
                "React",
                "Node.js",
                "Vue.js",
                "Angular",
                "TypeScript",
                "SQL",
                "Machine Learning",
                "Artificial Intelligence",
              ].map((tech) => (
                <div key={tech} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={tech}
                    name="preferencje"
                    value={tech}
                    checked={newCourse.preferencje.includes(tech)}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setNewCourse((prev) => {
                        let updatedPreferencje = [...prev.preferencje];
                        if (checked) {
                          updatedPreferencje.push(value);
                        } else {
                          updatedPreferencje = updatedPreferencje.filter(
                            (pref) => pref !== value
                          );
                        }
                        return { ...prev, preferencje: updatedPreferencje };
                      });
                    }}
                  />
                  <label htmlFor={tech}>{tech}</label>
                </div>
              ))}
            </div>
          </label>
          <div>
            {newCourse.preferencje.length > 0 && (
              <>
                <h3 className="subtitle" style={{ marginTop: "20px" }}>
                  Wybrane preferencje:
                </h3>
                <ul>
                  {newCourse.preferencje.map((pref, index) => (
                    <li key={index}>{pref}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <InstructorDetailsForm
          newCourse={newCourse}
          setNewCourse={setNewCourse}
        />
        <LessonForm newCourse={newCourse} setNewCourse={setNewCourse} />
        <QuizForm newCourse={newCourse} setNewCourse={setNewCourse} />

        <div>
          <button type="button" onClick={handleAddCourse} className="btn">
            Dodaj nowy kurs
          </button>
          <button
            type="button"
            onClick={() => navigate("/courses-search")}
            className="btn"
          >
            Wróć do kursów
          </button>
        </div>
      </div>
    </div>
  );
};

const InstructorDetailsForm = ({ newCourse, setNewCourse }) => {
  return (
    <>
      <div className="form form-container">
        <h3 className="title">Informacje o prowadzącym</h3>

        <label>
          Imię:
          <input
            type="text"
            name="imie"
            value={newCourse.informacje_o_prowadzacym.imie}
            onChange={(e) =>
              handleChange(e, setNewCourse, "informacje_o_prowadzacym")
            }
          />
        </label>

        <label>
          Doświadczenie:
          <textarea
            name="doswiadczenie"
            value={newCourse.informacje_o_prowadzacym.doswiadczenie}
            onChange={(e) =>
              handleChange(e, setNewCourse, "informacje_o_prowadzacym")
            }
            className="textarea-field"
          ></textarea>
        </label>

        <label>
          Certyfikaty:
          <input
            type="text"
            value={newCourse.informacje_o_prowadzacym.certyfikaty.join(", ")}
            onChange={(e) => {
              const updatedValue = e.target.value
                .split(",")
                .map((item) => item.trim());
              setNewCourse((prev) => ({
                ...prev,
                informacje_o_prowadzacym: {
                  ...prev.informacje_o_prowadzacym,
                  certyfikaty: updatedValue,
                },
              }));
            }}
          />
        </label>
      </div>
    </>
  );
};

const LessonForm = ({ newCourse, setNewCourse }) => {
  const [newLesson, setNewLesson] = useState({
    numer: 1,
    nazwa: "",
    materiały: [],
  });
  const [newMaterial, setNewMaterial] = useState({
    typ: "tekst",
    zawartosc: null,
  });

  const handleLessonInputChange = (e) => {
    const { name, value } = e.target;
    setNewLesson((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaterialTypeChange = (e) => {
    const { value } = e.target;
    setNewMaterial((prev) => ({ ...prev, typ: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewMaterial((prev) => ({ ...prev, zawartosc: file }));
  };

  const addMaterial = () => {
    if (!newMaterial.zawartosc) {
      alert("Nie wybrano pliku do dodania.");
      return;
    }

    setNewLesson((prev) => ({
      ...prev,
      materiały: [
        ...prev.materiały,
        { typ: newMaterial.typ, zawartosc: newMaterial.zawartosc.name },
      ],
    }));

    setNewMaterial({ typ: "tekst", zawartosc: null });
  };

  const addLesson = () => {
    if (!newLesson.nazwa || newLesson.materiały.length === 0) {
      alert("Lekcja musi mieć nazwę i co najmniej jeden materiał.");
      return;
    }

    setNewCourse((prev) => {
      const updatedLessons = [
        ...prev.lekcje,
        { ...newLesson, numer: prev.lekcje.length + 1 },
      ];
      const updatedPlanLekcji = updatedLessons.map((lesson) => lesson.nazwa);

      return {
        ...prev,
        lekcje: updatedLessons,
        plan_lekcji: updatedPlanLekcji,
      };
    });

    setNewLesson({ numer: 1, nazwa: "", materiały: [] });
  };

  return (
    <>
      <h3 className="title">Dodaj lekcję</h3>
      <div className="form form-container">
        <label>
          Nazwa lekcji:
          <input
            type="text"
            name="nazwa"
            value={newLesson.nazwa}
            onChange={handleLessonInputChange}
          />
        </label>

        <h4 className="subtitle">Dodanie materiałów:</h4>

        <label>
          Typ materiału:
          <select value={newMaterial.typ} onChange={handleMaterialTypeChange}>
            <option value="tekst">Tekst</option>
            <option value="wideo">Wideo</option>
            <option value="audio">Audio</option>
            <option value="kod">Kod</option>
            <option value="prezentacja">Prezentacja</option>
          </select>
        </label>

        <label>
          Wybierz plik:
          <input
            type="file"
            accept={
              newMaterial.typ === "tekst"
                ? ".txt"
                : newMaterial.typ === "wideo"
                ? ".mp4"
                : newMaterial.typ === "audio"
                ? ".mp3"
                : newMaterial.typ === "kod"
                ? ".js"
                : newMaterial.typ === "prezentacja"
                ? ".pdf"
                : "*/*"
            }
            onChange={handleFileChange}
          />
        </label>
      </div>

      <button type="button" onClick={addMaterial} className="btn btn-course">
        Dodaj materiał
      </button>

      <div>
        {newLesson.materiały.length > 0 && (
          <>
            <h4 className="subsubtitle">Materiały do lekcji:</h4>
            <ul>
              {newLesson.materiały.map((material, index) => (
                <li key={index}>
                  {material.typ}: {material.zawartosc}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <button
        className="btn btn-course"
        type="button"
        onClick={addLesson}
        disabled={newLesson.materiały.length === 0}
      >
        Dodaj lekcję
      </button>
      <div>
        {newCourse.lekcje.length > 0 && (
          <>
            <h4>Lista lekcji:</h4>
            <ul>
              {newCourse.lekcje.map((lesson) => (
                <li key={lesson.numer}>
                  {lesson.numer}. {lesson.nazwa} - {lesson.materiały.length}{" "}
                  materiał(ów)
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

const QuizForm = ({ newCourse, setNewCourse }) => {
  const addQuizQuestion = () => {
    const newQuestion = {
      pytanie: "",
      odpowiedzi: ["", "", ""],
      poprawna_odpowiedz: 0,
    };

    setNewCourse((prev) => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        pytania: [...prev.quiz.pytania, newQuestion],
      },
    }));
  };

  const handleQuizChange = (index, field, value) => {
    const updatedQuestions = [...newCourse.quiz.pytania];
    updatedQuestions[index][field] = value;

    setNewCourse((prev) => ({
      ...prev,
      quiz: { ...prev.quiz, pytania: updatedQuestions },
    }));
  };

  return (
    <>
      <h3 className="title">Quiz</h3>
      <div className="form form-container">
        {newCourse.quiz.pytania.map((question, index) => (
          <div key={index}>
            <label>
              Pytanie:
              <input
                type="text"
                value={question.pytanie}
                onChange={(e) =>
                  handleQuizChange(index, "pytanie", e.target.value)
                }
              />
            </label>

            <label>
              Odpowiedź 1:
              <input
                type="text"
                value={question.odpowiedzi[0]}
                onChange={(e) =>
                  handleQuizChange(index, "odpowiedzi", [
                    e.target.value,
                    question.odpowiedzi[1],
                    question.odpowiedzi[2],
                  ])
                }
              />
            </label>

            <label>
              Odpowiedź 2:
              <input
                type="text"
                value={question.odpowiedzi[1]}
                onChange={(e) =>
                  handleQuizChange(index, "odpowiedzi", [
                    question.odpowiedzi[0],
                    e.target.value,
                    question.odpowiedzi[2],
                  ])
                }
              />
            </label>

            <label>
              Odpowiedź 3:
              <input
                type="text"
                value={question.odpowiedzi[2]}
                onChange={(e) =>
                  handleQuizChange(index, "odpowiedzi", [
                    question.odpowiedzi[0],
                    question.odpowiedzi[1],
                    e.target.value,
                  ])
                }
              />
            </label>

            <label>
              Poprawna odpowiedź:
              <select
                value={question.poprawna_odpowiedz}
                onChange={(e) =>
                  handleQuizChange(index, "poprawna_odpowiedz", e.target.value)
                }
              >
                <option value="0">Odpowiedź 1</option>
                <option value="1">Odpowiedź 2</option>
                <option value="2">Odpowiedź 3</option>
              </select>
            </label>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addQuizQuestion}
        className="btn btn-course"
      >
        Dodaj pytanie
      </button>
    </>
  );
};

export default CoursesCreatorFeature;
