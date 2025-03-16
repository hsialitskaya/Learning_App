const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5002;

// Ścieżki do plików
const settingsPath = path.join(__dirname, "./assets/settings.json");
const coursesPath = path.join(__dirname, "./assets/courses.json");
const discussionPath = path.join(__dirname, "./assets/discussions.json");
const testsPath = path.join(__dirname, "./assets/tests.json");

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// ======Ustawienia======
// Endpoint do pobierania ustawień
app.get("/settings", (req, res) => {
  fs.readFile(settingsPath, "utf-8", (err, data) => {
    if (err) {
      console.error("Błąd wczytywania ustawień:", err);
      return res.status(500).json({ message: "Błąd wczytywania ustawień" });
    }
    try {
      const settings = JSON.parse(data);
      res.json(settings);
    } catch (parseError) {
      console.error("Błąd parsowania ustawień:", parseError);
      return res.status(500).json({ message: "Błąd parsowania ustawień" });
    }
  });
});

// Endpoint do zapisywania ustawień
app.post("/settings", (req, res) => {
  const updatedSettings = req.body;

  if (
    !updatedSettings.platformName ||
    !updatedSettings.contactEmail ||
    !updatedSettings.contactPhone
  ) {
    console.warn("Niekompletne dane w żądaniu:", updatedSettings);
    return res.status(400).json({ message: "Wszystkie pola są wymagane." });
  }

  fs.writeFile(
    settingsPath,
    JSON.stringify(updatedSettings, null, 2),
    "utf-8",
    (err) => {
      if (err) {
        console.error("Błąd zapisywania ustawień:", err);
        return res.status(500).json({ message: "Błąd zapisywania ustawień" });
      }
      res.status(200).json({ message: "Ustawienia zapisane pomyślnie!" });
    }
  );
});

// ========Kursy=======
// Funkcja pomocnicza do odczytu pliku JSON
const readCoursesFile = () => {
  try {
    if (!fs.existsSync(coursesPath)) {
      throw new Error("Plik JSON nie istnieje.");
    }
    return JSON.parse(fs.readFileSync(coursesPath, "utf8"));
  } catch (error) {
    console.error("Błąd odczytu pliku:", error);
    throw new Error("Nie można odczytać danych.");
  }
};

// Funkcja pomocnicza do zapisu do pliku JSON
const writeCoursesFile = (data) => {
  try {
    fs.writeFileSync(coursesPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Błąd zapisu pliku:", error);
    throw new Error("Nie można zapisać danych.");
  }
};

// Endpoint do pobierania kursów
app.get("/courses", (req, res) => {
  fs.readFile(coursesPath, "utf8", (err, data) => {
    if (err) {
      console.error("Błąd wczytywania kursów:", err);
      return res.status(500).send("Błąd serwera.");
    }
    const courses = JSON.parse(data);
    res.json(courses);
  });
});

// Endpoint do pobierania konkretnego kursu
app.get("/courses/:courseId", (req, res) => {
  try {
    const { courseId } = req.params;
    const courses = readCoursesFile();
    const course = courses.find((item) => item.id == courseId);

    if (!course) {
      console.warn(`Nie znaleziono kursu o ID: ${courseId}`);
      return res.status(404).json({ message: "Nie znaleziono kursu." });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Błąd w /courses/:courseId:", error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint do dodawania kursu
app.post("/courses", (req, res) => {
  const newCourse = req.body;

  fs.readFile(coursesPath, "utf8", (err, data) => {
    if (err) {
      console.error("Błąd wczytywania kursów:", err);
      return res.status(500).send("Błąd serwera.");
    }

    const courses = JSON.parse(data);

    // Przypisanie ID kursu i instruktora
    let instructorId;
    const existingInstructor = courses.find(
      (course) =>
        course.informacje_o_prowadzacym.imie ===
        newCourse.informacje_o_prowadzacym.imie
    );

    if (existingInstructor) {
      // Jeśli istnieje, przypisz ID istniejącego prowadzącego
      instructorId = String(existingInstructor.informacje_o_prowadzacym.id);
      newCourse.informacje_o_prowadzacym.doswiadczenie =
        existingInstructor.informacje_o_prowadzacym.doswiadczenie;
      newCourse.informacje_o_prowadzacym.certyfikaty =
        existingInstructor.informacje_o_prowadzacym.certyfikaty;
    } else {
      // Jeśli nie istnieje, przypisz nowe ID (najwyższe ID + 1)
      const maxInstructorId = Math.max(
        ...courses.map(
          (course) => course.informacje_o_prowadzacym.id || 0 // Domyślnie 0, jeśli brak ID
        )
      );
      instructorId = String(maxInstructorId + 1);
    }

    newCourse.informacje_o_prowadzacym.id = instructorId;

    // Przypisanie ID nowego kursu
    const maxCourseId = Math.max(...courses.map((course) => course.id || 0));
    newCourse.id = String(maxCourseId + 1);

    courses.push(newCourse);

    fs.writeFile(coursesPath, JSON.stringify(courses, null, 2), (err) => {
      if (err) {
        console.error("Błąd zapisywania kursu:", err);
        return res.status(500).send("Błąd zapisywania kursu.");
      }

      res.json(newCourse);
    });
  });
});

// Endpoint do usunęcia kursu
app.delete("/courses/:id", (req, res) => {
  const courseId = parseInt(req.params.id);

  fs.readFile(coursesPath, "utf8", (err, data) => {
    if (err) {
      console.error("Błąd wczytywania kursów:", err);
      return res.status(500).send("Błąd serwera.");
    }

    let courses = JSON.parse(data);

    courses = courses.filter((course) => parseInt(course.id) !== courseId);

    fs.writeFile(coursesPath, JSON.stringify(courses, null, 2), (err) => {
      if (err) {
        console.error("Błąd zapisywania kursów:", err);
        return res.status(500).send("Błąd zapisywania kursów.");
      }

      res.status(200).send({ message: "Kurs usunięty pomyślnie" });
    });
  });
});

// =======Opinie=========

// Endpoint do dodawania opinii
app.post("/courses/:courseId/feedback", (req, res) => {
  try {
    const { courseId } = req.params;
    const { userName, rating, comment, anonymous, target } = req.body;

    // Walidacja, aby upewnić się, że rating jest liczbą
    if (
      !userName ||
      !rating ||
      !comment ||
      anonymous === undefined ||
      !target ||
      isNaN(rating) // Sprawdzenie, czy rating jest liczbą
    ) {
      console.warn("Niekompletne dane opinii:", req.body);
      return res.status(400).json({ message: "Brak wymaganych danych." });
    }

    const courses = readCoursesFile();
    const course = courses.find((item) => item.id == courseId);

    if (!course) {
      console.warn(`Nie znaleziono kursu o ID: ${courseId}`);
      return res.status(404).json({ message: "Nie znaleziono kursu." });
    }

    // Dodanie oceny do tablicy "oceny"
    if (!course.oceny) {
      course.oceny = [];
    }
    course.oceny.push(parseInt(rating, 10));

    if (target === "course") {
      course.feedback = course.feedback || [];
      course.feedback.push({ userName, rating, comment, anonymous });
    } else if (target === "instructor") {
      course.informacje_o_prowadzacym.feedback =
        course.informacje_o_prowadzacym.feedback || [];
      course.informacje_o_prowadzacym.feedback.push({
        userName,
        rating,
        comment,
        anonymous,
      });
    } else {
      console.warn("Nieprawidłowy target opinii:", target);
      return res.status(400).json({ message: "Nieprawidłowy target opinii." });
    }

    writeCoursesFile(courses);
    res.status(200).json({ message: "Opinia zapisana." });
  } catch (error) {
    console.error("Błąd podczas dodawania opinii:", error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint do usuniecie opinii
app.delete("/users/:userId/delete-feedback", (req, res) => {
  try {
    const { userId } = req.params;
    const { userName } = req.body;

    // Wczytaj dane kursów z pliku
    let courses = readCoursesFile();

    // Filtruj opinie i usuń te związane z użytkownikiem
    courses = courses.map((course) => {
      if (course.feedback) {
        course.feedback = course.feedback.filter(
          (feedback) => feedback.userName !== userName
        );
      }
      if (
        course.informacje_o_prowadzacym &&
        course.informacje_o_prowadzacym.feedback
      ) {
        course.informacje_o_prowadzacym.feedback =
          course.informacje_o_prowadzacym.feedback.filter(
            (feedback) => feedback.userName !== userName
          );
      }
      return course;
    });

    // Zapisz zaktualizowane dane do pliku
    writeCoursesFile(courses);

    res
      .status(200)
      .json({ message: "Feedback użytkownika został pomyślnie usunięty." });
  } catch (error) {
    console.error("Błąd podczas usuwania opinii:", error);
    res
      .status(500)
      .json({ error: "Wystąpił błąd podczas usuwania opinii użytkownika." });
  }
});

function getDiscussions() {
  const data = fs.readFileSync(discussionPath);
  return JSON.parse(data);
}

function saveDiscussions(discussions) {
  fs.writeFileSync(discussionPath, JSON.stringify(discussions, null, 2));
}

// =====Dyskusje=======

// Endpoint do pobierania dyskusji
app.get("/discussion", (req, res) => {
  const discussions = getDiscussions();
  res.json(discussions);
});

// Endpoint do dodawania dyskusji
app.post("/discussion", (req, res) => {
  const discussions = getDiscussions();
  const newDiscussion = req.body;
  discussions.push(newDiscussion);
  saveDiscussions(discussions);
  res.status(201).json(newDiscussion);
});

// Endpoint do usuwania dyskusji
app.delete("/discussion/:id", (req, res) => {
  const { id } = req.params;
  const discussions = getDiscussions();
  const updatedDiscussions = discussions.filter((d) => d.id !== parseInt(id));
  saveDiscussions(updatedDiscussions);
  res.status(200).send("Dyskusja została usunięta.");
});

// Endpoint do edytowania dyskusji (np. dodawanie wiadomości)
app.put("/discussion/:id", (req, res) => {
  const { id } = req.params;
  const discussions = getDiscussions();
  const updatedDiscussion = req.body;

  // Zaktualizuj wszystkie dyskusje, które pasują do id
  let updated = false;
  const updatedDiscussions = discussions.map((discussion) => {
    if (discussion.id === parseInt(id)) {
      updated = true;
      return { ...discussion, ...updatedDiscussion }; // Zaktualizuj dane dyskusji
    }
    return discussion; // Zwróć oryginalną dyskusję, jeśli nie pasuje do id
  });

  if (updated) {
    saveDiscussions(updatedDiscussions);
    res.status(200).json(updatedDiscussions);
  } else {
    res.status(404).send("Dyskusja nie znaleziona.");
  }
});

// =====Wiadomosci=====

// Endpoint do pobierania wszystkich wiadomości
app.get("/messages", (req, res) => {
  try {
    // Pobierz wszystkie wiadomości
    const discussions = getDiscussions(); // Funkcja zwracająca wszystkie dyskusje
    const allMessages = [];

    // Iteruj przez wszystkie dyskusje i zbierz wiadomości
    discussions.forEach((discussion) => {
      allMessages.push(...discussion.messages); // Zakładając, że każda dyskusja ma tablicę wiadomości
    });

    res.status(200).json(allMessages); // Zwróć wszystkie wiadomości
  } catch (error) {
    console.error("Błąd podczas pobierania wiadomości:", error);
    res.status(500).send("Wystąpił błąd podczas pobierania wiadomości.");
  }
});

// Endpoint do aktualizacji wiadomości
app.put("/discussion/:discussionId/message/:messageAuthor", (req, res) => {
  const { discussionId, messageAuthor } = req.params;
  const discussions = getDiscussions();
  const updatedMessage = req.body;
  const discussion = discussions.find((d) => d.id === parseInt(discussionId));

  if (discussion) {
    let updated = false;
    // Iterujemy przez wszystkie wiadomości i aktualizujemy te, których autor to messageAuthor
    discussion.messages = discussion.messages.map((message) => {
      if (message.author === messageAuthor) {
        updated = true;
        return { ...message, ...updatedMessage }; // Zaktualizuj wiadomość
      }
      return message;
    });

    if (updated) {
      saveDiscussions(discussions);
      res
        .status(200)
        .send("Wszystkie wiadomości autora zostały zaktualizowane.");
    } else {
      res.status(404).send("Brak wiadomości do zaktualizowania.");
    }
  } else {
    res.status(404).send("Dyskusja nie znaleziona.");
  }
});

// Endpoint do usuwania wiadomości
app.delete("/discussion/:discussionId/message/:messageId", (req, res) => {
  const { discussionId, messageId } = req.params;
  const discussions = getDiscussions();
  const discussion = discussions.find((d) => d.id === parseInt(discussionId));

  if (discussion) {
    const updatedMessages = discussion.messages.filter(
      (m) => m.timestamp !== messageId
    );
    discussion.messages = updatedMessages;
    saveDiscussions(discussions);
    res.status(200).send("Wiadomość została usunięta.");
  } else {
    res.status(404).send("Dyskusja nie znaleziona.");
  }
});

// =====Testy=====
// Funkcja pomocnicza do odczytu pliku testów
const readTestsFile = () => {
  try {
    if (!fs.existsSync(testsPath)) {
      throw new Error("Plik testów nie istnieje.");
    }
    return JSON.parse(fs.readFileSync(testsPath, "utf8"));
  } catch (error) {
    console.error("Błąd odczytu pliku:", error);
    throw new Error("Nie można odczytać danych testów.");
  }
};

// Funkcja pomocnicza do zapisu danych do pliku testów
const writeTestsFile = (data) => {
  try {
    fs.writeFileSync(testsPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Błąd zapisu pliku:", error);
    throw new Error("Nie można zapisać danych testów.");
  }
};

// Pobierz wszystkie testy
app.get("/tests", (req, res) => {
  try {
    const tests = readTestsFile();
    res.json(tests);
  } catch (error) {
    console.error("Błąd podczas pobierania testów:", error);
    return res.status(500).json({ error: "Nie udało się pobrać testów." });
  }
});

// Obsługa dodania testu
app.post("/tests", (req, res) => {
  const newTest = req.body;

  try {
    const existingTests = readTestsFile();

    const existingTestIndex = existingTests.findIndex(
      (test) => test.id === newTest.id
    );

    if (existingTestIndex === -1) {
      existingTests.push(newTest);
    } else {
      existingTests[existingTestIndex] = newTest;
    }

    writeTestsFile(existingTests);

    res.status(201).send("Test dodany pomyślnie.");
  } catch (error) {
    console.error("Błąd podczas dodawania testu:", error);
    return res.status(500).send("Błąd serwera podczas zapisu testów.");
  }
});

app.post("/tests/:testId", (req, res) => {
  const testId = req.params.testId;
  const updatedResult = req.body; // Oczekujemy { id, score }

  try {
    let existingTests = readTestsFile();

    existingTests = existingTests.map((test) => {
      if (test.id === parseInt(testId, 10)) {
        // Jeśli `results` nie istnieje, utwórz pustą tablicę
        const existingResults = test.results || [];

        // Znajdź indeks wyniku dla danego użytkownika
        const userResultIndex = existingResults.findIndex(
          (result) => result.id === updatedResult.id
        );

        if (userResultIndex !== -1) {
          // Jeśli wynik istnieje, zaktualizuj score
          existingResults[userResultIndex].score = updatedResult.score;
        } else {
          // Jeśli wynik nie istnieje, dodaj nowy
          existingResults.push(updatedResult);
        }

        return { ...test, results: existingResults };
      }
      return test;
    });

    writeTestsFile(existingTests);

    res.status(200).send("Test zaktualizowany pomyślnie.");
  } catch (error) {
    console.error("Błąd podczas aktualizacji testu:", error);
    return res.status(500).send("Błąd serwera podczas aktualizacji testów.");
  }
});

// Obsługa usuwania testu
app.delete("/tests/:testId", (req, res) => {
  const testId = req.params.testId;

  try {
    let existingTests = readTestsFile();

    const testToDelete = existingTests.find(
      (test) => test.id === parseInt(testId, 10)
    );
    if (!testToDelete) {
      return res.status(404).send("Test o podanym ID nie istnieje.");
    }

    const updatedTests = existingTests.filter(
      (test) => test.id !== parseInt(testId, 10)
    );

    writeTestsFile(updatedTests);

    res.status(200).send("Test usunięty pomyślnie.");
  } catch (error) {
    console.error("Błąd podczas usuwania testu:", error);
    return res.status(500).send("Błąd serwera podczas usuwania testu.");
  }
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
