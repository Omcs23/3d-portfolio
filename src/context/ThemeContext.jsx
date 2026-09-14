import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// Helper to determine theme based on local time hour (6 AM - 6 PM is Day, 6 PM - 6 AM is Night)
const getAutoTheme = () => {
  const currentHour = new Date().getHours();
  return currentHour >= 6 && currentHour < 18 ? "day" : "night";
};

export const ThemeProvider = ({ children }) => {
  // Track if user explicitly selected a manual override
  const [isManual, setIsManual] = useState(() => {
    return localStorage.getItem("theme_is_manual") === "true";
  });

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    const manualFlag = localStorage.getItem("theme_is_manual") === "true";
    if (manualFlag && savedTheme) {
      return savedTheme;
    }
    // Auto-detect based on local time when entering portfolio
    return getAutoTheme();
  });

  const isNight = theme === "night";

  // Re-check auto theme every minute if user has not set a manual override
  useEffect(() => {
    const checkAutoTheme = () => {
      const manualFlag = localStorage.getItem("theme_is_manual") === "true";
      if (!manualFlag) {
        const autoTheme = getAutoTheme();
        setTheme(autoTheme);
      }
    };

    checkAutoTheme();
    const interval = setInterval(checkAutoTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("theme_is_manual", isManual ? "true" : "false");

    if (isNight) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme, isNight, isManual]);

  const toggleTheme = () => {
    setIsManual(true);
    setTheme((prevTheme) => (prevTheme === "day" ? "night" : "day"));
  };

  const resetToAuto = () => {
    setIsManual(false);
    localStorage.removeItem("theme_is_manual");
    setTheme(getAutoTheme());
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isNight,
        isManual,
        toggleTheme,
        resetToAuto,
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

