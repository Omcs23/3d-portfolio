import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { portfolioData } from "../constants";
import { SnakeGameModal, TicTacToeModal } from "./games";



// Boundary-free 3D Monkey Avatar Component (Emmy - Female Island Guide Monkey with cute flower accessory)
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

// Option Categories and Lists (Games classified separately)
const OPTION_CATEGORIES = [
  { id: "games", label: "🎮 Mini Games" },
  { id: "portfolio", label: "👨‍💻 Portfolio" },
  { id: "profiles", label: "🔗 Profiles" },
];

const CATEGORIZED_OPTIONS = {
  games: [
    { id: "snake", label: "🐍 Snake", icon: "🐍" },
    { id: "tictactoe", label: "❌⭕ Cross & Zero", icon: "❌" },
  ],
  portfolio: [
    { id: "home", label: "🏠 3D World", icon: "🏠" },
    { id: "about", label: "👨‍💻 About Om", icon: "👨‍💻" },
    { id: "skills", label: "🛠️ Skills", icon: "🛠️" },
    { id: "projects", label: "🚀 Projects", icon: "🚀" },
    { id: "certifications", label: "📜 Certifications", icon: "📜" },
    { id: "coding", label: "💻 Coding Journey", icon: "💻" },
    { id: "education", label: "🎓 Education", icon: "🎓" },
    { id: "resume", label: "📄 Resume", icon: "📄" },
    { id: "contact", label: "💬 Let's Talk", icon: "💬" },
  ],
  profiles: [
    { id: "github", label: "🐙 GitHub", icon: "🐙" },
    { id: "leetcode", label: "⚡ LeetCode", icon: "⚡" },
    { id: "codeforces", label: "🏆 Codeforces", icon: "🏆" },
    { id: "hackerrank", label: "⭐ HackerRank", icon: "⭐" },
    { id: "instagram", label: "📸 Instagram", icon: "📸" },
  ],
};

// Wake Up Messages
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

  const [activeGame, setActiveGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState("games");
  const [showInitialSpeech, setShowInitialSpeech] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isInitialFloating, setIsInitialFloating] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "robot",
      text: "Hey! 👋 I'm Emmy, your little AI guide around Om's digital world.",
      action: null,
    },
    {
      sender: "robot",
      text: "I can tell you about Om, his projects, skills, certifications, coding journey, play games like Snake or Cross & Zero with you, and help you navigate around.\n\nWant to explore or play something? ✨",
      action: null,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" && window.visualViewport
      ? window.visualViewport.height
      : typeof window !== "undefined"
      ? window.innerHeight
      : 600
  );
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleGameEnd = ({ score, highScore, isNewHighScore }) => {
    let reactionText = "Well... that snake had a good run 😂";
    if (isNewHighScore) {
      reactionText = "You actually beat your record 👀";
    } else if (score >= 500) {
      reactionText = "Okay, I wasn't expecting THAT score.";
    }

    setChatHistory((prev) => [
      ...prev,
      {
        sender: "robot",
        text: `${reactionText}\n\nFinal Score: ${score} | High Score: ${highScore}`,
        action: { type: "game", gameId: "snake", label: "🎮 PLAY SNAKE AGAIN" },
      },
    ]);
  };

  const handleTicTacToeEnd = ({ winner, isPlayerWinner }) => {
    let reactionText = "A tie! Great minds think alike 😄";
    if (isPlayerWinner) {
      reactionText = "Whoa! You outsmarted me at Cross & Zero! 🧠✨";
    } else if (winner === "O" || winner === "X") {
      reactionText = "Gotcha! Emmy takes this round 🐒🔥";
    }

    setChatHistory((prev) => [
      ...prev,
      {
        sender: "robot",
        text: reactionText,
        action: { type: "game", gameId: "tictactoe", label: "🎮 PLAY AGAIN" },
      },
    ]);
  };

  const chatContainerRef = useRef(null);
  const optionsContainerRef = useRef(null);
  const textInputRef = useRef(null);
  const inactivityTimerRef = useRef(null);


  // Handle mobile visual viewport height changes when virtual keyboard opens/closes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleViewportChange = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange);
      window.visualViewport.addEventListener("scroll", handleViewportChange);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportChange);
        window.visualViewport.removeEventListener("scroll", handleViewportChange);
      }
    };
  }, []);

  const handleInputFocus = () => {
    setIsInputFocused(true);
    if (location.pathname === "/") {
      window.scrollTo(0, 0);
    }
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };


  // Initial floating entry motion timer: float across screen for 6s then dock to corner
  useEffect(() => {
    const motionTimer = setTimeout(() => {
      setIsInitialFloating(false);
    }, 6000);

    return () => clearTimeout(motionTimer);
  }, []);

  // Prevent scroll chaining / background webpage scrolling while inside Emmy Chat
  useEffect(() => {
    if (!isOpen) return;

    const attachScrollGuard = (el) => {
      if (!el) return () => {};

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

      return () => {
        el.removeEventListener("wheel", handleWheel);
        el.removeEventListener("touchstart", handleTouchStart);
        el.removeEventListener("touchmove", handleTouchMove);
      };
    };

    const cleanupChat = attachScrollGuard(chatContainerRef.current);

    return () => {
      cleanupChat();
    };
  }, [isOpen]);


  // 60-second inactivity sleep timer logic (both initial site load AND during chat)
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
    }, 60000); // 60 seconds of no interaction -> sleep!
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

  // Asynchronous Gemini AI API caller (100% Client-side & Serverless)
  const fetchGeminiAiResponse = async (userQuery) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || window.GEMINI_API_KEY;
    if (!apiKey) return null;

    try {
      const systemPrompt = `You are Emmy, a friendly, warm, curious, and helpful 3D island guide monkey companion living inside Om Sharma's portfolio website.
Your role: Welcome visitors, explain Om's portfolio, guide them around, discuss Om's work, and play mini-games like Snake.
Personality: Human-like, warm, playful, concise (1-3 short sentences), occasional natural emojis.
Strict rules:
1. Answer using ONLY actual portfolio data:
- Om Sharma: B.Tech CSE student at GLA University (2023-2027).
- Projects: Hospital Management System (Node.js, Express, MongoDB), 3D Interactive Portfolio (React, Three.js, React Three Fiber, Tailwind), Instagram Automation Bot (Node.js, Python).
- Skills: Java, Python, JavaScript, HTML5, CSS3, Tailwind CSS, React.js, Node.js, Express.js, MongoDB, Git, GitHub, Three.js.
- Certifications: Oracle OCI 2025 Certified Generative AI Professional, Oracle OCI 2025 Certified DevOps Professional, Google Cybersecurity Professional Certificate, Infosys Java & MERN.
- Coding: LeetCode (OmSharma152 - 150+ solved), Codeforces (OmSharma_cs), HackerRank (iOmSharma52 - 5-star Java/Python).
2. NEVER invent fake projects, certs, jobs, companies, or stats.
3. If asked to play Snake or games, respond naturally (e.g. "Snake? Good choice 🐍 Let's see what you've got.") and invite them to launch the game!
4. If asked about unrelated topics (weather, coding homework, general trivia), politely redirect: "I'm mainly here to show you around Om's world 😄 Ask me about his projects, skills, certifications, or portfolio."
5. If information is unavailable, say: "I'm not seeing that information in Om's portfolio yet. You can check the Projects section or ask me about something else. 🙂"`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\nUser Question: ${userQuery}` }],
              },
            ],
            generationConfig: {
              maxOutputTokens: 250,
              temperature: 0.7,
            },
          }),
        }
      );

      if (!response.ok) return null;
      const data = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) {
        // Check if response relates to playing Snake / game
        if (userQuery.toLowerCase().includes("snake")) {
          return {
            text: aiText.trim(),
            action: { type: "game", gameId: "snake", label: "🎮 PLAY SNAKE" },
          };
        }
        return {
          text: aiText.trim(),
          action: null,
        };
      }
    } catch (err) {
      console.log("Gemini API call deferred to offline processor:", err);
    }
    return null;
  };

  // Helper to process user typed queries dynamically based on portfolioData
  const processTypedQuery = (query) => {
    const q = query.toLowerCase().trim();

    // Natural human touches & reactions
    const humanReactions = [
      "Nice choice 👀 ",
      "Ah, checking out Om's work! 🚀 ",
      "Going into developer territory, huh? 😄 ",
      "Hope you're enjoying the little world! ✨ "
    ];
    const randomReaction = humanReactions[Math.floor(Math.random() * humanReactions.length)];

    // Specific Snake requests
    if (
      q.includes("snake") ||
      q.includes("play snake") ||
      q.includes("open snake") ||
      q.includes("start snake") ||
      q.includes("can we play snake") ||
      q.includes("let's play snake") ||
      q.includes("lets play snake")
    ) {
      return {
        text: "Snake? Good choice 🐍 Let's see what you've got.",
        action: { type: "game", gameId: "snake", label: "🎮 PLAY SNAKE" },
      };
    }

    // Cross & Zero / Tic Tac Toe requests
    if (
      q.includes("cross zero") ||
      q.includes("cross and zero") ||
      q.includes("tic tac toe") ||
      q.includes("tictactoe") ||
      q.includes("xo") ||
      q.includes("x o") ||
      q.includes("noughts")
    ) {
      return {
        text: "Cross & Zero? You're on! ❌⭕ Let's see if you can beat me.",
        action: { type: "game", gameId: "tictactoe", label: "🎮 PLAY CROSS & ZERO" },
      };
    }

    // General game requests / bored
    if (
      q.includes("play a game") ||
      q.includes("want to play") ||
      q.includes("play game") ||
      q.includes("bored") ||
      q.includes("game") ||
      q.includes("games")
    ) {
      return {
        text: "Sure 😄 What do you want to play?",
        action: { type: "game", gameId: "tictactoe", label: "❌⭕ Cross & Zero" },
      };
    }

    // Navigation requests: Where are the projects / Show me projects
    if (
      q.includes("where are the projects") ||
      q.includes("where are projects") ||
      q.includes("where is projects") ||
      q.includes("find projects") ||
      q.includes("show projects") ||
      q.includes("take me to projects")
    ) {
      return {
        text: "Head over to the Projects section 🚀\nIf you'd like, I can also give you a quick overview here.",
        action: { type: "navigate", target: "/projects", label: "Go to Projects Section →" },
      };
    }

    // Navigation requests: How do I contact Om / Where is contact
    if (
      q.includes("how do i contact") ||
      q.includes("how to contact") ||
      q.includes("where is contact") ||
      q.includes("contact page") ||
      q.includes("find contact") ||
      q.includes("reach om")
    ) {
      return {
        text: "You can use the Contact section. If you'd like, I can guide you there.",
        action: { type: "navigate", target: "/contact", label: "Go to Contact Section →" },
      };
    }

    // Projects: What projects has Om built?
    if (
      q.includes("project") ||
      q.includes("built") ||
      q.includes("work") ||
      q.includes("created") ||
      q.includes("hospital") ||
      q.includes("3d") ||
      q.includes("bot")
    ) {
      return {
        text: `${randomReaction}Om has built several projects, including his Hospital Management System, 3D Interactive Portfolio, and Instagram Automation Bot. Want me to walk you through the interesting ones? 🚀`,
        action: { type: "navigate", target: "/projects", label: "Explore Projects →" },
      };
    }

    // Technologies / Skills: What technologies does he know?
    if (
      q.includes("technology") ||
      q.includes("technologies") ||
      q.includes("skill") ||
      q.includes("know") ||
      q.includes("stack") ||
      q.includes("framework")
    ) {
      // Specific Java query check
      if (q.includes("java")) {
        return {
          text: "Om is proficient in Java! He uses it for Data Structures & Algorithms, competitive programming (100+ problems solved), and holds Java certifications from Infosys Springboard. ☕",
          action: { type: "navigate", target: "/about", label: "View Certifications →" },
        };
      }

      return {
        text: "Om knows Java, JavaScript, Python, HTML5, CSS3, Tailwind CSS, React.js, Node.js, Express.js, MongoDB, Git, and Three.js! ✨",
        action: { type: "navigate", target: "/about", label: "View All Skills →" },
      };
    }

    // Specific Java query fallback
    if (q.includes("java")) {
      return {
        text: "Om is proficient in Java! He uses it for Data Structures & Algorithms, competitive programming (100+ problems solved), and holds Java certifications from Infosys Springboard. ☕",
        action: { type: "navigate", target: "/about", label: "View Certifications →" },
      };
    }

    // Certifications: Tell me about his certifications
    if (
      q.includes("certif") ||
      q.includes("oracle") ||
      q.includes("google") ||
      q.includes("infosys") ||
      q.includes("oci") ||
      q.includes("credential")
    ) {
      return {
        text: "Om holds verified professional certifications:\n• Oracle OCI 2025 Certified Generative AI Professional\n• Oracle OCI 2025 Certified DevOps Professional\n• Google Cybersecurity Professional Certificate\n• Infosys Java & MERN Stack Certifications 📜",
        action: { type: "navigate", target: "/about", label: "View Certifications →" },
      };
    }

    // Website: What is this website built with?
    if (
      q.includes("this website") ||
      q.includes("this portfolio") ||
      q.includes("built with") ||
      q.includes("how was this made") ||
      q.includes("three.js") ||
      q.includes("3d world")
    ) {
      return {
        text: "This website is Om's 3D developer portfolio built with React.js, Three.js, React Three Fiber, and Tailwind CSS! I'm Emmy, your AI guide living inside it. 🌴",
        action: null,
      };
    }

    // Contact: Can I contact Om?
    if (
      q.includes("can i contact") ||
      q.includes("contact om") ||
      q.includes("email") ||
      q.includes("message") ||
      q.includes("hire") ||
      q.includes("talk")
    ) {
      return {
        text: "You can use the Contact section. If you'd like, I can guide you there. 💬",
        action: { type: "navigate", target: "/contact", label: "Go to Contact Section →" },
      };
    }

    // GitHub: Show me his GitHub
    if (q.includes("github") || q.includes("repo") || q.includes("code")) {
      return {
        text: "You can check out Om's GitHub profile at github.com/Omcs23 to view his repositories and open-source projects! 🚀",
        action: {
          type: "download",
          target: "https://github.com/Omcs23",
          label: "Open GitHub Profile ↗",
        },
      };
    }

    // LeetCode / Coding stats
    if (
      q.includes("leetcode") ||
      q.includes("hackerrank") ||
      q.includes("codeforces") ||
      q.includes("dsa") ||
      q.includes("coding")
    ) {
      return {
        text: `Om is an active competitive programmer on LeetCode (@${portfolioData.codingProfiles.leetcode.username} - 150+ solved), Codeforces, and HackerRank! 💻`,
        action: { type: "navigate", target: "/about", label: "View Coding Stats →" },
      };
    }

    // Education / About
    if (
      q.includes("education") ||
      q.includes("college") ||
      q.includes("gla") ||
      q.includes("university") ||
      q.includes("degree") ||
      q.includes("about") ||
      q.includes("who is om")
    ) {
      return {
        text: "Om Sharma is a B.Tech Computer Science & Engineering student at GLA University, Mathura (2023 - 2027), focusing on Web Development, AI, and Software Engineering! 🎓",
        action: { type: "navigate", target: "/about", label: "Learn About Om →" },
      };
    }

    // Resume
    if (q.includes("resume") || q.includes("cv") || q.includes("pdf")) {
      return {
        text: "You can view or download Om's official Resume PDF directly:",
        action: {
          type: "download",
          target: "/Om_Sharma_Resume.pdf",
          label: "📄 Open Resume PDF",
        },
      };
    }

    // Greetings: Hi / Hello / Hey
    if (
      q.includes("hi") ||
      q.includes("hello") ||
      q.includes("hey") ||
      q.includes("yo") ||
      q.includes("sup")
    ) {
      return {
        text: "Hey there! 👋 I'm Emmy! Ask me about Om's projects, skills, certifications, or portfolio!",
        action: null,
      };
    }

    // Unrelated questions redirect (weather, math, general AI trivia)
    if (
      q.includes("weather") ||
      q.includes("temperature") ||
      q.includes("math") ||
      q.includes("solve") ||
      q.includes("write code") ||
      q.includes("python script") ||
      q.includes("capital") ||
      q.includes("president") ||
      q.includes("news")
    ) {
      return {
        text: "I'm mainly here to show you around Om's world 😄 Ask me about his projects, skills, certifications, or portfolio.",
        action: null,
      };
    }

    // Honest missing information fallback
    return {
      text: "I'm not seeing that information in Om's portfolio yet. You can check the Projects section or ask me about something else. 🙂",
      action: null,
    };
  };

  // Predefined options handler
  const handleOptionClick = (option) => {
    const wasSleeping = isSleeping;
    if (isSleeping) {
      setIsSleeping(false);
    }

    startInactivityTimer();

    const userMessage = { sender: "user", text: option.label };

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
        case "snake":
          botResponse = {
            sender: "robot",
            text: "Snake? Good choice 🐍 Let's see what you've got.",
            action: {
              type: "game",
              gameId: "snake",
              label: "🎮 PLAY SNAKE",
            },
          };
          break;

        case "tictactoe":
          botResponse = {
            sender: "robot",
            text: "Cross & Zero? You're on! ❌⭕ Let's see if you can beat me.",
            action: {
              type: "game",
              gameId: "tictactoe",
              label: "🎮 PLAY CROSS & ZERO",
            },
          };
          break;

        case "home":
          botResponse = {
            sender: "robot",
            text: "Welcome to Om's 3D Island Home! 🌴 Drag horizontally across the screen to rotate the 3D island, navigate around, or ask me about Om's work anytime! ✨",
            action: {
              type: "navigate",
              target: "/",
              label: "🏠 Explore 3D World",
            },
          };
          break;

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
            text: "Om's key tech stack includes:\n• MERN (MongoDB, Express, React, Node.js)\n• Java & Object-Oriented Software Design\n• Python & Web Automation\n• Cloud & AI (Oracle OCI GenAI Certified)",
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
            text: "Om has built several projects, including his 3D developer portfolio. Want me to walk you through the interesting ones? 🚀",
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
            text: "Om actively practices Data Structures & Algorithms on LeetCode (@OmSharma152 - 150+ solved), Codeforces, and HackerRank (5-Star in Java & Python)! 💻",
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

        case "github":
          botResponse = {
            sender: "robot",
            text: "Check out Om's open-source projects, repositories, and contributions on GitHub! 🐙",
            action: {
              type: "download",
              target: portfolioData.links.github,
              label: "Open GitHub Profile ↗",
            },
          };
          break;

        case "leetcode":
          botResponse = {
            sender: "robot",
            text: "Om actively solves Data Structures & Algorithms on LeetCode (@OmSharma152) with 150+ problems solved! ⚡",
            action: {
              type: "download",
              target: portfolioData.codingProfiles.leetcode.url,
              label: "Open LeetCode Profile ↗",
            },
          };
          break;

        case "codeforces":
          botResponse = {
            sender: "robot",
            text: "Check out Om's competitive programming profile on Codeforces (@OmSharma_cs)! 🏆",
            action: {
              type: "download",
              target: portfolioData.codingProfiles.codeforces.url,
              label: "Open Codeforces Profile ↗",
            },
          };
          break;

        case "hackerrank":
          botResponse = {
            sender: "robot",
            text: "Om holds 5-Star Badges in Java & Python on HackerRank (@iOmSharma52)! ⭐",
            action: {
              type: "download",
              target: portfolioData.codingProfiles.hackerrank.url,
              label: "Open HackerRank Profile ↗",
            },
          };
          break;

        case "instagram":
          botResponse = {
            sender: "robot",
            text: "Connect with Om or check out his Instagram automation work on Instagram! 📸",
            action: {
              type: "download",
              target: portfolioData.contact.instagram || "https://www.instagram.com/om.chaturvedi52?stkn=MTN4dDhjdm4xNGJtZg==",
              label: "Open Instagram Profile ↗",
            },
          };
          break;

        case "resume":
          botResponse = {
            sender: "robot",
            text: "You can view or download Om's official Resume PDF directly:",
            action: {
              type: "download",
              target: portfolioData.links.resume,
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

        case "ask":
          botResponse = {
            sender: "robot",
            text: "Ask me anything! For example: 'What projects has Om built?' or 'What technologies does he know?' 😄",
            action: null,
          };
          setTimeout(() => {
            textInputRef.current?.focus();
          }, 100);
          break;

        default:
          botResponse = {
            sender: "robot",
            text: "Emmy is right here! 🐒✨ Ask me anything about Om's projects or skills!",
            action: null,
          };
      }

      setChatHistory((prev) => [...prev, botResponse]);
      setIsTyping(false);

      startInactivityTimer();
    }, 400);
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

    fetchGeminiAiResponse(query).then((aiResult) => {
      const botResponse = aiResult || processTypedQuery(query);
      setChatHistory((prev) => [...prev, botResponse]);
      setIsTyping(false);

      startInactivityTimer();
    });
  };

  const handleActionClick = (action) => {
    if (!action) return;

    if (action.type === "navigate") {
      if (location.pathname !== action.target) {
        navigate(action.target);
      }
      setIsOpen(false);
    } else if (action.type === "download") {
      const pathname = window.location.pathname;
      const basePath = pathname.endsWith("/")
        ? pathname
        : pathname.substring(0, pathname.lastIndexOf("/") + 1);
      const fullUrl = action.target.startsWith("/")
        ? `${window.location.origin}${basePath}${action.target.slice(1)}`
        : action.target;
      window.open(fullUrl, "_blank", "noopener,noreferrer");
    } else if (action.type === "game") {
      setActiveGame(action.gameId);
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

  // Calculate max chat popup height based on current visual viewport (above soft keyboard)
  const calculatedMaxHeight = Math.min(
    Math.max(viewportHeight - 110, 220),
    480
  );

  return createPortal(
    <>
      <aside
        aria-label="Emmy Island Guide"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        className={`fixed bottom-6 sm:bottom-8 left-4 sm:left-12 lg:left-[calc(50vw-29rem)] z-[900] flex flex-col items-start pointer-events-none transition-all duration-1000 ${
          isInitialFloating && !isOpen ? "animate-monkey-entry-wave" : ""
        }`}
      >
        {/* CHAT POPUP WINDOW */}
        {isOpen && (
          <div
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            style={{
              maxHeight: `${calculatedMaxHeight}px`,
              height: `${calculatedMaxHeight}px`,
            }}
            className={`pointer-events-auto mb-3 w-[calc(100vw-2rem)] max-w-[320px] sm:max-w-[360px] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-left overscroll-contain ${
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
                  <h3 className="font-bold text-xs sm:text-sm font-outfit leading-tight flex items-center gap-1">
                    <span>Emmy</span> 🐒✨
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold font-mono bg-gradient-to-r from-blue-600 to-indigo-600 text-white uppercase tracking-wider ml-1">
                      AI Powered
                    </span>
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

            {/* Quick Action Pills Area with Category Switcher & Smooth Swiping */}
            <div
              className={`px-2.5 pt-2 pb-2 border-t flex flex-col gap-1.5 shrink-0 ${
                isNight
                  ? "bg-slate-900/95 border-slate-800"
                  : "bg-slate-50/95 border-slate-200/80"
              }`}
            >
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 font-semibold text-[10px] tracking-wide uppercase">
                {OPTION_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-2 py-0.5 rounded-lg transition-all duration-200 ${
                      activeCategory === cat.id
                        ? isNight
                          ? "bg-indigo-600 text-white shadow-sm font-bold"
                          : "bg-blue-600 text-white shadow-sm font-bold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Horizontal Scrollable Pills Area with Butter Smooth Touch/Swipe */}
              <div
                ref={optionsContainerRef}
                className="flex items-center gap-1.5 overflow-x-auto touch-pan-x custom-scrollbar py-0.5 no-scrollbar overscroll-x-contain select-none"
              >
                {CATEGORIZED_OPTIONS[activeCategory]?.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionClick(opt)}
                    type="button"
                    className={`px-2.5 py-1 shrink-0 rounded-xl text-[11px] font-medium transition-all duration-200 border flex items-center gap-1 active:scale-95 whitespace-nowrap ${
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
                ref={textInputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Ask Emmy anything about Om..."
                enterKeyHint="send"
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

        {/* DOCK ANCHOR CONTAINER FOR FLOATING MONKEY AVATAR */}
        <div className="relative pointer-events-auto flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 shrink-0">

          {/* Boundary-Free 3D Floating Monkey Avatar Button (Removes when chat mode is active, comes back when closed) */}
          <button
            onClick={toggleOpen}
            aria-label={isOpen ? "Close Emmy Guide" : "Open Emmy Guide"}
            type="button"
            tabIndex={isOpen ? -1 : 0}
            className={`relative group flex items-center justify-center focus:outline-none focus-visible:outline-none focus:ring-0 outline-none select-none bg-transparent border-none p-0 animate-monkey-float transition-all duration-300 transform w-full h-full z-10 ${
              isOpen
                ? "scale-0 opacity-0 pointer-events-none"
                : "scale-100 opacity-100 pointer-events-auto cursor-pointer"
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
        </div>
      </aside>

      {/* Standalone Snake Game Modal Overlay */}
      <SnakeGameModal
        isOpen={activeGame === "snake"}
        onClose={() => setActiveGame(null)}
        onGameEnd={handleGameEnd}
      />

      {/* Standalone Cross & Zero (Tic Tac Toe) Modal Overlay */}
      <TicTacToeModal
        isOpen={activeGame === "tictactoe"}
        onClose={() => setActiveGame(null)}
        onGameEnd={handleTicTacToeEnd}
      />
    </>,
    document.body
  );
};

export default PortfolioGuideRobot;

