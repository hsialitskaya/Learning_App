import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PreferencesFeature from "./PreferencesFeature";

const PreferencesPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleEditProfile = () => {
    navigate("/edit-preferences");
  };

  const goToMain = () => {
    navigate("/main");
  };

  useEffect(() => {
    const currentUserId = localStorage.getItem("currentUser");
    if (!currentUserId) {
      alert("Brak zalogowanego użytkownika. Proszę się zalogować.");
      navigate("/");
      return;
    }

    const parsedCurrentUserId = JSON.parse(currentUserId);
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = storedUsers.find(
      (user) => user.id === parseInt(parsedCurrentUserId.id, 10)
    );

    if (!currentUser) {
      alert(
        "Nie znaleziono użytkownika o podanym identyfikatorze. Proszę się zalogować."
      );
      navigate("/");
      return;
    }

    setUser(currentUser);
  }, [navigate]);

  return (
    <div className="container">
      <PreferencesFeature user={user} />
      <button onClick={handleEditProfile} className="btn">
        Zmień preferencje
      </button>
      <button onClick={goToMain} className="btn">
        Wróć do strony głównej
      </button>
    </div>
  );
};

export default PreferencesPage;
