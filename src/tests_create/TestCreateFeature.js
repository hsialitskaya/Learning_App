import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TestCreateFeature = ({ onSaveTest, existingTests, currentUserId }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { question: "", options: [{ answer: "", isCorrect: false }] },
    ]);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({
      answer: "",
      isCorrect: false,
    });
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex][field] =
      field === "isCorrect" ? value : value;
    setQuestions(updatedQuestions);
  };

  const handleSaveTest = () => {
    const existingQuestions = new Set();
    for (let q of questions) {
      if (existingQuestions.has(q.question)) {
        setError("Nie mogą być dwa takie same pytania.");
        return; // Prevent saving test if duplicate question is detected
      }
      existingQuestions.add(q.question);

      const existingAnswers = new Set();
      for (let option of q.options) {
        if (existingAnswers.has(option.answer)) {
          setError("Nie mogą być dwie takie same odpowiedzi w tym pytaniu.");
          return;
        }
        existingAnswers.add(option.answer);
      }
    }

    if (!title.trim() || !description.trim() || questions.length === 0) {
      setError("Tytuł, opis i przynajmniej jedno pytanie są wymagane.");
      return;
    }

    // Sprawdzenie, czy test o takim tytule już istnieje
    if (existingTests.some((test) => test.title === title)) {
      setError("Test o takim tytule już istnieje.");
      return;
    }

    // Dodajemy wyniki do testu
    const testWithResults = {
      title,
      description,
      questions,
      createdBy: currentUserId, // Dodajemy ID użytkownika, który stworzył test
    };

    // Przekazanie testu do rodzica
    onSaveTest(testWithResults);

    // Resetowanie formularza
    setTitle("");
    setDescription("");
    setQuestions([]);
    setError("");
  };

  return (
    <div className="container">
      <h2 className="title">Tworzenie testu</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div className="form">
        <div>
          <label>
            <strong>Tytuł testu:</strong>
          </label>
          <input
            type="text"
            placeholder="Wprowadź tytuł testu"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>
            <strong>Opis testu:</strong>
          </label>
          <textarea
            className="textarea-field "
            placeholder="Wprowadź opis testu"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          {questions.map((q, qIndex) => (
            <div key={qIndex} style={{ marginBottom: "20px" }}>
              <label>
                <strong>Pytanie {qIndex + 1}:</strong>
              </label>
              <input
                type="text"
                placeholder={`Pytanie ${qIndex + 1}`}
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              />
              <div style={{ marginLeft: "20px" }}>
                {q.options.map((option, oIndex) => (
                  <div
                    key={oIndex}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <input
                      type="text"
                      placeholder={`Odpowiedź ${oIndex + 1}`}
                      value={option.answer}
                      onChange={(e) =>
                        handleOptionChange(
                          qIndex,
                          oIndex,
                          "answer",
                          e.target.value
                        )
                      }
                      style={{ marginRight: "10px", flex: "1" }}
                    />
                    <div className="checkbox-group">
                      <label style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: "5px" }}>Poprawna:</span>
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) =>
                            handleOptionChange(
                              qIndex,
                              oIndex,
                              "isCorrect",
                              e.target.checked
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addOption(qIndex)}
                  className="btn btn-akcept"
                >
                  Dodaj odpowieź
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={addQuestion} className="btn btn-akcept ">
        Dodaj pytanie
      </button>
      <button onClick={handleSaveTest} className="btn">
        Zapisz test
      </button>
      <button onClick={() => navigate("/tests")} className="btn">
        Wróć do testów
      </button>
    </div>
  );
};

export default TestCreateFeature;
