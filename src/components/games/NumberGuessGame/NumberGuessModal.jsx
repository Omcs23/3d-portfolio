import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../context/ThemeContext";

// Web Audio API Synthesizer for Retro Game Sound FX
const playSoundEffect = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === "high") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "low") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "win") {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        const startTime = now + idx * 0.07;
        o.type = "square";
        o.frequency.setValueAtTime(freq, startTime);
        g.gain.setValueAtTime(0.15, startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);
        o.start(startTime);
        o.stop(startTime + 0.22);
      });
    } else if (type === "lose") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.38);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
      osc.start(now);
      osc.stop(now + 0.38);
    }
  } catch (err) {
    // Audio context may be blocked by browser policy until interaction
  }
};

const DIFFICULTY_PRESETS = [
  { id: "easy", label: "Easy (1–50)", icon: "🟢", max: 50, attempts: 6 },
  { id: "medium", label: "Medium (1–100)", icon: "⚡", max: 100, attempts: 7 },
  { id: "hard", label: "Hard (1–200)", icon: "🔥", max: 200, attempts: 8 },
  { id: "expert", label: "Expert (1–500)", icon: "👑", max: 500, attempts: 10 },
];

// Lightweight Confetti Particle Canvas for Victory State
const ConfettiCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const width = (canvas.width = canvas.offsetWidth || 400);
    const height = (canvas.height = canvas.offsetHeight || 300);

    const colors = ["#38bdf8", "#818cf8", "#34d399", "#fbbf24", "#f43f5e", "#a855f7"];
    const particles = Array.from({ length: 45 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      r: Math.random() * 6 + 3,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.5);
        ctx.restore();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};

const NumberGuessModal = ({ isOpen, onClose, onGameEnd }) => {
  const { isNight } = useTheme();

  const [difficulty, setDifficulty] = useState("medium");
  const [maxRange, setMaxRange] = useState(100);
  const [maxAttempts, setMaxAttempts] = useState(7);
  const [secretNumber, setSecretNumber] = useState(null);
  const [guessInput, setGuessInput] = useState("");
  const [guessHistory, setGuessHistory] = useState([]);
  const [gameState, setGameState] = useState("PLAYING"); // "PLAYING", "WON", "LOST"
  const [feedback, setFeedback] = useState(null);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [stats, setStats] = useState({
    wins: 0,
    gamesPlayed: 0,
    bestAttempts: null,
  });

  const inputRef = useRef(null);

  // Lock body overflow & reset scroll position on mobile when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        if (window.scrollY !== 0) {
          window.scrollTo(0, 0);
        }
      };
    }
  }, [isOpen]);

  // Load persistent stats from localStorage
  useEffect(() => {
    try {
      const savedWins = localStorage.getItem("emmy_ng_wins") || 0;
      const savedPlayed = localStorage.getItem("emmy_ng_played") || 0;
      const savedBest = localStorage.getItem("emmy_ng_best");
      setStats({
        wins: parseInt(savedWins, 10),
        gamesPlayed: parseInt(savedPlayed, 10),
        bestAttempts: savedBest ? parseInt(savedBest, 10) : null,
      });
    } catch (e) {
      console.log("LocalStorage stats error", e);
    }
  }, []);

  // Initialize new game round
  const startNewGame = (selectedDiffId = difficulty) => {
    const preset = DIFFICULTY_PRESETS.find((p) => p.id === selectedDiffId) || DIFFICULTY_PRESETS[1];
    setDifficulty(preset.id);
    setMaxRange(preset.max);
    setMaxAttempts(preset.attempts);

    const randomTarget = Math.floor(Math.random() * preset.max) + 1;
    setSecretNumber(randomTarget);
    setGuessInput("");
    setGuessHistory([]);
    setGameState("PLAYING");
    setFeedback({
      type: "NEUTRAL",
      text: `I've picked a secret number between 1 and ${preset.max}. Can you guess it in ${preset.attempts} tries? 🤔`,
    });

    setTimeout(() => {
      inputRef.current?.focus();
    }, 120);
  };

  useEffect(() => {
    if (isOpen) {
      startNewGame();
    }
  }, [isOpen]);

  // Handle keyboard shortcuts (Escape, Enter, R)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        if (window.scrollY !== 0) window.scrollTo(0, 0);
      } else if ((e.key === "r" || e.key === "R") && gameState !== "PLAYING") {
        startNewGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, gameState]);

  if (!isOpen) return null;

  const playSound = (type) => {
    if (!isSoundMuted) {
      playSoundEffect(type);
    }
  };

  const handleDifficultyChange = (preset) => {
    playSound("click");
    startNewGame(preset.id);
  };

  const handleGuessSubmit = (e) => {
    if (e) e.preventDefault();
    if (gameState !== "PLAYING") return;

    const num = parseInt(guessInput.trim(), 10);
    if (isNaN(num) || num < 1 || num > maxRange) {
      setFeedback({
        type: "INVALID",
        text: `⚠️ Enter a valid number between 1 and ${maxRange}!`,
      });
      playSound("high");
      return;
    }

    const currentAttempts = guessHistory.length + 1;
    const diff = Math.abs(secretNumber - num);
    const diffPercent = Math.round((diff / maxRange) * 100);

    let resultType = "";
    let feedbackMsg = "";
    let tempSound = "";

    if (num === secretNumber) {
      resultType = "CORRECT";
      feedbackMsg = `🎉 BINGO! ${num} is the exact secret number!`;
      tempSound = "win";
    } else if (num > secretNumber) {
      resultType = "HIGH";
      tempSound = "high";
      if (diffPercent <= 5) {
        feedbackMsg = `🔥 ⬇️ ${num} is TOO HIGH, but BURNING HOT! (Super close!)`;
      } else if (diffPercent <= 15) {
        feedbackMsg = `🌡️ ⬇️ ${num} is TOO HIGH! (Getting warm!)`;
      } else {
        feedbackMsg = `🧊 ⬇️ ${num} is TOO HIGH! Try a smaller number.`;
      }
    } else {
      resultType = "LOW";
      tempSound = "low";
      if (diffPercent <= 5) {
        feedbackMsg = `🔥 ⬆️ ${num} is TOO LOW, but BURNING HOT! (Super close!)`;
      } else if (diffPercent <= 15) {
        feedbackMsg = `🌡️ ⬆️ ${num} is TOO LOW! (Getting warm!)`;
      } else {
        feedbackMsg = `🧊 ⬆️ ${num} is TOO LOW! Try a larger number.`;
      }
    }

    const newHistory = [
      ...guessHistory,
      { guess: num, result: resultType, diff, diffPercent },
    ];
    setGuessHistory(newHistory);
    setFeedback({ type: resultType, text: feedbackMsg, diffPercent });
    setGuessInput("");
    playSound(tempSound);

    // Check Win
    if (resultType === "CORRECT") {
      setGameState("WON");
      const newWins = stats.wins + 1;
      const newPlayed = stats.gamesPlayed + 1;
      const newBest =
        stats.bestAttempts === null
          ? currentAttempts
          : Math.min(stats.bestAttempts, currentAttempts);

      setStats({ wins: newWins, gamesPlayed: newPlayed, bestAttempts: newBest });
      try {
        localStorage.setItem("emmy_ng_wins", newWins.toString());
        localStorage.setItem("emmy_ng_played", newPlayed.toString());
        localStorage.setItem("emmy_ng_best", newBest.toString());
      } catch (err) {}

      if (onGameEnd) {
        onGameEnd({
          status: "WON",
          attempts: currentAttempts,
          maxAttempts,
          maxRange,
          secretNumber,
        });
      }
      return;
    }

    // Check Loss
    if (currentAttempts >= maxAttempts) {
      setGameState("LOST");
      const newPlayed = stats.gamesPlayed + 1;
      setStats((prev) => ({ ...prev, gamesPlayed: newPlayed }));
      try {
        localStorage.setItem("emmy_ng_played", newPlayed.toString());
      } catch (err) {}

      playSound("lose");
      if (onGameEnd) {
        onGameEnd({
          status: "LOST",
          attempts: currentAttempts,
          maxAttempts,
          maxRange,
          secretNumber,
        });
      }
    } else {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  const attemptsRemaining = maxAttempts - guessHistory.length;
  const attemptsProgress = Math.max(0, (attemptsRemaining / maxAttempts) * 100);

  // Calculate dynamic narrowing target range (visual helper)
  const lowGuesses = guessHistory.filter((h) => h.result === "LOW").map((h) => h.guess);
  const highGuesses = guessHistory.filter((h) => h.result === "HIGH").map((h) => h.guess);

  const activeMin = lowGuesses.length > 0 ? Math.max(...lowGuesses) + 1 : 1;
  const activeMax = highGuesses.length > 0 ? Math.min(...highGuesses) - 1 : maxRange;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in select-none">
      <div
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all duration-300 transform scale-100 ${
          isNight
            ? "bg-slate-900/95 border-indigo-500/40 text-slate-100 shadow-indigo-950/90"
            : "bg-white/95 border-blue-400/50 text-slate-800 shadow-2xl shadow-blue-500/10"
        }`}
      >
        {/* Confetti canvas overlay on Victory */}
        {gameState === "WON" && <ConfettiCanvas />}

        {/* MODAL HEADER BAR */}
        <div
          className={`px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b ${
            isNight
              ? "bg-slate-950/90 border-slate-800"
              : "bg-slate-100/90 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30 shrink-0">
              🔢
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-outfit font-black text-sm sm:text-base leading-tight tracking-tight">
                  Emmy Arcade
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
                  Number Guess
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">
                Guess Emmy's secret number before tries run out!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 z-20">
            {/* Audio Toggle */}
            <button
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              type="button"
              title={isSoundMuted ? "Unmute Sound FX" : "Mute Sound FX"}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isNight
                  ? "bg-slate-800/90 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600"
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <span>{isSoundMuted ? "🔇" : "🔊"}</span>
              <span className="hidden sm:inline text-[10px] font-mono uppercase">
                {isSoundMuted ? "Muted" : "Sound"}
              </span>
            </button>

            {/* Close Modal Button */}
            <button
              onClick={() => {
                onClose();
                if (window.scrollY !== 0) window.scrollTo(0, 0);
              }}
              type="button"
              aria-label="Close modal"
              className={`w-9 h-9 rounded-xl text-sm font-black transition-all border flex items-center justify-center ${
                isNight
                  ? "bg-slate-800/90 border-slate-700 text-slate-400 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/40"
                  : "bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-rose-50 hover:border-rose-300"
              }`}
            >
              ✕
            </button>
          </div>
        </div>

        {/* DIFFICULTY PRESET RIBBON & STATS BAR */}
        <div
          className={`px-4 sm:px-6 py-2.5 border-b flex flex-wrap items-center justify-between gap-2.5 ${
            isNight ? "bg-slate-900/70 border-slate-800/90" : "bg-slate-50 border-slate-200/90"
          }`}
        >
          {/* Difficulty Preset Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {DIFFICULTY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleDifficultyChange(preset)}
                disabled={gameState === "PLAYING" && guessHistory.length > 0}
                type="button"
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1 ${
                  difficulty === preset.id
                    ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white border-indigo-400/80 shadow-md shadow-indigo-500/30 scale-[1.02]"
                    : gameState === "PLAYING" && guessHistory.length > 0
                    ? "opacity-40 cursor-not-allowed border-transparent text-slate-500"
                    : isNight
                    ? "bg-slate-800 border-slate-700/80 text-slate-300 hover:bg-slate-700/80 hover:text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>

          {/* Persistent Player Score Badges */}
          <div className="flex items-center gap-2.5 font-mono text-xs shrink-0 font-bold">
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
              🏆 <span>{stats.wins}</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center gap-1">
              ⚡ <span>{stats.bestAttempts ? `${stats.bestAttempts} tries` : "-"}</span>
            </span>
          </div>
        </div>

        {/* MAIN GAME BODY AREA */}
        <div className="p-4 sm:p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* ATTEMPTS REMAINING & HEALTH BAR */}
          <div
            className={`p-3 sm:p-3.5 rounded-2xl border flex flex-col gap-2.5 ${
              isNight ? "bg-slate-950/60 border-slate-800" : "bg-slate-100/80 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black font-outfit uppercase tracking-wider text-slate-400">
                  Attempts Left:
                </span>
                <span className="text-base font-extrabold font-mono text-cyan-400">
                  {attemptsRemaining} / {maxAttempts}
                </span>
              </div>

              {/* Heart / Dot Health Nodes */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: maxAttempts }).map((_, idx) => {
                  const isUsed = idx >= attemptsRemaining;
                  return (
                    <span
                      key={idx}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                        isUsed
                          ? "bg-slate-700/50 scale-75"
                          : idx === attemptsRemaining - 1
                          ? "bg-cyan-400 animate-pulse scale-125 shadow-sm shadow-cyan-400"
                          : "bg-indigo-500 shadow-sm shadow-indigo-500/50"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Health Meter Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  attemptsProgress > 50
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                    : attemptsProgress > 25
                    ? "bg-gradient-to-r from-amber-400 to-orange-500"
                    : "bg-gradient-to-r from-rose-500 to-red-600 animate-pulse"
                }`}
                style={{ width: `${attemptsProgress}%` }}
              />
            </div>
          </div>

          {/* VISUAL TARGET RANGE TRACKER (HOT/COLD ZONE) */}
          {guessHistory.length > 0 && gameState === "PLAYING" && (
            <div
              className={`p-3 rounded-2xl border flex flex-col gap-1.5 text-xs ${
                isNight ? "bg-slate-950/40 border-slate-800/80" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400">
                <span>Active Target Zone:</span>
                <span className="text-cyan-400 font-bold">
                  Between {activeMin} and {activeMax}
                </span>
              </div>

              <div className="relative w-full h-3 rounded-full bg-slate-800/80 overflow-hidden my-1">
                {/* Active Highlighted Range Zone */}
                <div
                  className="absolute h-full bg-indigo-500/30 border-x border-indigo-400/80 transition-all duration-300"
                  style={{
                    left: `${((activeMin - 1) / maxRange) * 100}%`,
                    width: `${((activeMax - activeMin + 1) / maxRange) * 100}%`,
                  }}
                />

                {/* Plot Guessed Points */}
                {guessHistory.map((item, i) => {
                  const pos = ((item.guess - 1) / maxRange) * 100;
                  return (
                    <div
                      key={i}
                      className={`absolute top-0 bottom-0 w-1 -ml-0.5 rounded-full transition-all ${
                        item.result === "HIGH"
                          ? "bg-rose-500 shadow-sm shadow-rose-500"
                          : item.result === "LOW"
                          ? "bg-sky-400 shadow-sm shadow-sky-400"
                          : "bg-emerald-400"
                      }`}
                      style={{ left: `${pos}%` }}
                      title={`Guess #${i + 1}: ${item.guess}`}
                    />
                  );
                })}
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>1</span>
                <span>{Math.round(maxRange / 2)}</span>
                <span>{maxRange}</span>
              </div>
            </div>
          )}

          {/* FEEDBACK & TEMPERATURE ALERT STATUS CARD */}
          {feedback && (
            <div
              className={`p-3.5 sm:p-4 rounded-2xl border text-center font-outfit font-extrabold text-xs sm:text-sm leading-relaxed transition-all duration-300 shadow-lg ${
                feedback.type === "CORRECT"
                  ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-emerald-950/60 animate-bounce"
                  : feedback.type === "HIGH"
                  ? "bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-rose-950/40"
                  : feedback.type === "LOW"
                  ? "bg-sky-500/20 border-sky-500/50 text-sky-300 shadow-sky-950/40"
                  : feedback.type === "INVALID"
                  ? "bg-amber-500/20 border-amber-500/60 text-amber-300"
                  : isNight
                  ? "bg-slate-800/80 border-slate-700 text-slate-200"
                  : "bg-slate-100 border-slate-200 text-slate-800"
              }`}
            >
              {feedback.text}
            </div>
          )}

          {/* INPUT FORM OR VICTORY / LOSS OVERLAY */}
          {gameState === "PLAYING" ? (
            <form onSubmit={handleGuessSubmit} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="number"
                  min="1"
                  max={maxRange}
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  onBlur={() => {
                    if (window.scrollY !== 0) window.scrollTo(0, 0);
                  }}
                  placeholder={`Enter 1 – ${maxRange}...`}
                  className={`flex-1 px-4 py-3 sm:py-3.5 rounded-2xl text-xl sm:text-2xl font-black font-mono text-center border outline-none transition-all shadow-inner ${
                    isNight
                      ? "bg-slate-950 border-slate-700/80 text-white placeholder-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20"
                      : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
                  }`}
                />

                <button
                  type="submit"
                  disabled={!guessInput.trim()}
                  className={`px-6 py-3.5 sm:py-4 rounded-2xl font-outfit font-black text-sm sm:text-base transition-all shadow-xl active:scale-95 whitespace-nowrap ${
                    guessInput.trim()
                      ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:brightness-110 text-white shadow-indigo-500/30"
                      : "bg-slate-800/80 text-slate-600 cursor-not-allowed shadow-none border border-slate-700/50"
                  }`}
                >
                  GUESS 🚀
                </button>
              </div>

              {/* TACTILE QUICK KEYPAD ADJUSTMENT BUTTONS */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
                <span className="text-[11px] font-mono">Quick:</span>
                {[-10, -1, +1, +10].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => {
                      playSound("click");
                      const cur = parseInt(guessInput || "0", 10);
                      const next = Math.max(1, Math.min(maxRange, cur + step));
                      setGuessInput(next.toString());
                    }}
                    className={`px-3 py-1.5 rounded-xl font-mono font-bold border transition-all active:scale-95 shadow-sm ${
                      isNight
                        ? "bg-slate-800/90 border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-slate-200"
                        : "bg-white border-slate-200 hover:bg-slate-100 text-slate-800"
                    }`}
                  >
                    {step > 0 ? `+${step}` : step}
                  </button>
                ))}
              </div>
            </form>
          ) : (
            /* GAME OVER / VICTORY OVERLAY CARD */
            <div className="relative z-20 flex flex-col items-center gap-3 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center backdrop-blur-md shadow-2xl">
              {gameState === "WON" ? (
                <>
                  <div className="text-4xl animate-bounce">🏆 🎉 🧠</div>
                  <h3 className="font-outfit font-black text-xl text-emerald-400 tracking-wide">
                    MASTERMIND! YOU WON!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    You cracked Emmy's secret number{" "}
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-base">
                      {secretNumber}
                    </span>{" "}
                    in only <strong className="text-cyan-400">{guessHistory.length}</strong>{" "}
                    tries!
                  </p>
                </>
              ) : (
                <>
                  <div className="text-4xl">🙈 💥 💀</div>
                  <h3 className="font-outfit font-black text-xl text-rose-400 tracking-wide">
                    OUT OF ATTEMPTS!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Emmy's secret number was{" "}
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-extrabold text-base">
                      {secretNumber}
                    </span>
                  </p>
                </>
              )}

              <button
                onClick={() => startNewGame()}
                type="button"
                className="mt-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-slate-950 font-outfit font-black text-sm sm:text-base shadow-xl shadow-emerald-950/70 active:scale-95 transition-all"
              >
                🎮 PLAY AGAIN (Space / R)
              </button>
            </div>
          )}

          {/* GUESS HISTORY STREAM */}
          {guessHistory.length > 0 && (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-black font-outfit uppercase tracking-wider text-slate-400">
                Guess History ({guessHistory.length}):
              </span>
              <div className="flex flex-wrap items-center gap-1.5 max-h-32 overflow-y-auto custom-scrollbar p-1">
                {guessHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 transition-all shadow-sm ${
                      item.result === "CORRECT"
                        ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-400"
                        : item.result === "HIGH"
                        ? "bg-rose-500/15 border-rose-500/40 text-rose-300"
                        : "bg-sky-500/15 border-sky-500/40 text-sky-300"
                    }`}
                  >
                    <span className="text-slate-400">#{idx + 1}:</span>
                    <span className="text-white text-sm">{item.guess}</span>
                    <span>
                      {item.result === "CORRECT"
                        ? "🎯 BINGO!"
                        : item.result === "HIGH"
                        ? "⬇️ High"
                        : "⬆️ Low"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberGuessModal;
