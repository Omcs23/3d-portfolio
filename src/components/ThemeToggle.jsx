import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { isNight, toggleTheme } = useTheme();

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={toggleTheme}
        type="button"
        aria-label="Toggle Day and Night Mode"
        title={
          isNight
            ? "Night Mode Active (6 PM - 6 AM). Click to switch to Day."
            : "Day Mode Active (6 AM - 6 PM). Click to switch to Night."
        }
        className={`relative inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all duration-300 transform active:scale-95 shadow-md ${
          isNight
            ? "bg-white text-slate-900 border border-slate-200/80 shadow-slate-900/10 hover:bg-slate-100"
            : "bg-slate-900/90 text-amber-300 border border-slate-700/80 shadow-slate-900/20 hover:bg-slate-800"
        }`}
      >
        <div className="relative w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shrink-0">
          {isNight ? (
            /* Crescent Moon Icon */
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 rotate-0 hover:rotate-12 text-slate-900"
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
              className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 rotate-0 hover:rotate-45 text-amber-400"
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

        <span className="ml-1.5 sm:ml-2 text-[11px] sm:text-xs font-bold tracking-wide">
          {isNight ? "Night" : "Day"}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;
