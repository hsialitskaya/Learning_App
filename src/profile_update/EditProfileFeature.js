import React, { useState, useEffect } from "react";

const EditProfileFeature = ({ onSave, goToData }) => {
  const [formData, setFormData] = useState({
    id: "", // ID użytkownika
    name: "",
    surname: "",
    username: "",
    email: "",
    photo: "dodaj zdjęcie",
    achievements: [], // Lista osiągnięć
  });

  const [newAchievement, setNewAchievement] = useState(""); // Pole dla nowego osiągnięcia

  useEffect(() => {
    const currentUserId = JSON.parse(localStorage.getItem("currentUser")); // Pobieramy tylko ID użytkownika
    let currentUser = null;
    if (currentUserId) {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      currentUser = storedUsers.find(
        (user) => user.id === parseInt(currentUserId.id)
      );
      if (currentUser) {
        setFormData(currentUser);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(formData); // Zapisujemy dane w localStorage
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim() !== "") {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, newAchievement],
      });
      setNewAchievement(""); // Czyścimy pole
    }
  };

  const handleRemoveAchievement = (index) => {
    const updatedAchievements = formData.achievements.filter(
      (ach, idx) => idx !== index
    );
    setFormData({ ...formData, achievements: updatedAchievements });
  };

  return (
    <div className="container">
      <h1 className="title">Edycja danych osobowych</h1>

      <form onSubmit={handleSave}>
        <div className="form form-container">
          <input
            type="text"
            name="name"
            placeholder="Imię"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="surname"
            placeholder="Nazwisko"
            value={formData.surname}
            onChange={handleChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Nazwa użytkownika"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <div>
            <label>Zdjęcie:</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            {formData.photo !== "dodaj zdjęcie" && (
              <img src={formData.photo} alt="Zdjęcie Preview" />
            )}
          </div>

          <div className="achievements-section">
            <h3>Osiągnięcia:</h3>
            <ul>
              {formData.achievements.map((achievement, index) => (
                <li key={index}>
                  {achievement}{" "}
                  <button
                    type="button"
                    onClick={() => handleRemoveAchievement(index)}
                  >
                    Usuń
                  </button>
                </li>
              ))}
            </ul>
            <input
              type="text"
              placeholder="Dodaj nowe osiągnięcie"
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
            />
            <button
              className="btn btn-akcept "
              type="button"
              onClick={handleAddAchievement}
              disabled={newAchievement.trim() === ""}
            >
              Dodaj osiągnięcie
            </button>
          </div>
          <button type="submit" className="btn">
            Zapisz zmiany
          </button>
        </div>
      </form>
      <button className="btn" onClick={goToData}>
        Wróć
      </button>
    </div>
  );
};

export default EditProfileFeature;
