import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import ActivityHeatmap from "./ActivityHeatmap";
import ConsistencyLineGraph from "./ConsistencyLineGraph";
import codingStatsData from "../../data/coding-stats.json";

const CodingJourney = () => {
  const { isNight } = useTheme();
  const [activePlatform, setActivePlatform] = useState("leetcode");
  const [viewMode, setViewMode] = useState("heatmap"); // "heatmap" | "chart"

  const leetcode = codingStatsData?.platforms?.leetcode || {
    username: "OmSharma152",
    profileUrl: "https://leetcode.com/u/OmSharma152/",
    ranking: 1153055,
    stats: {
      totalSolved: 154,
      easySolved: 43,
      mediumSolved: 66,
      hardSolved: 45,
      currentStreak: 0,
      longestStreak: 11,
      totalActiveDays: 29,
    },
    submissionCalendar: {},
  };

  const hackerrank = codingStatsData?.platforms?.hackerrank || {
    username: "iOmSharma52",
    profileUrl: "https://www.hackerrank.com/profile/iOmSharma52",
    stats: {
      totalSolved: 49,
      totalPoints: 577,
      badgesCount: 3,
      stars: 5,
    },
    badges: [
      {
        name: "Python",
        stars: 5,
        solved: 31,
        points: 415,
        category: "Language",
        rank: 314826,
      },
      {
        name: "Java",
        stars: 4,
        solved: 14,
        points: 158,
        category: "Language",
        rank: 441514,
      },
      {
        name: "30 Days of Code",
        stars: 1,
        solved: 4,
        points: 4,
        category: "Tutorial",
        rank: null,
      },
    ],
  };

  const lastUpdated = codingStatsData?.lastUpdated
    ? new Date(codingStatsData.lastUpdated).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Recently";

  const platforms = [
    { id: "leetcode", label: "LeetCode", active: true, icon: "⚡" },
    { id: "hackerrank", label: "HackerRank", active: false, icon: "💚" },
    { id: "codeforces", label: "Codeforces", active: false, icon: "🏆" },
    { id: "github", label: "GitHub", active: false, icon: "🐙" },
  ];

  // LeetCode calculations
  const totalSolved = leetcode.stats?.totalSolved || 154;
  const easySolved = leetcode.stats?.easySolved || 43;
  const mediumSolved = leetcode.stats?.mediumSolved || 66;
  const hardSolved = leetcode.stats?.hardSolved || 45;
  const currentStreak = leetcode.stats?.currentStreak ?? 0;
  const longestStreak = leetcode.stats?.longestStreak || 11;
  const totalActiveDays = leetcode.stats?.totalActiveDays || 29;

  const easyPct = totalSolved > 0 ? Math.round((easySolved / totalSolved) * 100) : 0;
  const mediumPct = totalSolved > 0 ? Math.round((mediumSolved / totalSolved) * 100) : 0;
  const hardPct = totalSolved > 0 ? Math.round((hardSolved / totalSolved) * 100) : 0;

  return (
    <section id="coding-journey" className="py-6 flex flex-col gap-4 relative">
      {/* Sleek Minimal Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className={`text-lg sm:text-xl font-bold font-outfit ${isNight ? "text-white" : "text-slate-900"}`}>
            Coding Stats & Activity
          </h3>
        </div>

        {/* Cute Compact Platform Switcher Tabs */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-xl border backdrop-blur-md max-w-full overflow-x-auto select-none touch-pan-x ${
            isNight
              ? "bg-slate-900/80 border-slate-800"
              : "bg-slate-100/80 border-slate-200"
          }`}
        >
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => p.active && setActivePlatform(p.id)}
              disabled={!p.active}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                activePlatform === p.id && p.active
                  ? "bg-amber-500 text-white shadow-sm"
                  : p.active
                  ? isNight
                    ? "text-slate-300 hover:text-white hover:bg-slate-800"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white"
                  : isNight
                  ? "text-slate-500 opacity-60 cursor-not-allowed bg-slate-950/40 border border-slate-800/40"
                  : "text-slate-400 opacity-60 cursor-not-allowed bg-slate-200/50 border border-slate-200/50"
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
              {!p.active && (
                <span className="text-[9px] px-1 py-0.2 rounded font-mono font-bold uppercase bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Cute Mini Glass Container */}
      <div
        className={`rounded-2xl border transition-all shadow-lg backdrop-blur-xl overflow-hidden ${
          isNight
            ? "bg-slate-900/90 border-slate-800 shadow-slate-950/40"
            : "bg-white/90 border-slate-200/80 shadow-slate-300/20"
        }`}
      >
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          {/* ==================== LEETCODE TAB ==================== */}
          {activePlatform === "leetcode" && (
            <>
              {/* Profile Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-base font-bold shrink-0">
                    ⚡
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${isNight ? "text-white" : "text-slate-900"}`}>
                        LeetCode Profile
                      </span>
                      <span className="text-xs font-mono font-medium text-amber-600 dark:text-amber-400">
                        @{leetcode.username}
                      </span>
                    </div>
                    <p className={`text-xs ${isNight ? "text-slate-400" : "text-slate-500"}`}>
                      Global Rank: <span className="font-semibold text-cyan-500">#{leetcode.ranking > 0 ? leetcode.ranking.toLocaleString() : "N/A"}</span>
                    </p>
                  </div>
                </div>

                <a
                  href={leetcode.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    isNight
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  }`}
                >
                  <span>View Profile</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>

              {/* Solved Metrics & Difficulty Bar */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Total Solved Mini Widget */}
                <div
                  className={`md:col-span-4 p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    isNight ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div>
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                      Total Solved
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-2xl font-extrabold font-outfit text-blue-500 dark:text-cyan-400">
                        {totalSolved}
                      </span>
                      <span className="text-xs text-slate-400">problems</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full border-2 border-cyan-500/40 flex items-center justify-center text-xs font-bold font-mono text-cyan-500"
                      title="Progress toward 300 problems goal"
                    >
                      {Math.min(Math.round((totalSolved / 300) * 100), 100)}%
                    </div>
                    <span className="text-[9px] font-mono font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">
                      Target 300
                    </span>
                  </div>
                </div>

                {/* Difficulty Split Pills & Distribution Bar */}
                <div
                  className={`md:col-span-8 p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 ${
                    isNight ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-500">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Easy: {easySolved} <span className="text-[10px] opacity-75">({easyPct}%)</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-amber-500">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Medium: {mediumSolved} <span className="text-[10px] opacity-75">({mediumPct}%)</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-rose-500">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Hard: {hardSolved} <span className="text-[10px] opacity-75">({hardPct}%)</span>
                    </span>
                  </div>

                  {/* Multi-color Segmented Bar */}
                  <div className="w-full h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex gap-0.5">
                    <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${easyPct}%` }} />
                    <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${mediumPct}%` }} />
                    <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${hardPct}%` }} />
                  </div>
                </div>
              </div>

              {/* Streaks Row Chips */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className={`p-2.5 rounded-xl border ${isNight ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Streak</span>
                  <span className={`font-bold font-outfit text-sm ${isNight ? "text-amber-400" : "text-amber-600"}`}>🔥 {currentStreak} days</span>
                </div>
                <div className={`p-2.5 rounded-xl border ${isNight ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Best Streak</span>
                  <span className={`font-bold font-outfit text-sm ${isNight ? "text-yellow-400" : "text-yellow-600"}`}>🏆 {longestStreak} days</span>
                </div>
                <div className={`p-2.5 rounded-xl border ${isNight ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Active Days</span>
                  <span className={`font-bold font-outfit text-sm ${isNight ? "text-cyan-400" : "text-blue-600"}`}>🗓️ {totalActiveDays} days</span>
                </div>
              </div>

              {/* Activity Toggle & Visualizers */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isNight ? "text-slate-300" : "text-slate-700"}`}>
                    Visual Activity Track
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewMode("heatmap")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        viewMode === "heatmap"
                          ? "bg-emerald-600 text-white"
                          : isNight
                          ? "bg-slate-800 text-slate-300"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      Heatmap
                    </button>
                    <button
                      onClick={() => setViewMode("chart")}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        viewMode === "chart"
                          ? "bg-blue-600 text-white"
                          : isNight
                          ? "bg-slate-800 text-slate-300"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      Growth Curve
                    </button>
                  </div>
                </div>

                {viewMode === "heatmap" ? (
                  <ActivityHeatmap submissionCalendar={leetcode.submissionCalendar} />
                ) : (
                  <ConsistencyLineGraph submissionCalendar={leetcode.submissionCalendar} stats={leetcode.stats} />
                )}
              </div>
            </>
          )}

          {/* ==================== HACKERRANK TAB ==================== */}
          {activePlatform === "hackerrank" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 text-base font-bold shrink-0">
                    💚
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${isNight ? "text-white" : "text-slate-900"}`}>
                        HackerRank Profile
                      </span>
                      <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                        @{hackerrank.username}
                      </span>
                    </div>
                    <p className={`text-xs ${isNight ? "text-slate-400" : "text-slate-500"}`}>
                      5-Star Gold Badge in Python • 4-Star in Java
                    </p>
                  </div>
                </div>

                <a
                  href={hackerrank.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1"
                >
                  <span>View Profile</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>

              {/* HackerRank Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {hackerrank.badges.map((b) => (
                  <div
                    key={b.name}
                    className={`p-3 rounded-xl border flex flex-col justify-between ${
                      isNight ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-outfit">{b.name}</span>
                      <span className="text-xs text-amber-500">{"★".repeat(b.stars)}</span>
                    </div>
                    <div className="mt-2 text-[11px] font-mono space-y-1 text-slate-400">
                      <div className="flex justify-between">
                        <span>Solved:</span>
                        <span className="font-bold text-emerald-500">{b.solved}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Points:</span>
                        <span className="font-bold text-amber-500">{b.points} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sync Note Footer */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Synced via GitHub Actions
            </span>
            <span>{lastUpdated}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodingJourney;
