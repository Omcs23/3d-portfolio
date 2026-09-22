import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// Sleek Modern Minimalist Lamp Component
const ModernMinimalLamp = ({ isNight, isSleeping }) => {
  const isGlowing = isNight && !isSleeping;

  return (
    <div className="absolute -top-7 -left-3.5 w-12 h-16 pointer-events-none z-30 transition-all duration-500">
      {/* Warm Ambient Spotlight Beam Cone (Glowing onto Emmy at Night when Awake) */}
      {isGlowing && (
        <div
          className="absolute top-4 left-1.5 w-12 h-14 origin-top transform -rotate-[15deg] bg-gradient-to-b from-amber-300/60 via-amber-400/25 to-transparent blur-[2.5px] pointer-events-none animate-pulse"
          style={{ clipPath: "polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)" }}
        />
      )}

      {/* SVG Architectural Minimalist Curved Lamp */}
      <svg
        viewBox="0 0 50 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-sm"
      >
        <defs>
          {/* Intense Radial Lamp Glow */}
          <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fef08a" />
            <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base Mount Plate */}
        <ellipse cx="12" cy="58" rx="6" ry="2.2" fill={isNight ? "#334155" : "#64748b"} stroke="#1e293b" strokeWidth="1" />

        {/* Sleek Modern Curved Metallic Stem */}
        <path
          d="M 12 58 L 12 28 Q 12 9 27 8 L 31 8"
          stroke={isNight ? "#475569" : "#64748b"}
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Modern Minimalist Dome Lamp Head */}
        <path
          d="M 23 13 C 23 7, 35 7, 35 13 Z"
          fill={isNight ? "#1e293b" : "#475569"}
          stroke={isGlowing ? "#fbbf24" : isNight ? "#334155" : "#64748b"}
          strokeWidth="1.2"
        />

        {/* Light Bulb & Ray Highlights */}
        {isGlowing ? (
          <>
            {/* Glowing Golden Bulb */}
            <circle cx="29" cy="13" r="4" fill="url(#bulbGlow)" />
            <circle cx="29" cy="13" r="1.8" fill="#ffffff" />
            {/* Soft Warm Ray Accents */}
            <line x1="29" y1="17" x2="29" y2="21" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="24" y1="16" x2="21" y2="19" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="34" y1="16" x2="37" y2="19" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
          </>
        ) : (
          /* OFF State: Dark bulb when Emmy is sleeping at night, or idle metallic model during daytime */
          <circle cx="29" cy="13" r="2.2" fill={isNight ? "#334155" : "#94a3b8"} opacity="0.8" />
        )}
      </svg>
    </div>
  );
};

// Boundary-free 3D Monkey Avatar Component (Emmy - Female Island Guide Monkey with cute flower accessory & minimal lamp)
const MonkeyAvatar = ({ size = "md", isNight = false, isSleeping = false, className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14 sm:w-16 sm:h-16",
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      {/* Modern Minimalist Lamp on Emmy (visible on large avatar button) */}
      {size === "lg" && <ModernMinimalLamp isNight={isNight} isSleeping={isSleeping} />}

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

        {/* Emmy's Cute Pink Island Flower Accessory */}
        <g filter="url(#soft3dShadow)">
          <circle cx="45" cy="14" r="3.8" fill="#ff6b81" />
          <circle cx="45" cy="14" r="1.6" fill="#feca57" />
        </g>

        {/* 3. 3D MUZZLE & CHEEKS SHAPE */}
        <path
          d="M 19 34 C 19 21, 51 21, 51 34 C 51 47, 19 47, 19 34 Z"
          fill="url(#monkeyFace)"
          stroke="#4f271a"
          strokeWidth="1.2"
        />

        {/* 4. EYES: AWAKE (WIDE OPEN 3D EYES WITH FEMININE LASHES) VS SLEEPING */}
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
            {/* WIDE OPEN EXPRESSIVE 3D GLOSSY EYES WITH CUTE LASHES */}
            {/* Left Eye Base & Iris */}
            <ellipse cx="27" cy="29" rx="5" ry="6" fill="#ffffff" stroke="#36170d" strokeWidth="0.8" />
            <ellipse cx="27" cy="29.5" rx="3.5" ry="4.2" fill="url(#monkeyEyePupil)" />
            {/* Eye Catchlights */}
            <circle cx="28.5" cy="28" r="1.4" fill="#ffffff" />
            <circle cx="25.8" cy="31" r="0.7" fill="#ffffff" />
            {/* Feminine Eyelash accents */}
            <path d="M 24 24.5 Q 26 22 28.5 23.5" stroke="#210c04" strokeWidth="1.2" strokeLinecap="round" fill="none" />

            {/* Right Eye Base & Iris */}
            <ellipse cx="43" cy="29" rx="5" ry="6" fill="#ffffff" stroke="#36170d" strokeWidth="0.8" />
            <ellipse cx="43" cy="29.5" rx="3.5" ry="4.2" fill="url(#monkeyEyePupil)" />
            {/* Eye Catchlights */}
            <circle cx="44.5" cy="28" r="1.4" fill="#ffffff" />
            <circle cx="41.8" cy="31" r="0.7" fill="#ffffff" />
            {/* Feminine Eyelash accents */}
            <path d="M 41.5 23.5 Q 44 22 46 24.5" stroke="#210c04" strokeWidth="1.2" strokeLinecap="round" fill="none" />
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
        <circle cx="21.5" cy="37.5" r="3" fill="#ff6b6b" opacity="0.55" />
        <circle cx="48.5" cy="37.5" r="3" fill="#ff6b6b" opacity="0.55" />
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

// Energetic Wake Up Messages in 100% English
const WAKE_UP_MESSAGES = [
  "Whoa! 🐒 Emmy was having the sweetest banana-smoothie dream!",
  "Hey friend! 🌴 You just woke up Emmy from her palm-tree lounge!",
  "Yay! 🍌 Emmy's awake and ready to swing into action! What are we exploring today?"
];

const PortfolioGuideRobot = () => {
  // ALL REACT HOOKS CALLED UNCONDITIONALLY AT THE TOP LEVEL
  const { isNight } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [showInitialSpeech, setShowInitialSpeech] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isInitialFloating, setIsInitialFloating] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "robot",
      text: "Hey there! ✨ I'm Emmy 🐒 — Om's energetic 3D island guide monkey! What awesome topic would you like to explore today?",
      action: null,
    },
  ]);
  const [inputText, setInputText] = useState("");
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
            text: "Zzz... 😴 *Emmy curls up under a warm palm leaf* Zzz...",
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

  // Jokes pool
  const JOKES = [
    "Why do programmers prefer dark mode? Because light attracts bugs! 🐛😄",
    "Why did the Java developer wear glasses? Because she couldn't C#! 👓💻",
    "What is Emmy's favorite key on the keyboard? The Banana Space-bar! 🍌⌨️",
    "There are 10 types of people in the world: those who understand binary, and those who don't! 🤖",
    "Why are monkeys so good at web design? Because we're masters of HTML5: High-Tree Monkey Language! 🌴🐒",
  ];

  // Quotes pool
  const QUOTES = [
    "“First, solve the problem. Then, write the code.” — John Johnson 💡",
    "“Code is like humor. When you have to explain it, it’s bad.” — Cory House 🚀",
    "“Simplicity is the soul of efficiency.” — Austin Freeman ✨",
    "“Make it work, make it right, make it fast.” — Kent Beck ⚡",
  ];

  // Helper to process user typed queries dynamically in 100% English & high energy
  const processTypedQuery = (query) => {
    const q = query.toLowerCase().trim();

    // How are you / How r u / How you doing
    if (
      q.includes("how are you") ||
      q.includes("how r u") ||
      q.includes("how u doing") ||
      q.includes("how are u") ||
      q.includes("wbu") ||
      q.includes("how do you do")
    ) {
      return {
        text: "Emmy is feeling 100% supercharged! ⚡ Swinging high on the palm trees with a ripe golden banana! 🍌 How are you doing today, explorer?",
        action: null,
      };
    }

    // Who are you / What are you / Who r u
    if (
      q.includes("who are you") ||
      q.includes("who r u") ||
      q.includes("what are you") ||
      q.includes("your name") ||
      q.includes("who is emmy") ||
      q.includes("who is bhola")
    ) {
      return {
        text: "I'm Emmy! 🐒✨ Om's energetic 3D island guide monkey! I'm here to show you Om's tech skills, awesome projects, certifications, resume, and coding stats!",
        action: { type: "navigate", target: "/about", label: "Learn About Om →" },
      };
    }

    // Joke / Tell me a joke / Funny
    if (
      q.includes("joke") ||
      q.includes("funny") ||
      q.includes("laugh")
    ) {
      const randomJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
      return {
        text: `Here's a fresh monkey bite of humor for you! 🐒😄\n\n${randomJoke}`,
        action: null,
      };
    }

    // Quote / Thought / Motivation
    if (
      q.includes("quote") ||
      q.includes("thought") ||
      q.includes("motivation") ||
      q.includes("inspire")
    ) {
      const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      return {
        text: `Here is a daily thought from Emmy! 🌴✨\n\n${randomQuote}`,
        action: null,
      };
    }

    // Banana / Monkey smalltalk
    if (q.includes("banana") || q.includes("monkey") || q.includes("tree")) {
      return {
        text: "YUMMM! Did somebody say BANANA?! 🍌 *Emmy does a joyful backflip through the palm trees* 🐒✨",
        action: null,
      };
    }

    // Thanks / Thank you
    if (
      q.includes("thank") ||
      q.includes("thanks") ||
      q.includes("ty")
    ) {
      return {
        text: "You're so welcome! ✨ Emmy is always happy to help! Ask me anything else about Om's work anytime!",
        action: null,
      };
    }

    // Bye / Goodbye / See ya
    if (
      q.includes("bye") ||
      q.includes("goodbye") ||
      q.includes("see ya")
    ) {
      return {
        text: "Bye bye! 👋 Have a banana-tastic day ahead! Come back anytime to chat with Emmy!",
        action: null,
      };
    }

    // About / Who is Om / Bio / Background
    if (
      q.includes("about") ||
      q.includes("who") ||
      q.includes("bio") ||
      q.includes("om") ||
      q.includes("intro") ||
      q.includes("developer")
    ) {
      return {
        text: "Om Sharma is an enthusiastic B.Tech Computer Science student at GLA University (2023 - 2027), specializing in Full-Stack Web Development (MERN), Java, Python, and AI automation! ✨",
        action: { type: "navigate", target: "/about", label: "Explore Full Bio →" },
      };
    }

    // Skills / Tech / Stack / Programming
    if (
      q.includes("skill") ||
      q.includes("tech") ||
      q.includes("stack") ||
      q.includes("react") ||
      q.includes("java") ||
      q.includes("python") ||
      q.includes("node") ||
      q.includes("mongo") ||
      q.includes("cloud") ||
      q.includes("code") ||
      q.includes("programming")
    ) {
      return {
        text: "Om's key tech stack includes:\n• MERN (MongoDB, Express, React, Node.js)\n• Java & Object-Oriented Software Design\n• Python & Web Automation\n• Cloud & AI (Oracle OCI GenAI Certified)",
        action: { type: "navigate", target: "/about", label: "View All Skills →" },
      };
    }

    // Projects / Work / Apps / Built
    if (
      q.includes("project") ||
      q.includes("work") ||
      q.includes("built") ||
      q.includes("app") ||
      q.includes("hospital") ||
      q.includes("bot") ||
      q.includes("3d")
    ) {
      return {
        text: "Om has created several key projects:\n1. 🏥 Hospital Management System\n2. 🤖 Instagram Automation Bot\n3. 🌐 3D Interactive Portfolio",
        action: { type: "navigate", target: "/projects", label: "Explore Projects →" },
      };
    }

    // Certifications / Certificate / Oracle / Google / Infosys
    if (
      q.includes("certif") ||
      q.includes("oracle") ||
      q.includes("google") ||
      q.includes("infosys") ||
      q.includes("oci")
    ) {
      return {
        text: "Om holds verified professional certifications:\n• Oracle OCI 2025 Certified Generative AI Professional\n• Oracle OCI 2025 Certified DevOps Professional\n• Google Cybersecurity Professional Certificate\n• Infosys MERN & Java Certifications",
        action: { type: "navigate", target: "/about", label: "View Certifications →" },
      };
    }

    // Coding / LeetCode / HackerRank / DSA
    if (
      q.includes("leetcode") ||
      q.includes("hackerrank") ||
      q.includes("dsa") ||
      q.includes("codeforces") ||
      q.includes("problem") ||
      q.includes("algo")
    ) {
      return {
        text: "Om actively practices Data Structures & Algorithms on LeetCode, Codeforces, and HackerRank with hundreds of problems solved!",
        action: { type: "navigate", target: "/about", label: "View Coding Stats →" },
      };
    }

    // Education / College / University / GLA / Study
    if (
      q.includes("education") ||
      q.includes("college") ||
      q.includes("gla") ||
      q.includes("university") ||
      q.includes("study") ||
      q.includes("degree") ||
      q.includes("btech") ||
      q.includes("school")
    ) {
      return {
        text: "🎓 B.Tech in Computer Science & Engineering\n📍 GLA University (2023 - 2027)\nFocusing on Data Structures, Algorithms, Software Engineering, and Web Systems.",
        action: { type: "navigate", target: "/about", label: "View Education Timeline →" },
      };
    }

    // Resume / CV / PDF / Download
    if (
      q.includes("resume") ||
      q.includes("cv") ||
      q.includes("pdf") ||
      q.includes("download")
    ) {
      return {
        text: "You can view or download Om's official Resume PDF directly:",
        action: {
          type: "download",
          target: "/Om_Sharma_Resume.pdf",
          label: "📄 Open Resume PDF",
        },
      };
    }

    // Contact / Email / Talk / Hire / Reach / Social
    if (
      q.includes("contact") ||
      q.includes("email") ||
      q.includes("hire") ||
      q.includes("reach") ||
      q.includes("talk") ||
      q.includes("message") ||
      q.includes("touch") ||
      q.includes("social")
    ) {
      return {
        text: "Looking for a talented developer or want to get in touch? Om is open for internships, opportunities, and projects!",
        action: { type: "navigate", target: "/contact", label: "💬 Open Contact Form →" },
      };
    }

    // Greetings: Hi, Hello, Hey, Yo
    if (
      q.includes("hi") ||
      q.includes("hello") ||
      q.includes("hey") ||
      q.includes("yo") ||
      q.includes("sup")
    ) {
      return {
        text: "Hey there! 🐒✨ I'm Emmy, super excited to guide you! I can show you Om's skills, projects, certifications, education, resume, or contact details!",
        action: null,
      };
    }

    // Energetic, friendly English fallback
    return {
      text: "Emmy is swinging high on Om's 3D island! 🌴 I'm specialized in guiding you around Om's portfolio. Feel free to ask me anything about Om's work, or tap one of the quick options!",
      action: null,
    };
  };

  // Predefined answers dictionary
  const handleOptionClick = (option) => {
    const wasSleeping = isSleeping;
    if (isSleeping) {
      setIsSleeping(false);
    }

    // Reset inactivity timer on interaction
    startInactivityTimer();

    const userMessage = { sender: "user", text: option.label };

    // If Emmy was sleeping, add funny wake-up message first
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
            text: "Om Sharma is an enthusiastic B.Tech CS & Engineering student at GLA University, specializing in Full-Stack Web Development (MERN), Java, Python, and AI automation! ✨",
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
            text: "Om has built impressive web & software projects:\n1. 🏥 Hospital Management System\n2. 🤖 Instagram Automation Bot\n3. 🌐 3D Interactive Portfolio",
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
            text: "Looking for a talented developer or want to get in touch? Om is open for internships, opportunities, and projects!",
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
            text: "Emmy is right here! 🐒✨ How else can I assist you today?",
            action: null,
          };
      }

      setChatHistory((prev) => [...prev, botResponse]);
      setIsTyping(false);

      // Re-arm inactivity timer after answering
      startInactivityTimer();
    }, 450);
  };

  // Handle custom user typed message submission
  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const query = inputText.trim();
    if (!query) return;

    const wasSleeping = isSleeping;
    if (isSleeping) {
      setIsSleeping(false);
    }

    startInactivityTimer();

    const userMessage = { sender: "user", text: query };
    setInputText("");

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
      const botResponse = processTypedQuery(query);
      setChatHistory((prev) => [...prev, botResponse]);
      setIsTyping(false);

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
      aria-label="Emmy Island Guide"
      className={`fixed bottom-4 sm:bottom-6 left-0 right-0 w-full max-w-5xl mx-auto px-4 sm:px-16 z-[99] flex flex-col items-end pointer-events-none transition-all duration-1000 ${
        isInitialFloating && !isOpen ? "animate-monkey-entry-wave" : ""
      }`}
    >
      {/* CHAT POPUP WINDOW */}
      {isOpen && (
        <div
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className={`pointer-events-auto mb-3 w-[calc(100vw-2rem)] max-w-[340px] max-h-[68vh] sm:max-h-[500px] h-[68vh] sm:h-[480px] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right overscroll-contain ${
            isNight
              ? "bg-slate-900/95 backdrop-blur-md border-slate-700/80 text-slate-100 shadow-slate-950/80"
              : "bg-white/95 backdrop-blur-md border-slate-200 text-slate-800 shadow-xl"
          }`}
        >
          {/* Chat Header */}
          <div
            className={`px-4 py-3 flex items-center justify-between border-b shrink-0 ${
              isNight
                ? "bg-slate-800/80 border-slate-700/80"
                : "bg-slate-100/80 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <MonkeyAvatar size="sm" isNight={isNight} isSleeping={isSleeping} />
              <div>
                <h3 className="font-bold text-xs sm:text-sm font-poppins leading-tight flex items-center gap-1">
                  <span>Emmy</span> 🐒✨
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
              aria-label="Close Emmy Guide"
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
                <span className="text-xs italic">Emmy is thinking...</span>
              </div>
            )}
          </div>

          {/* Quick Action Pills Area */}
          <div
            className={`px-2.5 pt-2 pb-1.5 border-t flex flex-col gap-1 shrink-0 ${
              isNight
                ? "bg-slate-900/90 border-slate-800"
                : "bg-slate-50/90 border-slate-200/80"
            }`}
          >
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 px-0.5">
              Quick Topics:
            </span>
            <div
              ref={optionsContainerRef}
              className="flex items-center gap-1 overflow-x-auto custom-scrollbar overscroll-contain pb-1 no-scrollbar sm:flex-wrap sm:max-h-[64px]"
            >
              {INITIAL_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleOptionClick(opt)}
                  type="button"
                  className={`px-2 py-1 shrink-0 rounded-xl text-[11px] font-medium transition-all duration-200 border flex items-center gap-1 active:scale-95 ${
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

          {/* Custom Message Keyboard Input Bar */}
          <form
            onSubmit={handleCustomSubmit}
            className={`p-2 border-t flex items-center gap-1.5 shrink-0 ${
              isNight
                ? "bg-slate-900 border-slate-800 text-slate-100"
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Emmy anything about Om..."
              className={`flex-1 px-3 py-1.5 rounded-xl text-xs sm:text-sm border outline-none transition-colors ${
                isNight
                  ? "bg-slate-800/90 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-indigo-500"
                  : "bg-slate-100/90 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500"
              }`}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              aria-label="Send message"
              className={`p-2 rounded-xl transition-all flex items-center justify-center shrink-0 ${
                inputText.trim()
                  ? isNight
                    ? "bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-950/40"
                    : "bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-md shadow-blue-500/20"
                  : isNight
                  ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* BOUNDARY-FREE 3D FLOATING MONKEY AVATAR BUTTON */}
      <button
        onClick={toggleOpen}
        aria-label="Open Emmy Guide"
        type="button"
        className={`pointer-events-auto relative group flex items-center justify-center focus:outline-none focus-visible:outline-none focus:ring-0 outline-none select-none bg-transparent border-none p-0 cursor-pointer ${
          !isOpen ? "animate-monkey-float" : ""
        }`}
      >
        {/* Soft Ambient Character Aura */}
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
      </button>
    </aside>
  );
};

export default PortfolioGuideRobot;

