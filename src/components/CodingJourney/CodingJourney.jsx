import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import ActivityHeatmap from "./ActivityHeatmap";
import ConsistencyLineGraph from "./ConsistencyLineGraph";
import RecentProblems from "./RecentProblems";
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
    recentSubmissions: [],
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
    <section id="coding-journey" className="py-10 flex flex-col gap-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold font-space uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            Live Competitive Programming
          </div>
          <h3 className="subhead-text">Coding Journey & Statistics</h3>
          <p
            className={`mt-1.5 text-sm ${
              isNight ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Real-time problem-solving activity, streaks, and platform contributions:
          </p>
        </div>

        {/* Platform Tabs */}
        <div
          className={`flex items-center gap-1.5 p-1.5 rounded-2xl border max-w-full overflow-x-auto self-start sm:self-auto shrink-0 shadow-lg backdrop-blur-md ${
            isNight ? "bg-slate-900/90 border-slate-800" : "bg-slate-100/90 border-slate-200"
          }`}
        >
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => p.active && setActivePlatform(p.id)}
              disabled={!p.active}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                activePlatform === p.id && p.active
                  ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                  : p.active
                  ? isNight
                    ? "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  : isNight
                  ? "text-slate-600 cursor-not-allowed opacity-50"
                  : "text-slate-400 cursor-not-allowed opacity-50"
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
              {!p.active && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                    isNight
                      ? "bg-indigo-950/90 text-indigo-300 border border-indigo-700/60"
                      : "bg-blue-100 text-blue-800 border border-blue-300/90 shadow-sm"
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
        className={`p-5 sm:p-8 rounded-3xl border transition-all shadow-2xl backdrop-blur-xl flex flex-col gap-8 ${
          isNight
            ? "bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border-slate-800/90 shadow-sky-950/20"
            : "bg-gradient-to-b from-white/95 via-slate-50/90 to-white/95 border-slate-200/90 shadow-sky-500/10"
        }`}
      >
        {/* LeetCode Profile Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-700/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-2xl shadow-lg shadow-amber-500/10 shrink-0">
              ⚡
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h4
                  className={`text-xl sm:text-2xl font-extrabold font-outfit ${
                    isNight ? "text-white" : "text-slate-900"
                  }`}
                >
                  LeetCode Profile
                </h4>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm">
                  @{leetcode.username}
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Global Rank:{" "}
                <span className="font-extrabold font-mono text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
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
            className="btn px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2.5 w-full md:w-auto shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-95 transition-all duration-200 uppercase tracking-wider"
          >
            <span>View LeetCode Profile</span>
            <span className="text-sm font-bold">↗</span>
          </a>
        </div>

        {/* Problem Metrics & Difficulties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Solved Card */}
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
              isNight
                ? "bg-slate-950/80 border-slate-800/90 shadow-inner"
                : "bg-slate-50/90 border-slate-200/90 shadow-sm"
            }`}
          >
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                Total Solved
              </span>
              <div className="my-3 flex items-baseline gap-2">
                <span className="text-4xl font-black font-outfit bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(34,211,238,0.3)]">
                  {totalSolved}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    isNight ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  problems
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono font-medium">
                <span className="text-slate-400">Target Progress</span>
                <span className="text-cyan-400 font-bold">{Math.min(Math.round((totalSolved / 300) * 100), 100)}%</span>
              </div>
              <div className="w-full bg-slate-800/60 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/40">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                  style={{ width: `${Math.min((totalSolved / 300) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Difficulty Cards */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Easy */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg ${
                isNight
                  ? "bg-gradient-to-br from-emerald-950/30 via-slate-950/60 to-slate-900/80 border-emerald-800/40 hover:border-emerald-500/60"
                  : "bg-emerald-50/70 border-emerald-200/80 hover:border-emerald-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider font-mono">
                  Easy
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
                  ★ {easyPct}%
                </span>
              </div>
              <div className="my-2">
                <span className="text-3xl font-black font-outfit text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  {easySolved}
                </span>
              </div>
              <span className={`text-[11px] font-medium ${isNight ? "text-slate-400" : "text-slate-500"}`}>
                Fundamentals & Data Types
              </span>
            </div>

            {/* Medium */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg ${
                isNight
                  ? "bg-gradient-to-br from-amber-950/30 via-slate-950/60 to-slate-900/80 border-amber-800/40 hover:border-amber-500/60"
                  : "bg-amber-50/70 border-amber-200/80 hover:border-amber-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider font-mono">
                  Medium
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/20">
                  ★★ {mediumPct}%
                </span>
              </div>
              <div className="my-2">
                <span className="text-3xl font-black font-outfit text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                  {mediumSolved}
                </span>
              </div>
              <span className={`text-[11px] font-medium ${isNight ? "text-slate-400" : "text-slate-500"}`}>
                Core Algorithms & Trees
              </span>
            </div>

            {/* Hard */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg ${
                isNight
                  ? "bg-gradient-to-br from-rose-950/30 via-slate-950/60 to-slate-900/80 border-rose-800/40 hover:border-rose-500/60"
                  : "bg-rose-50/70 border-rose-200/80 hover:border-rose-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-rose-400 uppercase tracking-wider font-mono">
                  Hard
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 font-mono font-bold border border-rose-500/20">
                  ★★★ {hardPct}%
                </span>
              </div>
              <div className="my-2">
                <span className="text-3xl font-black font-outfit text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                  {hardSolved}
                </span>
              </div>
              <span className={`text-[11px] font-medium ${isNight ? "text-slate-400" : "text-slate-500"}`}>
                Advanced Graphs & DP
              </span>
            </div>
          </div>
        </div>

        {/* Streaks & Consistency Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex items-center gap-4 transition-all duration-300 ${
              isNight
                ? "bg-gradient-to-r from-amber-500/10 via-slate-950/70 to-slate-950/70 border-amber-500/30 text-slate-100"
                : "bg-amber-50/80 border-amber-200/90 text-slate-800"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0 shadow-md shadow-amber-500/10">
              🔥
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider">
                Current Streak
              </div>
              <div className="text-xl font-extrabold font-outfit text-slate-100">
                {currentStreak} {currentStreak === 1 ? "day" : "days"} active
              </div>
            </div>
          </div>

          <div
            className={`p-4 sm:p-5 rounded-2xl border flex items-center gap-4 transition-all duration-300 ${
              isNight
                ? "bg-gradient-to-r from-yellow-500/10 via-slate-950/70 to-slate-950/70 border-yellow-500/30 text-slate-100"
                : "bg-yellow-50/80 border-yellow-200/90 text-slate-800"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-2xl shrink-0 shadow-md shadow-yellow-500/10">
              🏆
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-yellow-400 uppercase tracking-wider">
                Longest Streak
              </div>
              <div className="text-xl font-extrabold font-outfit text-slate-100">
                {longestStreak} {longestStreak === 1 ? "day" : "days"} record
              </div>
            </div>
          </div>

          <div
            className={`p-4 sm:p-5 rounded-2xl border flex items-center gap-4 transition-all duration-300 ${
              isNight
                ? "bg-gradient-to-r from-emerald-500/10 via-slate-950/70 to-slate-950/70 border-emerald-500/30 text-slate-100"
                : "bg-emerald-50/80 border-emerald-200/90 text-slate-800"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shrink-0 shadow-md shadow-emerald-500/10">
              🗓️
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
                Total Active Days
              </div>
              <div className="text-xl font-extrabold font-outfit text-slate-100">
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

        {/* Recent Submissions */}
        {leetcode.recentSubmissions && leetcode.recentSubmissions.length > 0 && (
          <RecentProblems submissions={leetcode.recentSubmissions} />
        )}

        {/* Footer Timestamp Sync Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-slate-700/20 text-xs font-mono">
          <span className="flex items-center gap-2 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            Auto-synced twice daily via GitHub Actions Workflow
          </span>
          <span className="text-slate-500">
            Last refreshed: {lastUpdated}
          </span>
        </div>
      </div>
    </section>
  );
};

export default CodingJourney;
