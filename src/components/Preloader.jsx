import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { useTheme } from "../context/ThemeContext";

const Preloader = ({ onComplete }) => {
  const { progress, active, total } = useProgress();
  const { isNight } = useTheme();

  const [displayProgress, setDisplayProgress] = useState(0);
  const [isReadyToExit, setIsReadyToExit] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Lock body scroll while preloader is active, restore when unmounted
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Calculate target progress: if active is false or total is 0 (cached/non-3D route), target is 100 immediately
  const targetProgress =
    !active || total === 0 || progress >= 100
      ? 100
      : Math.min(100, Math.max(0, Math.round(progress)));

  // Smoothly increment displayProgress to match targetProgress
  useEffect(() => {
    const step = targetProgress === 100 ? 5 : 2;
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < targetProgress) {
          return Math.min(prev + step, targetProgress);
        }
        return prev;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [targetProgress]);

  // Maximum fallback safety timer (4 seconds) so the user is never stuck
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setDisplayProgress(100);
      setIsReadyToExit(true);
    }, 4000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  // When displayProgress hits 100%, trigger exit sequence
  useEffect(() => {
    if (displayProgress >= 98 || (targetProgress === 100 && displayProgress >= 95)) {
      const exitTimer = setTimeout(() => {
        setDisplayProgress(100);
        setIsReadyToExit(true);
      }, 300);

      return () => clearTimeout(exitTimer);
    }
  }, [displayProgress, targetProgress]);

  // Handle smooth fade reveal animation & scroll restoration
  useEffect(() => {
    if (isReadyToExit && !isExiting) {
      setIsExiting(true);
      // Immediately restore body scroll when reveal starts
      document.body.style.overflow = "";

      const finishTimer = setTimeout(() => {
        setIsFinished(true);
        if (onComplete) onComplete();
      }, 500);

      return () => clearTimeout(finishTimer);
    }
  }, [isReadyToExit, isExiting, onComplete]);

  if (isFinished) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between py-10 sm:py-12 px-4 sm:px-6 select-none transition-all duration-500 ease-in-out ${
        isExiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      } ${
        isNight
          ? "bg-slate-950 text-slate-100"
          : "bg-gradient-to-b from-sky-50 via-slate-100 to-blue-50 text-slate-800"
      }`}
    >
      {/* Background Decorative Glow */}
      {isNight ? (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/80 pointer-events-none">
          <div className="stars-overlay absolute inset-0 opacity-70 pointer-events-none" />
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-80 sm:w-96 h-80 sm:h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-80 sm:w-96 h-80 sm:h-96 bg-sky-300/15 rounded-full blur-3xl animate-pulse delay-700" />
        </div>
      )}

      {/* Top Branding: Stylish Modern Dotted Cyber Badge for OM SHARMA */}
      <div className="relative z-10 flex flex-col items-center mt-3 sm:mt-5">
        <div
          className={`group relative px-6 sm:px-8 py-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 shadow-2xl backdrop-blur-md overflow-hidden ${
            isNight
              ? "bg-slate-900/85 border border-slate-700/60 shadow-indigo-950/60"
              : "bg-white/85 border border-slate-200/80 shadow-blue-500/10"
          }`}
        >
          {/* Dotted Matrix Background Accent */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, #00c6ff 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          />

          {/* Tech Corner Crosshairs */}
          <div className="absolute top-1 left-2 w-2 h-2 border-t-2 border-l-2 border-blue-500 opacity-70" />
          <div className="absolute top-1 right-2 w-2 h-2 border-t-2 border-r-2 border-blue-500 opacity-70" />
          <div className="absolute bottom-1 left-2 w-2 h-2 border-b-2 border-l-2 border-blue-500 opacity-70" />
          <div className="absolute bottom-1 right-2 w-2 h-2 border-b-2 border-r-2 border-blue-500 opacity-70" />

          {/* Full Name in Modern Futuristic Gradient Typography */}
          <h2 className="relative text-xl sm:text-2xl font-black tracking-[0.35em] sm:tracking-[0.45em] uppercase font-poppins blue-gradient_text pl-1.5 drop-shadow-sm">
            OM SHARMA
          </h2>

          {/* Sub-tag indicator */}
          <div className="flex items-center gap-1.5 mt-1 opacity-80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping inline-block" />
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-mono text-blue-500 dark:text-blue-400 font-bold">
              3D DEVELOPER
            </span>
          </div>
        </div>
      </div>

      {/* Center Welcome Intro */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto my-auto px-2">
        <div className="mb-3 sm:mb-4 text-blue-500/80 dark:text-blue-400/80 animate-bounce duration-1000">
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>

        <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] font-semibold text-blue-500 dark:text-blue-400 mb-2">
          3D Interactive Portfolio
        </p>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wider font-poppins mb-2 sm:mb-3 uppercase">
          <span className={isNight ? "text-slate-100" : "text-slate-800"}>
            WELCOME TO MY{" "}
          </span>
          <span className="blue-gradient_text">WORLD</span>
        </h1>

        <p className="text-xs sm:text-base opacity-75 max-w-xs sm:max-w-sm font-normal leading-relaxed">
          Preparing interactive 3D scene & assets...
        </p>
      </div>

      {/* Bottom Loading Progress Bar */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-md mx-auto mb-4 sm:mb-6 flex flex-col items-center px-2">
        <div className="w-full flex justify-between items-center text-xs font-semibold mb-2 tracking-wider">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping inline-block" />
            <span className={isNight ? "text-slate-300" : "text-slate-600"}>
              LOADING...
            </span>
          </span>
          <span className="blue-gradient_text font-mono text-xs sm:text-sm font-bold">
            {displayProgress}%
          </span>
        </div>

        <div
          className={`w-full h-2 sm:h-2.5 rounded-full p-0.5 overflow-hidden transition-all duration-300 ${
            isNight
              ? "bg-slate-900 border border-slate-800"
              : "bg-slate-200/80 border border-slate-300/50"
          }`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#00c6ff] via-[#0092ff] to-[#0072ff] transition-all duration-150 ease-out shadow-sm"
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        <p className="text-[10px] sm:text-[11px] opacity-50 mt-2 sm:mt-3 font-medium tracking-wide">
          Interactive Experience Powered by Three.js
        </p>
      </div>
    </div>
  );
};

export default Preloader;
