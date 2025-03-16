import React from "react";

import UniversalLoginForm from "../../components/UniversalLoginForm";

const LoginPage = () => {
  return (
    <div className="container">
      <header>
        <h1 className="subtitle">
          Zaloguj się, aby kontynuować jako administrator.
        </h1>
      </header>
      <main className="main-content">
        <UniversalLoginForm user="admin" />
      </main>
    </div>
  );
};

export default LoginPage;
