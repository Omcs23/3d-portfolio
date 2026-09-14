import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// Helper to determine theme based on local time hour (6 AM - 6 PM is Day, 6 PM - 6 AM is Night)
const getAutoTheme = () => {
  const currentHour = new Date().getHours();
  return currentHour >= 6 && currentHour < 18 ? "day" : "night";
};

export const ThemeProvider = ({ children }) => {
  // Use sessionStorage so manual toggles only apply for the current session/visit,
  // returning automatically to the time-based schedule when reopening/revisiting.
  const [theme, setTheme] = useState(() => {
    const savedSessionTheme = sessionStorage.getItem("session_theme");
    if (savedSessionTheme === "day" || savedSessionTheme === "night") {
      return savedSessionTheme;
    }
    return getAutoTheme();
  });

  const isNight = theme === "night";

  // Periodically update theme if session_theme is not explicitly set by user action
  useEffect(() => {
    sessionStorage.setItem("session_theme", theme);

    if (isNight) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, isNight]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "day" ? "night" : "day"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isNight,
        toggleTheme,
        autoDetectedTheme: getAutoTheme(),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};


