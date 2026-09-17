import { Link } from "react-router-dom";
import { CTA } from "../components";
import { projects } from "../constants";
import { arrow } from "../assets/icons";
import { useTheme } from "../context/ThemeContext";

const Projects = () => {
  const { isNight } = useTheme();

  return (
    <section className="max-container">
      <h1 className="head-text">
        My{" "}
        <span className="blue-gradient_text drop-shadow font-semibold">
          Projects
        </span>
      </h1>

      <p
        className={`mt-2 leading-relaxed ${
          isNight ? "text-slate-400" : "text-slate-500"
        }`}
      >
        Here are some of the projects I've built, combining web development, automation,
        and interactive experiences.
      </p>

      <div className="flex flex-wrap my-10 sm:my-20 gap-8 sm:gap-16">
        {projects.map((project) => (
          <div className="lg:w-[400px] w-full" key={project.name}>
            <div className="block-container w-12 h-12">
              <div className={`btn-back rounded-xl ${project.theme}`} />
              <div className="btn-front rounded-xl flex justify-center items-center">
                <img
                  src={project.iconUrl}
                  alt={project.name}
                  className="w-1/2 h-1/2 object-contain"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col">
              <h4
                className={`text-2xl font-poppins font-semibold ${
                  isNight ? "text-white" : "text-slate-900"
                }`}
              >
                {project.name}
              </h4>
              <p
                className={`mt-2 ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {project.description}
              </p>
              <div className="mt-5 flex items-center gap-2 font-poppins">
                <Link
                  to={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Live / Repository Link
                </Link>
                <img
                  src={arrow}
                  alt="arrow"
                  className="w-4 h-4 object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr className={isNight ? "border-slate-800" : "border-slate-200"} />

      <CTA />
    </section>
  );
};

export default Projects;
