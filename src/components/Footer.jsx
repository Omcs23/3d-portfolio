import { Link } from "react-router-dom";
import { socialLinks } from "../constants";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { isNight } = useTheme();

  return (
    <footer className="footer font-outfit">
      <hr className={isNight ? "border-slate-800/80" : "border-slate-200/80"} />

      <div className="footer-container py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className={`text-sm ${isNight ? "text-slate-400" : "text-slate-600"}`}>
          © 2026{" "}
          <strong className={`font-bold ${isNight ? "text-white" : "text-slate-900"}`}>
            Om Sharma
          </strong>
          . All rights reserved.

        </p>

        <div className="hidden md:flex gap-2.5 justify-center items-center flex-wrap">

          {socialLinks.map((link) => (
            <Link
              key={link.name}
              to={link.link}
              target={link.link.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              title={link.name}
              className={`p-2.5 rounded-xl border transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                isNight
                  ? "bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 text-slate-300"
                  : "bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700 shadow-sm"
              }`}
            >
              <img
                src={link.iconUrl}
                alt={link.name}
                className="w-5 h-5 object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

