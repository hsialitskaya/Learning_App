import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js"; // Importowanie biblioteki do szyfrowania
import { useNavigate } from "react-router-dom"; // Importowanie hooka useNavigate

const ResetPasswordFeature = () => {
  const navigate = useNavigate();

  const handlePasswordReset = (username, motherSurname, newPassword) => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Znalezienie użytkownika po nazwie użytkownika i nazwisku matki
    const userIndex = storedUsers.findIndex(
      (user) =>
        user.username === username && user.motherSurname === motherSurname
    );

    if (userIndex === -1) {
      return {
        success: false,
        error: "Użytkownik o podanej nazwie lub nazwisko matki nie istnieje.",
      };
    }

    // Zaktualizowanie hasła użytkownika
    storedUsers[userIndex].password = newPassword;

    // Zapisanie zmian w localStorage
    localStorage.setItem("users", JSON.stringify(storedUsers));

    return { success: true };
  };

  // Schemat walidacji
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Nazwa użytkownika jest wymagana"),
    motherSurname: Yup.string().required("Nazwisko matki jest wymagane"),
    newPassword: Yup.string().required("Nowe hasło jest wymagane"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Hasła muszą być takie same")
      .required("Potwierdzenie hasła jest wymagane"),
  });

  const handleSubmit = (values, { resetForm }) => {
    // Szyfrujemy nowe hasło
    const encryptedPassword = CryptoJS.AES.encrypt(
      values.newPassword,
      "secretKey"
    ).toString();

    // Sprawdzenie użytkownika i nazwiska matki
    const result = handlePasswordReset(
      values.username,
      values.motherSurname,
      encryptedPassword
    );

    if (result.success) {
      alert("Hasło zostało zresetowane!");

      // Przekierowanie na stronę /start
      navigate("/");
      resetForm();
    } else {
      // Obsługa błędu, wyświetlanie komunikatu
      alert(result.error); // Wyświetlenie błędu w oknie alert
    }
  };

  return (
    <div className="container">
      <header>
        <h1 className="title">Resetowanie hasła</h1>
      </header>
      <main className="main-content">
        <Formik
          initialValues={{
            username: "",
            motherSurname: "",
            newPassword: "",
            confirmNewPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="form">
            <Field
              type="text"
              name="username"
              placeholder="Nazwa użytkownika"
            />
            <ErrorMessage
              name="username"
              component="div"
              className="error-message"
            />

            <Field
              type="text"
              name="motherSurname"
              placeholder="Nazwisko matki do ślubu"
            />
            <ErrorMessage
              name="motherSurname"
              component="div"
              className="error-message"
            />

            <Field
              type="password"
              name="newPassword"
              placeholder="Nowe hasło"
            />
            <ErrorMessage
              name="newPassword"
              component="div"
              className="error-message"
            />

            <Field
              type="password"
              name="confirmNewPassword"
              placeholder="Potwierdź nowe hasło"
            />
            <ErrorMessage
              name="confirmNewPassword"
              component="div"
              className="error-message"
            />

            <button type="submit" className="btn">
              Zresetuj hasło
            </button>
          </Form>
        </Formik>
        <button className="btn" onClick={() => navigate("/login")}>
          Wroć
        </button>
      </main>
    </div>
  );
};

export default ResetPasswordFeature;
