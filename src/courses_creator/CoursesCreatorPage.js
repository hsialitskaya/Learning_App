import React, { useRef } from "react";
import CoursesCreatorFeature from "./CoursesCreatorFeature";
import coursesData from "../assets/courses.json";

const CoursesCreatorPage = () => {
  const courses = useRef([...coursesData]);

  const handleCourseAdded = (newCourse) => {
    courses.current.push(newCourse);
  };

  return (
    <div>
      <CoursesCreatorFeature
        onCourseAdded={handleCourseAdded}
        existingCourses={courses.current}
      />
    </div>
  );
};

export default CoursesCreatorPage;
