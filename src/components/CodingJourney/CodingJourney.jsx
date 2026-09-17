import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import ActivityHeatmap from "./ActivityHeatmap";
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
    { id: "leetcode", label: "LeetCode", active: true },
    { id: "codeforces", label: "Codeforces", active: false },
    { id: "hackerrank", label: "HackerRank", active: false },
    { id: "github", label: "GitHub", active: false },
  ];

  const totalSolved = leetcode.stats?.totalSolved || 0;
  const easySolved = leetcode.stats?.easySolved || 0;
  const mediumSolved = leetcode.stats?.mediumSolved || 0;
  const hardSolved = leetcode.stats?.hardSolved || 0;
  const currentStreak = leetcode.stats?.currentStreak || 0;
  const longestStreak = leetcode.stats?.longestStreak || 0;
  const totalActiveDays = leetcode.stats?.totalActiveDays || 0;

  return (
    <section id="coding-journey" className="py-8 flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h3 className="subhead-text">Coding Journey & Statistics</h3>
          <p
            className={`mt-1.5 text-sm ${
              isNight ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Live problem-solving activity, streaks, and platform contributions:
          </p>
        </div>

        {/* Platform Tabs */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border max-w-full overflow-x-auto self-start sm:self-auto shrink-0 ${
            isNight ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
          }`}
        >
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => p.active && setActivePlatform(p.id)}
              disabled={!p.active}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activePlatform === p.id && p.active
                  ? "bg-blue-500 text-white shadow-sm"
                  : p.active
                  ? isNight
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
                  : isNight
                  ? "text-slate-600 cursor-not-allowed opacity-60"
                  : "text-slate-400 cursor-not-allowed opacity-60"
              }`}
            >
              <span>{p.label}</span>
              {!p.active && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800/40 text-slate-400 font-normal">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Card Container */}
      <div
        className={`p-4 sm:p-8 rounded-2xl border transition-all shadow-lg flex flex-col gap-6 sm:gap-8 ${
          isNight
            ? "bg-slate-900/90 border-slate-800 shadow-sky-950/20"
            : "bg-white/90 border-slate-200/80 shadow-sky-500/5"
        }`}
      >
        {/* LeetCode Profile Banner & Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/20">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-xl sm:text-2xl shrink-0">
              ⚡
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4
                  className={`text-lg sm:text-xl font-bold font-poppins ${
                    isNight ? "text-white" : "text-slate-900"
                  }`}
                >
                  LeetCode Profile
                </h4>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium ${
                    isNight
                      ? "bg-slate-800 text-slate-300 border border-slate-700"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  @{leetcode.username}
                </span>
              </div>
              <p
                className={`text-xs mt-1 leading-snug ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Global Rank:{" "}
                <span className="font-semibold text-blue-500">
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
            className="btn px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 w-full sm:w-auto shadow-md hover:shadow-blue-500/20 active:scale-95 transition-all"
          >
            <span>View LeetCode Profile</span>
            <span className="text-sm">↗</span>
          </a>
        </div>

        {/* Problem Metrics & Streaks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Solved Box */}
          <div
            className={`p-4 sm:p-5 rounded-xl border flex flex-col justify-between transition-colors ${
              isNight
                ? "bg-slate-950/60 border-slate-800"
                : "bg-slate-50/80 border-slate-200"
            }`}
          >
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                isNight ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Total Solved
            </span>
            <div className="my-2">
              <span className="text-3xl font-extrabold font-poppins blue-gradient_text">
                {totalSolved}
              </span>
              <span
                className={`text-xs ml-1.5 ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                problems
              </span>
            </div>
            <div className="w-full bg-slate-700/20 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalSolved / 300) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Difficulty Breakdown Grid */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Easy */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl border flex sm:flex-col justify-between items-center sm:items-stretch gap-2 ${
                isNight
                  ? "bg-emerald-950/20 border-emerald-800/40"
                  : "bg-emerald-50/60 border-emerald-200/80"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-emerald-500 uppercase">
                  Easy
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono">
                  ★
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-bold font-poppins text-emerald-500 my-0.5">
                {easySolved}
              </span>
              <span
                className={`text-[11px] ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Fundamentals
              </span>
            </div>

            {/* Medium */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl border flex sm:flex-col justify-between items-center sm:items-stretch gap-2 ${
                isNight
                  ? "bg-amber-950/20 border-amber-800/40"
                  : "bg-amber-50/60 border-amber-200/80"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-amber-500 uppercase">
                  Medium
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-mono">
                  ★★
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-bold font-poppins text-amber-500 my-0.5">
                {mediumSolved}
              </span>
              <span
                className={`text-[11px] ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Core Algorithms
              </span>
            </div>

            {/* Hard */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl border flex sm:flex-col justify-between items-center sm:items-stretch gap-2 ${
                isNight
                  ? "bg-rose-950/20 border-rose-800/40"
                  : "bg-rose-50/60 border-rose-200/80"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-rose-500 uppercase">
                  Hard
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 font-mono">
                  ★★★
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-bold font-poppins text-rose-500 my-0.5">
                {hardSolved}
              </span>
              <span
                className={`text-[11px] ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Advanced Topics
              </span>
            </div>
          </div>
        </div>

        {/* Streak Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              isNight
                ? "bg-slate-950/60 border-slate-800 text-slate-200"
                : "bg-slate-50/80 border-slate-200 text-slate-800"
            }`}
          >
            <div className="text-2xl">🔥</div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">
                Current Streak
              </div>
              <div className="text-lg font-bold font-poppins">
                {currentStreak} {currentStreak === 1 ? "day" : "days"}
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              isNight
                ? "bg-slate-950/60 border-slate-800 text-slate-200"
                : "bg-slate-50/80 border-slate-200 text-slate-800"
            }`}
          >
            <div className="text-2xl">🏆</div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">
                Longest Streak
              </div>
              <div className="text-lg font-bold font-poppins">
                {longestStreak} {longestStreak === 1 ? "day" : "days"}
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              isNight
                ? "bg-slate-950/60 border-slate-800 text-slate-200"
                : "bg-slate-50/80 border-slate-200 text-slate-800"
            }`}
          >
            <div className="text-2xl">📅</div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">
                Total Active Days
              </div>
              <div className="text-lg font-bold font-poppins">
                {totalActiveDays} {totalActiveDays === 1 ? "day" : "days"}
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Section */}
        <ActivityHeatmap submissionCalendar={leetcode.submissionCalendar} />

        {/* Recent Problems Section */}
        <RecentProblems submissions={leetcode.recentSubmissions} />

        {/* Footer Timestamp & Auto Update Badge */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-slate-700/20 text-xs">
          <span
            className={`flex items-center gap-1.5 ${
              isNight ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Auto-synced twice daily via GitHub Actions
          </span>
          <span
            className={`${isNight ? "text-slate-500" : "text-slate-400"}`}
          >
            Last refreshed: {lastUpdated}
          </span>
        </div>
      </div>
    </section>
  );
};

export default CodingJourney;
