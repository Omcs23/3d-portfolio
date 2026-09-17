import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const CTA = () => {
  const { isNight } = useTheme();

  return (
    <section className="cta">
      <p className={`cta-text ${isNight ? "text-slate-100" : "text-slate-900"}`}>
        Have an opportunity in mind? <br className="sm:block hidden" />
        Let’s connect!
      </p>
      <Link to="/contact" className="btn font-semibold shadow-md w-full sm:w-auto">
        Contact Me
      </Link>
    </section>
  );
};

export default CTA;
