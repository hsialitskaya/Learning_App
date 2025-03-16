import React, { useState, useEffect } from "react";

const EditPreferencesFeature = ({ onSave, goToData }) => {
  const [formData, setFormData] = useState({
    preferences: [], // Preferences field only
  });

  const availablePreferences = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Ruby",
    "PHP",
    "Go",
    "Swift",
    "Kotlin",
    "HTML",
    "CSS",
    "React",
    "Node.js",
    "Vue.js",
    "Angular",
    "TypeScript",
    "SQL",
    "Machine Learning",
    "Artificial Intelligence",
  ];

  // Pobierz dane użytkownika po załadowaniu komponentu
  useEffect(() => {
    const currentUserId = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUserId) {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const currentUser = storedUsers.find(
        (user) => user.id === currentUserId.id
      );
      if (currentUser) {
        setFormData({ preferences: currentUser.preferences || [] });
      }
    }
  }, []);

  // Funkcja do obsługi zmian w formularzu (kliknięcie w checkbox)
  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      preferences: formData.preferences.includes(value)
        ? formData.preferences.filter((pref) => pref !== value)
        : [...formData.preferences, value],
    });
  };

  // Funkcja do obsługi zapisu danych (wywoływana w EditPreferencesPage)
  const handleSave = (e) => {
    e.preventDefault();
    onSave(formData); // Wywołanie funkcji onSave z rodzica
  };

  return (
    <div className="container">
      <h1 className="title">Edycja preferencji programowania</h1>
      <form onSubmit={handleSave}>
        <h2 className="subtitle">Preferencje Programowania:</h2>
        <div className="checkbox-group">
          {availablePreferences.map((preference) => (
            <div key={preference}>
              <input
                type="checkbox"
                name="preferences"
                value={preference}
                checked={formData.preferences.includes(preference)}
                onChange={handleChange}
              />
              <label>{preference}</label>
            </div>
          ))}
        </div>

        <button type="submit" className="btn">
          Zapisz zmiany
        </button>
      </form>
      <button type="button" onClick={goToData} className="btn">
        Wróć
      </button>
    </div>
  );
};

export default EditPreferencesFeature;
