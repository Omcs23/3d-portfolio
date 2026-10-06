import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../context/ThemeContext";

// Retro Web Audio Synthesizer with Cyber Arcade Sound Effects
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
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === "keypad") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === "high") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.14);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === "low") {
      osc.type = "square";
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.14);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === "win") {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        const startTime = now + idx * 0.055;
        o.type = "triangle";
        o.frequency.setValueAtTime(freq, startTime);
        g.gain.setValueAtTime(0.14, startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
        o.start(startTime);
        o.stop(startTime + 0.25);
      });
    } else if (type === "lose") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.35);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (err) {}
};

const DIFFICULTY_PRESETS = [
  { id: "easy", label: "EASY", range: "1–50", max: 50, attempts: 6 },
  { id: "medium", label: "MEDIUM", range: "1–100", max: 100, attempts: 7 },
  { id: "hard", label: "HARD", range: "1–200", max: 200, attempts: 8 },
  { id: "expert", label: "EXPERT", range: "1–500", max: 500, attempts: 10 },
];

// Particle Confetti Burst Canvas for Victory State
const CyberConfetti = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const width = (canvas.width = canvas.offsetWidth || 380);
    const height = (canvas.height = canvas.offsetHeight || 480);

    const colors = ["#38bdf8", "#818cf8", "#34d399", "#f43f5e", "#fbbf24", "#c084fc"];
    const particles = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 5 + 3,
      vx: (Math.random() - 0.5) * 2.5,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 6,
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
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        ctx.restore();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />;
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
  const [stats, setStats] = useState({ wins: 0, gamesPlayed: 0, bestAttempts: null });

  const inputRef = useRef(null);

  // Prevent background scroll & layout shift on mobile keyboards
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      if (window.scrollY !== 0) window.scrollTo(0, 0);

      return () => {
        document.body.style.overflow = originalOverflow;
        if (window.scrollY !== 0) window.scrollTo(0, 0);
      };
    }
  }, [isOpen]);

  // Persistent game stats from localStorage
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
    } catch (e) {}
  }, []);

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
      text: `SYSTEM ACTIVE. TARGET CIPHER SET (1–${preset.max}).`,
    });
  };

  useEffect(() => {
    if (isOpen) startNewGame();
  }, [isOpen]);

  // Keyboard shortcut listener (Physical typing 0-9, Enter, Backspace, Escape, R)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        if (window.scrollY !== 0) window.scrollTo(0, 0);
      } else if ((e.key === "r" || e.key === "R") && gameState !== "PLAYING") {
        startNewGame();
      } else if (gameState === "PLAYING") {
        if (/^[0-9]$/.test(e.key)) {
          playSound("keypad");
          setGuessInput((prev) => {
            const next = prev + e.key;
            const num = parseInt(next, 10);
            return num <= maxRange ? next : prev;
          });
        } else if (e.key === "Backspace") {
          playSound("keypad");
          setGuessInput((prev) => prev.slice(0, -1));
        } else if (e.key === "Enter") {
          e.preventDefault();
          executeGuess();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, gameState, guessInput, maxRange]);

  if (!isOpen) return null;

  const playSound = (type) => {
    if (!isSoundMuted) playSoundEffect(type);
  };

  const handleDifficultyChange = (preset) => {
    playSound("click");
    startNewGame(preset.id);
  };

  const handleKeypadPress = (val) => {
    if (gameState !== "PLAYING") return;
    playSound("keypad");

    if (val === "CLEAR") {
      setGuessInput("");
    } else if (val === "BACKSPACE") {
      setGuessInput((prev) => prev.slice(0, -1));
    } else {
      setGuessInput((prev) => {
        const next = prev + val;
        const num = parseInt(next, 10);
        return num <= maxRange ? next : prev;
      });
    }
  };

  const executeGuess = () => {
    if (gameState !== "PLAYING") return;
    const num = parseInt(guessInput.trim(), 10);

    if (isNaN(num) || num < 1 || num > maxRange) {
      setFeedback({ type: "INVALID", text: `⚠️ INVALID ENTRY! INPUT 1 – ${maxRange}` });
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
      feedbackMsg = `🎯 CIPHER UNLOCKED! ${num} IS CORRECT!`;
      tempSound = "win";
    } else if (num > secretNumber) {
      resultType = "HIGH";
      tempSound = "high";
      feedbackMsg = diffPercent <= 5 ? `🔥 ${num} TOO HIGH! BURNING HOT!` : `⬇️ ${num} IS TOO HIGH! LOWER!`;
    } else {
      resultType = "LOW";
      tempSound = "low";
      feedbackMsg = diffPercent <= 5 ? `🔥 ${num} TOO LOW! BURNING HOT!` : `⬆️ ${num} IS TOO LOW! HIGHER!`;
    }

    const newHistory = [{ guess: num, result: resultType, diffPercent }, ...guessHistory];
    setGuessHistory(newHistory);
    setFeedback({ type: resultType, text: feedbackMsg, diffPercent });
    setGuessInput("");
    playSound(tempSound);

    if (resultType === "CORRECT") {
      setGameState("WON");
      const newWins = stats.wins + 1;
      const newPlayed = stats.gamesPlayed + 1;
      const newBest = stats.bestAttempts === null ? currentAttempts : Math.min(stats.bestAttempts, currentAttempts);

      setStats({ wins: newWins, gamesPlayed: newPlayed, bestAttempts: newBest });
      try {
        localStorage.setItem("emmy_ng_wins", newWins.toString());
        localStorage.setItem("emmy_ng_played", newPlayed.toString());
        localStorage.setItem("emmy_ng_best", newBest.toString());
      } catch (err) {}

      if (onGameEnd) {
        onGameEnd({ status: "WON", attempts: currentAttempts, maxAttempts, maxRange, secretNumber });
      }
      return;
    }

    if (currentAttempts >= maxAttempts) {
      setGameState("LOST");
      const newPlayed = stats.gamesPlayed + 1;
      setStats((prev) => ({ ...prev, gamesPlayed: newPlayed }));
      try {
        localStorage.setItem("emmy_ng_played", newPlayed.toString());
      } catch (err) {}

      playSound("lose");
      if (onGameEnd) {
        onGameEnd({ status: "LOST", attempts: currentAttempts, maxAttempts, maxRange, secretNumber });
      }
    }
  };

  const attemptsRemaining = maxAttempts - guessHistory.length;

  // Compute narrowing laser scanner bounds
  const lowGuesses = guessHistory.filter((h) => h.result === "LOW").map((h) => h.guess);
  const highGuesses = guessHistory.filter((h) => h.result === "HIGH").map((h) => h.guess);
  const activeMin = lowGuesses.length > 0 ? Math.max(...lowGuesses) + 1 : 1;
  const activeMax = highGuesses.length > 0 ? Math.min(...highGuesses) - 1 : maxRange;

  // Dynamic Emmy companion reaction icon
  const getEmmyEmoji = () => {
    if (gameState === "WON") return "👑";
    if (gameState === "LOST") return "🙈";
    if (feedback?.diffPercent <= 5 && feedback?.type !== "NEUTRAL") return "🔥";
    if (feedback?.type === "HIGH") return "🧊";
    if (feedback?.type === "LOW") return "⚡";
    return "🤔";
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-xl animate-fade-in select-none font-mono">
      {/* FUTURISTIC CYBER ARCADE CARD CONTAINER */}
      <div
        className={`relative w-full max-w-sm rounded-3xl border shadow-[0_0_50px_rgba(56,189,248,0.25)] overflow-hidden flex flex-col transition-all duration-300 ${
          isNight
            ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-cyan-500/40 text-cyan-300"
            : "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-indigo-500/50 text-slate-100"
        }`}
      >
        {gameState === "WON" && <CyberConfetti />}

        {/* TOP STATUS BAR & EMMY COMPANION REACT HEADER */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-base shadow-md shadow-cyan-500/30 shrink-0">
              {getEmmyEmoji()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-outfit font-black text-xs text-white tracking-wide">
                  EMMY CIPHER
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <span className="text-[9px] text-cyan-400/80 uppercase tracking-widest block font-bold">
                CODEBREAKER ARCADE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              type="button"
              className="p-1.5 rounded-lg border border-cyan-500/30 bg-slate-900 text-xs text-cyan-400 hover:border-cyan-400 transition-colors"
              title={isSoundMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isSoundMuted ? "🔇" : "🔊"}
            </button>
            <button
              onClick={() => {
                onClose();
                if (window.scrollY !== 0) window.scrollTo(0, 0);
              }}
              type="button"
              className="p-1.5 rounded-lg border border-rose-500/30 bg-slate-900 text-xs text-rose-400 hover:bg-rose-500/20 transition-all font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* COMPACT SEGMENTED DIFFICULTY SELECTOR */}
        <div className="px-3 py-1.5 border-b border-cyan-500/20 bg-slate-950/60 flex items-center justify-between gap-1 text-[10px]">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {DIFFICULTY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleDifficultyChange(preset)}
                disabled={gameState === "PLAYING" && guessHistory.length > 0}
                type="button"
                className={`px-2 py-0.5 rounded-md font-bold transition-all whitespace-nowrap border ${
                  difficulty === preset.id
                    ? "bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                    : gameState === "PLAYING" && guessHistory.length > 0
                    ? "opacity-30 cursor-not-allowed border-transparent text-slate-500"
                    : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-cyan-300"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-cyan-400/90 shrink-0 font-bold">
            <span>🏆 {stats.wins}</span>
            <span>⚡ {stats.bestAttempts ? `${stats.bestAttempts}t` : "-"}</span>
          </div>
        </div>

        {/* MAIN CYBER CONSOLE BODY */}
        <div className="p-3.5 flex flex-col gap-3">
          {/* DIGITAL READOUT / CODE VAULT DISPLAY BOX */}
          <div className="p-3 rounded-2xl border border-cyan-500/30 bg-slate-950/90 shadow-inner flex flex-col gap-2 relative overflow-hidden">
            {/* Background Scanner Grid Lines */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#0ea5e9_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e9_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />

            <div className="flex items-center justify-between text-[10px] text-cyan-400/70 font-semibold tracking-wider uppercase">
              <span>CIPHER VAULT [{difficulty.toUpperCase()}]</span>
              <span>ATTEMPTS: <strong className="text-cyan-300 text-xs">{attemptsRemaining}/{maxAttempts}</strong></span>
            </div>

            {/* Glowing Digits Readout Display */}
            <div className="flex items-center justify-center py-1">
              <div className="px-5 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/50 text-cyan-300 font-mono font-black text-2xl tracking-[0.25em] shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                {guessInput ? guessInput.padStart(3, "0") : "___"}
              </div>
            </div>

            {/* Laser Target Range Scanner Track */}
            <div className="flex flex-col gap-1 pt-1">
              <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                <span>TARGET ZONE:</span>
                <span className="text-cyan-400">{activeMin} ─── {activeMax}</span>
              </div>
              <div className="relative w-full h-1.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                  style={{
                    left: `${((activeMin - 1) / maxRange) * 100}%`,
                    width: `${((activeMax - activeMin + 1) / maxRange) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* DYNAMIC SYSTEM FEEDBACK STATUS BANNER */}
          {feedback && (
            <div
              className={`px-3 py-1.5 rounded-xl border text-center font-outfit font-black text-xs transition-all shadow-md ${
                feedback.type === "CORRECT"
                  ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-emerald-950/60 animate-bounce"
                  : feedback.type === "HIGH"
                  ? "bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-rose-950/50"
                  : feedback.type === "LOW"
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-cyan-950/50"
                  : feedback.type === "INVALID"
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                  : "bg-slate-900/80 border-slate-800 text-slate-300"
              }`}
            >
              {feedback.text}
            </div>
          )}

          {/* CYBER ON-SCREEN KEYPAD & GUESS CONTROLS */}
          {gameState === "PLAYING" ? (
            <div className="flex flex-col gap-2">
              {/* 3x4 KEYPAD GRID */}
              <div className="grid grid-cols-3 gap-1.5">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLEAR", "0", "⌫"].map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (key === "CLEAR") handleKeypadPress("CLEAR");
                      else if (key === "⌫") handleKeypadPress("BACKSPACE");
                      else handleKeypadPress(key);
                    }}
                    type="button"
                    className={`h-10 rounded-xl font-mono font-black text-sm transition-all border shadow-sm active:scale-95 flex items-center justify-center ${
                      key === "CLEAR"
                        ? "bg-rose-950/60 border-rose-800/80 text-rose-400 hover:bg-rose-900/80 text-xs"
                        : key === "⌫"
                        ? "bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800"
                        : "bg-slate-900/90 border-cyan-500/25 text-cyan-200 hover:bg-cyan-950/50 hover:border-cyan-400 hover:text-white"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              {/* QUICK SCAN & EXECUTE GUESS ROW */}
              <div className="flex items-center gap-1.5 pt-1">
                {[-10, +10].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => {
                      playSound("click");
                      const cur = parseInt(guessInput || "0", 10);
                      const next = Math.max(1, Math.min(maxRange, cur + step));
                      setGuessInput(next.toString());
                    }}
                    className="h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold transition-all active:scale-95"
                  >
                    {step > 0 ? `+${step}` : step}
                  </button>
                ))}

                <button
                  onClick={executeGuess}
                  type="button"
                  disabled={!guessInput.trim()}
                  className={`flex-1 h-10 rounded-xl font-outfit font-black text-xs tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1 ${
                    guessInput.trim()
                      ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-cyan-500/30 hover:brightness-110"
                      : "bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  <span>EXECUTE GUESS</span>
                  <span>🚀</span>
                </button>
              </div>
            </div>
          ) : (
            /* MISSION COMPLETE / GAME OVER OVERLAY */
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/40 text-center shadow-2xl">
              {gameState === "WON" ? (
                <>
                  <div className="text-3xl animate-bounce">🏆 🎉 👑</div>
                  <div className="font-outfit font-black text-base text-emerald-400">
                    CIPHER DECRYPTED!
                  </div>
                  <div className="text-xs text-slate-300">
                    Target was <strong className="text-cyan-300">{secretNumber}</strong>. Unlocked in{" "}
                    <strong className="text-emerald-400">{guessHistory.length}</strong> attempts!
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl">🙈 💥 💀</div>
                  <div className="font-outfit font-black text-base text-rose-400">
                    CIPHER LOCKOUT!
                  </div>
                  <div className="text-xs text-slate-300">
                    Target secret was <span className="font-mono font-bold text-rose-300 text-sm px-1.5 py-0.5 rounded bg-rose-500/20">{secretNumber}</span>
                  </div>
                </>
              )}

              <button
                onClick={() => startNewGame()}
                type="button"
                className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 text-slate-950 font-outfit font-black text-xs tracking-wider shadow-lg active:scale-95 transition-all"
              >
                🎮 REBOOT CIPHER (R)
              </button>
            </div>
          )}

          {/* STREAMING GUESS LOG CHIPS */}
          {guessHistory.length > 0 && (
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 border-t border-cyan-500/10 text-[10px]">
              <span className="text-slate-500 shrink-0 font-bold uppercase">LOG:</span>
              {guessHistory.map((item, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-md font-bold shrink-0 border ${
                    item.result === "CORRECT"
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                      : item.result === "HIGH"
                      ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                      : "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                  }`}
                >
                  #{guessHistory.length - idx}: {item.guess} {item.result === "HIGH" ? "⬇️" : item.result === "LOW" ? "⬆️" : "🎯"}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberGuessModal;
