import React from "react";
import { useNavigate } from "react-router-dom";

const TestFeature = ({ user, tests, onSelectTest, onDeleteTest, done }) => {
  const navigate = useNavigate();

  const main = () => {
    navigate("/main");
  };

  const createTest = () => {
    navigate("/test-create");
  };

  const handleStartTest = (test) => {
    onSelectTest(test);
  };

  return (
    <>
      <div className="container">
        <h1 className="title">Lista testów</h1>
        {tests.length === 0 ? (
          <p>Brak testów</p>
        ) : (
          tests.map((test) => (
            <div key={test.id}>
              <h2>{test.title}</h2>
              <p>{test.description}</p>
              {done.indexOf(test.id) === -1 ? (
                <button
                  onClick={() => handleStartTest(test)}
                  className="btn btn-course"
                >
                  Rozpocznij test
                </button>
              ) : (
                <button
                  onClick={() => handleStartTest(test)}
                  className="btn btn-akcept"
                >
                  Rozwiąż test ponownie
                </button>
              )}

              {user && test.createdBy === user.id && (
                <button
                  onClick={() => onDeleteTest(test.id)}
                  style={{
                    backgroundColor: "#f05d5e",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    padding: "5px 10px",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  Usuń test
                </button>
              )}
            </div>
          ))
        )}
      </div>
      <button onClick={createTest} className="btn">
        Zrób swój test
      </button>
      <button onClick={main} className="btn">
        Wróć do strony głównej
      </button>
    </>
  );
};

export default TestFeature;
