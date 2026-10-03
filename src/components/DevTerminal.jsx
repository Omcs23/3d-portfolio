import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../context/ThemeContext";

const DevTerminal = ({ isOpen, onClose }) => {
  const { isNight, toggleTheme } = useTheme();
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState([
    {
      type: "system",
      content: `⚡ Om Sharma Interactive Portfolio CLI [v1.0.0]
Type 'help' to view available commands, or click quick action buttons below.
Press [ESC] or click '✕' to close terminal.`,
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Lock body scroll when terminal modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Auto-focus input when terminal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Auto-scroll to bottom of terminal output
  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isOpen]);

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
          type: "help",
          content: [
            { cmd: "about", desc: "View Om Sharma's bio, degree, & certifications" },
            { cmd: "skills", desc: "List technical skills, frameworks, & tools" },
            { cmd: "projects", desc: "View top 3D projects & GitHub repositories" },
            { cmd: "leetcode", desc: "Show live LeetCode stats & problem count" },
            { cmd: "socials", desc: "Display GitHub, LinkedIn, LeetCode, & profiles" },
            { cmd: "resume", desc: "Get verified resume summary & download links" },
            { cmd: "theme", desc: "Toggle between Dark and Light portfolio mode" },
            { cmd: "clear", desc: "Clear terminal screen output" },
          ],
        };
        break;

      case "about":
      case "whoami":
        responseObj = {
          type: "text",
          content: `👨‍💻 Om Sharma | Full-Stack Developer & AI Explorer
📍 Location: Mathura, India
🎓 Degree: B.Tech Computer Science & Engineering @ GLA University (2023 - 2027)
📜 Certifications: Oracle OCI GenAI Professional, Oracle DevOps Professional, Google Cybersecurity Professional
🚀 Summary: Detail-oriented developer specializing in MongoDB, Express, React, Node.js, Java, Python, 3D Web, & AI integrations.`,
        };
        break;

      case "skills":
        responseObj = {
          type: "skills",
          content: {
            languages: ["Java", "Python", "JavaScript (ES6+)", "HTML5", "CSS3", "SQL"],
            frameworks: ["React.js", "Node.js", "Express.js", "TailwindCSS", "Three.js", "Vite"],
            databases: ["MongoDB", "MySQL"],
            tools: ["Git & GitHub", "Oracle OCI", "Google Cloud", "VS Code", "Postman", "Linux"],
          },
        };
        break;

      case "projects":
      case "ls projects":
        responseObj = {
          type: "projects",
          content: [
            {
              name: "3D Interactive Island Portfolio",
              tech: "React, Three.js, React Three Fiber, TailwindCSS",
              desc: "Immersive 3D interactive portfolio featuring a navigable island, animated plane, guide robot, & live stats.",
              link: "https://github.com/Omcs23/3d-portfolio",
            },
            {
              name: "Summiz - AI Article Summarizer",
              tech: "React.js, OpenAI GPT-4 API, RapidAPI, Tailwind",
              desc: "Open-source article summarizer that converts lengthy web articles into crisp, digestible bullet summaries.",
              link: "https://github.com/Omcs23",
            },
            {
              name: "Pricewise - E-Commerce Price Tracker",
              tech: "Next.js 13, TypeScript, Web Scraping, MongoDB",
              desc: "Smart web scraper that tracks product prices across e-commerce sites and alerts users when prices drop.",
              link: "https://github.com/Omcs23",
            },
          ],
        };
        break;

      case "leetcode":
      case "stats":
        responseObj = {
          type: "leetcode",
          content: {
            username: "OmSharma152",
            totalSolved: 154,
            easy: 43,
            medium: 66,
            hard: 45,
            targetPct: "51%",
            streak: "4 days active",
            link: "https://leetcode.com/u/OmSharma152/",
          },
        };
        break;

      case "socials":
      case "contact":
        responseObj = {
          type: "socials",
          content: [
            { name: "GitHub", url: "https://github.com/Omcs23", handle: "@Omcs23" },
            { name: "LinkedIn", url: "https://www.linkedin.com/in/om-sharma-88109b296", handle: "om-sharma" },
            { name: "LeetCode", url: "https://leetcode.com/u/OmSharma152/", handle: "@OmSharma152" },
            { name: "Codeforces", url: "https://codeforces.com/profile/OmSharma_cs", handle: "@OmSharma_cs" },
            { name: "HackerRank", url: "https://www.hackerrank.com/profile/iOmSharma52", handle: "@iOmSharma52" },
            { name: "Email", url: "mailto:om.sharma_cs23@gla.ac.in", handle: "om.sharma_cs23@gla.ac.in" },
          ],
        };
        break;

      case "resume":
      case "cv":
        responseObj = {
          type: "text",
          content: `📄 Om Sharma - Official Resume & Credentials
Download PDF: ${window.location.origin}/Om_Sharma_Resume.pdf
Certified in GenAI (Oracle), DevOps (Oracle), & Cybersecurity (Google).`,
        };
        break;

      case "theme":
        toggleTheme();
        responseObj = {
          type: "system",
          content: `🎨 Theme toggled successfully to ${!isNight ? "Night / Dark Mode 🌙" : "Day / Light Mode ☀️"}!`,
        };
        break;

      case "clear":
      case "cls":
        setHistory([]);
        setInputVal("");
        return;

      case "sudo":
      case "matrix":
        responseObj = {
          type: "system",
          content: `🔑 Permission granted. Entering Matrix developer mode... 
"There is no spoon." — Everything built with React & Three.js 🚀`,
        };
        break;

      default:
        responseObj = {
          type: "error",
          content: `command not found: '${trimmed}'. Type 'help' to see list of valid commands.`,
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
              om@sharma-cli
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
          {["help", "about", "skills", "projects", "leetcode", "socials", "resume", "clear"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => executeCommand(cmd)}
              className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-800/80 text-slate-300 border border-slate-700/50 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/40 transition-all shrink-0 active:scale-95"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Output Console Container */}
        <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto custom-scrollbar space-y-2.5 font-mono leading-relaxed bg-slate-950/90 text-[11px] sm:text-xs">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.type === "user" && (
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <span className="text-emerald-400">om@sharma:~$</span>
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

          <div ref={terminalEndRef} />
        </div>

        {/* Minimal Input Form */}
        <form
          onSubmit={handleFormSubmit}
          className="px-3.5 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2 shrink-0"
        >
          <span className="text-emerald-400 font-bold font-mono text-xs shrink-0">
            om@sharma:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDownInput}
            placeholder="type command ('help', 'projects', 'skills')..."
            className="flex-1 bg-transparent text-slate-100 font-mono text-xs focus:outline-none placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono text-[11px] transition-all shrink-0 active:scale-95"
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
