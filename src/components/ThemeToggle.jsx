import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { isNight, isManual, toggleTheme, resetToAuto } = useTheme();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={toggleTheme}
        type="button"
        aria-label="Toggle Day and Night Mode"
        title={
          isManual
            ? `Manual Mode: ${isNight ? "Night" : "Day"}. Click to switch.`
            : `Auto Time Active: ${isNight ? "Night" : "Day"} (6 AM - 6 PM Day, 6 PM - 6 AM Night). Click to switch manually.`
        }
        className={`relative inline-flex items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 transform active:scale-95 shadow-md ${
          isNight
            ? "bg-slate-800/90 text-amber-300 border border-slate-700/80 shadow-amber-500/10 hover:bg-slate-700/90 hover:shadow-amber-500/20"
            : "bg-white/90 text-sky-600 border border-sky-100 shadow-sky-500/10 hover:bg-sky-50 hover:shadow-sky-500/20"
        }`}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
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

        <div className="ml-2 flex flex-col items-start text-left leading-tight hidden sm:flex">
          <span className="text-xs font-bold tracking-wide">
            {isNight ? "Night" : "Day"}
          </span>
          <span className="text-[10px] opacity-75 font-medium">
            {isManual ? "Manual" : "Auto Time"}
          </span>
        </div>
      </button>

      {isManual && (
        <button
          onClick={resetToAuto}
          type="button"
          aria-label="Reset to Auto Time Mode"
          title="Reset to Automatic Time Mode (6 AM - 6 PM Day, 6 PM - 6 AM Night)"
          className={`px-2.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 ${
            isNight
              ? "bg-slate-800/80 hover:bg-slate-800 text-amber-300/90 border border-slate-700"
              : "bg-white/90 hover:bg-white text-sky-600 border border-sky-100"
          }`}
        >
          ⏱️ Auto
        </button>
      )}
    </div>
  );
};

export default ThemeToggle;

