import React, { useEffect, useState } from "react";

// Komponent do wyświetlania materiałów lekcyjnych
const LessonFeature = ({ materials }) => {
  const basePath = "/materials"; // Ścieżka bazowa do folderu materials

  return (
    <div>
      {materials.map((material, index) => {
        const filePath = `${basePath}/${material.zawartosc}`;

        return (
          <div key={index} className="lesson">
            {material.typ === "tekst" && <TextContent filePath={filePath} />}
            {material.typ === "kod" && <CodeContent filePath={filePath} />}
            {material.typ === "audio" && (
              <div>
                <h3 className="subtitle">AudioBook</h3>
                <audio controls>
                  <source src={filePath} type="audio/mpeg" />
                  Twoja przeglądarka nie obsługuje plików audio.
                </audio>
              </div>
            )}
            {material.typ === "wideo" && (
              <>
                <h3 className="subtitle">Wideo</h3>
                <div className="video-container">
                  <VideoPlayer filePath={filePath} />
                </div>
              </>
            )}
            {material.typ === "prezentacja" && (
              <div>
                <h3 className="subtitle">Prezentacja</h3>
                <a
                  href={filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  <button>Przejdź do prezentacji</button>
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Komponent do pobrania i wyświetlenia zawartości pliku tekstowego
const TextContent = ({ filePath }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nie udało się pobrać pliku tekstowego.");
        }
        return response.text();
      })
      .then((data) => setContent(data))
      .catch((error) => console.error(error));
  }, [filePath]);

  return (
    <>
      <h3 className="subtitle">Tekst</h3>
      <div className="container">{content}</div>
    </>
  );
};

// Komponent do pobrania i wyświetlenia zawartości pliku z kodem
const CodeContent = ({ filePath }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Nie udało się pobrać pliku z kodem.");
        }
        return response.text();
      })
      .then((data) => setContent(data))
      .catch((error) => console.error(error));
  }, [filePath]);

  return (
    <>
      <h3 className="subtitle">Przykład kodu</h3>
      <pre>
        <code>{content}</code>
      </pre>
    </>
  );
};

// Komponent do wyświetlania wideo z lokalnego źródła
const VideoPlayer = ({ filePath }) => {
  return (
    <div>
      <video controls>
        <source src={filePath} type="video/mp4" />
        Twoja przeglądarka nie obsługuje wideo.
      </video>
    </div>
  );
};

export default LessonFeature;
