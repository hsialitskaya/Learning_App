import React, { useEffect, useState, useLayoutEffect } from "react";
import useToggleSections from "./useToggleSections";

// Hook do monitorowania rozmiaru okna
function useWindowSize() {
  const [width, setWidth] = useState(window.innerWidth);

  const resize = () => {
    setWidth(window.innerWidth);
  };

  useLayoutEffect(() => {
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return width;
}

const MainPageFeature = ({ onNavigate }) => {
  const { isMyOpen, isAppOpen, toggleMySection, toggleAppSection } =
    useToggleSections();

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const width = useWindowSize(); // Hook do uzyskania szerokości okna
  const isMobile = width < 748; // Ustalamy, że poniżej 768px wyświetlamy hamburgera

  const fetchProgrammingPhotos = async () => {
    try {
      const ACCESS_KEY = "-SLrzNG7WPXJcTMpKAR1GVj8jnhDiSkcq4hybxo2YWI";
      const response = await fetch(
        `https://api.unsplash.com/photos/random?client_id=${ACCESS_KEY}&count=10&query=programming blue`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammingPhotos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser"); // Usuwamy dane użytkownika
    onNavigate("/"); // Przenosimy na stronę główną
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); // Przełączanie stanu menu hamburgera
  };

  return (
    <div>
      <header className="main-header">
        <div className="main-buttons">
          {isMobile ? (
            // Jeśli ekran jest za mały, wyświetlamy hamburgera
            <button className="btn hamburger-menu" onClick={toggleMenu}>
              <span>☰</span>
            </button>
          ) : (
            <>
              <button className="btn main-button" onClick={toggleMySection}>
                Moje
              </button>
              {isMyOpen && (
                <div className="dropdown">
                  <button onClick={() => onNavigate("/profile")}>
                    Dane osobowe
                  </button>
                  <button onClick={() => onNavigate("/study_preferences")}>
                    Preferencje edukacyjne
                  </button>
                  <button onClick={() => onNavigate("/my_courses")}>
                    Moje kursy
                  </button>
                  <button onClick={() => onNavigate("/progress")}>
                    Mój progress
                  </button>
                  <button onClick={() => onNavigate("/my_analytics")}>
                    Utworzone kursy
                  </button>
                  <button onClick={handleLogout}>Wyloguj się</button>
                </div>
              )}

              <button className="btn main-button" onClick={toggleAppSection}>
                Aplikacja
              </button>
              {isAppOpen && (
                <div className="dropdown">
                  <button onClick={() => onNavigate("/courses-search")}>
                    Poznaj kursy
                  </button>
                  <button onClick={() => onNavigate("/effective")}>
                    Analiza kursów
                  </button>
                  <button onClick={() => onNavigate("/tests")}>Testy</button>
                  <button onClick={() => onNavigate("/discussions")}>
                    Forum dyskusyjne
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {isMobile && isMenuOpen && (
          // Jeśli ekran jest mały i menu jest otwarte, wyświetlamy rozwinięte menu
          <div className="mobile-menu">
            <div className="dropdown burger">
              <h3>Moje</h3>
              <button onClick={() => onNavigate("/profile")}>
                Dane osobowe
              </button>
              <button onClick={() => onNavigate("/study_preferences")}>
                Preferencje edukacyjne
              </button>
              <button onClick={() => onNavigate("/my_courses")}>
                Moje kursy
              </button>
              <button onClick={() => onNavigate("/progress")}>
                Mój progress
              </button>
              <button onClick={() => onNavigate("/my_analytics")}>
                Utworzone kursy
              </button>
              <button onClick={handleLogout}>Wyloguj się</button>
            </div>

            <div className="dropdown burger">
              <h3>Aplikacja</h3>
              <button onClick={() => onNavigate("/courses-search")}>
                Poznaj kursy
              </button>
              <button onClick={() => onNavigate("/effective")}>
                Analiza kursów
              </button>
              <button onClick={() => onNavigate("/tests")}>Testy</button>
              <button onClick={() => onNavigate("/discussions")}>
                Forum dyskusyjne
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="photo-gallery">
        {loading ? (
          <p>Ładowanie zdjęć...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : photos.length > 0 ? (
          photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.urls.small}
              alt={photo.alt_description || "Zdjęcie związane z programowaniem"}
              className="photo-item"
            />
          ))
        ) : (
          <p>Brak zdjęć do wyświetlenia</p>
        )}
      </main>

      <footer className="app-settings">
        <button
          onClick={() => onNavigate("/app_preferences")}
          className=".settings-btn"
        >
          <img src="settings.png" alt="Ustawienia" className="settings-icon" />
        </button>
      </footer>
    </div>
  );
};

export default MainPageFeature;
