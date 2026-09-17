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
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white dark:bg-slate-800 items-center justify-center flex font-bold shadow-md transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
      >
        <svg
          className="w-5 h-5 text-blue-500 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </NavLink>

      <div className="flex items-center gap-2 sm:gap-6">
        <nav className="flex text-sm sm:text-base md:text-lg gap-2.5 sm:gap-6 font-semibold items-center">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 font-bold drop-shadow"
                : isNight
                ? "text-slate-200 hover:text-blue-400 transition-colors"
                : "text-slate-700 hover:text-blue-600 transition-colors"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 font-bold drop-shadow"
                : isNight
                ? "text-slate-200 hover:text-blue-400 transition-colors"
                : "text-slate-700 hover:text-blue-600 transition-colors"
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
