import { useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import { CTA, Alert } from "../components";
import { experiences, skills, socialLinks } from "../constants";
import useAlert from "../hooks/useAlert";
import { useTheme } from "../context/ThemeContext";

import "react-vertical-timeline-component/style.min.css";

const About = () => {
  const { alert, showAlert, hideAlert } = useAlert();
  const [copiedType, setCopiedType] = useState(null);
  const { isNight } = useTheme();

  const handleCopyResumeText = () => {
    const resumeSummary = `OM SHARMA
B.Tech Computer Science & Engineering @ GLA University (2023 - 2027)
Full-Stack Developer | Competitive Programmer | AI & DevOps Certified

SUMMARY:
Creative Full-Stack Developer and Problem Solver with hands-on experience in MERN Stack (MongoDB, Express.js, React.js, Node.js), Java, and Python. Active competitive programmer on LeetCode, Codeforces, and HackerRank.

CERTIFICATIONS:
- Oracle OCI 2025 Certified Generative AI Professional
- Oracle OCI 2025 Certified DevOps Professional
- Google Cybersecurity Professional Certificate (Coursera)
- Infosys Springboard MERN Stack & Java Programming Certifications

PROFILES:
- GitHub: https://github.com/Omcs23
- LinkedIn: https://www.linkedin.com/in/om-sharma-88109b296
- LeetCode: https://leetcode.com/u/OmSharma152/
- Codeforces: https://codeforces.com/profile/OmSharma_cs
- HackerRank: https://www.hackerrank.com/profile/iOmSharma52
- Instagram: https://www.instagram.com/om.chaturvedi52`;

    navigator.clipboard.writeText(resumeSummary);
    setCopiedType("text");
    showAlert({
      show: true,
      text: "Resume summary copied to clipboard! 📋",
      type: "success",
    });

    setTimeout(() => {
      setCopiedType(null);
      hideAlert();
    }, 3000);
  };

  const handleCopyResumeLink = () => {
    const resumeLink = `${window.location.origin}/Om_Sharma_Resume.pdf`;
    navigator.clipboard.writeText(resumeLink);
    setCopiedType("link");
    showAlert({
      show: true,
      text: "Resume link copied to clipboard! 🔗",
      type: "success",
    });

    setTimeout(() => {
      setCopiedType(null);
      hideAlert();
    }, 3000);
  };

  return (
    <section className="max-container">
      {alert.show && <Alert {...alert} />}

      <h1 className="head-text">
        Hello, I'm{" "}
        <span className="blue-gradient_text font-semibold drop-shadow">
          Om Sharma
        </span>{" "}
        👋
      </h1>

      <div
        className={`mt-5 flex flex-col gap-3 leading-relaxed transition-colors ${
          isNight ? "text-slate-300" : "text-slate-600"
        }`}
      >
        <p>
          B.Tech Computer Science & Engineering student at{" "}
          <strong className={isNight ? "text-white" : "text-slate-900"}>
            GLA University
          </strong>
          .
        </p>
        <p>
          I am a creative full-stack developer and problem solver driven by turning
          complex ideas into functional, intuitive digital solutions. With hands-on
          experience in the{" "}
          <strong className={isNight ? "text-white" : "text-slate-900"}>
            MERN stack
          </strong>
          ,{" "}
          <strong className={isNight ? "text-white" : "text-slate-900"}>
            Java
          </strong>
          , and{" "}
          <strong className={isNight ? "text-white" : "text-slate-900"}>
            Python
          </strong>
          , I build scalable web applications, automation bots, and interactive 3D web
          experiences.
        </p>
        <p>
          Alongside my degree, I hold professional certifications in{" "}
          <strong className={isNight ? "text-white" : "text-slate-900"}>
            Cybersecurity (Coursera / Google)
          </strong>
          ,{" "}
          <strong className={isNight ? "text-white" : "text-slate-900"}>
            Generative AI & DevOps (Oracle OCI 2025)
          </strong>
          , and{" "}
          <strong className={isNight ? "text-white" : "text-slate-900"}>
            Java & MERN Stack (Infosys Springboard)
          </strong>
          . I am also an active competitive programmer on{" "}
          <strong className={isNight ? "text-white" : "text-slate-900"}>
            LeetCode
          </strong>
          ,{" "}
          <strong className={isNight ? "text-white" : "text-slate-900"}>
            Codeforces
          </strong>
          , and{" "}
          <strong className={isNight ? "text-white" : "text-slate-900"}>
            HackerRank
          </strong>
          .
        </p>
      </div>

      {/* Modern Resume Feature Container */}
      <div
        className={`my-10 p-6 sm:p-8 rounded-2xl border transition-all shadow-lg ${
          isNight
            ? "bg-slate-900/90 border-slate-800 shadow-sky-950/20"
            : "bg-white/90 border-slate-200/80 shadow-sky-500/5"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xl">
                📄
              </div>
              <div>
                <h3
                  className={`text-xl font-bold font-poppins ${
                    isNight ? "text-white" : "text-slate-900"
                  }`}
                >
                  Resume & Profile Summary
                </h3>
                <p
                  className={`text-sm mt-0.5 ${
                    isNight ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  View, copy, or download my verified resume and technical profile summary.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyResumeText}
              type="button"
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 shadow-sm active:scale-95 ${
                copiedType === "text"
                  ? "bg-emerald-600 text-white"
                  : isNight
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              }`}
            >
              <span>{copiedType === "text" ? "✓ Copied!" : "📋 Copy Resume Text"}</span>
            </button>

            <button
              onClick={handleCopyResumeLink}
              type="button"
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 shadow-sm active:scale-95 ${
                copiedType === "link"
                  ? "bg-emerald-600 text-white"
                  : isNight
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              }`}
            >
              <span>{copiedType === "link" ? "✓ Copied!" : "🔗 Copy Link"}</span>
            </button>

            <a
              href="/Om_Sharma_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Om_Sharma_Resume.pdf"
              className="btn px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-blue-500/20 active:scale-95 transition-all"
            >
              <span>👁️ View / Download PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* Profiles & Links Section (Desktop / Laptop view only) */}
      <div className="py-8 hidden md:flex flex-col">
        <h3 className="subhead-text">Coding & Social Profiles</h3>
        <p className={`mt-2 text-sm ${isNight ? "text-slate-400" : "text-slate-500"}`}>
          Connect with me across competitive programming platforms and social networks:
        </p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {socialLinks
            .filter((s) => s.name !== "Contact")
            .map((profile) => (
              <a
                key={profile.name}
                href={profile.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                  isNight
                    ? "bg-slate-900/80 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80"
                    : "bg-white border-slate-200/80 hover:border-blue-400 hover:shadow-blue-500/10"
                }`}
              >
                <img
                  src={profile.iconUrl}
                  alt={profile.name}
                  className="w-8 h-8 object-contain"
                />
                <span
                  className={`text-xs font-semibold font-poppins ${
                    isNight ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  {profile.name}
                </span>
              </a>
            ))}
        </div>
      </div>

      {/* Skills Section */}
      <div className="py-10 flex flex-col">
        <h3 className="subhead-text">My Skills</h3>

        <div className="mt-12 flex flex-wrap gap-12">
          {skills.map((skill) => (
            <div className="block-container w-20 h-20" key={skill.name}>
              <div className="btn-back rounded-xl" />
              <div className="btn-front rounded-xl flex justify-center items-center">
                <img
                  src={skill.imageUrl}
                  alt={skill.name}
                  className="w-1/2 h-1/2 object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education & Certifications Timeline */}
      <div className="py-16">
        <h3 className="subhead-text">Education & Certifications.</h3>
        <div
          className={`mt-5 flex flex-col gap-3 ${
            isNight ? "text-slate-400" : "text-slate-500"
          }`}
        >
          <p>
            A summary of my academic journey at GLA University alongside my professional
            certifications and technical achievements:
          </p>
        </div>

        <div className="mt-12 flex">
          <VerticalTimeline lineColor={isNight ? "#334155" : "#e2e8f0"}>
            {experiences.map((experience) => (
              <VerticalTimelineElement
                key={experience.company_name}
                date={experience.date}
                iconStyle={{ background: experience.iconBg }}
                icon={
                  <div className="flex justify-center items-center w-full h-full">
                    <img
                      src={experience.icon}
                      alt={experience.company_name}
                      className="w-[60%] h-[60%] object-contain"
                    />
                  </div>
                }
                contentStyle={{
                  background: isNight ? "#0f172a" : "#ffffff",
                  color: isNight ? "#f8fafc" : "#0f172a",
                  borderBottom: "8px",
                  borderStyle: "solid",
                  borderBottomColor: experience.iconBg,
                  boxShadow: isNight
                    ? "0 4px 20px -2px rgba(0, 0, 0, 0.5)"
                    : "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
                }}
                contentArrowStyle={{
                  borderRight: `7px solid ${isNight ? "#0f172a" : "#ffffff"}`,
                }}
              >
                <div>
                  <h3
                    className={`text-xl font-poppins font-semibold ${
                      isNight ? "text-white" : "text-black"
                    }`}
                  >
                    {experience.title}
                  </h3>
                  <p
                    className={`font-medium text-base ${
                      isNight ? "text-slate-300" : "text-slate-600"
                    }`}
                    style={{ margin: 0 }}
                  >
                    {experience.company_name}
                  </p>
                </div>

                <ul className="my-5 list-disc ml-5 space-y-2">
                  {experience.points.map((point, index) => (
                    <li
                      key={`experience-point-${index}`}
                      className={`font-normal pl-1 text-sm ${
                        isNight ? "text-slate-300/80" : "text-slate-600/90"
                      }`}
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>

      <hr className={isNight ? "border-slate-800" : "border-slate-200"} />

      <CTA />
    </section>
  );
};

export default About;
