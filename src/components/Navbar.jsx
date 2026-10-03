import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ onOpenTerminal }) => {
  const { isNight } = useTheme();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY <= 15) {
            // Near top of page -> Header always visible
            setIsVisible(true);
          } else if (currentScrollY < lastScrollY.current - 4) {
            // Scrolling UP -> Reveal header immediately
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY.current + 4 && currentScrollY > 60) {
            // Scrolling DOWN -> Hide header smoothly
            setIsVisible(false);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 w-full max-w-5xl mx-auto flex justify-between items-center sm:px-12 px-3 py-3 sm:py-4 z-50 pointer-events-auto transition-all duration-500 transform ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      {/* Home Brand Button */}
      <NavLink
        to="/"
        aria-label="Home"
        title="Go to Home"
        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-md sm:shadow-lg shrink-0 outline-none select-none group relative overflow-hidden ${
          isNight
            ? "bg-slate-900/90 text-indigo-400 border border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800 shadow-indigo-950/40"
            : "bg-white/90 text-blue-600 border border-slate-200/90 hover:border-blue-300 hover:bg-slate-50 shadow-blue-500/10"
        }`}
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 transition-opacity duration-300" />
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 fill-current transition-transform duration-300 group-hover:scale-110 relative z-10"
          viewBox="0 0 24 24"
        >
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </NavLink>

      {/* Navigation & Action Buttons */}
      <div
        className={`flex items-center gap-1.5 sm:gap-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border shadow-md sm:shadow-lg transition-all duration-300 shrink-0 ${
          isNight
            ? "bg-slate-950/80 border-slate-800/80 backdrop-blur-xl shadow-slate-950/50"
            : "bg-white/80 border-slate-200/80 backdrop-blur-xl shadow-slate-200/50"
        }`}
      >
        <nav className="flex text-xs sm:text-base font-outfit gap-1 sm:gap-2 font-bold items-center">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full font-bold text-xs sm:text-base transition-all duration-300 select-none outline-none ${
                isActive
                  ? isNight
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-extrabold shadow-md shadow-indigo-950/70"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-md shadow-blue-500/25"
                  : isNight
                  ? "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  : "text-slate-700 hover:text-blue-600 hover:bg-slate-100"
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full font-bold text-xs sm:text-base transition-all duration-300 select-none outline-none ${
                isActive
                  ? isNight
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-extrabold shadow-md shadow-indigo-950/70"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-md shadow-blue-500/25"
                  : isNight
                  ? "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  : "text-slate-700 hover:text-blue-600 hover:bg-slate-100"
              }`
            }
          >
            Projects
          </NavLink>

          {/* Contact - Laptop / Desktop Only */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `hidden md:inline-block px-4 py-1.5 rounded-full font-bold text-sm sm:text-base transition-all duration-300 select-none outline-none ${
                isActive
                  ? isNight
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-extrabold shadow-md shadow-indigo-950/70"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-md shadow-blue-500/25"
                  : isNight
                  ? "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  : "text-slate-700 hover:text-blue-600 hover:bg-slate-100"
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        <div className="h-4 sm:h-5 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5" />

        {/* Developer Terminal Trigger Button */}
        <button
          onClick={onOpenTerminal}
          type="button"
          title="Open Developer Terminal (Ctrl+K)"
          className={`px-2.5 py-1 rounded-full font-mono font-bold text-xs flex items-center gap-1.5 transition-all duration-300 select-none outline-none active:scale-95 ${
            isNight
              ? "bg-slate-900 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 hover:bg-slate-800 shadow-sm"
              : "bg-slate-100 text-cyan-700 border border-cyan-500/40 hover:border-cyan-600 hover:bg-white shadow-sm"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>&gt;_ CLI</span>
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;
