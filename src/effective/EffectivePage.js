import React, { Suspense } from "react";

const EffectiveFeature = React.lazy(() => import("./EffectiveFeature"));

const EffectivePage = () => {
  return (
    <div>
      <Suspense fallback={<div>Ładowanie...</div>}>
        <EffectiveFeature />
      </Suspense>
    </div>
  );
};

export default EffectivePage;
