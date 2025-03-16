import React, { useState, useEffect, useCallback } from "react";
import FeedbackSection from "../components/UniversalFeedback";
import { useParams, useNavigate } from "react-router-dom";

const FeedbackInstructorPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [instructor, setInstructor] = useState(null);

  const fetchInstructorData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5002/courses/${courseId}`);
      if (!response.ok) {
        throw new Error("Błąd podczas pobierania danych");
      }
      const data = await response.json();
      setInstructor(data.informacje_o_prowadzacym);
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error);
    }
  }, [courseId]);

  useEffect(() => {
    fetchInstructorData();
  }, [fetchInstructorData]);

  if (!instructor) {
    return <div>Ładowanie danych...</div>;
  }

  return (
    <FeedbackSection
      entity={instructor}
      feedbackKey="feedback"
      onFeedbackSubmit={fetchInstructorData}
      navigate={navigate}
      entityType="instructor"
    />
  );
};

export default FeedbackInstructorPage;
