import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [platformSettings, setPlatformSettings] = useState({
    platformName: "",
    contactEmail: "",
    contactPhone: "", // Dodane pole dla numeru telefonu
  });

  // Wczytanie ustawień z serwera
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("http://localhost:5002/settings");
        if (response.ok) {
          const data = await response.json();
          setPlatformSettings(data);
        } else {
          console.error("Błąd wczytywania ustawień");
        }
      } catch (error) {
        console.error("Błąd wczytywania ustawień:", error);
      }
    };

    loadSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlatformSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch("http://localhost:5002/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(platformSettings),
      });

      if (response.ok) {
        alert("Ustawienia zapisane pomyślnie!");
      } else {
        alert("Błąd podczas zapisywania ustawień.");
      }
    } catch (error) {
      console.error("Błąd serwera:", error);
      alert("Błąd serwera podczas zapisywania ustawień.");
    }
  };

  return (
    <>
      <div className="container">
        <h2 className="title">Ustawienia platformy</h2>
        <div className="form">
          <label>
            Nazwa platformy:
            <input
              type="text"
              name="platformName"
              value={platformSettings.platformName}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            E-mail kontaktowy:
            <input
              type="email"
              name="contactEmail"
              value={platformSettings.contactEmail}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Numer telefonu kontaktowego:
            <input
              type="tel"
              name="contactPhone"
              value={platformSettings.contactPhone}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <br />
        <button onClick={handleSaveSettings} className="btn">
          Zapisz
        </button>
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

export default Settings;
