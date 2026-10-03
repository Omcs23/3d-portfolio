import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../context/ThemeContext";
import { portfolioData } from "../constants";

const DevTerminal = ({ isOpen, onClose }) => {
  const { isNight, toggleTheme } = useTheme();
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState([]);
  const [isBooting, setIsBooting] = useState(false);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);
  const terminalOutputRef = useRef(null);

  // Lock body scroll & guard console output container when terminal modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const el = terminalOutputRef.current;
    let cleanupGuard = () => {};

    if (el) {
      let startY = 0;

      const handleWheel = (e) => {
        const delta = e.deltaY;
        const isAtTop = el.scrollTop <= 0 && delta < 0;
        const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && delta > 0;

        if (isAtTop || isAtBottom) {
          if (e.cancelable) e.preventDefault();
        }
        e.stopPropagation();
      };

      const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
          startY = e.touches[0].clientY;
        }
      };

      const handleTouchMove = (e) => {
        if (e.touches.length !== 1) return;
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;

        const isAtTop = el.scrollTop <= 0 && deltaY > 0;
        const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && deltaY < 0;

        if (isAtTop || isAtBottom) {
          if (e.cancelable) e.preventDefault();
        }
        e.stopPropagation();
      };

      el.addEventListener("wheel", handleWheel, { passive: false });
      el.addEventListener("touchstart", handleTouchStart, { passive: true });
      el.addEventListener("touchmove", handleTouchMove, { passive: false });

      cleanupGuard = () => {
        el.removeEventListener("wheel", handleWheel);
        el.removeEventListener("touchstart", handleTouchStart);
        el.removeEventListener("touchmove", handleTouchMove);
      };
    }

    return () => {
      cleanupGuard();
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Real-time progressive startup loading animation when terminal opens
  useEffect(() => {
    if (!isOpen) {
      setIsBooting(false);
      return;
    }

    setHistory([]);
    setIsBooting(true);

    const startupSteps = [
      { delay: 0, content: "INITIALIZING OM.SHELL..." },
      { delay: 140, content: "Loading portfolio..." },
      { delay: 280, content: "Loading projects..." },
      { delay: 420, content: "Loading skills..." },
      { delay: 560, content: "Loading AI..." },
      { delay: 740, content: "████████████████████ 100%" },
      { delay: 900, content: "Welcome to OmShell.\n\nType 'help' to begin." },
    ];

    const timers = [];

    startupSteps.forEach((step) => {
      const timer = setTimeout(() => {
        setHistory((prev) => [
          ...prev,
          { type: "system", content: step.content },
        ]);
      }, step.delay);
      timers.push(timer);
    });

    const completionTimer = setTimeout(() => {
      setIsBooting(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }, 950);
    timers.push(completionTimer);

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [isOpen]);

  // Auto-scroll to bottom of terminal output
  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isBooting, isOpen]);

  // Global ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const executeCommand = (rawCmd) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    const lowerCmd = trimmed.toLowerCase();

    // Append user command entry
    const newHistory = [...history, { type: "user", content: trimmed }];

    // Save to command history navigation
    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Command parser
    let responseObj = null;

    switch (lowerCmd) {
      case "help":
      case "?":
        responseObj = {
          type: "text",
          content: `Available commands:

  about        About Om
  projects     Explore projects
  skills       View technical skills
  certs        View certifications
  education    Education
  experience   Experience
  stack        Technology stack
  github       GitHub profile
  leetcode     Coding profile
  resume       Open resume
  contact      Contact information
  whoami       Developer identity
  neofetch     Portfolio system information
  clear        Clear terminal

Type a command to continue.`,
        };
        break;

      case "whoami":
        responseObj = {
          type: "text",
          content: `${portfolioData.developer.name}

${portfolioData.developer.degree}
${portfolioData.developer.role}

${portfolioData.developer.tagline.split(", ").join("\n")}`,
        };
        break;

      case "about":
        responseObj = {
          type: "text",
          content: `${portfolioData.developer.name}

${portfolioData.developer.fullDegree} @ ${portfolioData.developer.university} (${portfolioData.developer.years})
${portfolioData.developer.role}

Certified in Oracle OCI Generative AI, Oracle OCI DevOps, and Google Cybersecurity.
Specializing in MERN stack, Java, Python, 3D Web, and AI integrations.`,
        };
        break;

      case "stack":
        responseObj = {
          type: "text",
          content: `FRONTEND
${portfolioData.stack.frontend.join("\n")}

BACKEND
${portfolioData.stack.backend.join("\n")}

LANGUAGES
${portfolioData.stack.languages.join("\n")}

AI
${portfolioData.stack.ai.join("\n")}`,
        };
        break;

      case "neofetch":
        responseObj = {
          type: "text",
          content: `        OM SHARMA
---------------------------
OS        OmShell
Frontend  React
3D Engine Three.js
AI        Gemini
Status    Online
World     3D Portfolio
---------------------------`,
        };
        break;

      case "skills":
        responseObj = {
          type: "skills",
          content: {
            languages: portfolioData.stack.languages,
            frameworks: portfolioData.stack.frontend.concat(portfolioData.stack.backend),
            databases: ["MongoDB"],
            tools: portfolioData.stack.tools,
          },
        };
        break;

      case "projects":
      case "proj":
      case "ls projects":
        responseObj = {
          type: "projects",
          content: portfolioData.projects.map((p) => ({
            name: p.name,
            tech: p.description.split("Built with ")[1] || "React, Three.js, Node.js",
            desc: p.description,
            link: p.link,
          })),
        };
        break;

      case "certs":
      case "certifications":
        responseObj = {
          type: "text",
          content: `CERTIFICATIONS

${portfolioData.certifications.map((c) => `• ${c.title} (${c.company_name})`).join("\n")}`,
        };
        break;

      case "education":
        responseObj = {
          type: "text",
          content: `EDUCATION

Degree:     ${portfolioData.education[0].title}
University: ${portfolioData.education[0].company_name}
Period:     ${portfolioData.education[0].date}
Details:    ${portfolioData.education[0].points[1]}`,
        };
        break;

      case "experience":
        responseObj = {
          type: "text",
          content: `EXPERIENCE & BACKGROUND

• Full-Stack Web Application Development (MERN Stack)
• Competitive Programming (100+ LeetCode, 100+ Codeforces, 5-Star HackerRank)
• Cloud & AI Certification Track (Oracle OCI GenAI & DevOps, Google Cybersecurity)`,
        };
        break;

      case "github":
        responseObj = {
          type: "text",
          content: `GITHUB PROFILE

User: Omcs23
URL:  ${portfolioData.links.github}`,
        };
        break;

      case "leetcode":
      case "stats":
        responseObj = {
          type: "leetcode",
          content: {
            username: portfolioData.codingProfiles.leetcode.username,
            totalSolved: portfolioData.codingProfiles.leetcode.solved,
            easy: portfolioData.codingProfiles.leetcode.easy,
            medium: portfolioData.codingProfiles.leetcode.medium,
            hard: portfolioData.codingProfiles.leetcode.hard,
            targetPct: "51%",
            streak: `${portfolioData.codingProfiles.leetcode.streak} days active`,
            link: portfolioData.codingProfiles.leetcode.url,
          },
        };
        break;

      case "contact":
      case "socials":
        responseObj = {
          type: "socials",
          content: [
            { name: "GitHub", url: portfolioData.contact.github, handle: "@Omcs23" },
            { name: "LinkedIn", url: portfolioData.contact.linkedin, handle: "om-sharma" },
            { name: "LeetCode", url: portfolioData.contact.leetcode, handle: "@OmSharma152" },
            { name: "Codeforces", url: portfolioData.contact.codeforces, handle: "@OmSharma_cs" },
            { name: "HackerRank", url: portfolioData.contact.hackerrank, handle: "@iOmSharma52" },
            { name: "Email", url: `mailto:${portfolioData.contact.email}`, handle: portfolioData.contact.email },
          ],
        };
        break;

      case "resume":
      case "cv":
        window.open(portfolioData.links.resume, "_blank", "noopener,noreferrer");
        responseObj = {
          type: "text",
          content: `RESUME CREDENTIALS

PDF: ${portfolioData.links.resume}
Opening resume document in a new tab...`,
        };
        break;

      case "theme":
        toggleTheme();
        responseObj = {
          type: "system",
          content: `Theme toggled to ${!isNight ? "Night / Dark Mode 🌙" : "Day / Light Mode ☀️"}`,
        };
        break;

      case "clear":
      case "cls":
        setHistory([]);
        setInputVal("");
        return;

      default:
        responseObj = {
          type: "error",
          content: `Command not found: ${trimmed}

Type 'help' to see available commands.`,
        };
        break;
    }

    setHistory([...newHistory, responseObj]);
    setInputVal("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  // Command History Arrow Navigation (Up / Down)
  const handleKeyDownInput = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx < cmdHistory.length) {
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Compact Spotlight Terminal Window Frame */}
      <div className="w-full max-w-xl h-[65vh] sm:h-[430px] bg-slate-950/95 backdrop-blur-xl rounded-xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/60 flex flex-col overflow-hidden font-mono text-xs select-text">
        {/* Sleek Title Bar */}
        <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              title="Close Terminal (ESC)"
              className="w-2.5 h-2.5 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center text-[7px] font-bold text-slate-950"
            >
              ✕
            </button>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="ml-1.5 text-[11px] font-bold text-slate-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              om@portfolio
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[10px] text-slate-500 font-mono bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
              Ctrl + K
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded text-xs hover:bg-slate-800 transition-colors font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Minimal Quick Action Suggestion Bar */}
        <div className="px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/60 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0 select-none">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider shrink-0 mr-1">
            Quick:
          </span>
          {["help", "about", "projects", "skills", "certs", "education", "experience", "stack", "github", "leetcode", "resume", "contact", "whoami", "neofetch", "clear"].map((cmd) => (
            <button
              key={cmd}
              disabled={isBooting}
              onClick={() => executeCommand(cmd)}
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-800/80 text-slate-300 border border-slate-700/50 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/40 transition-all shrink-0 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Output Console Container */}
        <div
          ref={terminalOutputRef}
          className="flex-1 p-3.5 sm:p-4 overflow-y-auto overscroll-contain custom-scrollbar space-y-2.5 font-mono leading-relaxed bg-slate-950/90 text-[11px] sm:text-xs"
        >
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.type === "user" && (
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <span className="text-emerald-400">om@portfolio:~$</span>
                  <span>{item.content}</span>
                </div>
              )}

              {item.type === "system" && (
                <div className="text-emerald-400 whitespace-pre-wrap text-[11px]">
                  {item.content}
                </div>
              )}

              {item.type === "text" && (
                <div className="text-slate-300 whitespace-pre-wrap pl-2.5 border-l-2 border-slate-700 text-[11px]">
                  {item.content}
                </div>
              )}

              {item.type === "error" && (
                <div className="text-rose-400 pl-2.5 border-l-2 border-rose-500 text-[11px]">
                  ❌ {item.content}
                </div>
              )}

              {item.type === "help" && (
                <div className="pl-2.5 space-y-1 border-l-2 border-cyan-500/40 my-1.5">
                  <div className="text-cyan-300 font-bold text-[11px] mb-1">Available Commands:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                    {item.content.map((h, i) => (
                      <div key={i} className="flex items-baseline gap-1.5">
                        <span className="text-emerald-400 font-bold font-mono min-w-[62px]">
                          {h.cmd}
                        </span>
                        <span className="text-slate-400 text-[10px]">{h.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item.type === "skills" && (
                <div className="pl-2.5 space-y-1 border-l-2 border-indigo-500/40 my-1.5 text-[11px]">
                  <div>
                    <span className="text-amber-400 font-bold">Languages: </span>
                    <span className="text-slate-200">{item.content.languages.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-bold">Frameworks: </span>
                    <span className="text-slate-200">{item.content.frameworks.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-bold">Databases: </span>
                    <span className="text-slate-200">{item.content.databases.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-rose-400 font-bold">Cloud & Tools: </span>
                    <span className="text-slate-200">{item.content.tools.join(", ")}</span>
                  </div>
                </div>
              )}

              {item.type === "projects" && (
                <div className="pl-2.5 space-y-2 border-l-2 border-blue-500/40 my-1.5 text-[11px]">
                  {item.content.map((p, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold text-xs">✦ {p.name}</span>
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline hover:text-cyan-300 font-mono text-[10px]"
                        >
                          [GitHub ↗]
                        </a>
                      </div>
                      <div className="text-slate-400 text-[10px]">{p.desc}</div>
                      <div className="text-amber-400 text-[9.5px] font-mono">Tech: {p.tech}</div>
                    </div>
                  ))}
                </div>
              )}

              {item.type === "leetcode" && (
                <div className="pl-2.5 space-y-1 border-l-2 border-amber-500/40 my-1.5 text-[11px]">
                  <div className="text-amber-400 font-bold text-[11px]">⚡ LeetCode Real-Time Stats (@{item.content.username}):</div>
                  <div className="flex flex-wrap gap-2.5 font-mono text-[11px]">
                    <span className="text-cyan-400 font-bold">Total: {item.content.totalSolved}</span>
                    <span className="text-emerald-400">Easy: {item.content.easy}</span>
                    <span className="text-amber-400">Med: {item.content.medium}</span>
                    <span className="text-rose-400">Hard: {item.content.hard}</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Target: <span className="text-cyan-300 font-bold">{item.content.targetPct}</span> • Streak: <span className="text-amber-300 font-bold">{item.content.streak}</span>
                  </div>
                </div>
              )}

              {item.type === "socials" && (
                <div className="pl-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 border-l-2 border-emerald-500/40 my-1.5 text-[11px]">
                  {item.content.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 p-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 transition-all text-slate-200 text-[10px]"
                    >
                      <span className="text-cyan-400 font-bold">➜ {s.name}:</span>
                      <span className="text-emerald-400 font-mono underline truncate">{s.handle}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isBooting && (
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[11px] animate-pulse py-1">
              <span className="w-2 h-3.5 bg-emerald-400 inline-block animate-ping" />
              <span className="text-slate-500 italic">kernel loading modules...</span>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Minimal Input Form */}
        <form
          onSubmit={handleFormSubmit}
          className="px-3.5 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2 shrink-0"
        >
          <span className="text-emerald-400 font-bold font-mono text-xs shrink-0">
            om@portfolio:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            disabled={isBooting}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDownInput}
            placeholder={isBooting ? "initializing om.shell..." : "type command ('help', 'projects', 'skills')..."}
            className="flex-1 bg-transparent text-slate-100 font-mono text-xs focus:outline-none placeholder:text-slate-600 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isBooting || !inputVal.trim()}
            className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono text-[11px] transition-all shrink-0 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            EXEC ↵
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default DevTerminal;
