import { Link } from "react-router-dom";
import { CTA } from "../components";
import { projects } from "../constants";
import { arrow } from "../assets/icons";
import { useTheme } from "../context/ThemeContext";

// Helper map for tech stack pills per project
const projectTechMap = {
  "Hospital Management System": ["Node.js", "Express.js", "MongoDB", "Mongoose", "JavaScript", "HTML/CSS"],
  "3D Interactive Portfolio": ["React", "Three.js", "React Three Fiber", "Tailwind CSS", "Vite"],
  "Instagram Automation Bot (WIP)": ["Python", "Automation", "Node.js", "API Integrations"]
};

const Projects = () => {
  const { isNight } = useTheme();

  return (
    <section className="max-container">
      <div className="flex flex-col items-start">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold font-space uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          Featured Work & Innovation
        </div>

        <h1 className="head-text">
          My{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-sky-400 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
            Projects
          </span>
        </h1>
      </div>

      <p
        className={`mt-3 text-base sm:text-lg leading-relaxed max-w-3xl ${
          isNight ? "text-slate-300" : "text-slate-600"
        }`}
      >
        Explore a curated collection of software projects I've engineered — spanning full-stack web applications, interactive 3D experiences, and automated bots.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-12 sm:my-16 gap-6 sm:gap-8">
        {projects.map((project) => {
          const techStack = projectTechMap[project.name] || ["Full-Stack", "JavaScript"];

          return (
            <div
              key={project.name}
              className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl group relative overflow-hidden ${
                isNight
                  ? "bg-slate-900/90 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/90 shadow-slate-950/50"
                  : "bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-blue-500/15"
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="block-container w-14 h-14 shrink-0">
                    <div className={`btn-back rounded-2xl ${project.theme}`} />
                    <div className="btn-front rounded-2xl flex justify-center items-center">
                      <img
                        src={project.iconUrl}
                        alt={project.name}
                        className="w-7 h-7 object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {project.name.includes("WIP") ? "In Development ⚙️" : "Completed ✨"}
                  </span>
                </div>

                <h4
                  className={`text-xl sm:text-2xl font-outfit font-bold group-hover:text-blue-500 transition-colors ${
                    isNight ? "text-white" : "text-slate-900"
                  }`}
                >
                  {project.name}
                </h4>

                <p
                  className={`mt-3 text-sm sm:text-base leading-relaxed ${
                    isNight ? "text-slate-300/90" : "text-slate-600"
                  }`}
                >
                  {project.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium font-space ${
                        isNight
                          ? "bg-slate-800/90 text-indigo-300 border border-slate-700/80"
                          : "bg-blue-50 text-blue-700 border border-blue-100/80"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="mt-8 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                <Link
                  to={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-outfit font-bold text-sm text-blue-600 dark:text-indigo-400 hover:text-blue-500 dark:hover:text-indigo-300 transition-colors group/link"
                >
                  <span>View Project Repository / Live</span>
                  <img
                    src={arrow}
                    alt="arrow"
                    className="w-4 h-4 object-contain transition-transform group-hover/link:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <hr className={isNight ? "border-slate-800" : "border-slate-200"} />

      <CTA />
    </section>
  );
};

export default Projects;

