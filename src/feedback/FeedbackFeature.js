import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FeedbackFeature = ({ courseId, onFeedbackSubmit, isForInstructor }) => {
  const [feedback, setFeedback] = useState({
    userName: "",
    comment: "",
    rating: 0,
    anonymous: false,
  });

  const [currentUserName, setCurrentUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userData = users.find((user) => user.id === currentUser.id);
      if (userData) {
        setCurrentUserName(userData.username);
        setFeedback((prevFeedback) => ({
          ...prevFeedback,
          userName: userData.username,
        }));
      } else {
        alert("Błąd: Użytkownik nie znaleziony.");
      }
    } else {
      alert(
        "Nie znaleziono użytkownika o podanym identyfikatorze. Proszę się zalogować."
      );
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const target = isForInstructor ? "instructor" : "course";

    const feedbackData = {
      ...feedback,
      courseId,
      target,
      rating: parseInt(feedback.rating, 10),
    };

    try {
      const response = await fetch(
        `http://localhost:5002/courses/${courseId}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(feedbackData),
        }
      );

      if (response.ok) {
        onFeedbackSubmit(); // Refresh the data after submitting feedback
        setFeedback({
          userName: currentUserName,
          comment: "",
          rating: 0,
          anonymous: false,
        });
      } else {
        console.error("Błąd: ", response.statusText);
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania opinii:", error);
    }
  };

  // If no user data is available, return early without rendering the form
  if (!currentUserName) {
    return null;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="form form-container">
        <label>
          Dodaj komentarz:
          <textarea
            className="textarea-field"
            name="comment"
            value={feedback.comment}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Ocena:
          <input
            type="number"
            name="rating"
            value={feedback.rating}
            onChange={handleChange}
            min="1"
            max="5"
          />
        </label>

        <div className="checkbox-group">
          <label style={{ display: "flex", alignItems: "center" }}>
            Anonimowo:
            <input
              style={{
                marginLeft: "10px",
              }}
              className="checkbox-item"
              type="checkbox"
              name="anonymous"
              checked={feedback.anonymous}
              onChange={() =>
                setFeedback((prev) => ({ ...prev, anonymous: !prev.anonymous }))
              }
            />
          </label>
        </div>
        <button type="submit" className="btn btn-course">
          Dodaj opinię
        </button>
      </form>
    </>
  );
};

export default FeedbackFeature;
