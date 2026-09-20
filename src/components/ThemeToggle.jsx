import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { isNight, toggleTheme } = useTheme();

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={toggleTheme}
        type="button"
        aria-label={isNight ? "Switch to Day Mode" : "Switch to Night Mode"}
        title={
          isNight
            ? "Night Mode Active. Click to switch to Day Mode."
            : "Day Mode Active. Click to switch to Night Mode."
        }
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-md ${
          isNight
            ? "bg-slate-800 text-indigo-300 border border-slate-700/80 hover:bg-slate-700 hover:scale-105"
            : "bg-white text-amber-500 border border-slate-200/80 hover:bg-slate-50 hover:scale-105"
        }`}
      >
        {isNight ? (
          /* Moon Icon for Night Mode */
          <svg
            className="w-5 h-5 transition-transform duration-500 hover:-rotate-12 text-indigo-300"
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
          /* Sun Icon for Day Mode */
          <svg
            className="w-5 h-5 transition-transform duration-500 hover:rotate-90 text-amber-500"
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
      </button>
    </div>
  );
};

export default ThemeToggle;
