import { useEffect, useState, useRef } from "react";
import { useProgress } from "@react-three/drei";

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const { progress, active, total, loaded } = useProgress();

  const [displayProgress, setDisplayProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLampOn, setIsLampOn] = useState(false);
  const [isPullingRope, setIsPullingRope] = useState(false);

  const handlePullRope = () => {
    setIsPullingRope(true);
    setIsLampOn((prev) => !prev);
    setTimeout(() => {
      setIsPullingRope(false);
    }, 250);
  };

  // Lock body scroll while preloader is active, restore when unmounted
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Safe numerical progress (guards against NaN / undefined)
  const safeProgress = typeof progress === "number" && !isNaN(progress) ? progress : 0;

  // Determine effective target percentage
  const targetProgress =
    (total > 0 && loaded >= total) || safeProgress >= 100
      ? 100
      : active && safeProgress > 0
      ? Math.min(99, Math.max(10, Math.round(safeProgress)))
      : 95; // Smooth initial ramp target while gltf starts loading

  // Smooth progress ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < targetProgress) {
          const step = targetProgress === 100 ? 5 : 2;
          return Math.min(prev + step, targetProgress);
        }
        return prev;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [targetProgress]);

  // Safety fallback timer (2.2s) ensures completion
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setDisplayProgress(100);
      setIsLoaded(true);
    }, 2200);

    return () => clearTimeout(safetyTimer);
  }, []);

  // Trigger isLoaded when progress reaches 98%+
  useEffect(() => {
    if (displayProgress >= 98) {
      const loadTimer = setTimeout(() => {
        setDisplayProgress(100);
        setIsLoaded(true);
      }, 150);

      return () => clearTimeout(loadTimer);
    }
  }, [displayProgress]);

  // Auto-scroll down to "CLICK TO ENTER" button when loaded in horizontal / landscape mode
  useEffect(() => {
    if (isLoaded) {
      const scrollToButton = () => {
        const isLandscape =
          window.matchMedia("(orientation: landscape)").matches ||
          window.innerHeight < 600;

        if (isLandscape && containerRef.current) {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      };

      const timer = setTimeout(scrollToButton, 200);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  // Handle exiting preloader
  const handleEnterWorld = () => {
    if (!isLoaded || isExiting) return;
    setIsExiting(true);
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

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
      ref={containerRef}
      data-preloader="true"
      className={`fixed top-0 left-0 right-0 bottom-0 inset-0 z-[99999] w-full h-full flex flex-col justify-between px-4 xs:px-6 sm:px-12 py-4 xs:py-6 sm:py-10 select-none overflow-x-hidden overflow-y-auto box-border transition-all duration-700 ease-in-out ${
        isLampOn ? "bg-[#FAF8F5] text-slate-900" : "bg-black text-white"
      } ${isExiting ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <style>{`
        @media (orientation: landscape) {
          [data-preloader="true"] {
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y;
          }
        }
        @media (max-height: 600px) {
          [data-preloader="true"] {
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y;
          }
        }
      `}</style>

      {/* Ambient Glowing Light Cone when Lamp is Turned ON */}
      <div
        className={`absolute top-0 right-2 sm:right-20 w-[280px] xs:w-[350px] sm:w-[500px] h-full pointer-events-none transition-opacity duration-700 z-0 ${
          isLampOn ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(253,224,71,0.35) 0%, rgba(251,191,36,0.15) 50%, transparent 80%)",
        }}
      />

      {/* Hanging Ceiling Lamp with Interactive Pull-Rope (Top Right) */}
      <div className="absolute top-0 right-4 xs:right-8 sm:right-20 z-30 flex flex-col items-center select-none pointer-events-none">
        {/* Ceiling Cord - Responsive height for rotated/mobile screens */}
        <div className={`w-[2px] h-8 xs:h-12 sm:h-20 transition-colors duration-500 ${isLampOn ? "bg-amber-700/60" : "bg-neutral-600"}`} />

        {/* Lamp Fixture & Shade */}
        <div className="relative flex flex-col items-center">
          {/* Metal Cap */}
          <div className="w-4 sm:w-5 h-2 bg-neutral-700 rounded-t-sm" />

          {/* Lamp Shade (Pendant Dome) */}
          <div className={`w-14 xs:w-16 sm:w-20 h-8 sm:h-10 rounded-t-full relative shadow-md transition-colors duration-500 ${
            isLampOn ? "bg-gradient-to-b from-amber-600 to-amber-700" : "bg-gradient-to-b from-neutral-800 to-neutral-900"
          }`}>
            {/* Lamp Shade Rim */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 transition-colors duration-500 ${
              isLampOn ? "bg-amber-400" : "bg-neutral-600"
            }`} />
          </div>

          {/* Glowing Bulb */}
          <div className={`w-6 h-6 sm:w-8 sm:h-8 -mt-1.5 sm:-mt-2 rounded-full transition-all duration-500 flex items-center justify-center ${
            isLampOn
              ? "bg-amber-200 shadow-[0_0_40px_15px_rgba(251,191,36,0.9)] animate-pulse"
              : "bg-neutral-700/80 shadow-none"
          }`}>
            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${isLampOn ? "bg-white" : "bg-neutral-500"}`} />
          </div>

          {/* Pull Rope Container */}
          <div className="relative flex flex-col items-center pointer-events-auto">
            {/* Beaded Rope Line */}
            <div
              className={`w-[2px] transition-all duration-200 ease-out origin-top ${
                isLampOn ? "bg-amber-500/80" : "bg-neutral-400/80"
              }`}
              style={{
                height: isPullingRope ? "56px" : "40px",
              }}
            />

            {/* Brass Pull Knob / Handle Ring */}
            <button
              type="button"
              onClick={handlePullRope}
              title="Pull rope to turn light ON / OFF 💡"
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center cursor-pointer hover:scale-125 active:scale-90 shadow-lg ${
                isPullingRope ? "translate-y-3 scale-110" : "translate-y-0"
              } ${
                isLampOn
                  ? "bg-amber-400 border-amber-200 text-amber-950 shadow-amber-500/50"
                  : "bg-neutral-300 border-white text-neutral-800 shadow-white/20"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isLampOn ? "bg-amber-900" : "bg-neutral-600"}`} />
            </button>

            {/* Helper Floating Tooltip Badge - Positioned safely inside screen bounds (Left of Knob on mobile/desktop) */}
            <div
              onClick={handlePullRope}
              className={`absolute right-7 top-0 whitespace-nowrap text-[9px] xs:text-[10px] sm:text-xs font-pixel px-2 py-1 rounded-full cursor-pointer border transition-all duration-300 shadow-md ${
                isLampOn
                  ? "bg-amber-200/95 text-amber-950 border-amber-400"
                  : "bg-neutral-800/95 text-amber-300 border-neutral-700 animate-bounce"
              }`}
            >
              {isLampOn ? "LIGHT ON 💡" : "PULL ROPE 💡"}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl sm:max-w-4xl mx-auto min-h-full flex flex-col justify-between py-2 relative z-10">
        {/* Top Headline Section */}
        <div className="w-full pt-2 sm:pt-4 shrink-0">
          <h1 className={`text-[32px] xs:text-[40px] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider leading-[1.1] uppercase text-left font-pixel transition-colors duration-500 ${
            isLampOn ? "text-slate-950" : "text-white"
          }`}>
            WELCOME<br />
            TO MY<br />
            WORLD!
          </h1>
        </div>

        {/* Middle Bio Section */}
        <div className="w-full flex flex-col items-end text-right my-auto py-6 sm:py-8 shrink-0">
          <p className={`text-sm xs:text-base sm:text-lg md:text-xl font-pixel leading-relaxed max-w-[320px] xs:max-w-[360px] sm:max-w-md md:max-w-lg text-right tracking-wide transition-colors duration-500 ${
            isLampOn ? "text-slate-800" : "text-neutral-100"
          }`}>
            I'm Om Sharma, a Full-Stack Developer & AI Explorer passionate about building interactive web applications & 3D experiences.
          </p>

          <p className={`text-xs sm:text-sm font-pixel mt-4 sm:mt-6 tracking-wider text-right transition-colors duration-500 ${
            isLampOn ? "text-slate-500" : "text-neutral-400"
          }`}>
            Interactive 3D Portfolio • 2026
          </p>
        </div>

        {/* Bottom Capsule Progress / Pill Button */}
        <div className="w-full pb-2 flex flex-col items-center shrink-0">
          <button
            type="button"
            disabled={!isLoaded}
            onClick={handleEnterWorld}
            className={`w-full h-14 sm:h-16 rounded-full relative overflow-hidden transition-all duration-300 shadow-2xl flex items-center justify-center ${
              isLoaded
                ? "cursor-pointer hover:scale-[1.01] active:scale-[0.99] animate-pulse"
                : "cursor-not-allowed opacity-90"
            }`}
            style={{ backgroundColor: isLampOn ? "#6366F1" : "#8187F5" }}
          >
            {/* Progress Fill bar */}
            <div
              className={`absolute top-0 left-0 bottom-0 transition-all duration-150 ease-out ${
                isLampOn ? "bg-slate-900" : "bg-white"
              }`}
              style={{ width: `${Math.round(displayProgress)}%` }}
            />

            {/* Bold Text inside pill */}
            <span className={`relative z-10 font-bold text-xs sm:text-sm md:text-base tracking-[0.15em] uppercase font-pixel transition-colors duration-300 ${
              isLampOn ? "text-white" : "text-black"
            }`}>
              {isLoaded ? "CLICK TO ENTER" : `LOADING... ${Math.round(displayProgress)}%`}
            </span>
          </button>

          {isLoaded && (
            <p className={`text-center text-[10px] sm:text-xs mt-2 font-pixel tracking-wider transition-colors duration-500 ${
              isLampOn ? "text-slate-500" : "text-neutral-400"
            }`}>
              Click pill or press ENTER to start
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preloader;
