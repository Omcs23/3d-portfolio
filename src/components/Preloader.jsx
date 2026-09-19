import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

const Preloader = ({ onComplete }) => {
  const { progress, active, total } = useProgress();

  const [displayProgress, setDisplayProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
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
    const step = targetProgress === 100 ? 4 : 2;
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

  // Maximum fallback safety timer (3.5 seconds) so user is never blocked
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setDisplayProgress(100);
      setIsLoaded(true);
    }, 3500);

    return () => clearTimeout(fallbackTimer);
  }, []);

  // Set isLoaded when progress reaches 98-100%
  useEffect(() => {
    if (displayProgress >= 98 || (targetProgress === 100 && displayProgress >= 95)) {
      const loadTimer = setTimeout(() => {
        setDisplayProgress(100);
        setIsLoaded(true);
      }, 200);

      return () => clearTimeout(loadTimer);
    }
  }, [displayProgress, targetProgress]);

  // Handle exiting preloader
  const handleEnterWorld = () => {
    if (!isLoaded || isExiting) return;
    setIsExiting(true);
    document.body.style.overflow = "";

    const finishTimer = setTimeout(() => {
      setIsFinished(true);
      if (onComplete) onComplete();
    }, 550);
  };

  // Keyboard shortcut: Press Enter or Space to skip/enter when ready
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "Enter" || e.key === " ") && isLoaded) {
        e.preventDefault();
        handleEnterWorld();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoaded, isExiting]);

  if (isFinished) return null;

  return (
    <div
      data-preloader="true"
      className={`fixed inset-0 z-[9999] w-full h-[100dvh] max-h-[100dvh] bg-black text-white flex flex-col justify-between px-6 sm:px-12 py-6 sm:py-10 select-none overflow-hidden box-border transition-all duration-700 ease-in-out ${
        isExiting ? "opacity-0 scale-98 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Top Headline Section */}
      <div className="w-full max-w-2xl sm:max-w-4xl mx-auto pt-2 sm:pt-4">
        <h1 className="text-[44px] xs:text-[50px] sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.98] text-white uppercase text-left font-sans">
          WELCOME<br />
          TO MY<br />
          WORLD!
        </h1>
      </div>

      {/* Middle Bio Section (Right-Aligned like reference screenshot) */}
      <div className="w-full max-w-2xl sm:max-w-4xl mx-auto flex flex-col items-end text-right my-auto py-2 sm:py-4">
        <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-neutral-100 font-normal leading-snug max-w-[280px] xs:max-w-[320px] sm:max-w-md md:max-w-lg text-right">
          I'm Om, an Interaction Designer who is enthusiastic about creating engaging and delightful digital experiences.
        </p>

        <p className="text-xs sm:text-sm text-neutral-300 font-normal mt-4 sm:mt-6 tracking-wide text-right">
          This website was last updated in 2026.
        </p>
      </div>

      {/* Bottom Capsule Progress / Pill Button */}
      <div className="w-full max-w-2xl sm:max-w-4xl mx-auto pb-2 flex flex-col items-center shrink-0">
        <button
          type="button"
          disabled={!isLoaded}
          onClick={handleEnterWorld}
          className={`w-full h-14 sm:h-16 rounded-full relative overflow-hidden transition-all duration-300 shadow-2xl flex items-center justify-center ${
            isLoaded
              ? "cursor-pointer hover:scale-[1.01] active:scale-[0.99] animate-pulse"
              : "cursor-not-allowed opacity-90"
          }`}
          style={{ backgroundColor: "#8187F5" }}
        >
          {/* White Progress Fill bar */}
          <div
            className="absolute top-0 left-0 bottom-0 bg-white transition-all duration-150 ease-out"
            style={{ width: `${displayProgress}%` }}
          />

          {/* Bold Black Text inside pill */}
          <span className="relative z-10 font-extrabold text-sm sm:text-base tracking-[0.2em] uppercase text-black">
            {isLoaded ? "CLICK TO ENTER" : "LOADING..."}
          </span>
        </button>

        {isLoaded && (
          <p className="text-center text-[10px] sm:text-xs text-neutral-400 mt-2 font-mono tracking-wider">
            Click pill or press ENTER to start
          </p>
        )}
      </div>
    </div>
  );
};

export default Preloader;
