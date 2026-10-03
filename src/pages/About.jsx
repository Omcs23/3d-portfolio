import { useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import { CTA, Alert, CodingJourney, BadgeModal } from "../components";
import { education, certifications, skills, socialLinks } from "../constants";
import useAlert from "../hooks/useAlert";
import { useTheme } from "../context/ThemeContext";

import "react-vertical-timeline-component/style.min.css";

const About = () => {
  const { alert, showAlert, hideAlert } = useAlert();
  const [copiedType, setCopiedType] = useState(null);
  const [selectedBadgeCert, setSelectedBadgeCert] = useState(null);
  const { isNight } = useTheme();

  const handleCopyResumeText = () => {
    const resumeSummary = `OM SHARMA
Mathura, India | +91 7404420131 | om.sharma_cs23@gla.ac.in
B.Tech Computer Science & Engineering @ GLA University (2023 - 2027)
Full-Stack Developer | Competitive Programmer | AI & DevOps Certified

SUMMARY:
Detail-oriented Full-Stack Developer with a solid foundation in Computer Science principles. Proficient in MongoDB, Express.js, React, Node.js, and multi-language development (Java/Python). Certified by Oracle, Google, and Infosys in GenAI, DevOps, and Cybersecurity. Active competitive programmer ready to contribute to high-impact software engineering roles.

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
- HackerRank: https://www.hackerrank.com/profile/iOmSharma52`;

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

  const getResumeUrl = () => {
    const pathname = window.location.pathname;
    const basePath = pathname.endsWith("/")
      ? pathname
      : pathname.substring(0, pathname.lastIndexOf("/") + 1);
    return `${window.location.origin}${basePath}Om_Sharma_Resume.pdf`;
  };

  const handleCopyResumeLink = () => {
    const resumeLink = getResumeUrl();
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

      <div className="flex flex-col items-start">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold font-space uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-3">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Full-Stack Developer & AI Explorer
        </div>
        
        <h1 className="head-text">
          Hello, I'm{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-sky-400 dark:via-indigo-300 dark:to-cyan-300 bg-clip-text text-transparent drop-shadow-sm font-extrabold">
            Om Sharma
          </span>{" "}
          👋
        </h1>
      </div>

      <div
        className={`mt-5 flex flex-col gap-3.5 leading-relaxed text-base sm:text-lg ${
          isNight ? "text-slate-300" : "text-slate-600"
        }`}
      >
        <p>
          I'm a passionate software developer who loves turning ideas into smooth, intuitive, and visually captivating digital experiences. I specialize in full-stack web development, competitive programming, and 3D web interfaces.
        </p>
        <p>
          Currently pursuing my B.Tech in Computer Science & Engineering at GLA University, I am certified in Generative AI, DevOps, and Cybersecurity by Oracle & Google.
        </p>
        <p className={`font-semibold font-outfit text-lg ${isNight ? "text-slate-100" : "text-slate-900"}`}>
          Still learning. Still creating. Still building what's next 🚀
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

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
            <button
              onClick={handleCopyResumeText}
              type="button"
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 ${
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
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 ${
                copiedType === "link"
                  ? "bg-emerald-600 text-white"
                  : isNight
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              }`}
            >
              <span>{copiedType === "link" ? "✓ Copied!" : "🔗 Copy PDF Link"}</span>
            </button>

            <a
              href={getResumeUrl()}
              target="_blank"
              rel="noopener noreferrer"
              download="Om_Sharma_Resume.pdf"
              className="btn px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-blue-500/20 active:scale-95 transition-all w-full sm:w-auto"
            >
              <span>📥 Download Resume</span>
            </a>
          </div>
        </div>
      </div>

      {/* Coding Journey & Statistics Section */}
      <CodingJourney />

      {/* Skills Section */}
      <div className="py-10 flex flex-col w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h3 className="subhead-text">Skills & Technologies</h3>
            <p className={`mt-1.5 text-sm ${isNight ? "text-slate-400" : "text-slate-500"}`}>
              Languages, frameworks, database systems, and developer tools I work with:
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2.5 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl group select-none ${
                isNight
                  ? "bg-slate-900/90 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/90 shadow-slate-950/40"
                  : "bg-white border-slate-200/80 hover:border-blue-400 hover:shadow-blue-500/10"
              }`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center relative">
                <img
                  src={skill.imageUrl}
                  alt={skill.name}
                  className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span
                className={`text-xs sm:text-sm font-semibold font-outfit text-center ${
                  isNight ? "text-slate-200 group-hover:text-white" : "text-slate-800 group-hover:text-blue-600"
                }`}
              >
                {skill.name}
              </span>
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

        {/* Education Timeline */}
        <div className="mt-10 flex flex-col">
          <h4
            className={`text-xl font-poppins font-semibold border-b pb-2 ${
              isNight ? "text-slate-200 border-slate-700" : "text-slate-700 border-slate-200"
            }`}
          >
            Education
          </h4>
          <div className="mt-6 flex">
            <VerticalTimeline animate={true} lineColor={isNight ? "#334155" : "#e2e8f0"}>
              {education.map((item) => (
                <VerticalTimelineElement
                  key={item.company_name + item.title}
                  date={item.date}
                  iconStyle={{ background: item.iconBg }}
                  icon={
                    <div className="flex justify-center items-center w-full h-full">
                      <img
                        src={item.icon}
                        alt={item.company_name}
                        className="w-[60%] h-[60%] object-contain"
                      />
                    </div>
                  }
                  contentStyle={{
                    background: isNight ? "#0f172a" : "#ffffff",
                    color: isNight ? "#f8fafc" : "#0f172a",
                    borderBottom: "8px",
                    borderStyle: "solid",
                    borderBottomColor: item.iconBg,
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
                      {item.title}
                    </h3>
                    <p
                      className={`font-medium text-base ${
                        isNight ? "text-slate-300" : "text-slate-600"
                      }`}
                      style={{ margin: 0 }}
                    >
                      {item.company_name}
                    </p>
                  </div>

                  <ul className="my-5 list-disc ml-5 space-y-2">
                    {item.points.map((point, index) => (
                      <li
                        key={`edu-point-${index}`}
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

        {/* Certifications Timeline */}
        <div className="mt-14 flex flex-col">
          <h4
            className={`text-xl font-poppins font-semibold border-b pb-2 ${
              isNight ? "text-slate-200 border-slate-700" : "text-slate-700 border-slate-200"
            }`}
          >
            Certifications & Training
          </h4>
          <div className="mt-6 flex">
            <VerticalTimeline animate={true} lineColor={isNight ? "#334155" : "#e2e8f0"}>
              {certifications.map((item) => (
                <VerticalTimelineElement
                  key={item.company_name + item.title}
                  date={item.date}
                  iconStyle={{ background: item.iconBg }}
                  icon={
                    <div className="flex justify-center items-center w-full h-full">
                      <img
                        src={item.icon}
                        alt={item.company_name}
                        className="w-[60%] h-[60%] object-contain"
                      />
                    </div>
                  }
                  contentStyle={{
                    background: isNight ? "#0f172a" : "#ffffff",
                    color: isNight ? "#f8fafc" : "#0f172a",
                    borderBottom: "8px",
                    borderStyle: "solid",
                    borderBottomColor: item.iconBg,
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
                      {item.title}
                    </h3>
                    <p
                      className={`font-medium text-base ${
                        isNight ? "text-slate-300" : "text-slate-600"
                      }`}
                      style={{ margin: 0 }}
                    >
                      {item.company_name}
                    </p>
                  </div>

                  <ul className="my-5 list-disc ml-5 space-y-2">
                    {item.points.map((point, index) => (
                      <li
                        key={`cert-point-${index}`}
                        className={`font-normal pl-1 text-sm ${
                          isNight ? "text-slate-300/80" : "text-slate-600/90"
                        }`}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Skill tags */}
                  {item.skills && item.skills.length > 0 && (
                    <div className="my-3 flex flex-wrap gap-1.5">
                      {item.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            isNight
                              ? "bg-slate-800 text-blue-300 border border-slate-700"
                              : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Badge & Credential Verification Access Point */}
                  {item.credentialUrl || item.badgeImage || item.badges ? (
                    <div
                      className={`mt-4 p-3 sm:p-3.5 rounded-xl border flex flex-col gap-2.5 w-full max-w-full overflow-hidden transition-all ${
                        isNight
                          ? "bg-slate-900/90 border-slate-700/80 hover:border-blue-500/50"
                          : "bg-slate-50/90 border-slate-200/90 hover:border-blue-400"
                      }`}
                    >
                      {/* Multi-badge showcase layout (e.g., Infosys Springboard) */}
                      {item.badges && item.badges.length > 0 ? (
                        <div className="space-y-2.5 w-full">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                              {item.verificationPlatform || "Official"} Verified ({item.badges.length} Badges)
                            </span>
                            <span className={`text-[10px] ${isNight ? "text-slate-400" : "text-slate-500"}`}>
                              Click badge to expand
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 w-full">
                            {item.badges.map((b, idx) => (
                              <button
                                key={b.id || idx}
                                type="button"
                                onClick={() => setSelectedBadgeCert({ ...item, activeBadgeIndex: idx })}
                                className={`group p-2 rounded-xl border flex flex-col items-center justify-between text-center transition-all cursor-pointer active:scale-95 ${
                                  isNight
                                    ? "bg-slate-950/60 border-slate-800 hover:border-blue-500/60 hover:bg-slate-800/40"
                                    : "bg-white border-slate-200/80 hover:border-blue-400 hover:bg-blue-50/30 shadow-sm"
                                }`}
                              >
                                <div className="w-10 h-10 flex items-center justify-center p-0.5">
                                  <img
                                    src={b.badgeImage}
                                    alt={b.title}
                                    className="w-10 h-10 object-contain aspect-square drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                <span
                                  className={`text-[10px] sm:text-[11px] font-semibold mt-1 leading-tight line-clamp-2 ${
                                    isNight ? "text-slate-200" : "text-slate-700"
                                  }`}
                                >
                                  {b.title.includes("MERN")
                                    ? "MERN Stack"
                                    : b.title.includes("DSA")
                                    ? "Java & DSA"
                                    : "Java Foundation"}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : item.badgeImage ? (
                        /* Single-badge standard layout */
                        <div className="flex items-center gap-3 w-full min-w-0">
                          <img
                            src={item.badgeImage}
                            alt={item.title}
                            className="w-10 h-10 object-contain aspect-square drop-shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0"
                            onClick={() => setSelectedBadgeCert(item)}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                                {item.verificationPlatform
                                  ? `${item.verificationPlatform} Verified`
                                  : "Verified Credential"}
                              </span>
                            </div>
                            <p
                              className={`text-[11px] mt-0.5 leading-tight ${
                                isNight ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              Click badge to view official certificate & details.
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* Clean card layout without badge image */
                        <div className="flex items-center justify-between gap-3 w-full">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                              {item.verificationPlatform
                                ? `${item.verificationPlatform} Verified`
                                : "Verified Credential"}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 w-full pt-2 border-t border-slate-700/20">
                        {(item.badgeImage || item.badges) && (
                          <button
                            onClick={() => setSelectedBadgeCert(item)}
                            type="button"
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all active:scale-95 flex items-center justify-center gap-1 flex-1 ${
                              isNight
                                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm"
                            }`}
                          >
                            <span>🔍 {item.badges ? `View All Badges (${item.badges.length})` : "View Badge"}</span>
                          </button>
                        )}

                        {item.credentialUrl && (
                          <a
                            href={item.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-1 flex-1 shadow-md shadow-blue-500/20"
                          >
                            <span>Verify Credential ↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ) : null}
                </VerticalTimelineElement>
              ))}
            </VerticalTimeline>
          </div>
        </div>
      </div>

      <hr className={isNight ? "border-slate-800" : "border-slate-200"} />

      <CTA />

      {/* Badge Preview Modal */}
      <BadgeModal
        cert={selectedBadgeCert}
        onClose={() => setSelectedBadgeCert(null)}
      />
    </section>
  );
};

export default About;
