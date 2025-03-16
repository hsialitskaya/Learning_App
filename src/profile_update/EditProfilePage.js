import React from "react";
import { useNavigate } from "react-router-dom";
import EditProfileFeature from "./EditProfileFeature";

const EditProfilePage = () => {
  const navigate = useNavigate();

  const handleSave = (formData) => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = storedUsers.findIndex((user) => user.id === formData.id);

    if (userIndex !== -1) {
      // Zaktualizowanie danych użytkownika w tablicy
      storedUsers[userIndex] = formData;

      // Zapisanie zaktualizowanej tablicy użytkowników, bez zmiany currentUser
      localStorage.setItem("users", JSON.stringify(storedUsers));

      alert("Dane zostały zapisane");
    } else {
      alert(
        "Nie znaleziono użytkownika o podanym identyfikatorze. Proszę się zalogować"
      );
      navigate("/");
    }
  };

  const main = () => {
    navigate("/profile");
  };

  return (
    <div>
      <EditProfileFeature onSave={handleSave} goToData={main} />
    </div>
  );
};

export default EditProfilePage;
