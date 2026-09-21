import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { monkey3d } from "../assets/images";

// Boundary-free 3D Monkey Avatar Component (No background cover, Wide Open Eyes Awake vs Closed Eyes Sleeping)
const MonkeyAvatar = ({ size = "md", isNight = false, isSleeping = false, className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14 sm:w-16 sm:h-16",
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      {/* Floating ZZZs when sleeping */}
      {isSleeping && (
        <span className="absolute -top-3 -right-1 text-xs sm:text-sm font-bold text-indigo-400 dark:text-indigo-300 animate-bounce z-30 select-none drop-shadow">
          💤
        </span>
      )}

      {/* Boundary-Free 3D Vector Monkey Character (No Background Container) */}
      <svg
        viewBox="0 0 70 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full transition-all duration-300 transform ${
          isSleeping
            ? "opacity-85 grayscale-[15%] scale-95"
            : isNight
            ? "drop-shadow-[0_4px_16px_rgba(165,180,252,0.7)]"
            : "drop-shadow-[0_4px_16px_rgba(56,189,248,0.7)]"
        }`}
      >
        <defs>
          {/* 3D Fur Radial Gradient */}
          <radialGradient id="monkeyFur" cx="35" cy="30" r="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a36955" />
            <stop offset="70%" stopColor="#7a4635" />
            <stop offset="100%" stopColor="#4f271a" />
          </radialGradient>

          {/* 3D Face Muzzle Radial Gradient */}
          <radialGradient id="monkeyFace" cx="35" cy="36" r="18" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffe3d1" />
            <stop offset="75%" stopColor="#f7c5a8" />
            <stop offset="100%" stopColor="#e5a885" />
          </radialGradient>

          {/* 3D Inner Ear Gradient */}
          <linearGradient id="monkeyEarInner" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffcca8" />
            <stop offset="100%" stopColor="#e39d78" />
          </linearGradient>

          {/* 3D Eye Pupil Radial Gradient */}
          <radialGradient id="monkeyEyePupil" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4a2511" />
            <stop offset="70%" stopColor="#210c04" />
            <stop offset="100%" stopColor="#0b0301" />
          </radialGradient>

          {/* Soft 3D Drop Shadow */}
          <filter id="soft3dShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 1. OUTER EARS WITH 3D SHADING */}
        <g filter="url(#soft3dShadow)">
          {/* Left Ear */}
          <circle cx="11" cy="33" r="10" fill="url(#monkeyFur)" stroke="#381b11" strokeWidth="1.5" />
          <circle cx="11" cy="33" r="6" fill="url(#monkeyEarInner)" />

          {/* Right Ear */}
          <circle cx="59" cy="33" r="10" fill="url(#monkeyFur)" stroke="#381b11" strokeWidth="1.5" />
          <circle cx="59" cy="33" r="6" fill="url(#monkeyEarInner)" />
        </g>

        {/* 2. 3D MAIN HEAD SPHERE */}
        <circle cx="35" cy="34" r="23" fill="url(#monkeyFur)" stroke="#381b11" strokeWidth="1.8" filter="url(#soft3dShadow)" />

        {/* Top Fur Tuft / Hair Highlight */}
        <path d="M 31 11 Q 35 6 39 11 Q 37 13 35 12 Q 33 13 31 11 Z" fill="#b87a64" opacity="0.9" />

        {/* 3. 3D MUZZLE & CHEEKS SHAPE */}
        <path
          d="M 19 34 C 19 21, 51 21, 51 34 C 51 47, 19 47, 19 34 Z"
          fill="url(#monkeyFace)"
          stroke="#4f271a"
          strokeWidth="1.2"
        />

        {/* 4. EYES: AWAKE (WIDE OPEN 3D EYES) VS SLEEPING (CLOSED EYELIDS) */}
        {isSleeping ? (
          <>
            {/* Sleeping Closed Eyelids (Peaceful Sleeping Expression) */}
            <path
              d="M 22 30 Q 27 35 32 30"
              stroke="#36170d"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 38 30 Q 43 35 48 30"
              stroke="#36170d"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
            {/* Eyelashes detail */}
            <path d="M 23 32 L 21 34 M 31 32 L 33 34" stroke="#36170d" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 39 32 L 37 34 M 47 32 L 49 34" stroke="#36170d" strokeWidth="1.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* WIDE OPEN EXPRESSIVE 3D GLOSSY EYES */}
            {/* Left Eye Base & Iris */}
            <ellipse cx="27" cy="29" rx="5" ry="6" fill="#ffffff" stroke="#36170d" strokeWidth="0.8" />
            <ellipse cx="27" cy="29.5" rx="3.5" ry="4.2" fill="url(#monkeyEyePupil)" />
            {/* Eye Catchlights */}
            <circle cx="28.5" cy="28" r="1.4" fill="#ffffff" />
            <circle cx="25.8" cy="31" r="0.7" fill="#ffffff" />

            {/* Right Eye Base & Iris */}
            <ellipse cx="43" cy="29" rx="5" ry="6" fill="#ffffff" stroke="#36170d" strokeWidth="0.8" />
            <ellipse cx="43" cy="29.5" rx="3.5" ry="4.2" fill="url(#monkeyEyePupil)" />
            {/* Eye Catchlights */}
            <circle cx="44.5" cy="28" r="1.4" fill="#ffffff" />
            <circle cx="41.8" cy="31" r="0.7" fill="#ffffff" />
          </>
        )}

        {/* 5. 3D NOSE */}
        <ellipse cx="35" cy="36.5" rx="3" ry="2.2" fill="#381b11" />
        <ellipse cx="34.2" cy="35.8" rx="1" ry="0.6" fill="#693b2a" />

        {/* 6. MOUTH: AWAKE SMILE VS SLEEPING MOUTH */}
        {isSleeping ? (
          /* Sleeping peaceful small mouth */
          <ellipse cx="35" cy="41.5" rx="2.5" ry="1.8" fill="#4a271a" />
        ) : (
          /* Awake Warm Smile */
          <path
            d="M 28 41 Q 35 47 42 41"
            stroke="#381b11"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* 7. ROSY BLUSHING CHEEKS */}
        <circle cx="21.5" cy="37.5" r="3" fill="#ff6b6b" opacity="0.45" />
        <circle cx="48.5" cy="37.5" r="3" fill="#ff6b6b" opacity="0.45" />
      </svg>
    </div>
  );
};

// Initial options list
const INITIAL_OPTIONS = [
  { id: "about", label: "👨‍💻 About Om", icon: "👨‍💻" },
  { id: "skills", label: "🛠️ Skills", icon: "🛠️" },
  { id: "projects", label: "🚀 Projects", icon: "🚀" },
  { id: "certifications", label: "📜 Certifications", icon: "📜" },
  { id: "coding", label: "💻 Coding Journey", icon: "💻" },
  { id: "education", label: "🎓 Education", icon: "🎓" },
  { id: "resume", label: "📄 Resume", icon: "📄" },
  { id: "contact", label: "💬 Let's Talk", icon: "💬" },
];

// Funny Wake Up Messages with Bhola Guru Indian Guide Flair
const WAKE_UP_MESSAGES = [
  "Arre bhai! 🐒 Bhola Guru was having such a peaceful banana dream!",
  "Ayy dost! 🥱 Who woke up Bhola Guru from his palm tree nap?!",
  "Pranam! 🙈 Bhola Guru is awake now, tell me what you want to explore!"
];

const PortfolioGuideRobot = () => {
  // ALL REACT HOOKS CALLED UNCONDITIONALLY AT THE TOP LEVEL
  const { isNight } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [showInitialSpeech, setShowInitialSpeech] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isInitialFloating, setIsInitialFloating] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "robot",
      text: "Pranam! 🙏 I'm Bhola Guru 🐒 — Om's island guide monkey! What banana-rific thing would you like to explore today?",
      action: null,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const chatContainerRef = useRef(null);
  const optionsContainerRef = useRef(null);
  const inactivityTimerRef = useRef(null);

  // Initial floating entry motion timer: float across screen for 6s then dock to corner
  useEffect(() => {
    const motionTimer = setTimeout(() => {
      setIsInitialFloating(false);
    }, 6000);

    return () => clearTimeout(motionTimer);
  }, []);

  // Prevent touch overscroll / scroll chaining to parent window on mobile devices
  useEffect(() => {
    if (!isOpen) return;

    const attachTouchGuard = (el) => {
      if (!el) return () => {};

      let startY = 0;

      const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
          startY = e.touches[0].clientY;
        }
      };

      const handleTouchMove = (e) => {
        if (e.touches.length !== 1) return;
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;

        const isAtTop = el.scrollTop <= 0;
        const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

        if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
          if (e.cancelable) {
            e.preventDefault();
          }
        }
        e.stopPropagation();
      };

      el.addEventListener("touchstart", handleTouchStart, { passive: true });
      el.addEventListener("touchmove", handleTouchMove, { passive: false });

      return () => {
        el.removeEventListener("touchstart", handleTouchStart);
        el.removeEventListener("touchmove", handleTouchMove);
      };
    };

    const cleanupChat = attachTouchGuard(chatContainerRef.current);
    const cleanupOpts = attachTouchGuard(optionsContainerRef.current);

    return () => {
      cleanupChat();
      cleanupOpts();
    };
  }, [isOpen]);

  // Initial speech auto-hide timer after 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialSpeech(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // 12-second inactivity sleep timer logic (both initial site load AND during chat)
  const startInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      setIsSleeping(true);
      if (isOpen) {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: "robot",
            text: "Zzz... 😴 *Bhola Guru falls asleep on a palm tree leaf* Zzz...",
            action: null,
          },
        ]);
      }
    }, 12000); // 12 seconds of no interaction -> sleep!
  };

  useEffect(() => {
    if (!isSleeping) {
      startInactivityTimer();
    } else {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    }

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [isOpen, isSleeping]);

  // Scroll to bottom of chat history when updated
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping, isOpen, isSleeping]);

  // Predefined answers dictionary
  const handleOptionClick = (option) => {
    const wasSleeping = isSleeping;
    if (isSleeping) {
      setIsSleeping(false);
    }

    // Reset inactivity timer on interaction
    startInactivityTimer();

    const userMessage = { sender: "user", text: option.label };

    // If Bhola Guru was sleeping, add funny wake-up message first
    if (wasSleeping) {
      const randomWakeUp =
        WAKE_UP_MESSAGES[Math.floor(Math.random() * WAKE_UP_MESSAGES.length)];

      setChatHistory((prev) => [
        ...prev,
        userMessage,
        { sender: "robot", text: randomWakeUp, action: null },
      ]);
    } else {
      setChatHistory((prev) => [...prev, userMessage]);
    }

    setIsTyping(true);

    setTimeout(() => {
      let botResponse = { sender: "robot", text: "", action: null };

      switch (option.id) {
        case "about":
          botResponse = {
            sender: "robot",
            text: "Om Sharma is a B.Tech CS & Engineering student at GLA University, specializing in Full-Stack Web Development (MERN), Java, Python, and AI automation.",
            action: {
              type: "navigate",
              target: "/about",
              label: "Explore Full Bio →",
            },
          };
          break;

        case "skills":
          botResponse = {
            sender: "robot",
            text: "Om's primary tech stack includes:\n• MERN (MongoDB, Express, React, Node.js)\n• Java & Object-Oriented Software Design\n• Python & Web Automation\n• Cloud & AI (Oracle OCI GenAI Certified)",
            action: {
              type: "navigate",
              target: "/about",
              label: "View All Skills →",
            },
          };
          break;

        case "projects":
          botResponse = {
            sender: "robot",
            text: "Om has built impressive web & software projects:\n1. 🏥 Hospital Management System\n2. 🤖 Instagram Automation Bot (WIP)\n3. 🌐 3D Interactive Portfolio",
            action: {
              type: "navigate",
              target: "/projects",
              label: "Explore Projects →",
            },
          };
          break;

        case "certifications":
          botResponse = {
            sender: "robot",
            text: "Om holds verified professional certifications:\n• Oracle OCI 2025 Certified Generative AI Professional\n• Oracle OCI 2025 Certified DevOps Professional\n• Google Cybersecurity Professional Certificate\n• Infosys MERN & Java Certifications",
            action: {
              type: "navigate",
              target: "/about",
              label: "View Certifications →",
            },
          };
          break;

        case "coding":
          botResponse = {
            sender: "robot",
            text: "Om is an active competitive programmer on LeetCode, Codeforces, and HackerRank with hundreds of algorithms solved!",
            action: {
              type: "navigate",
              target: "/about",
              label: "View Coding Stats →",
            },
          };
          break;

        case "education":
          botResponse = {
            sender: "robot",
            text: "🎓 B.Tech in Computer Science & Engineering\n📍 GLA University (2023 - 2027)\nFocusing on Data Structures, Algorithms, Software Engineering, and Web Systems.",
            action: {
              type: "navigate",
              target: "/about",
              label: "View Education Timeline →",
            },
          };
          break;

        case "resume":
          botResponse = {
            sender: "robot",
            text: "You can view or download Om's official Resume PDF directly:",
            action: {
              type: "download",
              target: "/Om_Sharma_Resume.pdf",
              label: "📄 Open Resume PDF",
            },
          };
          break;

        case "contact":
          botResponse = {
            sender: "robot",
            text: "Looking for a developer or want to get in touch? Om is open for internships, opportunities, and projects!",
            action: {
              type: "navigate",
              target: "/contact",
              label: "💬 Open Contact Form →",
            },
          };
          break;

        default:
          botResponse = {
            sender: "robot",
            text: "Bhola Guru is here! How else can I assist you today?",
            action: null,
          };
      }

      setChatHistory((prev) => [...prev, botResponse]);
      setIsTyping(false);

      // Re-arm inactivity timer after answering
      startInactivityTimer();
    }, 450);
  };

  const handleActionClick = (action) => {
    if (!action) return;

    if (action.type === "navigate") {
      if (location.pathname !== action.target) {
        navigate(action.target);
      }
      setIsOpen(false);
    } else if (action.type === "download") {
      window.open(action.target, "_blank", "noopener,noreferrer");
    }
  };

  const toggleOpen = () => {
    setIsInitialFloating(false);
    setShowInitialSpeech(false);
    
    // If opening while sleeping, wake up!
    if (!isOpen && isSleeping) {
      setIsSleeping(false);
      const randomWakeUp =
        WAKE_UP_MESSAGES[Math.floor(Math.random() * WAKE_UP_MESSAGES.length)];
      setChatHistory((prev) => [
        ...prev,
        { sender: "robot", text: randomWakeUp, action: null },
      ]);
    }

    setIsOpen((prev) => !prev);
  };

  // CONDITIONAL RENDER MUST BE PLACED AFTER ALL HOOKS ARE EXECUTED
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <aside
      aria-label="Bhola Guru Island Guide"
      className={`fixed bottom-4 sm:bottom-6 left-0 right-0 w-full max-w-5xl mx-auto px-4 sm:px-16 z-[99] flex flex-col items-end pointer-events-none transition-all duration-1000 ${
        isInitialFloating && !isOpen ? "animate-monkey-entry-wave" : ""
      }`}
    >
      {/* 1. INITIAL SPEECH BUBBLE POPUP */}
      {showInitialSpeech && !isOpen && (
        <div
          className={`pointer-events-auto mb-2 px-3.5 py-2.5 rounded-2xl shadow-lg border text-xs sm:text-sm font-medium transition-all duration-500 animate-bounce max-w-[240px] sm:max-w-[280px] ${
            isNight
              ? "bg-slate-900/95 text-slate-100 border-indigo-500/30 shadow-indigo-950/60"
              : "bg-white/95 text-slate-800 border-sky-300/60 shadow-sky-500/20"
          }`}
          style={{
            animationDuration: "3s",
          }}
        >
          <div className="flex items-center gap-1.5">
            <span>Pranam! 🙏 Bhola Guru in motion! 🐒</span>
          </div>
          {/* Speech tail */}
          <div
            className={`absolute -bottom-1.5 right-5 w-3 h-3 rotate-45 border-r border-b ${
              isNight ? "bg-slate-900 border-indigo-500/30" : "bg-white border-sky-300/60"
            }`}
          />
        </div>
      )}

      {/* 2. CHAT POPUP WINDOW */}
      {isOpen && (
        <div
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className={`pointer-events-auto mb-3 w-[calc(100vw-2rem)] max-w-[340px] max-h-[62vh] sm:max-h-[480px] h-[62vh] sm:h-[460px] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right overscroll-contain ${
            isNight
              ? "bg-slate-900/95 backdrop-blur-md border-slate-700/80 text-slate-100 shadow-slate-950/80"
              : "bg-white/95 backdrop-blur-md border-slate-200 text-slate-800 shadow-xl"
          }`}
        >
          {/* Chat Header */}
          <div
            className={`px-4 py-3 flex items-center justify-between border-b ${
              isNight
                ? "bg-slate-800/80 border-slate-700/80"
                : "bg-slate-100/80 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <MonkeyAvatar size="sm" isNight={isNight} isSleeping={isSleeping} />
              <div>
                <h3 className="font-bold text-xs sm:text-sm font-poppins leading-tight flex items-center gap-1">
                  <span>Bhola Guru</span> 🐒
                </h3>
                {isSleeping ? (
                  <span className="text-[10px] text-indigo-400 dark:text-indigo-300 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                    Sleeping 😴
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Awake & Swingin' 🌴
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={toggleOpen}
              aria-label="Close Bhola Guru Guide"
              className={`p-1 rounded-lg transition-colors text-sm font-semibold ${
                isNight
                  ? "hover:bg-slate-700 text-slate-400 hover:text-slate-100"
                  : "hover:bg-slate-200 text-slate-500 hover:text-slate-900"
              }`}
            >
              ✕
            </button>
          </div>

          {/* Chat History Area */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-3.5 overflow-y-auto custom-scrollbar overscroll-contain space-y-3 text-xs sm:text-sm scroll-smooth"
          >
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                    msg.sender === "user"
                      ? isNight
                        ? "bg-indigo-600 text-white rounded-br-none shadow-sm"
                        : "bg-blue-600 text-white rounded-br-none shadow-sm"
                      : isNight
                      ? "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none"
                      : "bg-slate-100 border border-slate-200/80 text-slate-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Optional Action Button */}
                {msg.action && (
                  <button
                    onClick={() => handleActionClick(msg.action)}
                    type="button"
                    className={`mt-2 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all border flex items-center gap-1.5 active:scale-95 ${
                      isNight
                        ? "bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border-indigo-500/30"
                        : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border-blue-500/30"
                    }`}
                  >
                    <span>{msg.action.label}</span>
                  </button>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-1.5 text-slate-400">
                <MonkeyAvatar size="sm" isNight={isNight} isSleeping={isSleeping} className="opacity-75 scale-75" />
                <span className="text-xs italic">Bhola Guru is thinking...</span>
              </div>
            )}
          </div>

          {/* Predefined Action Options Area */}
          <div
            className={`p-2.5 border-t flex flex-col gap-1.5 ${
              isNight
                ? "bg-slate-900/90 border-slate-800"
                : "bg-slate-50/90 border-slate-200/80"
            }`}
          >
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 px-1">
              Quick Options:
            </span>
            <div
              ref={optionsContainerRef}
              className="flex flex-wrap gap-1 max-h-[120px] overflow-y-auto custom-scrollbar overscroll-contain p-0.5"
            >
              {INITIAL_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleOptionClick(opt)}
                  type="button"
                  className={`px-2 py-1 rounded-xl text-[11px] font-medium transition-all duration-200 border flex items-center gap-1 active:scale-95 ${
                    isNight
                      ? "bg-slate-800 hover:bg-indigo-600/30 border-slate-700 hover:border-indigo-500 text-slate-200"
                      : "bg-white hover:bg-sky-50 border-slate-200 hover:border-sky-400 text-slate-700"
                  }`}
                >
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. BOUNDARY-FREE 3D FLOATING MONKEY AVATAR BUTTON WITH CONTINUOUS MOTION */}
      <button
        onClick={toggleOpen}
        aria-label="Open Bhola Guru Guide"
        type="button"
        className={`pointer-events-auto relative group flex items-center justify-center focus:outline-none focus-visible:outline-none focus:ring-0 outline-none select-none bg-transparent border-none p-0 cursor-pointer ${
          !isOpen ? "animate-monkey-float" : ""
        }`}
      >
        {/* Soft Ambient Character Aura (No rigid box or circle border) */}
        <div
          className={`absolute inset-1 rounded-full opacity-40 blur-lg group-hover:opacity-80 transition-opacity animate-pulse ${
            isSleeping
              ? "bg-indigo-500/40"
              : isNight
              ? "bg-indigo-500/60"
              : "bg-sky-400/60"
          }`}
        />

        {/* Boundary-Free 3D Monkey Avatar */}
        <MonkeyAvatar size="lg" isNight={isNight} isSleeping={isSleeping} className="relative z-10" />

        {/* Quick notification dot */}
        {showInitialSpeech && !isOpen && (
          <span
            className={`absolute top-0 right-0 w-3 h-3 rounded-full border border-slate-900 z-20 animate-ping ${
              isNight ? "bg-indigo-400" : "bg-sky-400"
            }`}
          />
        )}
      </button>
    </aside>
  );
};

export default PortfolioGuideRobot;

