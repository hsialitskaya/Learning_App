import React, { useState, useEffect } from "react";
import TestCreateFeature from "./TestCreateFeature";

const TestCreatePage = () => {
  const [tests, setTests] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null); // ID aktualnie zalogowanego użytkownika

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch("http://localhost:5002/tests");
        if (!response.ok) {
          throw new Error("Błąd podczas pobierania testów.");
        }
        const data = await response.json();
        setTests(data);
      } catch (error) {
        console.error("Błąd podczas pobierania testów:", error);
      }
    };

    fetchTests();

    // Zapisujemy ID aktualnego użytkownika (możesz to zrobić na przykład z localStorage)
    const userId = JSON.parse(localStorage.getItem("currentUser"))?.id;
    setCurrentUserId(userId);
  }, []);

  const handleSaveTest = async (newTest) => {
    const newTestWithId = {
      id: tests.length ? tests[tests.length - 1].id + 1 : 1,
      ...newTest,
    };

    try {
      const response = await fetch("http://localhost:5002/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTestWithId),
      });

      if (!response.ok) {
        throw new Error("Błąd podczas zapisywania testu.");
      }

      setTests((prevTests) => [...prevTests, newTestWithId]);
      alert("Test zapisany pomyślnie!");
    } catch (error) {
      console.error("Błąd podczas zapisywania testu:", error);
      alert("Nie udało się zapisać testu.");
    }
  };

  return (
    <div>
      <TestCreateFeature
        onSaveTest={handleSaveTest}
        existingTests={tests}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default TestCreatePage;
