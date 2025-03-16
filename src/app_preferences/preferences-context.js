import React, { createContext, useContext, useState, useEffect } from "react";

// Tworzenie kontekstu
const PreferencesContext = createContext();

// Provider kontekstu
export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    theme: "light",
    fontSize: "medium",
    fontFamily: "Arial",
    lineHeight: "1.5",
    letterSpacing: "normal",
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem("users"));
      const userData = users.find((user) => user.id === currentUser.id);
      if (userData && userData.application_preferences) {
        setPreferences(userData.application_preferences);
      }
    }
  }, []);

  useEffect(() => {
    // Aktualizacja stylów w body
    document.body.className = preferences.theme;
    document.body.style.fontSize =
      preferences.fontSize === "small"
        ? "10px"
        : preferences.fontSize === "large"
        ? "18px"
        : "14px";
    document.body.style.fontFamily = preferences.fontFamily;
    document.body.style.lineHeight = preferences.lineHeight;
    document.body.style.letterSpacing = preferences.letterSpacing;
  }, [preferences]);

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

// Custom hook dla łatwego dostępu do kontekstu
export const usePreferences = () => useContext(PreferencesContext);
