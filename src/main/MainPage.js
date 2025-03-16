import React, { Suspense } from "react";
import { useNavigate } from "react-router-dom";

const MainPageFeature = React.lazy(() => import("./MainFeature"));

const MainPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Suspense fallback={<div>Ładowanie...</div>}>
      <MainPageFeature onNavigate={handleNavigate} />
    </Suspense>
  );
};

export default MainPage;
