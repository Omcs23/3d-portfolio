import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const CTA = () => {
  const { isNight } = useTheme();

  return (
    <section
      className={`cta ${
        isNight
          ? "bg-slate-900/90 border-slate-800 shadow-2xl shadow-indigo-950/40"
          : "bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-sky-50/90 border-slate-200/90 shadow-xl shadow-blue-500/5"
      }`}
    >
      <div className="flex flex-col gap-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-500 dark:text-indigo-400">
          Collaboration & Opportunities
        </span>
        <p className={`cta-text ${isNight ? "text-white" : "text-slate-900"}`}>
          Have an exciting project or opportunity? <br className="sm:block hidden" />
          Let's build something remarkable together!
        </p>
      </div>

      <Link
        to="/contact"
        className="btn font-outfit font-bold text-base py-3.5 px-8 shadow-lg shadow-blue-500/25 shrink-0 group flex items-center justify-center gap-2"
      >
        <span>Contact Me</span>
        <span className="group-hover:translate-x-1 transition-transform">🚀</span>
      </Link>
    </section>
  );
};

export default CTA;

