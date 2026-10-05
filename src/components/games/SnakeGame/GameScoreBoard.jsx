import React from "react";

const GameScoreBoard = ({ score, highScore, level, soundEnabled, onToggleSound, onClose }) => {
  // Format numbers to fixed digits (e.g., 000240)
  const formatNumber = (num, digits = 6) => {
    return String(num).padStart(digits, "0");
  };

  const formatLevel = (num) => {
    return String(num).padStart(2, "0");
  };

  return (
    <div className="w-full px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between gap-2 shrink-0 select-none">
      {/* Title & Badge */}
      <div className="flex items-center gap-2">
        <span className="text-xl sm:text-2xl animate-bounce">🐍</span>
        <div>
          <h2 className="text-base sm:text-lg font-black tracking-wider text-slate-100 font-outfit uppercase flex items-center gap-1.5">
            SNAKE
          </h2>
        </div>
      </div>

      {/* Stats Display */}
      <div className="flex items-center gap-3 sm:gap-5 font-mono text-xs sm:text-sm">
        {/* Score */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-400 uppercase font-sans">
            SCORE
          </span>
          <span className="font-extrabold text-emerald-400 tracking-wider">
            {formatNumber(score)}
          </span>
        </div>

        {/* High Score */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-400 uppercase font-sans">
            HIGH SCORE
          </span>
          <span className="font-extrabold text-amber-400 tracking-wider">
            {formatNumber(highScore)}
          </span>
        </div>

        {/* Level */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-400 uppercase font-sans">
            LEVEL
          </span>
          <span className="font-extrabold text-cyan-400 tracking-wider">
            {formatLevel(level)}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1">
        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? "Mute Sound" : "Enable Sound"}
          aria-label={soundEnabled ? "Mute Sound" : "Enable Sound"}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-sm"
        >
          {soundEnabled ? "🔊" : "🔇"}
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Snake Game"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-transparent transition-all text-sm font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default GameScoreBoard;
