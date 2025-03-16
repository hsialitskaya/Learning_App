import React, { useState, useEffect, useCallback } from "react";
import FeedbackSection from "../components/UniversalFeedback";
import { useParams, useNavigate } from "react-router-dom";

const FeedbackCoursePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  const fetchCourseData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5002/courses/${courseId}`);
      if (!response.ok) {
        throw new Error("Błąd podczas pobierania danych");
      }
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  if (!course) {
    return <div>Ładowanie danych...</div>;
  }

  return (
    <FeedbackSection
      entity={course}
      feedbackKey="feedback"
      onFeedbackSubmit={fetchCourseData}
      navigate={navigate}
      entityType="course"
    />
  );
};

export default FeedbackCoursePage;
