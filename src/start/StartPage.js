import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const StartPage = () => {
  useEffect(() => {
    document.body.className = ""; // Resetujemy klasę dla motywu
    document.body.style.fontSize = "14px"; // Domyślny rozmiar czcionki
    document.body.style.fontFamily = "Arial"; // Domyślna czcionka
    document.body.style.lineHeight = "1.5"; // Domyślna wysokość linii
    document.body.style.letterSpacing = "normal"; // Domyślne odstępy między literami
    document.body.style.textAlign = "left"; // Domyślne wyrównanie tekstu
  }, []);
  return (
    <div className="container">
      <h1 className="title">Witaj na stronie głównej!</h1>
      <p className="subtitle">Wybierz opcję logowania lub rejestracji.</p>

      <div className="link-container">
        <Link to="/login" className="btn btn-primary">
          Zaloguj się
        </Link>
      </div>
      <div className="link-container">
        <Link to="/register" className="btn btn-secondary">
          Zarejestruj się
        </Link>
      </div>
      <div className="link-container">
        <Link to="/admin_login" className="btn btn-danger">
          Zaloguj się jako administrator
        </Link>
      </div>
    </div>
  );
};

export default StartPage;
