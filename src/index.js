import React from "react";
import ReactDOM from "react-dom/client"; // Importowanie createRoot
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")); // Tworzymy root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
