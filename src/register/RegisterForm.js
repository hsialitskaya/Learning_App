import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";

const RegisterForm = () => {
  const navigate = useNavigate();

  // Schemat walidacji
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Imię jest wymagane"),
    surname: Yup.string().required("Nazwisko jest wymagane"),
    username: Yup.string().required("Nazwa użytkownika jest wymagana"),
    email: Yup.string()
      .email("Nieprawidłowy adres e-mail")
      .required("Adres e-mail jest wymagany"),
    password: Yup.string()
      .min(1, "Hasło musi mieć co najmniej 1 znak")
      .required("Hasło jest wymagane"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Hasła muszą być takie same")
      .required("Potwierdzenie hasła jest wymagane"),
    motherSurname: Yup.string().required(
      "Panieńskie nazwisko matki jest wymagane"
    ),
  });

  const handleSubmit = (values, { resetForm }) => {
    // Odczytujemy istniejących użytkowników z localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Sprawdzamy, czy adres e-mail już istnieje
    const isEmailTaken = storedUsers.some(
      (user) => user.email === values.email
    );
    if (isEmailTaken) {
      alert("Na ten adres e-mail jest już zarejestrowane konto.");
      return;
    }

    // Sprawdzamy, czy username już istnieje
    const isUsernameTaken = storedUsers.some(
      (user) => user.username === values.username
    );
    if (isUsernameTaken) {
      alert("Nazwa użytkownika jest już zajęta, wybierz inną.");
      return;
    }

    // Generujemy ID na podstawie długości obecnych użytkowników + 1
    const userId = storedUsers.length > 0 ? storedUsers.length + 1 : 1;

    // Szyfrujemy hasło użytkownika
    const encryptedPassword = CryptoJS.AES.encrypt(
      values.password,
      "secretKey"
    ).toString();

    // Logika zapisu danych użytkownika
    const userData = {
      id: userId,
      ...values,
      password: encryptedPassword,
      achievements: [],
    };

    // Dodajemy nowego użytkownika do listy
    storedUsers.push(userData);

    // Zapisujemy zaktualizowaną listę użytkowników w localStorage
    localStorage.setItem("users", JSON.stringify(storedUsers));

    // Ustawiamy tylko ID użytkownika jako zalogowanego
    localStorage.setItem("currentUser", JSON.stringify({ id: userId }));

    alert("Rejestracja zakończona sukcesem!");

    // Resetowanie formularza
    resetForm();

    // Przekierowanie na stronę główną po rejestracji
    navigate("/main");
  };

  return (
    <Formik
      initialValues={{
        name: "",
        surname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        motherSurname: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="form">
          <h2 className="title">Rejestracja</h2>

          <Field
            type="text"
            name="name"
            placeholder="Imię"
            className="form-input"
          />
          <ErrorMessage name="name" component="div" className="error-message" />

          <Field type="text" name="surname" placeholder="Nazwisko" />
          <ErrorMessage
            name="surname"
            component="div"
            className="error-message"
          />

          <Field type="text" name="username" placeholder="Nazwa użytkownika" />
          <ErrorMessage
            name="username"
            component="div"
            className="error-message"
          />

          <Field type="email" name="email" placeholder="Adres e-mail" />
          <ErrorMessage
            name="email"
            component="div"
            className="error-message"
          />

          <Field type="password" name="password" placeholder="Hasło" />
          <ErrorMessage
            name="password"
            component="div"
            className="error-message"
          />

          <Field
            type="password"
            name="confirmPassword"
            placeholder="Potwierdź hasło"
          />
          <ErrorMessage
            name="confirmPassword"
            component="div"
            className="error-message"
          />

          <Field
            type="text"
            name="motherSurname"
            placeholder="Panieńskie nazwisko matki"
          />
          <ErrorMessage
            name="motherSurname"
            component="div"
            className="error-message"
          />

          <button type="submit" className="btn">
            Zarejestruj się
          </button>

          <button className="btn" onClick={() => navigate("/")}>
            Wroć
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
