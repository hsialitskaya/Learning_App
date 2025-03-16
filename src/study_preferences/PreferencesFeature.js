import React from "react";

const PreferencesFeature = ({ user }) => {
  if (!user) {
    return <p>Ładowanie danych użytkownika...</p>;
  }
  return (
    <div>
      <h1 className="title">Preferencje:</h1>
      <ul>
        {user.preferences && user.preferences.length > 0 ? (
          user.preferences.map((preference, index) => (
            <li key={index}>{preference}</li>
          ))
        ) : (
          <li>Brak preferencji</li>
        )}
      </ul>
    </div>
  );
};

export default PreferencesFeature;
