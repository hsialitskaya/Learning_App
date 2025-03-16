import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";

const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser?.id === "admin") {
      setIsAdmin(true);
    } else {
      alert(
        "Błąd: Musisz być administratorem, aby uzyskać dostęp do tego panelu."
      );
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser"); // Usuwamy dane użytkownika
    navigate("/"); // Przenosimy na stronę główną
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="title text-4xl font-extrabold text-center text-[#2c3e50] mb-8">
        Panel Administracyjny
      </h1>

      <nav className="main-buttons flex justify-center gap-8">
        <Link
          to="/admin/courses"
          className="text-[#86dce9] hover:text-[#6fced1] text-2xl font-semibold no-underline border-b-4 border-transparent hover:border-[#6fced1] transition-all duration-300 transform hover:scale-105 pb-2"
        >
          Kursy
        </Link>
        <Link
          to="/admin/users"
          className="text-[#86dce9] hover:text-[#6fced1] text-2xl font-semibold no-underline border-b-4 border-transparent hover:border-[#6fced1] transition-all duration-300 transform hover:scale-105 pb-2"
        >
          Użytkownicy
        </Link>
        <Link
          to="/admin/settings"
          className="text-[#86dce9] hover:text-[#6fced1] text-2xl font-semibold no-underline border-b-4 border-transparent hover:border-[#6fced1] transition-all duration-300 transform hover:scale-105 pb-2"
        >
          Ustawienia
        </Link>
      </nav>
      <div className="flex justify-center mt-8">
        <button
          onClick={handleLogout}
          className="bg-[lightgrey] text-white text-xl font-semibold py-2 px-4 rounded-full hover:bg-[#6fced1] transition-all duration-300"
        >
          Wyloguj się
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
