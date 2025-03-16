import React from "react";

const ProfileFeature = ({ user, onEditProfile, onDeleteProfile, goToMain }) => {
  return (
    <div className="container">
      <h1 className="title">Dane osobowe</h1>
      <p className="subtitle">
        Zdjęcie:{" "}
        {user.photo ? (
          <img src={user.photo} alt="Zdjęcie użytkownika" />
        ) : (
          "Brak zdjęcia"
        )}
      </p>
      <p className="subtitle">Imię: {user.name || "Brak danych"}</p>
      <p className="subtitle">Nazwisko: {user.surname || "Brak danych"}</p>
      <p className="subtitle">
        Nazwa użytkownika: {user.username || "Brak danych"}
      </p>
      <p className="subtitle">Email: {user.email || "Brak danych"}</p>
      <p className="subtitle">Własne osiągnięcia:</p>
      <div className="osiagniecia">
        {user.achievements && user.achievements.length > 0 ? (
          <ul>
            {user.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        ) : (
          <p className="subtitle">Brak osiągnięć</p>
        )}
      </div>
      <button onClick={onEditProfile} className="btn">
        Zmień dane osobowe
      </button>
      <button onClick={onDeleteProfile} className="btn">
        Usuń profil
      </button>
      <button onClick={goToMain} className="btn">
        Wróć do strony głównej
      </button>
    </div>
  );
};

export default ProfileFeature;
