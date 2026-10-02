import { Link } from "react-router-dom";
import { arrow } from "../assets/icons";
import { useTheme } from "../context/ThemeContext";

const HomeInfo = ({ currentStage }) => {
  const { isNight } = useTheme();

  if (currentStage === 1)
    return (
      <div
        className={`text-center py-3.5 px-5 mx-4 rounded-2xl border shadow-xl transition-all duration-300 backdrop-blur-md max-w-xs sm:max-w-md ${
          isNight
            ? "bg-slate-950/85 border-indigo-500/30 text-white shadow-indigo-950/60"
            : "bg-white/90 border-blue-200/80 text-slate-900 shadow-blue-500/15"
        }`}
      >
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-space uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          3D Developer Portfolio
        </div>
        <h1 className="font-outfit font-extrabold text-lg sm:text-xl leading-tight">
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-sky-400 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent">
            Om Sharma
          </span>{" "}
          👋
        </h1>
        <p className={`text-xs sm:text-sm mt-1 font-medium ${isNight ? "text-slate-300" : "text-slate-600"}`}>
          Full-Stack Developer & AI Explorer 🚀
        </p>
        <div className="text-[10px] mt-2 text-slate-500 dark:text-slate-400 font-mono">
          Drag horizontally to rotate island & explore ✨
        </div>
      </div>
    );

  if (currentStage === 2) {
    return (
      <div
        className={`mx-4 relative flex flex-col items-center gap-2.5 max-w-xs sm:max-w-md py-3.5 px-5 shadow-xl rounded-2xl border transition-all duration-300 backdrop-blur-md text-center ${
          isNight
            ? "bg-slate-950/85 border-indigo-500/30 text-white shadow-indigo-950/60"
            : "bg-white/90 border-blue-200/80 text-slate-900 shadow-blue-500/15"
        }`}
      >
        <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-indigo-400">
          Education & Background
        </span>
        <p className={`font-outfit font-bold text-xs sm:text-sm leading-snug ${isNight ? "text-slate-100" : "text-slate-800"}`}>
          Pursuing B.Tech Computer Science @ GLA University & building modern web & 3D apps.
        </p>

        <Link
          to="/about"
          className="mt-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-outfit font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 group"
        >
          <span>Learn more</span>
          <img
            src={arrow}
            alt="arrow"
            className="w-3.5 h-3.5 object-contain transition-transform group-hover:translate-x-1 filter invert"
          />
        </Link>
      </div>
    );
  }

  if (currentStage === 3) {
    return (
      <div
        className={`mx-4 relative flex flex-col items-center gap-2.5 max-w-xs sm:max-w-md py-3.5 px-5 shadow-xl rounded-2xl border transition-all duration-300 backdrop-blur-md text-center ${
          isNight
            ? "bg-slate-950/85 border-indigo-500/30 text-white shadow-indigo-950/60"
            : "bg-white/90 border-blue-200/80 text-slate-900 shadow-blue-500/15"
        }`}
      >
        <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
          Featured Work
        </span>
        <p className={`font-outfit font-bold text-xs sm:text-sm leading-snug ${isNight ? "text-slate-100" : "text-slate-800"}`}>
          Built multiple high-impact web, automation & 3D projects.
        </p>

        <Link
          to="/projects"
          className="mt-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-outfit font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 group"
        >
          <span>Explore projects</span>
          <img
            src={arrow}
            alt="arrow"
            className="w-3.5 h-3.5 object-contain transition-transform group-hover:translate-x-1 filter invert"
          />
        </Link>
      </div>
    );
  }

  if (currentStage === 4) {
    return (
      <div
        className={`mx-4 relative flex flex-col items-center gap-2.5 max-w-xs sm:max-w-md py-3.5 px-5 shadow-xl rounded-2xl border transition-all duration-300 backdrop-blur-md text-center ${
          isNight
            ? "bg-slate-950/85 border-indigo-500/30 text-white shadow-indigo-950/60"
            : "bg-white/90 border-blue-200/80 text-slate-900 shadow-blue-500/15"
        }`}
      >
        <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Get In Touch
        </span>
        <p className={`font-outfit font-bold text-xs sm:text-sm leading-snug ${isNight ? "text-slate-100" : "text-slate-800"}`}>
          Looking for a passionate developer or have an exciting project idea?
        </p>

        <Link
          to="/contact"
          className="mt-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-outfit font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 group"
        >
          <span>Let's talk</span>
          <img
            src={arrow}
            alt="arrow"
            className="w-3.5 h-3.5 object-contain transition-transform group-hover:translate-x-1 filter invert"
          />
        </Link>
      </div>
    );
  }

  return null;
};

export default HomeInfo;


