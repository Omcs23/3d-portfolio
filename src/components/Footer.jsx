import { Link } from "react-router-dom";
import { socialLinks } from "../constants";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { isNight } = useTheme();

  return (
    <footer className="footer font-poppins">
      <hr className={isNight ? "border-slate-800" : "border-slate-200"} />

      <div className="footer-container py-2">
        <p className={isNight ? "text-slate-400" : "text-slate-600"}>
          © 2026{" "}
          <strong className={isNight ? "text-white" : "text-slate-900"}>
            Om Sharma
          </strong>
          . All rights reserved.
        </p>

        <div className="hidden md:flex gap-4 justify-center items-center flex-wrap">
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              to={link.link}
              target={link.link.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              title={link.name}
              className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                isNight
                  ? "hover:bg-slate-800/80 text-slate-300"
                  : "hover:bg-slate-200/60 text-slate-700"
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
