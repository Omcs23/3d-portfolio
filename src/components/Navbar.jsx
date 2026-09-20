import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { isNight } = useTheme();

  return (
    <header className="header">
      <NavLink
        to="/"
        aria-label="Home"
        title="Go to Home"
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shrink-0 ${
          isNight
            ? "bg-slate-900 text-indigo-400 border border-slate-700/80 hover:bg-slate-800"
            : "bg-white text-blue-600 border border-slate-200/80 hover:bg-slate-50"
        }`}
      >
        <svg
          className="w-5 h-5 fill-current transition-transform duration-300 hover:scale-110"
          viewBox="0 0 24 24"
        >
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </NavLink>

      <div className="flex items-center gap-2.5 sm:gap-6">
        <nav className="flex text-sm sm:text-base md:text-lg gap-2 sm:gap-4 font-bold items-center">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? isNight
                  ? "text-sky-400 font-extrabold px-3 py-1 rounded-xl bg-slate-900/90 border border-sky-500/40 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                  : "text-blue-600 font-extrabold px-3 py-1 rounded-xl bg-white/90 border border-blue-200 shadow-md"
                : isNight
                ? "text-slate-100 hover:text-sky-300 px-2.5 py-1 transition-all duration-300 hover:scale-105"
                : "text-slate-900 hover:text-blue-600 px-2.5 py-1 transition-all duration-300 hover:scale-105"
            }
          >
            About
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive
                ? isNight
                  ? "text-sky-400 font-extrabold px-3 py-1 rounded-xl bg-slate-900/90 border border-sky-500/40 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                  : "text-blue-600 font-extrabold px-3 py-1 rounded-xl bg-white/90 border border-blue-200 shadow-md"
                : isNight
                ? "text-slate-100 hover:text-sky-300 px-2.5 py-1 transition-all duration-300 hover:scale-105"
                : "text-slate-900 hover:text-blue-600 px-2.5 py-1 transition-all duration-300 hover:scale-105"
            }
          >
            Projects
          </NavLink>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;
