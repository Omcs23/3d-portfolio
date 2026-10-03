import { useState, useEffect, useRef } from "react";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Terminal Window Frame */}
      <div className="w-full max-w-3xl h-[85vh] sm:h-[580px] bg-slate-950 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden font-mono text-xs sm:text-sm text-slate-100 select-text">
        {/* VS Code / MacOS Style Title Bar */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              title="Close Terminal"
              className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center text-[8px] font-bold text-slate-950"
            >
              ✕
            </button>
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-2 text-xs font-bold text-slate-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              om@sharma-3d-cli v1.0.0
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] text-slate-500 font-mono">
              [Ctrl + K] to toggle
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 transition-colors font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Output Console Container */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto custom-scrollbar space-y-3 font-mono leading-relaxed bg-slate-950/95">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.type === "user" && (
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <span className="text-emerald-400">om@sharma:~$</span>
                  <span>{item.content}</span>
                </div>
              )}

              {item.type === "system" && (
                <div className="text-emerald-400 whitespace-pre-wrap">
                  {item.content}
                </div>
              )}

              {item.type === "text" && (
                <div className="text-slate-300 whitespace-pre-wrap pl-3 border-l-2 border-slate-700">
                  {item.content}
                </div>
              )}

              {item.type === "error" && (
                <div className="text-rose-400 pl-3 border-l-2 border-rose-500">
                  ❌ {item.content}
                </div>
              )}

              {item.type === "help" && (
                <div className="pl-3 space-y-1 border-l-2 border-cyan-500/40 my-2">
                  <div className="text-cyan-300 font-bold mb-1">Available Portfolio Commands:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {item.content.map((h, i) => (
                      <div key={i} className="flex items-baseline gap-2">
                        <span className="text-emerald-400 font-bold font-mono min-w-[70px]">
                          {h.cmd}
                        </span>
                        <span className="text-slate-400">{h.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item.type === "skills" && (
                <div className="pl-3 space-y-2 border-l-2 border-indigo-500/40 my-2 text-xs">
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
                <div className="pl-3 space-y-2.5 border-l-2 border-blue-500/40 my-2 text-xs">
                  {item.content.map((p, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold text-sm">✦ {p.name}</span>
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline hover:text-cyan-300 font-mono text-[11px]"
                        >
                          [GitHub Repo ↗]
                        </a>
                      </div>
                      <div className="text-slate-400 text-[11px]">{p.desc}</div>
                      <div className="text-amber-400 text-[10px] font-mono">Tech: {p.tech}</div>
                    </div>
                  ))}
                </div>
              )}

              {item.type === "leetcode" && (
                <div className="pl-3 space-y-1.5 border-l-2 border-amber-500/40 my-2 text-xs">
                  <div className="text-amber-400 font-bold">⚡ LeetCode Real-Time Stats (@{item.content.username}):</div>
                  <div className="flex flex-wrap gap-3 font-mono">
                    <span className="text-cyan-400 font-bold">Total Solved: {item.content.totalSolved}</span>
                    <span className="text-emerald-400">Easy: {item.content.easy}</span>
                    <span className="text-amber-400">Medium: {item.content.medium}</span>
                    <span className="text-rose-400">Hard: {item.content.hard}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Target Progress: <span className="text-cyan-300 font-bold">{item.content.targetPct}</span> • Streak: <span className="text-amber-300 font-bold">{item.content.streak}</span>
                  </div>
                </div>
              )}

              {item.type === "socials" && (
                <div className="pl-3 grid grid-cols-1 sm:grid-cols-2 gap-2 border-l-2 border-emerald-500/40 my-2 text-xs">
                  {item.content.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 transition-all text-slate-200"
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

        {/* Quick Action Suggestion Pills */}
        <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 select-none">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0 mr-1">
            Quick Run:
          </span>
          {["help", "about", "skills", "projects", "leetcode", "socials", "resume", "clear"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => executeCommand(cmd)}
              className="px-2.5 py-1 rounded-md text-[11px] font-bold font-mono bg-slate-800 text-slate-300 border border-slate-700/70 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/40 transition-all shrink-0 active:scale-95"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Interactive Typing Pad Input Form */}
        <form
          onSubmit={handleFormSubmit}
          className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0"
        >
          <span className="text-emerald-400 font-bold font-mono text-sm shrink-0">
            om@sharma:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDownInput}
            placeholder="type command (e.g. 'help', 'projects', 'skills')..."
            className="flex-1 bg-transparent text-slate-100 font-mono text-xs sm:text-sm focus:outline-none placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono text-xs transition-colors shrink-0 active:scale-95"
          >
            EXEC ↵
          </button>
        </form>
      </div>
    </div>
  );
};

export default DevTerminal;
