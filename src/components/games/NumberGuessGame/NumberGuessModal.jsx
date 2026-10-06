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
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.03);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === "high") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "low") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "win") {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        const startTime = now + idx * 0.06;
        o.type = "sine";
        o.frequency.setValueAtTime(freq, startTime);
        g.gain.setValueAtTime(0.12, startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);
        o.start(startTime);
        o.stop(startTime + 0.18);
      });
    } else if (type === "lose") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (err) {}
};

const DIFFICULTY_PRESETS = [
  { id: "easy", label: "Easy (1–50)", max: 50, attempts: 6 },
  { id: "medium", label: "Medium (1–100)", max: 100, attempts: 7 },
  { id: "hard", label: "Hard (1–200)", max: 200, attempts: 8 },
  { id: "expert", label: "Expert (1–500)", max: 500, attempts: 10 },
];

// Minimal Confetti Particles Canvas
const MinimalConfetti = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const width = (canvas.width = canvas.offsetWidth || 360);
    const height = (canvas.height = canvas.offsetHeight || 260);

    const colors = ["#38bdf8", "#818cf8", "#34d399", "#fbbf24", "#f43f5e"];
    const particles = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      r: Math.random() * 4 + 2,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 2.5 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />;
};

const NumberGuessModal = ({ isOpen, onClose, onGameEnd }) => {
  const { isNight } = useTheme();

  const [difficulty, setDifficulty] = useState("medium");
  const [maxRange, setMaxRange] = useState(100);
  const [maxAttempts, setMaxAttempts] = useState(7);
  const [secretNumber, setSecretNumber] = useState(null);
  const [guessInput, setGuessInput] = useState("");
  const [guessHistory, setGuessHistory] = useState([]);
  const [gameState, setGameState] = useState("PLAYING");
  const [feedback, setFeedback] = useState(null);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [stats, setStats] = useState({ wins: 0, gamesPlayed: 0, bestAttempts: null });

  const inputRef = useRef(null);

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
      text: `Guess Emmy's secret number (1–${preset.max}) in ${preset.attempts} tries! 🤔`,
    });

    setTimeout(() => inputRef.current?.focus(), 80);
  };

  useEffect(() => {
    if (isOpen) startNewGame();
  }, [isOpen]);

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
    if (!isSoundMuted) playSoundEffect(type);
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
      setFeedback({ type: "INVALID", text: `⚠️ Enter a number between 1 and ${maxRange}!` });
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
      feedbackMsg = `🎉 BINGO! ${num} is correct!`;
      tempSound = "win";
    } else if (num > secretNumber) {
      resultType = "HIGH";
      tempSound = "high";
      feedbackMsg = diffPercent <= 5 ? `🔥 ${num} is TOO HIGH (Close!)` : `⬇️ ${num} is TOO HIGH`;
    } else {
      resultType = "LOW";
      tempSound = "low";
      feedbackMsg = diffPercent <= 5 ? `🔥 ${num} is TOO LOW (Close!)` : `⬆️ ${num} is TOO LOW`;
    }

    const newHistory = [...guessHistory, { guess: num, result: resultType, diffPercent }];
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
    } else {
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  };

  const attemptsRemaining = maxAttempts - guessHistory.length;
  const attemptsProgress = Math.max(0, (attemptsRemaining / maxAttempts) * 100);

  const lowGuesses = guessHistory.filter((h) => h.result === "LOW").map((h) => h.guess);
  const highGuesses = guessHistory.filter((h) => h.result === "HIGH").map((h) => h.guess);
  const activeMin = lowGuesses.length > 0 ? Math.max(...lowGuesses) + 1 : 1;
  const activeMax = highGuesses.length > 0 ? Math.min(...highGuesses) - 1 : maxRange;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-slate-950/75 backdrop-blur-md animate-fade-in select-none">
      {/* MINIMAL COMPACT CARD */}
      <div
        className={`relative w-full max-w-sm rounded-2xl border shadow-xl overflow-hidden flex flex-col transition-all ${
          isNight
            ? "bg-slate-900/95 border-slate-800 text-slate-100 shadow-slate-950/80"
            : "bg-white border-slate-200 text-slate-800 shadow-lg"
        }`}
      >
        {gameState === "WON" && <MinimalConfetti />}

        {/* COMPACT MINIMAL HEADER */}
        <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="text-base">🔢</span>
            <span className="font-outfit font-bold text-xs tracking-wide">Number Guess</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-semibold">
              Arcade
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              type="button"
              className="p-1 rounded-lg text-xs opacity-70 hover:opacity-100 transition-opacity"
              title={isSoundMuted ? "Unmute" : "Mute"}
            >
              {isSoundMuted ? "🔇" : "🔊"}
            </button>
            <button
              onClick={() => {
                onClose();
                if (window.scrollY !== 0) window.scrollTo(0, 0);
              }}
              type="button"
              className="p-1 rounded-lg text-xs font-bold opacity-60 hover:opacity-100 hover:text-rose-400 transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* MINIMAL TABS & STATS ROW */}
        <div className="px-3 py-2 flex items-center justify-between gap-1.5 text-[11px] border-b border-slate-800/40 bg-slate-900/40">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {DIFFICULTY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleDifficultyChange(preset)}
                disabled={gameState === "PLAYING" && guessHistory.length > 0}
                type="button"
                className={`px-2 py-0.5 rounded-md font-medium text-[10px] transition-all whitespace-nowrap ${
                  difficulty === preset.id
                    ? "bg-indigo-600 text-white font-bold"
                    : gameState === "PLAYING" && guessHistory.length > 0
                    ? "opacity-30 cursor-not-allowed text-slate-500"
                    : "bg-slate-800/60 text-slate-400 hover:text-white"
                }`}
              >
                {preset.label.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 shrink-0">
            <span>🏆 {stats.wins}</span>
            <span>•</span>
            <span>⚡ {stats.bestAttempts ? `${stats.bestAttempts}t` : "-"}</span>
          </div>
        </div>

        {/* COMPACT MAIN CONTENT */}
        <div className="p-3.5 flex flex-col gap-3">
          {/* ATTEMPTS & THIN HEALTH LINE */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Tries Left: <strong className="text-cyan-400 font-bold">{attemptsRemaining}/{maxAttempts}</strong></span>
              {/* Minimal dots */}
              <div className="flex items-center gap-1">
                {Array.from({ length: maxAttempts }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full ${
                      idx >= attemptsRemaining
                        ? "bg-slate-700/40"
                        : idx === attemptsRemaining - 1
                        ? "bg-cyan-400 animate-pulse"
                        : "bg-indigo-500"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  attemptsProgress > 50 ? "bg-emerald-400" : attemptsProgress > 25 ? "bg-amber-400" : "bg-rose-500"
                }`}
                style={{ width: `${attemptsProgress}%` }}
              />
            </div>
          </div>

          {/* MINIMAL RANGE TRACKER */}
          {guessHistory.length > 0 && gameState === "PLAYING" && (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Range hint:</span>
                <span className="text-cyan-400 font-semibold">{activeMin} – {activeMax}</span>
              </div>
              <div className="relative w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="absolute h-full bg-indigo-500/40 rounded-full"
                  style={{
                    left: `${((activeMin - 1) / maxRange) * 100}%`,
                    width: `${((activeMax - activeMin + 1) / maxRange) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* COMPACT FEEDBACK BADGE */}
          {feedback && (
            <div
              className={`px-3 py-1.5 rounded-lg text-center font-outfit font-semibold text-xs transition-all ${
                feedback.type === "CORRECT"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : feedback.type === "HIGH"
                  ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                  : feedback.type === "LOW"
                  ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                  : feedback.type === "INVALID"
                  ? "bg-amber-500/20 text-amber-300"
                  : "bg-slate-800/50 text-slate-300"
              }`}
            >
              {feedback.text}
            </div>
          )}

          {/* INPUT & ACTION ROW */}
          {gameState === "PLAYING" ? (
            <form onSubmit={handleGuessSubmit} className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
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
                  placeholder={`1–${maxRange}...`}
                  className={`flex-1 h-9 px-3 rounded-lg text-sm font-bold font-mono border outline-none transition-all ${
                    isNight
                      ? "bg-slate-950 border-slate-700/70 text-white placeholder-slate-600 focus:border-indigo-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
                  }`}
                />

                <button
                  type="submit"
                  disabled={!guessInput.trim()}
                  className={`h-9 px-4 rounded-lg font-outfit font-bold text-xs transition-all whitespace-nowrap ${
                    guessInput.trim()
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  GUESS 🚀
                </button>
              </div>

              {/* MINIMAL QUICK STEP BUTTONS */}
              <div className="flex items-center justify-center gap-1">
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
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800/70 hover:bg-slate-700 border border-slate-700/50 text-slate-300 transition-colors"
                  >
                    {step > 0 ? `+${step}` : step}
                  </button>
                ))}
              </div>
            </form>
          ) : (
            /* MINIMAL GAME OVER CARD */
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              {gameState === "WON" ? (
                <>
                  <div className="text-xl">🏆 🎉</div>
                  <div className="font-bold text-xs text-emerald-400">YOU WON!</div>
                  <div className="text-[11px] text-slate-300">
                    Guessed <strong>{secretNumber}</strong> in <strong>{guessHistory.length}</strong> tries!
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xl">🙈 💀</div>
                  <div className="font-bold text-xs text-rose-400">GAME OVER</div>
                  <div className="text-[11px] text-slate-300">
                    Secret number was <span className="font-mono font-bold text-rose-300">{secretNumber}</span>
                  </div>
                </>
              )}

              <button
                onClick={() => startNewGame()}
                type="button"
                className="mt-1 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all"
              >
                PLAY AGAIN
              </button>
            </div>
          )}

          {/* MINIMAL HISTORY CHIPS */}
          {guessHistory.length > 0 && (
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1 border-t border-slate-800/40 text-[10px] font-mono">
              <span className="text-slate-500 shrink-0">Log:</span>
              {guessHistory.map((item, idx) => (
                <span
                  key={idx}
                  className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                    item.result === "CORRECT"
                      ? "bg-emerald-500/20 text-emerald-300 font-bold"
                      : item.result === "HIGH"
                      ? "bg-rose-500/15 text-rose-300"
                      : "bg-sky-500/15 text-sky-300"
                  }`}
                >
                  #{idx + 1}:{item.guess}{item.result === "HIGH" ? "↓" : item.result === "LOW" ? "↑" : "✓"}
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
