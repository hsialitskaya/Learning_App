import React, { Suspense } from "react";
const CoursesFeature = React.lazy(() => import("./CoursesFeature"));

const CoursePage = () => {
  return (
    <div>
      <Suspense fallback={<div>Ładowanie...</div>}>
        <CoursesFeature />
      </Suspense>
    </div>
  );
};

export default CoursePage;
