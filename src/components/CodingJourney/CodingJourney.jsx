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
    ranking: 1153055,
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

  return (
    <section id="coding-journey" className="py-8 flex flex-col gap-6 relative">
      {/* Background Ambient Glow FX */}
      <div className="absolute -top-10 left-1/4 w-72 h-72 bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-1/4 w-72 h-72 bg-indigo-500/10 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Live Competitive Programming
          </div>
          <h3 className="subhead-text text-2xl sm:text-3xl font-extrabold font-outfit">
            Coding Journey & Statistics
          </h3>
          <p
            className={`mt-1 text-xs sm:text-sm font-medium ${
              isNight ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Real-time problem-solving activity, streaks, and verified platform metrics:
          </p>
        </div>

        {/* 3D Capsule Platform Switcher */}
        <div
          className={`flex items-center gap-1.5 p-1.5 rounded-2xl border max-w-full overflow-x-auto self-start sm:self-auto shrink-0 shadow-lg backdrop-blur-xl ${
            isNight
              ? "bg-slate-900/90 border-slate-800 shadow-slate-950/50"
              : "bg-slate-100/90 border-slate-200 shadow-slate-300/40"
          }`}
        >
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => p.active && setActivePlatform(p.id)}
              disabled={!p.active}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap outline-none select-none ${
                activePlatform === p.id && p.active
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border border-white/20 shadow-lg shadow-amber-500/30 scale-105"
                  : p.active
                  ? isNight
                    ? "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 hover:scale-102"
                    : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:scale-102 shadow-sm"
                  : isNight
                  ? "bg-slate-900/40 text-slate-500 border border-slate-800/40 cursor-not-allowed opacity-50"
                  : "bg-slate-100/60 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-50"
              }`}
            >
              <span className="text-sm icon-hover-animate">{p.icon}</span>
              <span>{p.label}</span>
              {!p.active && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono uppercase font-bold ${
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

      {/* Main Glass Dashboard Container with Top Accent Line */}
      <div
        className={`rounded-3xl border transition-all duration-300 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden z-10 ${
          isNight
            ? "bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border-slate-800 shadow-slate-950/80"
            : "bg-gradient-to-b from-white via-slate-50/90 to-slate-100/90 border-slate-200 shadow-blue-500/5"
        }`}
      >
        {/* Top Animated Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-emerald-500 via-cyan-500 to-indigo-500" />

        <div className="p-5 sm:p-7 flex flex-col gap-6">
          {/* ==================== LEETCODE TAB ==================== */}
          {activePlatform === "leetcode" && (
            <>
              {/* Profile Header Banner */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  isNight
                    ? "bg-slate-950/70 border-slate-800/80 shadow-inner"
                    : "bg-white/80 border-slate-200/90 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-2xl shrink-0 shadow-md">
                    ⚡
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-lg sm:text-xl font-extrabold font-outfit ${
                          isNight ? "text-white" : "text-slate-900"
                        }`}
                      >
                        LeetCode Profile
                      </h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        @{leetcode.username}
                      </span>
                    </div>
                    <p
                      className={`text-xs sm:text-sm mt-1 ${
                        isNight ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Global Rank:{" "}
                      <span className="font-extrabold font-mono text-cyan-500 dark:text-cyan-400">
                        #{leetcode.ranking > 0 ? leetcode.ranking.toLocaleString() : "N/A"}
                      </span>{" "}
                      • Active Problem Solver across Data Structures & Algorithms
                    </p>
                  </div>
                </div>

                <a
                  href={leetcode.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn px-5 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center justify-center gap-1.5 w-full sm:w-auto shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all shrink-0"
                >
                  <span>View LeetCode Profile</span>
                  <span className="text-xs">↗</span>
                </a>
              </div>

              {/* Problem Solved Metrics 3D Card Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Total Solved Card */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group select-none relative overflow-hidden ${
                    isNight
                      ? "bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border-slate-800 hover:border-cyan-500/50 shadow-cyan-950/30"
                      : "bg-gradient-to-br from-white via-slate-50 to-blue-50/30 border-slate-200/90 hover:border-blue-400 shadow-blue-500/10"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                        Total Solved
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-extrabold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                        {Math.min(Math.round((totalSolved / 300) * 100), 100)}%
                      </span>
                    </div>
                    <div className="my-2.5 flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold font-outfit bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-indigo-300 bg-clip-text text-transparent">
                        {totalSolved}
                      </span>
                      <span className={`text-xs font-semibold ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                        problems
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-300/40 dark:border-slate-700/40">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min((totalSolved / 300) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Easy Card */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group select-none relative overflow-hidden ${
                    isNight
                      ? "bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-800/50 hover:border-emerald-500/70 shadow-emerald-950/30"
                      : "bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/30 border-emerald-200/90 hover:border-emerald-400 shadow-emerald-500/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase font-mono">
                      Easy
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-extrabold border border-emerald-500/30">
                      ★ {easyPct}%
                    </span>
                  </div>
                  <div className="my-2.5 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold font-outfit text-emerald-600 dark:text-emerald-400">
                      {easySolved}
                    </span>
                    <span className={`text-xs font-semibold ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                      solved
                    </span>
                  </div>
                  <span className={`text-xs truncate font-semibold ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                    Fundamentals & Data Types
                  </span>
                </div>

                {/* Medium Card */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group select-none relative overflow-hidden ${
                    isNight
                      ? "bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-800/50 hover:border-amber-500/70 shadow-amber-950/30"
                      : "bg-gradient-to-br from-amber-50/90 via-white to-amber-50/30 border-amber-200/90 hover:border-amber-400 shadow-amber-500/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase font-mono">
                      Medium
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-extrabold border border-amber-500/30">
                      ★★ {mediumPct}%
                    </span>
                  </div>
                  <div className="my-2.5 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold font-outfit text-amber-600 dark:text-amber-400">
                      {mediumSolved}
                    </span>
                    <span className={`text-xs font-semibold ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                      solved
                    </span>
                  </div>
                  <span className={`text-xs truncate font-semibold ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                    Core Algorithms & Trees
                  </span>
                </div>

                {/* Hard Card */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group select-none relative overflow-hidden ${
                    isNight
                      ? "bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border-rose-800/50 hover:border-rose-500/70 shadow-rose-950/30"
                      : "bg-gradient-to-br from-rose-50/90 via-white to-rose-50/30 border-rose-200/90 hover:border-rose-400 shadow-rose-500/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 uppercase font-mono">
                      Hard
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-extrabold border border-rose-500/30">
                      ★★★ {hardPct}%
                    </span>
                  </div>
                  <div className="my-2.5 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold font-outfit text-rose-600 dark:text-rose-400">
                      {hardSolved}
                    </span>
                    <span className={`text-xs font-semibold ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                      solved
                    </span>
                  </div>
                  <span className={`text-xs truncate font-semibold ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                    Advanced Graphs & DP
                  </span>
                </div>
              </div>

              {/* Streaks Row Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl border flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.02] ${
                    isNight
                      ? "bg-slate-950/70 border-slate-800/80"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shrink-0">
                    🔥
                  </div>
                  <div className="min-w-0">
                    <div className={`text-[10px] font-extrabold uppercase tracking-wider font-mono ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                      Current Streak
                    </div>
                    <div className={`text-base font-extrabold font-outfit ${isNight ? "text-slate-100" : "text-slate-900"}`}>
                      {currentStreak} {currentStreak === 1 ? "day" : "days"} active
                    </div>
                  </div>
                </div>

                <div
                  className={`p-3.5 sm:p-4 rounded-2xl border flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.02] ${
                    isNight
                      ? "bg-slate-950/70 border-slate-800/80"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-xl shrink-0">
                    🏆
                  </div>
                  <div className="min-w-0">
                    <div className={`text-[10px] font-extrabold uppercase tracking-wider font-mono ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                      Longest Streak
                    </div>
                    <div className={`text-base font-extrabold font-outfit ${isNight ? "text-slate-100" : "text-slate-900"}`}>
                      {longestStreak} {longestStreak === 1 ? "day" : "days"} record
                    </div>
                  </div>
                </div>

                <div
                  className={`p-3.5 sm:p-4 rounded-2xl border flex items-center gap-3.5 transition-all duration-300 hover:scale-[1.02] ${
                    isNight
                      ? "bg-slate-950/70 border-slate-800/80"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl shrink-0">
                    🗓️
                  </div>
                  <div className="min-w-0">
                    <div className={`text-[10px] font-extrabold uppercase tracking-wider font-mono ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                      Total Active Days
                    </div>
                    <div className={`text-base font-extrabold font-outfit ${isNight ? "text-slate-100" : "text-slate-900"}`}>
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
            <div className="flex flex-col gap-6 animate-in fade-in">
              {/* Profile Banner */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  isNight
                    ? "bg-slate-950/70 border-slate-800/80 shadow-inner"
                    : "bg-white/80 border-slate-200/90 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold text-2xl shrink-0 shadow-md">
                    💚
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-lg sm:text-xl font-extrabold font-outfit ${
                          isNight ? "text-white" : "text-slate-900"
                        }`}
                      >
                        HackerRank Profile
                      </h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        @{hackerrank.username}
                      </span>
                    </div>
                    <p
                      className={`text-xs sm:text-sm mt-1 ${
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
                  className="btn px-5 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center justify-center gap-1.5 w-full sm:w-auto shadow-md !bg-emerald-600 hover:!bg-emerald-700 active:scale-95 transition-all shrink-0"
                >
                  <span>View HackerRank Profile</span>
                  <span className="text-xs">↗</span>
                </a>
              </div>

              {/* Summary Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    isNight
                      ? "bg-slate-950/70 border-slate-800/90"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                    Total Solved
                  </span>
                  <div className="my-2 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold font-outfit text-emerald-500">
                      {hrTotalSolved}
                    </span>
                    <span className={`text-xs font-semibold ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                      problems
                    </span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    isNight
                      ? "bg-slate-950/70 border-slate-800/90"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                    Total Score
                  </span>
                  <div className="my-2 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold font-outfit text-cyan-400">
                      {hrTotalPoints}
                    </span>
                    <span className={`text-xs font-semibold ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                      points
                    </span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    isNight
                      ? "bg-slate-950/70 border-slate-800/90"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                    Highest Rating
                  </span>
                  <div className="my-2 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold font-outfit text-amber-500">
                      {hrStars}-Star
                    </span>
                    <span className={`text-xs font-semibold ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                      Gold
                    </span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    isNight
                      ? "bg-slate-950/70 border-slate-800/90"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                    Verified Badges
                  </span>
                  <div className="my-2 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold font-outfit text-indigo-400">
                      {hrBadgesCount}
                    </span>
                    <span className={`text-xs font-semibold ${isNight ? "text-slate-400" : "text-slate-600"}`}>
                      domains
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Domain Badges Grid */}
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h4
                    className={`text-xs font-extrabold tracking-wider font-mono uppercase ${
                      isNight ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Verified HackerRank Domain Badges
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {hackerrank.badges.map((b) => (
                    <div
                      key={b.name}
                      className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        isNight
                          ? "bg-slate-950/80 border-slate-800/90"
                          : "bg-white border-slate-200 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-extrabold font-outfit">{b.name}</span>
                        <span className="text-sm text-amber-500 font-bold">
                          {"★".repeat(b.stars)}{"☆".repeat(5 - b.stars)}
                        </span>
                      </div>

                      <div className="my-4 space-y-1.5 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className={isNight ? "text-slate-400" : "text-slate-600"}>Category:</span>
                          <span className="font-semibold">{b.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isNight ? "text-slate-400" : "text-slate-600"}>Problems Solved:</span>
                          <span className="font-extrabold text-emerald-500">{b.solved}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isNight ? "text-slate-400" : "text-slate-600"}>Points Earned:</span>
                          <span className="font-extrabold text-amber-500">{b.points} pts</span>
                        </div>
                        {b.rank && (
                          <div className="flex justify-between">
                            <span className={isNight ? "text-slate-400" : "text-slate-600"}>Global Rank:</span>
                            <span className="font-extrabold text-cyan-400">#{b.rank.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-300/40 dark:border-slate-700/40">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
                          style={{ width: `${(b.stars / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== CODEFORCES TAB ==================== */}
          {activePlatform === "codeforces" && (
            <div className="flex flex-col gap-6 animate-in fade-in">
              <div
                className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  isNight
                    ? "bg-slate-950/70 border-slate-800/80 shadow-inner"
                    : "bg-white/80 border-slate-200/90 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-500 font-bold text-2xl shrink-0 shadow-md">
                    🏆
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-lg sm:text-xl font-extrabold font-outfit ${
                          isNight ? "text-white" : "text-slate-900"
                        }`}
                      >
                        Codeforces Profile
                      </h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                        @OmSharma_cs
                      </span>
                    </div>
                    <p
                      className={`text-xs sm:text-sm mt-1 ${
                        isNight ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Competitive Algorithmic Contests • Active Problem Solver
                    </p>
                  </div>
                </div>

                <a
                  href="https://codeforces.com/profile/OmSharma_cs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn px-5 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center justify-center gap-1.5 w-full sm:w-auto shadow-md !bg-blue-600 hover:!bg-blue-700 active:scale-95 transition-all shrink-0"
                >
                  <span>View Codeforces Profile</span>
                  <span className="text-xs">↗</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isNight
                      ? "bg-slate-950/80 border-slate-800/90"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                    Handle
                  </span>
                  <div className="my-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold font-outfit text-blue-500">
                      OmSharma_cs
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Verified Handle</span>
                </div>

                <div
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isNight
                      ? "bg-slate-950/80 border-slate-800/90"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                    Contest Division
                  </span>
                  <div className="my-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold font-outfit text-cyan-400">
                      Div 2 / Div 3
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Algorithmic Rounds</span>
                </div>

                <div
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isNight
                      ? "bg-slate-950/80 border-slate-800/90"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                    Platform Status
                  </span>
                  <div className="my-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold font-outfit text-emerald-500">
                      Active
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Contest Track</span>
                </div>
              </div>
            </div>
          )}

          {/* ==================== GITHUB TAB ==================== */}
          {activePlatform === "github" && (
            <div className="flex flex-col gap-6 animate-in fade-in">
              <div
                className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  isNight
                    ? "bg-slate-950/70 border-slate-800/80 shadow-inner"
                    : "bg-white/80 border-slate-200/90 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-2xl shrink-0 shadow-md">
                    🐙
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-lg sm:text-xl font-extrabold font-outfit ${
                          isNight ? "text-white" : "text-slate-900"
                        }`}
                      >
                        GitHub Developer Hub
                      </h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                        @Omcs23
                      </span>
                    </div>
                    <p
                      className={`text-xs sm:text-sm mt-1 ${
                        isNight ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Open-Source Repositories • Full-Stack Web Applications & Bots
                    </p>
                  </div>
                </div>

                <a
                  href="https://github.com/Omcs23"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn px-5 py-2.5 rounded-xl text-xs font-bold font-outfit flex items-center justify-center gap-1.5 w-full sm:w-auto shadow-md !bg-purple-600 hover:!bg-purple-700 active:scale-95 transition-all shrink-0"
                >
                  <span>View GitHub Profile</span>
                  <span className="text-xs">↗</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isNight
                      ? "bg-slate-950/80 border-slate-800/90"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                    Username
                  </span>
                  <div className="my-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold font-outfit text-purple-400">
                      Omcs23
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Verified Developer</span>
                </div>

                <div
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isNight
                      ? "bg-slate-950/80 border-slate-800/90"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                    Repositories
                  </span>
                  <div className="my-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold font-outfit text-indigo-400">
                      Public & Private
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Full-Stack & 3D Web</span>
                </div>

                <div
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    isNight
                      ? "bg-slate-950/80 border-slate-800/90"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-mono">
                    Contributions
                  </span>
                  <div className="my-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold font-outfit text-emerald-400">
                      Active
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Continuous Commits</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Timestamp Sync Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-slate-200 dark:border-slate-800/80 text-xs font-mono">
            <span className={`flex items-center gap-2 ${isNight ? "text-slate-400" : "text-slate-600"}`}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Auto-synced twice daily via GitHub Actions
            </span>
            <span className={`${isNight ? "text-slate-400" : "text-slate-600"}`}>
              Last refreshed: {lastUpdated}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodingJourney;
