import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { TextField, Button, Typography, Box } from "@mui/material";

const DeleteFeature = () => {
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    motherSurname: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUserId = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUserId) {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const currentUser = storedUsers.find(
        (user) => user.id === parseInt(currentUserId.id)
      );
      if (currentUser) {
        setUserData(currentUser);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.motherSurname) {
      setError("Wszystkie pola muszą być wypełnione!");
      return;
    }

    if (userData.email !== formData.email) {
      setError("Nieprawidłowy email.");
      return;
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      userData.password,
      "secretKey"
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== formData.password) {
      setError("Nieprawidłowe hasło.");
      return;
    }

    if (userData.motherSurname !== formData.motherSurname) {
      setError("Nieprawidłowe nazwisko matki.");
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = storedUsers.filter((user) => user.id !== userData.id);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.removeItem("currentUser");

    try {
      // Pobierz wszystkie dyskusje z serwera
      const responseDiscussions = await fetch(
        `http://localhost:5002/discussion`
      );
      const discussions = await responseDiscussions.json();

      for (let discussion of discussions) {
        if (discussion.createdBy === userData.username) {
          const updatedDiscussion = {
            ...discussion,
            createdBy: "deleted_user", // Ustawienie autora na 'deleted_user'
          };

          // Wykonaj PUT na serwerze, aby zaktualizować dyskusję
          await fetch(`http://localhost:5002/discussion/${discussion.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedDiscussion),
          });
        }
      }

      // Pobierz wszystkie wiadomości z serwera
      const responseMessages = await fetch(`http://localhost:5002/messages`);
      const messages = await responseMessages.json();

      // Zaktualizuj autorów wiadomości napisanych przez usuniętego użytkownika
      for (let message of messages) {
        if (message.author === userData.username) {
          const updatedMessage = {
            ...message,
            author: "deleted_user", // Ustawienie autora na 'deleted_user'
          };

          // Znajdź dyskusję, do której należy ta wiadomość
          const discussion = discussions.find(
            (discussion) => discussion.id === message.discussionId
          );

          // Wykonaj PUT na serwerze, aby zaktualizować wiadomość
          if (discussion) {
            await fetch(
              `http://localhost:5002/discussion/${discussion.id}/message/${message.author}`, // Możesz użyć timestamp jako unikalnego identyfikatora wiadomości
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedMessage),
              }
            );
          }
        }
      }

      // Pobierz wszystkie testy
      const responseTests = await fetch("http://localhost:5002/tests");
      if (!responseTests.ok) {
        throw new Error("Błąd podczas pobierania testów.");
      }
      const tests = await responseTests.json();

      // Zaktualizuj każdy test
      for (let test of tests) {
        let testUpdated = false;

        // Zmień `createdBy` na "deleted_user", jeśli użytkownik jest twórcą
        if (test.createdBy === userData.id) {
          test.createdBy = "deleted_user";
          testUpdated = true;
        }

        // Usuń wyniki użytkownika z `results`
        if (test.results) {
          const initialLength = test.results.length;
          test.results = test.results.filter(
            (result) => result.id !== userData.id
          );
          if (test.results.length !== initialLength) {
            testUpdated = true;
          }
        }

        if (testUpdated) {
          await fetch(`http://localhost:5002/tests`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(test),
          });
        }
      }
    } catch (error) {
      console.error(
        "Błąd podczas aktualizacji dyskusji, wiadomości lub testów:",
        error
      );
    }

    // Wyślij żądanie do usunięcia użytkownika z bazy
    await fetch(`http://localhost:5002/users/${userData.id}/delete-feedback`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: userData.username }),
    });

    setError("");
    alert("Konto zostało usunięte pomyślnie!");

    setFormData({
      email: "",
      password: "",
      motherSurname: "",
    });

    navigate("/");
  };

  const goToMain = () => {
    navigate("/main");
  };

  return (
    <Box
      component="form"
      sx={{
        maxWidth: 500,
        margin: "auto",
        padding: 4,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#fff",
      }}
      onSubmit={handleSubmit}
    >
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Usunięcie konta użytkownika
      </Typography>

      {error && (
        <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Adres e-mail"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#86dce9", // Kolor obramowania przy najechaniu
              },
            },
          }}
        />

        <TextField
          label="Hasło"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#86dce9", // Kolor obramowania przy najechaniu
              },
            },
          }}
        />
        <TextField
          label="Nazwisko matki do ślubu"
          type="text"
          name="motherSurname"
          value={formData.motherSurname}
          onChange={handleChange}
          fullWidth
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#86dce9", // Kolor obramowania przy najechaniu
              },
            },
          }}
        />
      </Box>

      <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}
      >
        <Button
          type="submit"
          variant="contained"
          color="error"
          sx={{
            backgroundColor: "#86dce9",
            color: "#ffffff",
            border: "none",
            padding: "12px 20px",
            fontSize: "16px",
            fontWeight: 600,
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            width: "48%",
            margin: "10px 0",
            "&:hover": {
              backgroundColor: "#73c7d5", // Kolor przy najechaniu
              transform: "scale(1.05)", // Powiększenie przy najechaniu
            },
          }}
        >
          Usuń konto
        </Button>

        <Button
          onClick={goToMain}
          variant="outlined"
          color="primary"
          sx={{
            backgroundColor: "#86dce9",
            color: "#ffffff",
            border: "none",
            padding: "12px 20px",
            fontSize: "16px",
            fontWeight: 600,
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            width: "48%",
            margin: "10px 0",
            "&:hover": {
              backgroundColor: "#73c7d5", // Kolor przy najechaniu
              transform: "scale(1.05)", // Powiększenie przy najechaniu
            },
          }}
        >
          Wróć do strony głównej
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteFeature;
