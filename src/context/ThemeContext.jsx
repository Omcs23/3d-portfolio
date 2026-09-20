import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext();

// Helper to determine theme based on local time hour (6 AM - 6 PM is Day, 6 PM - 6 AM is Night)
const getAutoTheme = () => {
  const currentHour = new Date().getHours();
  return currentHour >= 6 && currentHour < 18 ? "day" : "night";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedSessionTheme = sessionStorage.getItem("session_theme");
    if (savedSessionTheme === "day" || savedSessionTheme === "night") {
      return savedSessionTheme;
    }
    return getAutoTheme();
  });

  const isNight = theme === "night";

  useEffect(() => {
    sessionStorage.setItem("session_theme", theme);

    if (isNight) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, isNight]);

  const value = useMemo(
    () => ({
      theme,
      isNight,
      toggleTheme: () => setTheme((prev) => (prev === "day" ? "night" : "day")),
      autoDetectedTheme: getAutoTheme(),
    }),
    [theme, isNight]
  );

  return (
    <ThemeContext.Provider value={value}>
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


