import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import GameScoreBoard from "./GameScoreBoard";
import SnakeCanvas, { GRID_SIZE } from "./SnakeCanvas";
import GameControls from "./GameControls";

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
const INITIAL_DIR = { x: 1, y: 0 }; // Moving Right

const generateRandomFood = (snake) => {
  let newFood;
  while (!newFood || snake.some((seg) => seg.x === newFood.x && seg.y === newFood.y)) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }
  return newFood;
};

// Web Audio API Sound Synthesizer (No external mp3 assets needed)
const playSynthesizedSound = (type, soundEnabled) => {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "eat") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === "gameover") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === "levelup") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (err) {
    // Audio context may be restricted by browser policy before user interaction
  }
};

const SnakeGameModal = ({ isOpen, onClose, onGameEnd }) => {
  const [gameState, setGameState] = useState("START"); // START, PLAYING, PAUSED, GAMEOVER
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIR);
  const [food, setFood] = useState(() => generateRandomFood(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const lastProcessedDirRef = useRef(INITIAL_DIR);
  const nextDirRef = useRef(INITIAL_DIR);
  const gameLoopTimerRef = useRef(null);

  // Load High Score from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("emmy_snake_high_score");
      if (saved) {
        setHighScore(parseInt(saved, 10) || 0);
      }
    } catch (e) {
      console.warn("Could not load high score from localStorage:", e);
    }
  }, []);

  // Update direction with reversal prevention
  const changeDirection = useCallback((newDir) => {
    const currentDir = lastProcessedDirRef.current;
    // Prevent 180 degree reverse turn
    if (newDir.x !== 0 && currentDir.x === -newDir.x) return;
    if (newDir.y !== 0 && currentDir.y === -newDir.y) return;
    nextDirRef.current = newDir;
  }, []);

  // Reset & Start Game
  const handleStartGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIR);
    lastProcessedDirRef.current = INITIAL_DIR;
    nextDirRef.current = INITIAL_DIR;
    setFood(generateRandomFood(INITIAL_SNAKE));
    setScore(0);
    setLevel(1);
    setIsNewRecord(false);
    setGameState("PLAYING");
  };

  // Pause / Resume Toggle
  const handleTogglePause = useCallback(() => {
    if (gameState === "PLAYING") {
      setGameState("PAUSED");
    } else if (gameState === "PAUSED") {
      setGameState("PLAYING");
    }
  }, [gameState]);

  // Main Game Tick Step
  const gameStep = useCallback(() => {
    setSnake((prevSnake) => {
      const currentDir = nextDirRef.current;
      lastProcessedDirRef.current = currentDir;
      setDirection(currentDir);

      const head = prevSnake[0];
      const newHead = {
        x: head.x + currentDir.x,
        y: head.y + currentDir.y,
      };

      // 1. Wall Collision Check
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        handleGameOver(score, highScore);
        return prevSnake;
      }

      // 2. Self Collision Check
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameOver(score, highScore);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // 3. Food Collision Check
      if (newHead.x === food.x && newHead.y === food.y) {
        playSynthesizedSound("eat", soundEnabled);

        const newScore = score + 10;
        setScore(newScore);

        const newLevel = Math.floor(newScore / 40) + 1;
        if (newLevel > level) {
          setLevel(newLevel);
          playSynthesizedSound("levelup", soundEnabled);
        }

        // Update High Score if beaten
        if (newScore > highScore) {
          setHighScore(newScore);
          setIsNewRecord(true);
          try {
            localStorage.setItem("emmy_snake_high_score", String(newScore));
          } catch (e) {
            // localStorage fallback ignore
          }
        }

        // Spawn new food
        setFood(generateRandomFood(newSnake));
      } else {
        // Remove tail
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, score, highScore, level, soundEnabled]);

  // Game Over Handler
  const handleGameOver = (finalScore, currentHighScore) => {
    setGameState("GAMEOVER");
    playSynthesizedSound("gameover", soundEnabled);

    const isRecord = finalScore > currentHighScore;

    if (onGameEnd) {
      onGameEnd({
        score: finalScore,
        highScore: Math.max(finalScore, currentHighScore),
        level,
        isNewHighScore: isRecord,
      });
    }
  };

  // Game Loop Interval Timer
  useEffect(() => {
    if (gameState !== "PLAYING") {
      if (gameLoopTimerRef.current) {
        clearInterval(gameLoopTimerRef.current);
      }
      return;
    }

    // Speed increases with level: Level 1 = 140ms, Level 10 = 50ms
    const speed = Math.max(50, 140 - (level - 1) * 9);

    gameLoopTimerRef.current = setInterval(() => {
      gameStep();
    }, speed);

    return () => {
      if (gameLoopTimerRef.current) {
        clearInterval(gameLoopTimerRef.current);
      }
    };
  }, [gameState, level, gameStep]);

  // Keyboard Event Listeners (Arrow keys, WASD, Space, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Don't intercept if user is typing inside an input or textarea
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return;
      }

      const key = e.key;

      if (key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (key === " " || key === "Spacebar") {
        e.preventDefault();
        if (gameState === "PLAYING" || gameState === "PAUSED") {
          handleTogglePause();
        }
        return;
      }

      if (gameState !== "PLAYING") return;

      if (key === "ArrowUp" || key === "w" || key === "W") {
        e.preventDefault();
        changeDirection({ x: 0, y: -1 });
      } else if (key === "ArrowDown" || key === "s" || key === "S") {
        e.preventDefault();
        changeDirection({ x: 0, y: 1 });
      } else if (key === "ArrowLeft" || key === "a" || key === "A") {
        e.preventDefault();
        changeDirection({ x: -1, y: 0 });
      } else if (key === "ArrowRight" || key === "d" || key === "D") {
        e.preventDefault();
        changeDirection({ x: 1, y: 0 });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, gameState, changeDirection, handleTogglePause, onClose]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (gameLoopTimerRef.current) {
        clearInterval(gameLoopTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Snake Game Window"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md transition-opacity duration-300 overflow-y-auto animate-fade-in"
    >
      {/* Standalone Game Window Card */}
      <div className="relative w-full max-w-[420px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center my-auto transition-all duration-300 border-indigo-500/20">
        
        {/* Header Bar */}
        <GameScoreBoard
          score={score}
          highScore={highScore}
          level={level}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          onClose={onClose}
        />

        {/* Main Canvas & Screen Overlays Container */}
        <div className="relative w-full p-4 flex flex-col items-center justify-center bg-slate-950/60">
          <SnakeCanvas
            snake={snake}
            food={food}
            direction={direction}
            isGameOver={gameState === "GAMEOVER"}
          />

          {/* 1. START SCREEN OVERLAY */}
          {gameState === "START" && (
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20 space-y-4">
              <span className="text-5xl animate-bounce">🐍</span>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-100 tracking-wider font-outfit uppercase">
                  READY TO PLAY?
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Use Arrow Keys or WASD to move
                </p>
              </div>
              <button
                onClick={handleStartGame}
                className="w-full max-w-[200px] py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
              >
                🎮 START GAME
              </button>
            </div>
          )}

          {/* 2. PAUSE SCREEN OVERLAY */}
          {gameState === "PAUSED" && (
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20 space-y-4">
              <h3 className="text-2xl font-black text-amber-400 tracking-widest font-outfit uppercase">
                PAUSED
              </h3>
              <div className="flex flex-col gap-2.5 w-full max-w-[200px]">
                <button
                  onClick={handleTogglePause}
                  className="w-full py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md"
                >
                  ▶ RESUME
                </button>
                <button
                  onClick={handleStartGame}
                  className="w-full py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all"
                >
                  🔄 RESTART
                </button>
              </div>
            </div>
          )}

          {/* 3. GAME OVER SCREEN OVERLAY */}
          {gameState === "GAMEOVER" && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20 space-y-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-rose-500 tracking-widest font-outfit uppercase">
                  GAME OVER
                </h3>
                {isNewRecord && (
                  <span className="inline-block mt-1 px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[11px] rounded-full animate-pulse">
                    🏆 NEW HIGH SCORE!
                  </span>
                )}
              </div>

              {/* Score Breakdown Box */}
              <div className="w-full max-w-[220px] p-3 rounded-2xl bg-slate-900 border border-slate-800 flex justify-around items-center font-mono">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400 font-sans uppercase">
                    Final Score
                  </span>
                  <span className="text-lg font-black text-slate-100">
                    {score}
                  </span>
                </div>
                <div className="w-[1px] h-8 bg-slate-800" />
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-400 font-sans uppercase">
                    High Score
                  </span>
                  <span className="text-lg font-black text-amber-400">
                    {highScore}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 w-full max-w-[200px]">
                <button
                  onClick={handleStartGame}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 active:scale-95 transition-all"
                >
                  🔁 PLAY AGAIN
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all"
                >
                  🚪 EXIT GAME
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Touch Controls */}
        <GameControls
          onDirectionChange={changeDirection}
          isPaused={gameState === "PAUSED"}
          isGameOver={gameState === "GAMEOVER"}
          isStartScreen={gameState === "START"}
          onTogglePause={handleTogglePause}
        />
      </div>
    </div>,
    document.body
  );
};

export default SnakeGameModal;
