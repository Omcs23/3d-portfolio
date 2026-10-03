import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import ActivityHeatmap from "./ActivityHeatmap";
import ConsistencyLineGraph from "./ConsistencyLineGraph";
import codingStatsData from "../../data/coding-stats.json";

const CodingJourney = () => {
  const { isNight } = useTheme();
  const [activePlatform, setActivePlatform] = useState("leetcode");

  const leetcode = codingStatsData?.platforms?.leetcode || {
    username: "OmSharma152",
    profileUrl: "https://leetcode.com/u/OmSharma152/",
    ranking: 0,
    stats: {
      totalSolved: 78,
      easySolved: 30,
      mediumSolved: 34,
      hardSolved: 14,
      currentStreak: 2,
      longestStreak: 2,
      totalActiveDays: 13,
    },
    submissionCalendar: {},
  };

  const lastUpdated = codingStatsData?.lastUpdated
    ? new Date(codingStatsData.lastUpdated).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recently";

  const platforms = [
    { id: "leetcode", label: "LeetCode", active: true, icon: "⚡" },
    { id: "codeforces", label: "Codeforces", active: false, icon: "🏆" },
    { id: "hackerrank", label: "HackerRank", active: false, icon: "💚" },
    { id: "github", label: "GitHub", active: false, icon: "🐙" },
  ];

  const totalSolved = leetcode.stats?.totalSolved || 78;
  const easySolved = leetcode.stats?.easySolved || 30;
  const mediumSolved = leetcode.stats?.mediumSolved || 34;
  const hardSolved = leetcode.stats?.hardSolved || 14;
  const currentStreak = leetcode.stats?.currentStreak || 2;
  const longestStreak = leetcode.stats?.longestStreak || 2;
  const totalActiveDays = leetcode.stats?.totalActiveDays || 13;

  const easyPct = totalSolved > 0 ? Math.round((easySolved / totalSolved) * 100) : 0;
  const mediumPct = totalSolved > 0 ? Math.round((mediumSolved / totalSolved) * 100) : 0;
  const hardPct = totalSolved > 0 ? Math.round((hardSolved / totalSolved) * 100) : 0;

  return (
    <section id="coding-journey" className="py-6 flex flex-col gap-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Live Competitive Programming
          </div>
          <h3 className="subhead-text text-xl sm:text-2xl">Coding Journey & Statistics</h3>
          <p
            className={`mt-0.5 text-xs sm:text-sm font-medium ${
              isNight ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Real-time problem-solving activity, streaks, and platform metrics:
          </p>
        </div>

        {/* Platform Tabs */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border max-w-full overflow-x-auto self-start sm:self-auto shrink-0 shadow-sm ${
            isNight ? "bg-slate-900/90 border-slate-800" : "bg-slate-100 border-slate-200"
          }`}
        >
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => p.active && setActivePlatform(p.id)}
              disabled={!p.active}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                activePlatform === p.id && p.active
                  ? "bg-blue-600 text-white shadow-sm scale-[1.01]"
                  : p.active
                  ? isNight
                    ? "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    : "text-slate-700 hover:text-slate-900 hover:bg-white/80"
                  : isNight
                  ? "text-slate-600 cursor-not-allowed opacity-50"
                  : "text-slate-400 cursor-not-allowed opacity-50"
              }`}
            >
              <span className="text-xs">{p.icon}</span>
              <span>{p.label}</span>
              {!p.active && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold ${
                    isNight
                      ? "bg-indigo-950 text-indigo-300 border border-indigo-800"
                      : "bg-blue-100 text-blue-800 border border-blue-300"
                  }`}
                >
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Glass Dashboard Container */}
      <div
        className={`p-4 sm:p-6 rounded-2xl border transition-all shadow-xl backdrop-blur-xl flex flex-col gap-5 ${
          isNight
            ? "bg-slate-900/90 border-slate-800/90 text-slate-100 shadow-slate-950/50"
            : "bg-white border-slate-200/90 text-slate-900 shadow-slate-200/60"
        }`}
      >
        {/* LeetCode Profile Compact Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-lg shrink-0">
              ⚡
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4
                  className={`text-base sm:text-lg font-bold font-outfit ${
                    isNight ? "text-white" : "text-slate-900"
                  }`}
                >
                  LeetCode Profile
                </h4>
                <span className="text-xs px-2 py-0.5 rounded-md font-mono font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  @{leetcode.username}
                </span>
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  isNight ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Global Rank:{" "}
                <span className="font-bold font-mono text-blue-600 dark:text-cyan-400">
                  #{leetcode.ranking > 0 ? leetcode.ranking.toLocaleString() : "N/A"}
                </span>{" "}
                • Solved across Data Structures & Algorithms
              </p>
            </div>
          </div>

          <a
            href={leetcode.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 w-full sm:w-auto shadow-md hover:shadow-blue-500/20 active:scale-95 transition-all"
          >
            <span>View LeetCode Profile</span>
            <span className="text-xs">↗</span>
          </a>
        </div>

        {/* Minimal & Compact Problem Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Total Solved Card */}
          <div
            className={`p-3 sm:p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
              isNight
                ? "bg-slate-950/70 border-slate-800/90"
                : "bg-slate-50 border-slate-200/90"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  Total Solved
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-blue-500/10 text-blue-700 dark:text-cyan-400 border border-blue-500/20">
                  {Math.min(Math.round((totalSolved / 300) * 100), 100)}%
                </span>
              </div>
              <div className="my-1.5 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold font-outfit text-blue-600 dark:text-cyan-400">
                  {totalSolved}
                </span>
                <span className={`text-xs ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                  problems
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalSolved / 300) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Easy Card */}
          <div
            className={`p-3 sm:p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
              isNight
                ? "bg-emerald-950/20 border-emerald-800/40"
                : "bg-emerald-50/80 border-emerald-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase font-mono">
                Easy
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono font-bold border border-emerald-500/20">
                ★ {easyPct}%
              </span>
            </div>
            <div className="my-1 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-outfit text-emerald-600 dark:text-emerald-400">
                {easySolved}
              </span>
              <span className={`text-[11px] ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                solved
              </span>
            </div>
            <span className={`text-[11px] truncate font-medium ${isNight ? "text-slate-400" : "text-slate-600"}`}>
              Fundamentals & Data Types
            </span>
          </div>

          {/* Medium Card */}
          <div
            className={`p-3 sm:p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
              isNight
                ? "bg-amber-950/20 border-amber-800/40"
                : "bg-amber-50/80 border-amber-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase font-mono">
                Medium
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono font-bold border border-amber-500/20">
                ★★ {mediumPct}%
              </span>
            </div>
            <div className="my-1 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-outfit text-amber-600 dark:text-amber-400">
                {mediumSolved}
              </span>
              <span className={`text-[11px] ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                solved
              </span>
            </div>
            <span className={`text-[11px] truncate font-medium ${isNight ? "text-slate-400" : "text-slate-600"}`}>
              Core Algorithms & Trees
            </span>
          </div>

          {/* Hard Card */}
          <div
            className={`p-3 sm:p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
              isNight
                ? "bg-rose-950/20 border-rose-800/40"
                : "bg-rose-50/80 border-rose-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase font-mono">
                Hard
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-400 font-mono font-bold border border-rose-500/20">
                ★★★ {hardPct}%
              </span>
            </div>
            <div className="my-1 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-outfit text-rose-600 dark:text-rose-400">
                {hardSolved}
              </span>
              <span className={`text-[11px] ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                solved
              </span>
            </div>
            <span className={`text-[11px] truncate font-medium ${isNight ? "text-slate-400" : "text-slate-600"}`}>
              Advanced Graphs & DP
            </span>
          </div>
        </div>

        {/* Minimal & Compact Streak Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div
            className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
              isNight
                ? "bg-slate-950/70 border-slate-800/80"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="text-xl shrink-0">🔥</div>
            <div className="min-w-0">
              <div className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                Current Streak
              </div>
              <div className={`text-sm sm:text-base font-bold font-outfit ${isNight ? "text-slate-100" : "text-slate-900"}`}>
                {currentStreak} {currentStreak === 1 ? "day" : "days"} active
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
              isNight
                ? "bg-slate-950/70 border-slate-800/80"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="text-xl shrink-0">🏆</div>
            <div className="min-w-0">
              <div className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                Longest Streak
              </div>
              <div className={`text-sm sm:text-base font-bold font-outfit ${isNight ? "text-slate-100" : "text-slate-900"}`}>
                {longestStreak} {longestStreak === 1 ? "day" : "days"} record
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
              isNight
                ? "bg-slate-950/70 border-slate-800/80"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="text-xl shrink-0">🗓️</div>
            <div className="min-w-0">
              <div className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                Total Active Days
              </div>
              <div className={`text-sm sm:text-base font-bold font-outfit ${isNight ? "text-slate-100" : "text-slate-900"}`}>
                {totalActiveDays} {totalActiveDays === 1 ? "day" : "days"} logged
              </div>
            </div>
          </div>
        </div>

        {/* Consistency Line Graph */}
        <ConsistencyLineGraph
          submissionCalendar={leetcode.submissionCalendar}
          stats={leetcode.stats}
        />

        {/* Yearly Activity Heatmap */}
        <ActivityHeatmap submissionCalendar={leetcode.submissionCalendar} />

        {/* Footer Timestamp Sync Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-mono">
          <span className={`flex items-center gap-2 ${isNight ? "text-slate-400" : "text-slate-600"}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Auto-synced twice daily via GitHub Actions
          </span>
          <span className={`${isNight ? "text-slate-500" : "text-slate-600"}`}>
            Last refreshed: {lastUpdated}
          </span>
        </div>
      </div>
    </section>
  );
};

export default CodingJourney;
