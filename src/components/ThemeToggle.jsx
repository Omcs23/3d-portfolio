import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { isNight, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle Day and Night Mode"
      title={isNight ? "Switch to Day Mode" : "Switch to Night Mode"}
      className={`relative inline-flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 transform active:scale-95 shadow-md ${
        isNight
          ? "bg-slate-800/90 text-amber-300 border border-slate-700/80 shadow-amber-500/10 hover:bg-slate-700/90 hover:shadow-amber-500/20"
          : "bg-white/90 text-sky-600 border border-sky-100 shadow-sky-500/10 hover:bg-sky-50 hover:shadow-sky-500/20"
      } ${className}`}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {isNight ? (
          /* Crescent Moon Icon with Star Sparkles */
          <svg
            className="w-5 h-5 transition-transform duration-500 rotate-0 hover:rotate-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              fill="currentColor"
            />
          </svg>
        ) : (
          /* Glowing Sun Icon */
          <svg
            className="w-5 h-5 transition-transform duration-500 rotate-0 hover:rotate-45"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              fill="currentColor"
            />
          </svg>
        )}
      </div>

      <span className="ml-2 text-xs font-semibold tracking-wide hidden sm:inline-block">
        {isNight ? "Night" : "Day"}
      </span>
    </button>
  );
};

export default ThemeToggle;
