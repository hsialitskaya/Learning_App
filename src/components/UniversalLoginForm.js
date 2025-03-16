import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js"; // Importowanie biblioteki do odszyfrowania hasła

const UniversalLoginForm = ({ user }) => {
  const navigate = useNavigate();

  // Ref dla pól formularza
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  // Schemat walidacji za pomocą Yup
  const validationSchema = Yup.object().shape({
    username:
      user === "admin"
        ? Yup.string().required("Nazwa użytkownika jest wymagana.")
        : Yup.string(),
    email:
      user === "user"
        ? Yup.string()
            .email("Niepoprawny adres e-mail.")
            .required("Adres e-mail jest wymagany.")
        : Yup.string(),
    password: Yup.string().required("Hasło jest wymagane."),
  });

  const handleSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
    const { username, email, password } = values;

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    if (user === "admin") {
      // Sprawdzamy, czy nazwa użytkownika to "admin" i hasło to "learning2025"
      if (username === "admin" && password === "learning2025") {
        // Zalogowanie administratora
        localStorage.setItem("currentUser", JSON.stringify({ id: "admin" }));
        alert("Zalogowano jako administrator!");

        // Czyszczenie formularza
        resetForm();

        // Przekierowanie na stronę administracyjną
        navigate("/admin");
        return;
      }
      // Jeśli dane są nieprawidłowe, wyświetlamy błąd
      setErrors({ username: "Nieprawidłowa nazwa użytkownika lub hasło." });
      setSubmitting(false);
    } else if (user === "user") {
      // Sprawdzamy, czy użytkownik istnieje po emailu
      const foundUser = storedUsers.find((user) => user.email === email);

      if (!foundUser) {
        setErrors({
          email: "Użytkownik o podanym adresie e-mail nie istnieje.",
        });
        setSubmitting(false);
        emailRef.current.focus(); // Ustawienie fokusu na pole email
        return;
      }

      // Odszyfrowanie hasła z localStorage
      const decryptedPassword = CryptoJS.AES.decrypt(
        foundUser.password,
        "secretKey"
      ).toString(CryptoJS.enc.Utf8);

      // Sprawdzamy, czy hasło jest poprawne
      if (decryptedPassword !== password) {
        setErrors({ password: "Nieprawidłowe hasło." });
        setSubmitting(false);
        passwordRef.current.focus(); // Ustawienie fokusu na pole password
        return;
      }

      // Zapisujemy zalogowanego użytkownika jako currentUser
      localStorage.setItem("currentUser", JSON.stringify({ id: foundUser.id }));

      const preferences = foundUser.application_preferences;

      if (preferences) {
        // Zastosuj preferencje do aplikacji (np. motyw)
        document.body.className = preferences.theme || "light";
        document.body.style.fontSize =
          preferences.fontSize === "small"
            ? "12px"
            : preferences.fontSize === "large"
            ? "18px"
            : "14px";
        document.body.style.fontFamily = preferences.fontFamily || "Arial";
        document.body.style.lineHeight = preferences.lineHeight || "1.5";
        document.body.style.letterSpacing =
          preferences.letterSpacing || "normal";
        document.body.style.textAlign = preferences.textAlign || "left";
      }

      // Przekierowanie na stronę główną
      navigate("/main");
    }
  };

  useEffect(() => {
    // Ustawienie fokusu na odpowiednie pole po załadowaniu formularza
    user === "admin" ? usernameRef.current.focus() : emailRef.current.focus();
  }, [user]);

  return (
    <>
      <Formik
        initialValues={{
          [user === "admin" ? "username" : "email"]: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="form">
            <h2 className="title">Logowanie</h2>

            {user === "admin" ? (
              <Field
                type="text"
                name="username"
                placeholder="Nazwa użytkownika"
                className="form-input"
                innerRef={usernameRef}
              />
            ) : (
              <Field
                type="email"
                name="email"
                placeholder="Adres e-mail"
                className="form-input"
                innerRef={emailRef}
              />
            )}
            <ErrorMessage
              name={user === "admin" ? "username" : "email"}
              component="div"
              className="error-message"
            />

            <Field
              type="password"
              name="password"
              placeholder="Hasło"
              className="form-input"
              innerRef={passwordRef}
            />
            <ErrorMessage
              name="password"
              component="div"
              className="error-message"
            />

            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Logowanie..." : "Zaloguj się"}
            </button>
          </Form>
        )}
      </Formik>
      <button className="btn" onClick={() => navigate("/")}>
        Wróć
      </button>
    </>
  );
};

export default UniversalLoginForm;
