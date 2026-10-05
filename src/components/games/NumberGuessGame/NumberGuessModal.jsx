import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../context/ThemeContext";

// Simple Web Audio API Synthesizer for Retro Game Sound FX
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
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "high") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "low") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "win") {
      // Arpeggio victory chord
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        const startTime = now + idx * 0.08;
        o.type = "square";
        o.frequency.setValueAtTime(freq, startTime);
        g.gain.setValueAtTime(0.15, startTime);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
        o.start(startTime);
        o.stop(startTime + 0.2);
      });
    } else if (type === "lose") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (err) {
    // Audio context may be blocked by browser policy until interaction
  }
};

const DIFFICULTY_PRESETS = [
  { id: "easy", label: "Easy (1–50)", max: 50, attempts: 6 },
  { id: "medium", label: "Medium (1–100)", max: 100, attempts: 7 },
  { id: "hard", label: "Hard (1–200)", max: 200, attempts: 8 },
  { id: "expert", label: "Expert (1–500)", max: 500, attempts: 10 },
];

const NumberGuessModal = ({ isOpen, onClose, onGameEnd }) => {
  const { isNight } = useTheme();

  const [difficulty, setDifficulty] = useState("medium");
  const [maxRange, setMaxRange] = useState(100);
  const [maxAttempts, setMaxAttempts] = useState(7);
  const [secretNumber, setSecretNumber] = useState(null);
  const [guessInput, setGuessInput] = useState("");
  const [guessHistory, setGuessHistory] = useState([]);
  const [gameState, setGameState] = useState("PLAYING"); // "PLAYING", "WON", "LOST"
  const [feedback, setFeedback] = useState(null); // { type: "HIGH"|"LOW"|"CORRECT"|"INVALID", text: "", diffPercent: 0 }
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [stats, setStats] = useState({
    wins: 0,
    gamesPlayed: 0,
    bestAttempts: null,
  });

  const inputRef = useRef(null);

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
      console.log("LocalStorage stats read error", e);
    }
  }, []);

  // Initialize a new game round
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
      text: `I've picked a number between 1 and ${preset.max}. Can you guess it in ${preset.attempts} tries? 🤔`,
    });

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Start game when modal opens
  useEffect(() => {
    if (isOpen) {
      startNewGame();
    }
  }, [isOpen]);

  // Handle keyboard shortcuts (Enter to submit, Escape to close, R to restart)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
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
        text: `⚠️ Please enter a valid number between 1 and ${maxRange}!`,
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

    // Check Out of Attempts Loss
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

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all duration-300 transform scale-100 ${
          isNight
            ? "bg-slate-900/95 border-indigo-500/40 text-slate-100 shadow-indigo-950/80"
            : "bg-white/95 border-blue-300 text-slate-800 shadow-2xl"
        }`}
      >
        {/* MODAL HEADER */}
        <div
          className={`px-4 sm:px-6 py-3.5 flex items-center justify-between border-b ${
            isNight
              ? "bg-slate-950/80 border-slate-800"
              : "bg-slate-100/90 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/30">
              🔢
            </div>
            <div>
              <h2 className="font-outfit font-extrabold text-sm sm:text-base leading-tight flex items-center gap-1.5">
                <span>🐒 Emmy Arcade</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Number Guess
                </span>
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
                Guess Emmy's secret number!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Mute Toggle */}
            <button
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              type="button"
              title={isSoundMuted ? "Unmute Audio" : "Mute Audio"}
              className={`p-2 rounded-xl text-xs transition-colors border ${
                isNight
                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              {isSoundMuted ? "🔇" : "🔊"}
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              type="button"
              className={`p-2 rounded-xl text-sm font-bold transition-all border ${
                isNight
                  ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700"
                  : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              ✕
            </button>
          </div>
        </div>

        {/* DIFFICULTY & STATS BAR */}
        <div
          className={`px-4 sm:px-6 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 text-xs font-outfit ${
            isNight ? "bg-slate-900/60 border-slate-800" : "bg-slate-50/80 border-slate-200"
          }`}
        >
          {/* Difficulty Preset Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {DIFFICULTY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleDifficultyChange(preset)}
                disabled={gameState === "PLAYING" && guessHistory.length > 0}
                type="button"
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap border ${
                  difficulty === preset.id
                    ? isNight
                      ? "bg-indigo-600 text-white border-indigo-400 shadow-sm"
                      : "bg-blue-600 text-white border-blue-400 shadow-sm"
                    : gameState === "PLAYING" && guessHistory.length > 0
                    ? "opacity-40 cursor-not-allowed border-transparent text-slate-500"
                    : isNight
                    ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Stats Badge */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 shrink-0">
            <span>
              🏆 Wins: <strong className="text-emerald-400">{stats.wins}</strong>
            </span>
            <span>•</span>
            <span>
              ⚡ Best:{" "}
              <strong className="text-cyan-400">
                {stats.bestAttempts ? `${stats.bestAttempts} tries` : "-"}
              </strong>
            </span>
          </div>
        </div>

        {/* MAIN GAME BODY */}
        <div className="p-4 sm:p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* ATTEMPTS REMAINING DOTS */}
          <div className="flex items-center justify-between bg-slate-950/40 border border-slate-800/80 rounded-2xl p-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-outfit uppercase tracking-wider text-slate-400">
                Attempts Left:
              </span>
              <span className="text-base font-extrabold font-mono text-cyan-400">
                {attemptsRemaining} / {maxAttempts}
              </span>
            </div>

            {/* Heart / Dot indicators */}
            <div className="flex items-center gap-1">
              {Array.from({ length: maxAttempts }).map((_, idx) => {
                const isUsed = idx >= attemptsRemaining;
                return (
                  <span
                    key={idx}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      isUsed
                        ? "bg-slate-700 scale-75 opacity-40"
                        : idx === attemptsRemaining - 1
                        ? "bg-cyan-400 animate-pulse scale-110 shadow-sm shadow-cyan-400"
                        : "bg-indigo-500"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* FEEDBACK STATUS CARD */}
          {feedback && (
            <div
              className={`p-3.5 sm:p-4 rounded-2xl border text-center font-outfit font-bold text-xs sm:text-sm leading-relaxed transition-all duration-300 ${
                feedback.type === "CORRECT"
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-950/50 animate-bounce"
                  : feedback.type === "HIGH"
                  ? "bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-md shadow-rose-950/30"
                  : feedback.type === "LOW"
                  ? "bg-sky-500/15 border-sky-500/40 text-sky-300 shadow-md shadow-sky-950/30"
                  : feedback.type === "INVALID"
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                  : isNight
                  ? "bg-slate-800/60 border-slate-700 text-slate-300"
                  : "bg-slate-100 border-slate-200 text-slate-700"
              }`}
            >
              {feedback.text}
            </div>
          )}

          {/* INPUT FORM OR WIN/LOSS ACTIONS */}
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
                  placeholder={`Enter 1 – ${maxRange}...`}
                  className={`flex-1 px-4 py-3 rounded-2xl text-lg sm:text-xl font-bold font-mono text-center border outline-none transition-all ${
                    isNight
                      ? "bg-slate-950/90 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                      : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />

                <button
                  type="submit"
                  disabled={!guessInput.trim()}
                  className={`px-5 py-3 rounded-2xl font-outfit font-extrabold text-sm sm:text-base transition-all shadow-lg active:scale-95 whitespace-nowrap ${
                    guessInput.trim()
                      ? isNight
                        ? "bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-indigo-950/50"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/30"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed shadow-none"
                  }`}
                >
                  GUESS 🚀
                </button>
              </div>

              {/* QUICK NUMERICAL CONTROLS */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <span>Quick adjust:</span>
                {[-10, -1, +1, +10].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => {
                      const cur = parseInt(guessInput || "0", 10);
                      const next = Math.max(1, Math.min(maxRange, cur + step));
                      setGuessInput(next.toString());
                    }}
                    className={`px-2.5 py-1 rounded-xl font-mono font-bold border transition-colors ${
                      isNight
                        ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                        : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {step > 0 ? `+${step}` : step}
                  </button>
                ))}
              </div>
            </form>
          ) : (
            /* GAME OVER / VICTORY OVERLAY CARD */
            <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              {gameState === "WON" ? (
                <>
                  <div className="text-3xl animate-bounce">🏆 🎉 🧠</div>
                  <h3 className="font-outfit font-extrabold text-lg text-emerald-400">
                    MASTERMIND! YOU WON!
                  </h3>
                  <p className="text-xs text-slate-300">
                    You guessed Emmy's secret number <strong>{secretNumber}</strong> in{" "}
                    <strong className="text-emerald-400">{guessHistory.length}</strong>{" "}
                    tries!
                  </p>
                </>
              ) : (
                <>
                  <div className="text-3xl">🙈 💥 💀</div>
                  <h3 className="font-outfit font-extrabold text-lg text-rose-400">
                    OUT OF ATTEMPTS!
                  </h3>
                  <p className="text-xs text-slate-300">
                    Emmy's secret number was{" "}
                    <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 font-mono font-bold text-sm">
                      {secretNumber}
                    </span>
                  </p>
                </>
              )}

              <button
                onClick={() => startNewGame()}
                type="button"
                className="mt-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-outfit font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-950/50 active:scale-95 transition-all"
              >
                🔄 PLAY AGAIN (Space / R)
              </button>
            </div>
          )}

          {/* GUESS HISTORY CHIPS LIST */}
          {guessHistory.length > 0 && (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold font-outfit uppercase tracking-wider text-slate-400">
                Guess History:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 max-h-32 overflow-y-auto custom-scrollbar p-1">
                {guessHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 transition-all ${
                      item.result === "CORRECT"
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : item.result === "HIGH"
                        ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                        : "bg-sky-500/15 border-sky-500/30 text-sky-300"
                    }`}
                  >
                    <span>#{idx + 1}:</span>
                    <span className="text-white">{item.guess}</span>
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
