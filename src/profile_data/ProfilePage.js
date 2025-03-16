import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileFeature from "./ProfileFeature";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleDeleteProfile = () => {
    navigate("/delete-profile");
  };

  const main = () => {
    navigate("/main");
  };

  // Wczytywanie zapisanych kursów z localStorage na początku działania aplikacji
  useEffect(() => {
    const currentUserId = JSON.parse(localStorage.getItem("currentUser"));

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = storedUsers.find(
      (user) => user.id === parseInt(currentUserId.id, 10)
    );

    if (!currentUser) {
      alert(
        "Nie znaleziono użytkownika o podanym identyfikatorze. Proszę się zalogować."
      );
      navigate("/"); // Redirect to the home page or login
      return;
    }

    // Set the user data and their saved courses
    setUserData(currentUser);
  }, [navigate]);

  // Early return to prevent rendering the component if no user data is found
  if (!userData) {
    return null; // Return null until userData is loaded or redirect is complete
  }

  return (
    <ProfileFeature
      user={userData}
      goToMain={main}
      onEditProfile={handleEditProfile}
      onDeleteProfile={handleDeleteProfile}
    />
  );
};

export default ProfilePage;
