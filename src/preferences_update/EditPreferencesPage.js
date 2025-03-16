import React from "react";
import { useNavigate } from "react-router-dom";
import EditPreferencesFeature from "./EditPreferencesFeature";

const EditPreferencesPage = () => {
  const navigate = useNavigate();
  const handleSave = (formData) => {
    const currentUserId = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUserId) {
      // Pobierz wszystkich użytkowników z localStorage
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      // Znajdź użytkownika po id
      const userIndex = storedUsers.findIndex(
        (user) => user.id === currentUserId.id
      );

      if (userIndex !== -1) {
        // Zaktualizuj preferencje użytkownika
        storedUsers[userIndex].preferences = formData.preferences;

        // Zapisz zaktualizowaną listę użytkowników w localStorage
        localStorage.setItem("users", JSON.stringify(storedUsers));

        // Powiadom użytkownika o zapisaniu zmian
        alert("Preferencje zostały zapisane");
      } else {
        alert("Użytkownik nie został znaleziony w bazie danych");
      }
    } else {
      alert(
        "Nie znaleziono użytkownika o podanym identyfikatorze. Proszę się zalogować"
      );
      navigate("/");
    }
  };

  const main = () => {
    navigate("/study_preferences");
  };

  return (
    <div className="page-container">
      <EditPreferencesFeature onSave={handleSave} goToData={main} />
    </div>
  );
};

export default EditPreferencesPage;
