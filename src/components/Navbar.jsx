import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { isNight } = useTheme();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header
      className={`${
        isHome ? "fixed top-0" : "absolute top-0"
      } flex justify-between items-center sm:px-16 px-4 py-4 max-w-5xl mx-auto z-40 right-0 left-0 w-full pointer-events-auto`}
    >
      <NavLink
        to="/"
        aria-label="Home"
        title="Go to Home"
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shrink-0 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none ${
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
              `px-3.5 py-1.5 rounded-full font-bold text-sm sm:text-base transition-all duration-200 select-none outline-none focus:outline-none ${
                isActive
                  ? isNight
                    ? "bg-indigo-600 text-white font-extrabold shadow-md shadow-indigo-950/60"
                    : "bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/20"
                  : isNight
                  ? "text-slate-100 hover:text-white hover:bg-slate-800/60"
                  : "text-slate-800 hover:text-blue-600 hover:bg-slate-100/80"
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-full font-bold text-sm sm:text-base transition-all duration-200 select-none outline-none focus:outline-none ${
                isActive
                  ? isNight
                    ? "bg-indigo-600 text-white font-extrabold shadow-md shadow-indigo-950/60"
                    : "bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/20"
                  : isNight
                  ? "text-slate-100 hover:text-white hover:bg-slate-800/60"
                  : "text-slate-800 hover:text-blue-600 hover:bg-slate-100/80"
              }`
            }
          >
            Projects
          </NavLink>

          <a
            href="/Om_Sharma_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3.5 py-1.5 rounded-full font-bold text-sm sm:text-base transition-all duration-200 select-none outline-none focus:outline-none ${
              isNight
                ? "text-slate-100 hover:text-white hover:bg-slate-800/60"
                : "text-slate-800 hover:text-blue-600 hover:bg-slate-100/80"
            }`}
          >
            Resume 📄
          </a>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;
