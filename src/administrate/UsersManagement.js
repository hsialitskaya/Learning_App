import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const UsersManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  // Wczytaj użytkowników z localStorage przy załadowaniu komponentu
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(savedUsers);
  }, []);

  const handleDeleteUser = async (userData) => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = storedUsers.filter((user) => user.id !== userData.id);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    // Wysyłamy żądanie do serwera, aby zaktualizować dyskusje
    try {
      // Pobierz wszystkie dyskusje z serwera
      const responseDiscussions = await fetch(
        `http://localhost:5002/discussion`
      );
      const discussions = await responseDiscussions.json();

      // Zaktualizuj autorów dyskusji utworzonych przez usuniętego użytkownika
      for (let discussion of discussions) {
        if (discussion.createdBy === userData.username) {
          const updatedDiscussion = {
            ...discussion,
            createdBy: "deleted_user", // Ustawienie autora na 'deleted_user'
          };

          // Wykonaj PUT na serwerze, aby zaktualizować dyskusję
          await fetch(`http://localhost:5002/discussion/${discussion.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedDiscussion),
          });
        }
      }

      // Pobierz wszystkie wiadomości z serwera
      const responseMessages = await fetch(`http://localhost:5002/messages`);
      const messages = await responseMessages.json();

      // Zaktualizuj autorów wiadomości napisanych przez usuniętego użytkownika
      for (let message of messages) {
        if (message.author === userData.username) {
          const updatedMessage = {
            ...message,
            author: "deleted_user", // Ustawienie autora na 'deleted_user'
          };

          // Znajdź dyskusję, do której należy ta wiadomość
          const discussion = discussions.find(
            (discussion) => discussion.id === message.discussionId
          );

          // Wykonaj PUT na serwerze, aby zaktualizować wiadomość
          if (discussion) {
            await fetch(
              `http://localhost:5002/discussion/${discussion.id}/message/${message.author}`, // Możesz użyć timestamp jako unikalnego identyfikatora wiadomości
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedMessage),
              }
            );
          }
        }
      }
      // Pobierz wszystkie testy
      const responseTests = await fetch("http://localhost:5002/tests");
      if (!responseTests.ok) {
        throw new Error("Błąd podczas pobierania testów.");
      }
      const tests = await responseTests.json();

      // Zaktualizuj każdy test
      for (let test of tests) {
        let testUpdated = false;

        // Zmień `createdBy` na "deleted_user", jeśli użytkownik jest twórcą
        if (test.createdBy === userData.id) {
          test.createdBy = "deleted_user";
          testUpdated = true;
        }

        // Usuń wyniki użytkownika z `results`
        if (test.results) {
          const initialLength = test.results.length;
          test.results = test.results.filter(
            (result) => result.id !== userData.id
          );
          if (test.results.length !== initialLength) {
            testUpdated = true;
          }
        }

        if (testUpdated) {
          await fetch(`http://localhost:5002/tests`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(test),
          });
        }
      }
    } catch (error) {
      console.error(
        "Błąd podczas aktualizacji dyskusji, wiadomości lub testów:",
        error
      );
    }
    // Wyślij żądanie do usunięcia użytkownika z bazy
    await fetch(`http://localhost:5002/users/${userData.id}/delete-feedback`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: userData.username }),
    });

    alert("Użytkownik usunięty!");
  };

  return (
    <>
      <div className="container">
        <h2 className="title">Zarządzanie użytkownikami</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.username}{" "}
              <button
                onClick={() => handleDeleteUser(user)}
                className="btn p-0"
              >
                Usuń użytkownika
              </button>
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

export default UsersManagement;
