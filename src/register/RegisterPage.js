import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="container">
      <header>
        <h1 className="title">Dołącz do naszej społeczności!</h1>
        <p className="subtitle">
          Zarejestruj się, aby rozpocząć przygodę z naszą platformą.
        </p>
      </header>
      <main className="main-content">
        <RegisterForm />
        <p className="redirect">
          Masz już konto?{" "}
          <button onClick={handleLoginClick}>Zaloguj się tutaj</button>.
        </p>
      </main>
    </div>
  );
};

export default RegisterPage;
