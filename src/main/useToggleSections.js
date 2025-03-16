import { useState } from "react";

const useToggleSections = () => {
  const [isMyOpen, setIsMyOpen] = useState(false);
  const [isAppOpen, setIsAppOpen] = useState(false);

  const toggleMySection = () => {
    setIsMyOpen((prev) => !prev);
    setIsAppOpen(false); // Close the "App" section if open
  };

  const toggleAppSection = () => {
    setIsAppOpen((prev) => !prev);
    setIsMyOpen(false); // Close the "My" section if open
  };

  return {
    isMyOpen,
    isAppOpen,
    toggleMySection,
    toggleAppSection,
  };
};

export default useToggleSections;
