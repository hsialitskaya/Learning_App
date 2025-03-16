import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiscussionFeature from "./DiscussionFeature";

const DiscussionPage = () => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [userDate, setUserDate] = useState(null);

  const API_URL = "http://localhost:5002/discussion";

  // Pobierz wszystkie dyskusje
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Błąd podczas pobierania dyskusji");
        }
        const data = await response.json();
        setDiscussions(data);
      } catch (error) {
        console.error("Błąd podczas pobierania dyskusji:", error);
      }
    };

    // Pobierz dane o aktualnym użytkowniku
    const checkUserAndFetch = () => {
      const currentUserId = JSON.parse(localStorage.getItem("currentUser"));
      let currentUser = null;

      if (currentUserId) {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        currentUser = storedUsers.find((user) => user.id === currentUserId.id);
      }

      if (currentUser) {
        setUserDate(currentUser);
        fetchDiscussions(); // Pobierz dyskusje tylko jeśli użytkownik istnieje
      } else {
        navigate("/"); // Nawiguj, jeśli użytkownik nie został znaleziony
      }
    };

    checkUserAndFetch();
  }, [navigate]); // Dodaj `navigate` do zależności

  if (!userDate) {
    return null; // Nie renderuj nic, dopóki użytkownik nie zostanie załadowany
  }

  // Dodaj nową dyskusję
  const addDiscussion = async (title) => {
    const newDiscussion = {
      id: discussions.length ? discussions[discussions.length - 1].id + 1 : 1, // Inkrementacja ID
      title,
      messages: [],
      createdBy: userDate.username, // Dodajemy informację o twórcy dyskusji
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDiscussion),
      });
      if (!response.ok) {
        throw new Error("Błąd podczas dodawania dyskusji");
      }
      setDiscussions((prev) => [...prev, newDiscussion]);
    } catch (error) {
      console.error("Błąd podczas dodawania dyskusji:", error);
    }
  };

  // Dodaj wiadomość do dyskusji
  const addMessage = async () => {
    if (!newMessage.trim() || !selectedDiscussion) return;

    const updatedDiscussion = {
      ...selectedDiscussion,
      messages: [
        ...selectedDiscussion.messages,
        {
          discussionId: selectedDiscussion.id,
          author: userDate.username,
          content: newMessage,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      const response = await fetch(`${API_URL}/${selectedDiscussion.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDiscussion),
      });
      if (!response.ok) {
        throw new Error("Błąd podczas dodawania wiadomości");
      }
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === selectedDiscussion.id ? updatedDiscussion : d
        )
      );
      setSelectedDiscussion(updatedDiscussion);
      setNewMessage("");
    } catch (error) {
      console.error("Błąd podczas dodawania wiadomości:", error);
    }
  };

  // Usuń dyskusję
  const deleteDiscussion = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Błąd podczas usuwania dyskusji");
      }
      setDiscussions((prev) => prev.filter((d) => d.id !== id));
      setSelectedDiscussion(null);
    } catch (error) {
      console.error("Błąd podczas usuwania dyskusji:", error);
    }
  };

  // Usuń wiadomość
  const deleteMessage = async (messageId) => {
    if (!selectedDiscussion) return;

    const updatedDiscussion = {
      ...selectedDiscussion,
      messages: selectedDiscussion.messages.filter(
        (msg) => msg.timestamp !== messageId
      ),
    };

    try {
      const response = await fetch(`${API_URL}/${selectedDiscussion.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDiscussion),
      });
      if (!response.ok) {
        throw new Error("Błąd podczas usuwania wiadomości");
      }
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === selectedDiscussion.id ? updatedDiscussion : d
        )
      );
      setSelectedDiscussion(updatedDiscussion);
    } catch (error) {
      console.error("Błąd podczas usuwania wiadomości:", error);
    }
  };

  return (
    <div>
      {selectedDiscussion ? (
        <div className="container">
          <h2 className="title">{selectedDiscussion.title}</h2>
          <ul>
            {selectedDiscussion.messages.map((msg, index) => (
              <li key={index}>
                <strong>{msg.author}</strong>: {msg.content}{" "}
                <em>({new Date(msg.timestamp).toLocaleString()})</em>
                {msg.author === userDate.username && (
                  <button
                    onClick={() => deleteMessage(msg.timestamp)}
                    className="btn btn-course"
                    style={{
                      backgroundColor: " #e74c3c",
                      width: "100px",
                      marginLeft: "10px",
                    }}
                  >
                    Usuń
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <form className="form form-container" style={{ display: "flex" }}>
              <input
                type="text"
                placeholder="Napisz wiadomość..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px",
                  fontSize: "16px",
                }}
              />
            </form>
            <button onClick={addMessage} className="btn" style={{ flex: 1 }}>
              Dodaj wiadomość
            </button>
          </div>
          <button onClick={() => setSelectedDiscussion(null)} className="btn">
            Powrót do listy
          </button>
        </div>
      ) : (
        <DiscussionFeature
          user={userDate}
          discussions={discussions}
          onSelectDiscussion={setSelectedDiscussion}
          onAddDiscussion={addDiscussion}
          onDeleteDiscussion={deleteDiscussion}
        />
      )}
    </div>
  );
};

export default DiscussionPage;
