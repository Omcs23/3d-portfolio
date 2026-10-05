import React from "react";

// Original sleek SVG game icons for Rock, Paper, Scissors
export const RockIcon = ({ className = "w-8 h-8", color = "indigo" }) => {
  const colorMap = {
    indigo: "from-indigo-500 to-blue-600 border-indigo-400 text-indigo-100",
    rose: "from-rose-500 to-red-600 border-rose-400 text-rose-100",
    emerald: "from-emerald-500 to-teal-600 border-emerald-400 text-emerald-100",
    amber: "from-amber-500 to-orange-600 border-amber-400 text-amber-100",
    slate: "from-slate-700 to-slate-800 border-slate-600 text-slate-200",
  };

  return (
    <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br border shadow-md ${colorMap[color] || colorMap.indigo} ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3/5 h-3/5 filter drop-shadow"
      >
        {/* Closed Fist / Rock Shape */}
        <path d="M18 11V6a2 2 0 0 0-4 0v1a2 2 0 0 0-4 0v-1a2 2 0 0 0-4 0v5a5 5 0 0 0 10 0z" />
        <path d="M6 11V8a2 2 0 0 1 4 0" />
        <path d="M18 10a2 2 0 0 1 2 2v3a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7v-4" />
      </svg>
    </div>
  );
};

export const PaperIcon = ({ className = "w-8 h-8", color = "indigo" }) => {
  const colorMap = {
    indigo: "from-indigo-500 to-blue-600 border-indigo-400 text-indigo-100",
    rose: "from-rose-500 to-red-600 border-rose-400 text-rose-100",
    emerald: "from-emerald-500 to-teal-600 border-emerald-400 text-emerald-100",
    amber: "from-amber-500 to-orange-600 border-amber-400 text-amber-100",
    slate: "from-slate-700 to-slate-800 border-slate-600 text-slate-200",
  };

  return (
    <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br border shadow-md ${colorMap[color] || colorMap.indigo} ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3/5 h-3/5 filter drop-shadow"
      >
        {/* Open Palm / Paper Shape */}
        <path d="M18 11V5a2 2 0 0 0-4 0v4" />
        <path d="M14 9V3a2 2 0 0 0-4 0v6" />
        <path d="M10 9V4a2 2 0 0 0-4 0v7" />
        <path d="M6 11V7a2 2 0 0 0-4 0v6a7 7 0 0 0 7 7h4a7 7 0 0 0 7-7v-6a2 2 0 0 0-2-2h-2" />
      </svg>
    </div>
  );
};

export const ScissorsIcon = ({ className = "w-8 h-8", color = "indigo" }) => {
  const colorMap = {
    indigo: "from-indigo-500 to-blue-600 border-indigo-400 text-indigo-100",
    rose: "from-rose-500 to-red-600 border-rose-400 text-rose-100",
    emerald: "from-emerald-500 to-teal-600 border-emerald-400 text-emerald-100",
    amber: "from-amber-500 to-orange-600 border-amber-400 text-amber-100",
    slate: "from-slate-700 to-slate-800 border-slate-600 text-slate-200",
  };

  return (
    <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br border shadow-md ${colorMap[color] || colorMap.indigo} ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-3/5 h-3/5 filter drop-shadow"
      >
        {/* Scissors V-Sign Shape */}
        <path d="M14 10a2 2 0 0 0-4 0v2" />
        <path d="M10 12V3a2 2 0 0 1 4 0v5" />
        <path d="M14 8V4a2 2 0 0 1 4 0v7a7 7 0 0 1-7 7h-1a7 7 0 0 1-7-7v-3a2 2 0 0 1 4 0" />
      </svg>
    </div>
  );
};
