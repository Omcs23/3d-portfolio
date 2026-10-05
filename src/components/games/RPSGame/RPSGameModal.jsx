import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { RockIcon, PaperIcon, ScissorsIcon } from "./RPSIcons";

const CHOICES = [
  { id: "rock", label: "ROCK", icon: "✊", Component: RockIcon, key: "r" },
  { id: "paper", label: "PAPER", icon: "✋", Component: PaperIcon, key: "p" },
  { id: "scissors", label: "SCISSORS", icon: "✌️", Component: ScissorsIcon, key: "s" },
];

// Web Audio API Sound Synthesizer
const playRPSSound = (type, soundEnabled) => {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "select") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === "tick") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "reveal") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "win") {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.07 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.12);
      });
    } else if (type === "loss") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === "draw") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === "streak") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (err) {
    // Ignore audio context policy errors
  }
};

const determineWinner = (player, emmy) => {
  if (player === emmy) return "DRAW";
  if (
    (player === "rock" && emmy === "scissors") ||
    (player === "paper" && emmy === "rock") ||
    (player === "scissors" && emmy === "paper")
  ) {
    return "PLAYER";
  }
  return "EMMY";
};

const RPSGameModal = ({ isOpen, onClose, onGameEnd }) => {
  // Game states: IDLE, COUNTDOWN, REVEAL, RESULT, MATCH_COMPLETE
  const [gameState, setGameState] = useState("IDLE");
  const [playerScore, setPlayerScore] = useState(0);
  const [emmyScore, setEmmyScore] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);

  const [playerChoice, setPlayerChoice] = useState(null);
  const [emmyChoice, setEmmyChoice] = useState(null);
  const [countdownText, setCountdownText] = useState("");
  const [roundResult, setRoundResult] = useState(null); // 'PLAYER' | 'EMMY' | 'DRAW'
  const [matchWinner, setMatchWinner] = useState(null); // 'PLAYER' | 'EMMY'

  // Win Streak & History Chain
  const [roundHistory, setRoundHistory] = useState([]); // array of 'WIN' | 'LOSS' | 'DRAW'
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [totalLosses, setTotalLosses] = useState(0);
  const [totalDraws, setTotalDraws] = useState(0);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const countdownTimerRef = useRef(null);

  // Load persistent stats from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("emmy_rps_stats");
      if (saved) {
        const parsed = JSON.parse(saved);
        setBestStreak(parsed.bestStreak || 0);
        setTotalWins(parsed.totalWins || 0);
        setTotalLosses(parsed.totalLosses || 0);
        setTotalDraws(parsed.totalDraws || 0);
      }
    } catch (e) {
      console.warn("Could not load RPS stats:", e);
    }
  }, []);

  // Update persistent stats
  const saveStats = (newBest, wins, losses, draws) => {
    try {
      localStorage.setItem(
        "emmy_rps_stats",
        JSON.stringify({
          bestStreak: newBest,
          totalWins: wins,
          totalLosses: losses,
          totalDraws: draws,
        })
      );
    } catch (e) {}
  };

  // Reset entire match
  const handleResetMatch = () => {
    setPlayerScore(0);
    setEmmyScore(0);
    setRoundNumber(1);
    setPlayerChoice(null);
    setEmmyChoice(null);
    setRoundResult(null);
    setMatchWinner(null);
    setGameState("IDLE");
  };

  // Trigger round choice
  const handleSelectChoice = (choiceId) => {
    if (gameState !== "IDLE" && gameState !== "RESULT") return;
    if (matchWinner) return;

    playRPSSound("select", soundEnabled);
    setPlayerChoice(choiceId);
    setEmmyChoice(null);
    setRoundResult(null);
    setGameState("COUNTDOWN");

    // Fast 3-2-1-GO Countdown Sequence
    let count = 3;
    setCountdownText("3");
    playRPSSound("tick", soundEnabled);

    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      if (count === 2) {
        setCountdownText("2");
        playRPSSound("tick", soundEnabled);
      } else if (count === 1) {
        setCountdownText("1");
        playRPSSound("tick", soundEnabled);
      } else if (count === 0) {
        setCountdownText("GO!");
        playRPSSound("reveal", soundEnabled);
        clearInterval(countdownTimerRef.current);

        // Fair random selection for Emmy
        const randomChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)].id;
        setEmmyChoice(randomChoice);

        // Process Round Outcome
        setTimeout(() => {
          processRoundOutcome(choiceId, randomChoice);
        }, 300);
      }
    }, 320);
  };

  // Process outcome after reveal
  const processRoundOutcome = (pChoice, eChoice) => {
    const outcome = determineWinner(pChoice, eChoice);
    setRoundResult(outcome);

    let newStreak = currentStreak;
    let newBest = bestStreak;
    let newWins = totalWins;
    let newLosses = totalLosses;
    let newDraws = totalDraws;

    if (outcome === "PLAYER") {
      const newPScore = playerScore + 1;
      setPlayerScore(newPScore);
      setRoundHistory((prev) => [...prev.slice(-9), "WIN"]);
      newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);

      if (newStreak > bestStreak) {
        newBest = newStreak;
        setBestStreak(newBest);
        playRPSSound("streak", soundEnabled);
      } else {
        playRPSSound("win", soundEnabled);
      }
      newWins += 1;
      setTotalWins(newWins);

      // Check Match Win (Best of 5 -> first to 3 wins)
      if (newPScore >= 3) {
        setMatchWinner("PLAYER");
        setGameState("MATCH_COMPLETE");
        saveStats(newBest, newWins, newLosses, newDraws);
        if (onGameEnd) {
          onGameEnd({
            winner: "PLAYER",
            playerScore: newPScore,
            emmyScore,
            streak: newStreak,
          });
        }
        return;
      }
    } else if (outcome === "EMMY") {
      const newEScore = emmyScore + 1;
      setEmmyScore(newEScore);
      setRoundHistory((prev) => [...prev.slice(-9), "LOSS"]);
      newStreak = 0; // Streak breaks
      setCurrentStreak(0);
      playRPSSound("loss", soundEnabled);
      newLosses += 1;
      setTotalLosses(newLosses);

      // Check Match Loss
      if (newEScore >= 3) {
        setMatchWinner("EMMY");
        setGameState("MATCH_COMPLETE");
        saveStats(newBest, newWins, newLosses, newDraws);
        if (onGameEnd) {
          onGameEnd({
            winner: "EMMY",
            playerScore,
            emmyScore: newEScore,
            streak: 0,
          });
        }
        return;
      }
    } else {
      // DRAW
      setRoundHistory((prev) => [...prev.slice(-9), "DRAW"]);
      playRPSSound("draw", soundEnabled);
      newDraws += 1;
      setTotalDraws(newDraws);
    }

    saveStats(newBest, newWins, newLosses, newDraws);
    setGameState("RESULT");
  };

  // Advance to Next Round
  const handleNextRound = () => {
    if (gameState === "MATCH_COMPLETE") return;
    setRoundNumber((prev) => prev + 1);
    setPlayerChoice(null);
    setEmmyChoice(null);
    setRoundResult(null);
    setGameState("IDLE");
  };

  // Keyboard Shortcuts (R, P, S, Space, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === "escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (key === " " || key === "spacebar") {
        e.preventDefault();
        if (gameState === "RESULT") {
          handleNextRound();
        } else if (gameState === "MATCH_COMPLETE") {
          handleResetMatch();
        }
        return;
      }

      if (gameState === "IDLE" || gameState === "RESULT") {
        if (key === "r") {
          e.preventDefault();
          handleSelectChoice("rock");
        } else if (key === "p") {
          e.preventDefault();
          handleSelectChoice("paper");
        } else if (key === "s") {
          e.preventDefault();
          handleSelectChoice("scissors");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, gameState, handleNextRound, onClose]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Emmy Arcade Rock Paper Scissors Window"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 overflow-y-auto animate-fade-in"
    >
      {/* Standalone Emmy Arcade Window Card */}
      <div className="relative w-full max-w-[420px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center my-auto transition-all duration-300 border-indigo-500/20 select-none">
        
        {/* Header Bar */}
        <div className="w-full px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl animate-pulse">🐒</span>
            <div>
              <div className="text-[9px] font-extrabold tracking-widest text-indigo-400 font-mono uppercase">
                EMMY ARCADE
              </div>
              <h2 className="text-sm sm:text-base font-black tracking-wider text-slate-100 font-outfit uppercase">
                ROCK PAPER SCISSORS
              </h2>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              aria-label={soundEnabled ? "Mute Sound" : "Enable Sound"}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors text-sm"
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
            <button
              onClick={onClose}
              aria-label="Close Game"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/30 border border-transparent transition-all text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scoreboard Bar */}
        <div className="w-full px-5 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
          {/* YOU Score */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-extrabold text-base flex items-center justify-center font-outfit">
              YOU
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                PLAYER
              </span>
              <span className="text-xl font-black font-outfit text-indigo-400 leading-none">
                {String(playerScore).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Match Round Badge */}
          <div className="flex flex-col items-center">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-extrabold font-mono text-slate-300 uppercase tracking-widest">
              BEST OF 5
            </span>
            <span className="text-xs font-bold font-mono text-slate-400 mt-1">
              ROUND {String(roundNumber).padStart(2, "0")} / 05
            </span>
          </div>

          {/* EMMY Score */}
          <div className="flex items-center gap-2.5 flex-row-reverse">
            <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-400 font-extrabold text-base flex items-center justify-center font-outfit">
              EMMY
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                EMMY AI
              </span>
              <span className="text-xl font-black font-outfit text-rose-400 leading-none">
                {String(emmyScore).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Round History & Winning Streak Chain Bar */}
        <div className="w-full px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
          {/* Win Streak Indicator */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-base animate-bounce">🔥</span>
            <span className="font-extrabold font-mono text-amber-400 text-xs tracking-wider">
              {currentStreak} STREAK
            </span>
            {bestStreak > 0 && (
              <span className="text-[10px] text-slate-400 font-mono">
                (BEST {bestStreak})
              </span>
            )}
          </div>

          {/* Round History Chain Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {roundHistory.length === 0 ? (
              <span className="text-[10px] font-mono text-slate-500 italic">
                No rounds played yet
              </span>
            ) : (
              roundHistory.map((res, idx) => (
                <span
                  key={idx}
                  title={`Round ${idx + 1}: ${res}`}
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 shadow-sm ${
                    res === "WIN"
                      ? "bg-emerald-500 text-emerald-950 border border-emerald-300"
                      : res === "LOSS"
                      ? "bg-rose-500 text-rose-950 border border-rose-300"
                      : "bg-slate-500 text-slate-950 border border-slate-300"
                  }`}
                >
                  {res === "WIN" ? "W" : res === "LOSS" ? "L" : "D"}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Central Battle Arena */}
        <div className="relative w-full p-6 flex flex-col items-center justify-center bg-slate-950/70 min-h-[260px]">
          
          {/* Countdown Screen */}
          {gameState === "COUNTDOWN" && (
            <div className="flex flex-col items-center justify-center space-y-2 py-6 animate-pulse">
              <span className="text-6xl font-black text-amber-400 font-outfit tracking-widest drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                {countdownText}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                CHOOSING BATTLE...
              </span>
            </div>
          )}

          {/* Idle / Battle Reveal Screen */}
          {gameState !== "COUNTDOWN" && gameState !== "MATCH_COMPLETE" && (
            <div className="w-full flex items-center justify-around gap-4 my-2">
              
              {/* Player Side Card */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold font-mono text-indigo-400 uppercase">
                  YOU
                </span>
                {playerChoice ? (
                  (() => {
                    const playerObj = CHOICES.find((c) => c.id === playerChoice);
                    const PlayerIconComponent = playerObj?.Component;
                    return (
                      <div className="transform transition-all duration-300 hover:scale-105">
                        <PlayerIconComponent className="w-20 h-20 sm:w-24 sm:h-24" color="indigo" />
                      </div>
                    );
                  })()
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-slate-700/80 flex items-center justify-center text-3xl text-slate-600 bg-slate-900/50">
                    ❓
                  </div>
                )}
              </div>

              {/* VS Divider */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black font-outfit italic text-slate-500">
                  VS
                </span>
              </div>

              {/* Emmy Side Card */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold font-mono text-rose-400 uppercase">
                  EMMY
                </span>
                {emmyChoice ? (
                  (() => {
                    const emmyObj = CHOICES.find((c) => c.id === emmyChoice);
                    const EmmyIconComponent = emmyObj?.Component;
                    return (
                      <div className="transform transition-all duration-300 hover:scale-105">
                        <EmmyIconComponent className="w-20 h-20 sm:w-24 sm:h-24" color="rose" />
                      </div>
                    );
                  })()
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-slate-700/80 flex items-center justify-center text-3xl text-slate-600 bg-slate-900/50">
                    ❓
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Round Result Banner */}
          {gameState === "RESULT" && roundResult && (
            <div className="mt-4 flex flex-col items-center space-y-2 animate-fade-in">
              <span
                className={`text-xl sm:text-2xl font-black font-outfit uppercase tracking-widest ${
                  roundResult === "PLAYER"
                    ? "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                    : roundResult === "EMMY"
                    ? "text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]"
                    : "text-amber-400"
                }`}
              >
                {roundResult === "PLAYER"
                  ? "🎉 YOU WIN THIS ROUND!"
                  : roundResult === "EMMY"
                  ? "🙈 EMMY WINS THIS ROUND!"
                  : "🤝 DRAW ROUND!"}
              </span>
              <button
                onClick={handleNextRound}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              >
                NEXT ROUND → (Space)
              </button>
            </div>
          )}

          {/* Match Complete Modal Overlay */}
          {gameState === "MATCH_COMPLETE" && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 space-y-4 animate-fade-in">
              <span className="text-5xl animate-bounce">🏆</span>
              <div>
                <h3
                  className={`text-2xl sm:text-3xl font-black tracking-wider font-outfit uppercase ${
                    matchWinner === "PLAYER" ? "text-emerald-400" : "text-rose-500"
                  }`}
                >
                  {matchWinner === "PLAYER" ? "MATCH VICTORY!" : "MATCH DEFEAT"}
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {matchWinner === "PLAYER"
                    ? "You outsmarted Emmy in this Best-of-5 Match! 🧠✨"
                    : "Emmy claimed the match victory! 🐒🔥"}
                </p>
              </div>

              {/* Match Final Score */}
              <div className="w-full max-w-[220px] p-3 rounded-2xl bg-slate-900 border border-slate-800 flex justify-around items-center font-mono">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400 font-sans uppercase">
                    YOU
                  </span>
                  <span className="text-xl font-black text-indigo-400">
                    {playerScore}
                  </span>
                </div>
                <span className="text-slate-600 font-bold text-lg">—</span>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400 font-sans uppercase">
                    EMMY
                  </span>
                  <span className="text-xl font-black text-rose-400">
                    {emmyScore}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2.5 w-full max-w-[220px]">
                <button
                  onClick={handleResetMatch}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
                >
                  🔁 PLAY AGAIN
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all"
                >
                  🚪 EXIT TO EMMY
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Choice Selection Control Bar */}
        <div className="w-full px-4 py-3 bg-slate-900 border-t border-slate-800 flex flex-col gap-2 shrink-0">
          <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase text-center font-mono">
            SELECT YOUR MOVE (Or press R / P / S on keyboard):
          </div>

          <div className="grid grid-cols-3 gap-2 w-full">
            {CHOICES.map((choice) => {
              const ChoiceIconComponent = choice.Component;
              const isSelected = playerChoice === choice.id;
              const isDisabled = gameState === "COUNTDOWN" || gameState === "MATCH_COMPLETE";

              return (
                <button
                  key={choice.id}
                  onClick={() => handleSelectChoice(choice.id)}
                  disabled={isDisabled}
                  className={`py-2.5 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 select-none shadow-md ${
                    isSelected
                      ? "bg-indigo-600/30 border-indigo-500 text-white scale-105 shadow-indigo-600/20"
                      : isDisabled
                      ? "bg-slate-950/40 border-slate-800/60 text-slate-600 opacity-50 cursor-not-allowed"
                      : "bg-slate-800/90 hover:bg-indigo-600/20 border-slate-700 hover:border-indigo-500/80 text-slate-200 active:scale-95 cursor-pointer"
                  }`}
                >
                  <ChoiceIconComponent className="w-8 h-8" color={isSelected ? "indigo" : "slate"} />
                  <span className="text-[11px] font-extrabold font-outfit uppercase tracking-wider">
                    {choice.label} ({choice.key.toUpperCase()})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RPSGameModal;
