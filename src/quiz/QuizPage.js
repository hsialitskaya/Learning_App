// QuizPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuizFeature from "./QuizFeature";

const QuizPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUserId = localStorage.getItem("currentUser");

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const parsedCurrentUserId = JSON.parse(currentUserId);
    const currentUser = storedUsers.find(
      (user) => user.id === parseInt(parsedCurrentUserId.id, 10)
    );

    if (!currentUser) {
      alert(
        "Nie znaleziono użytkownika o podanym identyfikatorze. Proszę się zalogować."
      );
      navigate("/");
      return;
    }

    // Set the found user in the state
    setUser(currentUser);
  }, [navigate]);

  const main = () => {
    navigate(`/my_courses/${courseId}`);
  };

  return (
    <div>
      {user && <QuizFeature courseId={courseId} user={user} goBack={main} />}
    </div>
  );
};

export default QuizPage;
