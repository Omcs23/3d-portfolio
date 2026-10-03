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
      totalSolved: 154,
      easySolved: 43,
      mediumSolved: 66,
      hardSolved: 45,
      currentStreak: 4,
      longestStreak: 11,
      totalActiveDays: 28,
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
        category: "Language Proficiency",
        rank: 314826,
      },
      {
        name: "Java",
        stars: 4,
        solved: 14,
        points: 158,
        category: "Language Proficiency",
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

  // LeetCode calculations
  const totalSolved = leetcode.stats?.totalSolved || 154;
  const easySolved = leetcode.stats?.easySolved || 43;
  const mediumSolved = leetcode.stats?.mediumSolved || 66;
  const hardSolved = leetcode.stats?.hardSolved || 45;
  const currentStreak = leetcode.stats?.currentStreak || 4;
  const longestStreak = leetcode.stats?.longestStreak || 11;
  const totalActiveDays = leetcode.stats?.totalActiveDays || 28;

  const easyPct = totalSolved > 0 ? Math.round((easySolved / totalSolved) * 100) : 0;
  const mediumPct = totalSolved > 0 ? Math.round((mediumSolved / totalSolved) * 100) : 0;
  const hardPct = totalSolved > 0 ? Math.round((hardSolved / totalSolved) * 100) : 0;

  // HackerRank calculations
  const hrTotalSolved = hackerrank.stats?.totalSolved || 49;
  const hrTotalPoints = hackerrank.stats?.totalPoints || 577;
  const hrBadgesCount = hackerrank.stats?.badgesCount || 3;
  const hrStars = hackerrank.stats?.stars || 5;

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

        {/* Platform Switcher Tabs */}
        <div
          className={`flex items-center gap-1.5 p-1.5 rounded-2xl border max-w-full overflow-x-auto self-start sm:self-auto shrink-0 shadow-sm ${
            isNight ? "bg-slate-900/90 border-slate-800" : "bg-slate-200/70 border-slate-300/80"
          }`}
        >
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => p.active && setActivePlatform(p.id)}
              disabled={!p.active}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
                activePlatform === p.id && p.active
                  ? p.id === "hackerrank"
                    ? "bg-emerald-600 text-white border border-emerald-500 shadow-emerald-500/20 scale-[1.01]"
                    : "bg-blue-600 text-white border border-blue-500 shadow-blue-500/20 scale-[1.01]"
                  : p.active
                  ? isNight
                    ? "bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80"
                    : "bg-white hover:bg-slate-100 text-slate-800 border border-slate-300/80"
                  : isNight
                  ? "bg-slate-900/50 text-slate-500 border border-slate-800/50 cursor-not-allowed opacity-50"
                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50"
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
        {/* ==================== LEETCODE TAB ==================== */}
        {activePlatform === "leetcode" && (
          <>
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
          </>
        )}

        {/* ==================== HACKERRANK TAB ==================== */}
        {activePlatform === "hackerrank" && (
          <div className="flex flex-col gap-5 animate-in fade-in">
            {/* HackerRank Profile Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-lg shrink-0">
                  💚
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-base sm:text-lg font-bold font-outfit ${
                        isNight ? "text-white" : "text-slate-900"
                      }`}
                    >
                      HackerRank Profile
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded-md font-mono font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      @{hackerrank.username}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-0.5 ${
                      isNight ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Ranked Competitive Coding • 5-Star Gold Badge in Python & 4-Star in Java
                  </p>
                </div>
              </div>

              <a
                href={hackerrank.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 w-full sm:w-auto shadow-md !bg-emerald-600 hover:!bg-emerald-700 active:scale-95 transition-all"
              >
                <span>View HackerRank Profile</span>
                <span className="text-xs">↗</span>
              </a>
            </div>

            {/* HackerRank Summary Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div
                className={`p-3 sm:p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isNight
                    ? "bg-slate-950/70 border-slate-800/90"
                    : "bg-slate-50 border-slate-200/90"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  Total Solved
                </span>
                <div className="my-1 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold font-outfit text-emerald-600 dark:text-emerald-400">
                    {hrTotalSolved}
                  </span>
                  <span className={`text-xs ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                    problems
                  </span>
                </div>
              </div>

              <div
                className={`p-3 sm:p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isNight
                    ? "bg-slate-950/70 border-slate-800/90"
                    : "bg-slate-50 border-slate-200/90"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  Total Score
                </span>
                <div className="my-1 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold font-outfit text-blue-600 dark:text-cyan-400">
                    {hrTotalPoints}
                  </span>
                  <span className={`text-xs ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                    points
                  </span>
                </div>
              </div>

              <div
                className={`p-3 sm:p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isNight
                    ? "bg-slate-950/70 border-slate-800/90"
                    : "bg-slate-50 border-slate-200/90"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  Highest Rating
                </span>
                <div className="my-1 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold font-outfit text-amber-600 dark:text-amber-400">
                    {hrStars}-Star
                  </span>
                  <span className={`text-xs ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                    Gold
                  </span>
                </div>
              </div>

              <div
                className={`p-3 sm:p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isNight
                    ? "bg-slate-950/70 border-slate-800/90"
                    : "bg-slate-50 border-slate-200/90"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  Verified Badges
                </span>
                <div className="my-1 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold font-outfit text-indigo-600 dark:text-indigo-400">
                    {hrBadgesCount}
                  </span>
                  <span className={`text-xs ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                    domains
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Domain Badges Detailed Grid */}
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4
                  className={`text-xs font-bold tracking-wider font-mono uppercase ${
                    isNight ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Verified HackerRank Domain Badges
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {hackerrank.badges.map((b) => (
                  <div
                    key={b.name}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.01] ${
                      isNight
                        ? "bg-slate-950/80 border-slate-800/90"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold font-outfit">{b.name}</span>
                      <span className="text-xs text-amber-500 font-bold">
                        {"★".repeat(b.stars)}{"☆".repeat(5 - b.stars)}
                      </span>
                    </div>

                    <div className="my-3 space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className={isNight ? "text-slate-400" : "text-slate-600"}>Category:</span>
                        <span className="font-semibold">{b.category}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className={isNight ? "text-slate-400" : "text-slate-600"}>Problems Solved:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{b.solved}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className={isNight ? "text-slate-400" : "text-slate-600"}>Points Earned:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">{b.points} pts</span>
                      </div>
                      {b.rank && (
                        <div className="flex justify-between text-xs font-mono">
                          <span className={isNight ? "text-slate-400" : "text-slate-600"}>Global Rank:</span>
                          <span className="font-bold text-blue-600 dark:text-cyan-400">#{b.rank.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(b.stars / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
