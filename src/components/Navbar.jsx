import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { isNight } = useTheme();

  return (
    <header className="header">
      <NavLink
        to="/"
        className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 items-center justify-center flex font-bold shadow-md transition-colors"
      >
        <p className="blue-gradient_text font-extrabold">OS</p>
      </NavLink>

      <div className="flex items-center gap-6">
        <nav className="flex text-lg gap-6 font-semibold items-center">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 font-bold drop-shadow"
                : isNight
                ? "text-slate-200 hover:text-blue-400"
                : "text-slate-700 hover:text-blue-600"
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
                ? "text-slate-200 hover:text-blue-400"
                : "text-slate-700 hover:text-blue-600"
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


