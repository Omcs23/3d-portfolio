import React from "react";

const GameControls = ({ onDirectionChange, isPaused, isGameOver, isStartScreen, onTogglePause }) => {
  const handleTouch = (dir) => (e) => {
    if (e.cancelable) e.preventDefault();
    if (!isPaused && !isGameOver && !isStartScreen) {
      onDirectionChange(dir);
    }
  };

  return (
    <div className="w-full flex items-center justify-between px-4 py-2 bg-slate-900/90 border-t border-slate-800/80 shrink-0 select-none">
      {/* Pause / Resume Button on Mobile */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePause}
          disabled={isGameOver || isStartScreen}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
            isPaused
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
              : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
          } ${isGameOver || isStartScreen ? "opacity-40 cursor-not-allowed" : "active:scale-95"}`}
        >
          {isPaused ? "▶ RESUME" : "⏸ PAUSE"}
        </button>
      </div>

      {/* D-Pad Layout */}
      <div className="flex flex-col items-center gap-1 my-1">
        {/* Up Button */}
        <button
          onTouchStart={handleTouch({ x: 0, y: -1 })}
          onClick={() => onDirectionChange({ x: 0, y: -1 })}
          aria-label="Move Up"
          className="w-11 h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-lg flex items-center justify-center shadow-md active:bg-indigo-600 active:scale-95 transition-all touch-none select-none"
        >
          ↑
        </button>

        <div className="flex items-center gap-2">
          {/* Left Button */}
          <button
            onTouchStart={handleTouch({ x: -1, y: 0 })}
            onClick={() => onDirectionChange({ x: -1, y: 0 })}
            aria-label="Move Left"
            className="w-11 h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-lg flex items-center justify-center shadow-md active:bg-indigo-600 active:scale-95 transition-all touch-none select-none"
          >
            ←
          </button>

          {/* Down Button */}
          <button
            onTouchStart={handleTouch({ x: 0, y: 1 })}
            onClick={() => onDirectionChange({ x: 0, y: 1 })}
            aria-label="Move Down"
            className="w-11 h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-lg flex items-center justify-center shadow-md active:bg-indigo-600 active:scale-95 transition-all touch-none select-none"
          >
            ↓
          </button>

          {/* Right Button */}
          <button
            onTouchStart={handleTouch({ x: 1, y: 0 })}
            onClick={() => onDirectionChange({ x: 1, y: 0 })}
            aria-label="Move Right"
            className="w-11 h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-lg flex items-center justify-center shadow-md active:bg-indigo-600 active:scale-95 transition-all touch-none select-none"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
