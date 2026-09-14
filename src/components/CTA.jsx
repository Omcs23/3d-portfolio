import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const CTA = () => {
  const { isNight } = useTheme();

  return (
    <section className="cta">
      <p className={`cta-text ${isNight ? "text-slate-100" : "text-black-500"}`}>
        Have an opportunity in mind? <br className="sm:block hidden" />
        Let’s connect!
      </p>
      <Link to="/contact" className="btn font-semibold shadow-md">
        Contact Me
      </Link>
    </section>
  );
};

export default CTA;
