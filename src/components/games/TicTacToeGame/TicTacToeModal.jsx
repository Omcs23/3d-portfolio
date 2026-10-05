import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

// Sound synthesizer using Web Audio API
const playTicTacToeSound = (type, soundEnabled) => {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "place_x") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "place_o") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "win") {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.15);
      });
    } else if (type === "lose") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
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
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (err) {
    // Ignore audio context errors
  }
};

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

const checkWinner = (board) => {
  for (let combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { winner: "DRAW", combo: null };
  }
  return null;
};

// Emmy AI move calculation (Minimax algorithm with slight human imperfection on random chance)
const getBestMove = (board, aiPlayer, humanPlayer) => {
  // Available moves
  const availableMoves = board
    .map((val, idx) => (val === null ? idx : null))
    .filter((val) => val !== null);

  if (availableMoves.length === 0) return null;

  // 1. Check if AI can win in 1 move
  for (let move of availableMoves) {
    const tempBoard = [...board];
    tempBoard[move] = aiPlayer;
    if (checkWinner(tempBoard)?.winner === aiPlayer) {
      return move;
    }
  }

  // 2. Check if Human can win in 1 move, and block!
  for (let move of availableMoves) {
    const tempBoard = [...board];
    tempBoard[move] = humanPlayer;
    if (checkWinner(tempBoard)?.winner === humanPlayer) {
      return move;
    }
  }

  // 3. Take Center if available
  if (board[4] === null) return 4;

  // 4. Take Corners if available
  const corners = [0, 2, 6, 8].filter((idx) => board[idx] === null);
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // 5. Random available move
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

const TicTacToeModal = ({ isOpen, onClose, onGameEnd }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [playerSymbol, setPlayerSymbol] = useState("X"); // Player is X, Emmy is O
  const emmySymbol = playerSymbol === "X" ? "O" : "X";

  const [gameState, setGameState] = useState("START"); // START, PLAYING, GAMEOVER
  const [gameResult, setGameResult] = useState(null); // { winner: 'X'|'O'|'DRAW', combo: [...] }
  const [stats, setStats] = useState({ playerWins: 0, emmyWins: 0, draws: 0 });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Load stats from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("emmy_tictactoe_stats");
      if (saved) {
        setStats(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load TicTacToe stats:", e);
    }
  }, []);

  // Save stats to localStorage
  const updateStats = (winner) => {
    setStats((prev) => {
      const newStats = { ...prev };
      if (winner === playerSymbol) {
        newStats.playerWins += 1;
      } else if (winner === emmySymbol) {
        newStats.emmyWins += 1;
      } else {
        newStats.draws += 1;
      }
      try {
        localStorage.setItem("emmy_tictactoe_stats", JSON.stringify(newStats));
      } catch (e) {}
      return newStats;
    });
  };

  const handleStartGame = (chosenSymbol = "X") => {
    setPlayerSymbol(chosenSymbol);
    setBoard(Array(9).fill(null));
    setGameResult(null);
    setGameState("PLAYING");
    setIsPlayerTurn(chosenSymbol === "X"); // X always goes first
  };

  const makeMove = useCallback(
    (index, symbol) => {
      setBoard((prev) => {
        if (prev[index] !== null) return prev;
        const newBoard = [...prev];
        newBoard[index] = symbol;

        playTicTacToeSound(symbol === "X" ? "place_x" : "place_o", soundEnabled);

        const result = checkWinner(newBoard);
        if (result) {
          setGameResult(result);
          setGameState("GAMEOVER");
          updateStats(result.winner);

          if (result.winner === playerSymbol) {
            playTicTacToeSound("win", soundEnabled);
          } else if (result.winner === emmySymbol) {
            playTicTacToeSound("lose", soundEnabled);
          } else {
            playTicTacToeSound("draw", soundEnabled);
          }

          if (onGameEnd) {
            onGameEnd({
              winner: result.winner,
              isPlayerWinner: result.winner === playerSymbol,
              isDraw: result.winner === "DRAW",
              playerWins: stats.playerWins + (result.winner === playerSymbol ? 1 : 0),
            });
          }
        } else {
          setIsPlayerTurn(symbol !== playerSymbol);
        }

        return newBoard;
      });
    },
    [playerSymbol, emmySymbol, soundEnabled, stats, onGameEnd]
  );

  // Emmy AI Turn Logic
  useEffect(() => {
    if (gameState !== "PLAYING" || isPlayerTurn) return;

    setIsAiThinking(true);
    const aiTimer = setTimeout(() => {
      const move = getBestMove(board, emmySymbol, playerSymbol);
      if (move !== null && gameState === "PLAYING") {
        makeMove(move, emmySymbol);
      }
      setIsAiThinking(false);
    }, 450);

    return () => clearTimeout(aiTimer);
  }, [gameState, isPlayerTurn, board, emmySymbol, playerSymbol, makeMove]);

  const handleCellClick = (index) => {
    if (!isPlayerTurn || board[index] !== null || gameState !== "PLAYING" || isAiThinking) {
      return;
    }
    makeMove(index, playerSymbol);
  };

  // Keyboard accessibility (Escape to close, Space to restart)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === " " && gameState === "GAMEOVER") {
        e.preventDefault();
        handleStartGame(playerSymbol);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, gameState, playerSymbol, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cross Zero Tic Tac Toe Window"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md transition-opacity duration-300 overflow-y-auto animate-fade-in"
    >
      {/* Standalone Window Card */}
      <div className="relative w-full max-w-[400px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center my-auto transition-all duration-300 border-indigo-500/20">
        
        {/* Header Bar */}
        <div className="w-full px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between gap-2 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl animate-pulse">❌⭕</span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wider text-slate-100 font-outfit uppercase">
                CROSS & ZERO
              </h2>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">
                YOU
              </span>
              <span className="font-extrabold text-indigo-400">
                {stats.playerWins}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">
                EMMY
              </span>
              <span className="font-extrabold text-rose-400">
                {stats.emmyWins}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">
                DRAWS
              </span>
              <span className="font-extrabold text-amber-400">
                {stats.draws}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              aria-label={soundEnabled ? "Mute Sound" : "Enable Sound"}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-sm"
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
            <button
              onClick={onClose}
              aria-label="Close Game"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-all text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Turn Status Banner */}
        <div className="w-full py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-center gap-2 text-xs font-bold text-slate-300">
          {gameState === "PLAYING" && (
            <>
              {isPlayerTurn ? (
                <span className="text-indigo-400 flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  Your Turn ({playerSymbol})
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  Emmy is thinking... 🐒
                </span>
              )}
            </>
          )}
          {gameState === "START" && <span className="text-slate-400">Choose your symbol to start!</span>}
          {gameState === "GAMEOVER" && <span className="text-slate-400">Match Completed</span>}
        </div>

        {/* Game Board Container */}
        <div className="relative w-full p-5 flex flex-col items-center justify-center bg-slate-950/60">
          {/* 3x3 Grid Board */}
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-[300px] aspect-square">
            {board.map((cell, idx) => {
              const isWinningCell = gameResult?.combo?.includes(idx);

              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  disabled={!isPlayerTurn || cell !== null || gameState !== "PLAYING" || isAiThinking}
                  className={`relative aspect-square rounded-2xl border text-3xl sm:text-4xl font-black font-outfit flex items-center justify-center transition-all duration-200 select-none shadow-lg ${
                    isWinningCell
                      ? "bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border-emerald-400 text-emerald-300 scale-105 shadow-emerald-500/20"
                      : cell === "X"
                      ? "bg-slate-800/90 border-indigo-500/40 text-indigo-400 shadow-indigo-950/40"
                      : cell === "O"
                      ? "bg-slate-800/90 border-rose-500/40 text-rose-400 shadow-rose-950/40"
                      : "bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-transparent hover:border-slate-500 active:scale-95 cursor-pointer"
                  }`}
                >
                  {cell}
                </button>
              );
            })}
          </div>

          {/* 1. START OVERLAY */}
          {gameState === "START" && (
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20 space-y-4">
              <span className="text-5xl animate-bounce">❌⭕</span>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-100 tracking-wider font-outfit uppercase">
                  CROSS & ZERO
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Play against Emmy the AI Guide!
                </p>
              </div>

              {/* Symbol Choice */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleStartGame("X")}
                  className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm border border-indigo-400 active:scale-95 transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <span>Play as ❌</span>
                </button>
                <button
                  onClick={() => handleStartGame("O")}
                  className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm border border-rose-400 active:scale-95 transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
                >
                  <span>Play as ⭕</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. GAME OVER OVERLAY */}
          {gameState === "GAMEOVER" && (
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20 space-y-4">
              <div>
                {gameResult?.winner === playerSymbol ? (
                  <>
                    <h3 className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-wider font-outfit uppercase animate-bounce">
                      🎉 YOU WON!
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 font-medium">
                      You outsmarted Emmy this round! 🧠✨
                    </p>
                  </>
                ) : gameResult?.winner === emmySymbol ? (
                  <>
                    <h3 className="text-2xl sm:text-3xl font-black text-rose-500 tracking-wider font-outfit uppercase">
                      🙈 EMMY WINS!
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 font-medium">
                      Emmy takes this round! 🐒🔥
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wider font-outfit uppercase">
                      🤝 IT'S A DRAW!
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 font-medium">
                      Great minds think alike! 😄
                    </p>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 w-full max-w-[200px]">
                <button
                  onClick={() => handleStartGame(playerSymbol)}
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
      </div>
    </div>,
    document.body
  );
};

export default TicTacToeModal;
