import React from "react";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "./preferences-context";

const UserPreferences = () => {
  const navigate = useNavigate();
  const { preferences, setPreferences } = usePreferences();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const goToMain = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem("users"));
      const userData = users.find((user) => user.id === currentUser.id);
      if (userData) {
        userData.application_preferences = preferences;
        localStorage.setItem("users", JSON.stringify(users));
      }
    }
    navigate("/main");
  };

  return (
    <div className="container">
      <h2 className="title">Dostosowanie aplikacji</h2>
      <div className="form form-container">
        <div>
          <label>Motyw:</label>
          <select
            name="theme"
            value={preferences.theme}
            onChange={handleChange}
          >
            <option value="light">Jasny</option>
            <option value="dark">Ciemny</option>
            <option value="pink">Różowy</option>
          </select>
        </div>
        <div>
          <label>Rozmiar czcionki:</label>
          <select
            name="fontSize"
            value={preferences.fontSize}
            onChange={handleChange}
          >
            <option value="small">Mały</option>
            <option value="medium">Średni</option>
            <option value="large">Duży</option>
          </select>
        </div>
        <div>
          <label>Czcionka:</label>
          <select
            name="fontFamily"
            value={preferences.fontFamily}
            onChange={handleChange}
          >
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </select>
        </div>
        <div>
          <label>Wysokość linii:</label>
          <select
            name="lineHeight"
            value={preferences.lineHeight}
            onChange={handleChange}
          >
            <option value="1.2">1.2</option>
            <option value="1.5">1.5</option>
            <option value="2">2</option>
          </select>
        </div>
        <div>
          <label>Odstępy między literami:</label>
          <select
            name="letterSpacing"
            value={preferences.letterSpacing}
            onChange={handleChange}
          >
            <option value="normal">Normalne</option>
            <option value="0.5px">0.5px</option>
            <option value="1px">1px</option>
            <option value="2px">2px</option>
          </select>
        </div>
      </div>
      <button onClick={goToMain} className="btn">
        Wróć do strony głównej
      </button>
    </div>
  );
};

export default UserPreferences;
