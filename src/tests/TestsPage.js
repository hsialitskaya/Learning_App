import React, { useEffect, useState, useCallback } from "react";

import TestsFeature from "./TestsFeature";

const TestPage = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [userDate, setUserDate] = useState(null);
  const [done, setDone] = useState([]);

  const API_URL = "http://localhost:5002/tests";

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Błąd podczas pobierania testów");
        }
        const data = await response.json();
        setTests(data);
      } catch (error) {
        console.error("Błąd podczas pobierania testów:", error);
      }
    };

    const currentUserId = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUserId) {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const currentUser = storedUsers.find(
        (user) => user.id === currentUserId.id
      );
      if (currentUser) {
        setUserDate(currentUser);
        setDone(currentUser.tests || []);
      }
    }

    fetchTests();
  }, []);

  const calculateScore = useCallback((test) => {
    let calculatedScore = 0;
    test.questions.forEach((q) => {
      q.options.forEach((option) => {
        if (option.isCorrect && option.selected) {
          calculatedScore += 1;
        }
      });
    });
    return calculatedScore;
  }, []);

  const handleSubmitTest = async (testId) => {
    if (!userDate) {
      alert("Błąd: Musisz być zalogowany, aby zapisać wyniki testu.");
      return;
    }

    if (!selectedTest) return;

    const calculatedScore = calculateScore(selectedTest);

    const updateTestURL = `http://localhost:5002/tests/${testId}`;
    try {
      const response = await fetch(updateTestURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userDate.id, score: calculatedScore }),
      });

      if (!response.ok) {
        throw new Error("Błąd podczas zapisywania wyników");
      }

      alert(`Twój wynik: ${calculatedScore}`);
      setSelectedTest(null);

      if (!done.includes(testId)) {
        const updatedDone = [...done, testId];
        setDone(updatedDone);

        const updatedUserTests = [
          ...new Set([...(userDate.tests || []), testId]),
        ];
        const updatedUserDate = { ...userDate, tests: updatedUserTests };

        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = storedUsers.findIndex(
          (user) => user.id === userDate.id
        );

        if (userIndex !== -1) {
          storedUsers[userIndex] = updatedUserDate;
          localStorage.setItem("users", JSON.stringify(storedUsers));
        }
      }
    } catch (error) {
      console.error("Błąd podczas zapisywania testów:", error);
    }
  };

  const handleDeleteTest = async (testId) => {
    const testToDelete = tests.find((test) => test.id === testId);

    if (!testToDelete || testToDelete.createdBy !== userDate.id) {
      alert("Nie możesz usunąć tego testu.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5002/tests/${testId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Błąd podczas usuwania testu.");
      }

      setTests(tests.filter((test) => test.id !== testId));
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = storedUsers.map((user) => ({
        ...user,
        tests: user.tests.filter((id) => id !== testId),
      }));
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      alert("Test usunięty pomyślnie!");
    } catch (error) {
      console.error("Błąd podczas usuwania testu:", error);
      alert("Nie udało się usunąć testu.");
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: 1 }}>
        <TestsFeature
          user={userDate}
          tests={tests}
          done={done}
          onSelectTest={setSelectedTest}
          onDeleteTest={handleDeleteTest}
        />
      </div>

      <div
        style={{ flex: 1, borderLeft: "1px solid #ccc", paddingLeft: "20px" }}
        className="container"
      >
        {selectedTest ? (
          <div>
            <h2 className="Title">{selectedTest.title}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitTest(selectedTest.id);
              }}
            >
              {selectedTest.questions?.map((q, index) => (
                <div key={index}>
                  <p className="subtitle">
                    {" "}
                    Pytanie {index + 1}: {q.question}
                  </p>
                  <div className="checkbox-group">
                    {q.options?.map((option, i) => (
                      <label key={i}>
                        <input
                          style={{
                            marginLeft: "10px",
                            marginRight: "5px",
                            verticalAlign: "middle",
                          }}
                          type="checkbox"
                          name={`question-${index}`}
                          value={option.answer}
                          checked={!!option.selected}
                          onChange={() => {
                            const updatedQuestions = [
                              ...selectedTest.questions,
                            ];
                            updatedQuestions[index].options[i].selected =
                              !updatedQuestions[index].options[i].selected;
                            setSelectedTest({
                              ...selectedTest,
                              questions: updatedQuestions,
                            });
                          }}
                        />
                        {option.answer}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button type="submit" className="btn">
                Zakończ test
              </button>
            </form>
          </div>
        ) : (
          <div>Wybierz test, aby rozpocząć.</div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
