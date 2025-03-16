import React from "react";
import UniversalLoginForm from "../components/UniversalLoginForm";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleResetPasswordClick = () => {
    navigate("/reset-password");
  };

  return (
    <div className="container">
      <header>
        <h1 className="title">Witaj ponownie!</h1>
        <p className="subtitle">Zaloguj się, aby kontynuować.</p>
      </header>
      <main className="main-content">
        <UniversalLoginForm user="user" />
        <p className="redirect">
          Nie masz konta?{" "}
          <button onClick={handleRegisterClick}> Zarejestruj się tutaj</button>.
        </p>
        <p className="redirect">
          <button onClick={handleResetPasswordClick}>Zapomniałeś hasła?</button>
        </p>
      </main>
    </div>
  );
};

export default LoginPage;
