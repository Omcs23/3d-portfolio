import { useMemo, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const ConsistencyLineGraph = ({ submissionCalendar = {}, stats = {} }) => {
  const { isNight } = useTheme();
  const [activeTab, setActiveTab] = useState("cumulative"); // "cumulative" | "daily" | "difficulty"
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const totalSolved = stats?.totalSolved || 115;
  const easySolved = stats?.easySolved || 35;
  const mediumSolved = stats?.mediumSolved || 55;
  const hardSolved = stats?.hardSolved || 25;

  // Process submission calendar to generate sorted time series data points
  const graphData = useMemo(() => {
    const rawEntries = [];
    if (submissionCalendar) {
      Object.entries(submissionCalendar).forEach(([tsStr, count]) => {
        const ts = parseInt(tsStr, 10);
        if (!isNaN(ts) && count > 0) {
          rawEntries.push({ ts, count });
        }
      });
    }

    rawEntries.sort((a, b) => a.ts - b.ts);

    if (rawEntries.length === 0) {
      // Fallback data if no submissions exist
      const now = Date.now();
      const oneDay = 86400 * 1000;
      const fake = [
        { ts: (now - 30 * oneDay) / 1000, count: 2 },
        { ts: (now - 24 * oneDay) / 1000, count: 5 },
        { ts: (now - 18 * oneDay) / 1000, count: 8 },
        { ts: (now - 12 * oneDay) / 1000, count: 12 },
        { ts: (now - 6 * oneDay) / 1000, count: 18 },
        { ts: now / 1000, count: 25 },
      ];
      rawEntries.push(...fake);
    }

    // Compute cumulative solved up to totalSolved
    const totalRawCount = rawEntries.reduce((acc, curr) => acc + curr.count, 0);
    const scalingFactor = totalRawCount > 0 ? totalSolved / totalRawCount : 1;

    let runningSum = 0;
    const points = rawEntries.map((item, idx) => {
      const dateObj = new Date(item.ts * 1000);
      const dateStr = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const fullDateStr = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      runningSum += Math.round(item.count * scalingFactor);
      // Ensure last point hits exact totalSolved
      const cumulative = idx === rawEntries.length - 1 ? totalSolved : Math.min(runningSum, totalSolved);

      // Estimate difficulty split progress based on ratios
      const easy = Math.round(cumulative * (easySolved / totalSolved));
      const medium = Math.round(cumulative * (mediumSolved / totalSolved));
      const hard = Math.max(0, cumulative - easy - medium);

      return {
        ts: item.ts,
        dateStr,
        fullDateStr,
        daily: item.count,
        cumulative,
        easy,
        medium,
        hard,
      };
    });

    return points;
  }, [submissionCalendar, totalSolved, easySolved, mediumSolved, hardSolved]);

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 240;
  const padding = { top: 30, right: 30, bottom: 40, left: 45 };
  const graphW = svgWidth - padding.left - padding.right;
  const graphH = svgHeight - padding.top - padding.bottom;

  // Determine Max Y values based on active tab
  const maxY = useMemo(() => {
    if (activeTab === "cumulative") {
      const maxVal = Math.max(...graphData.map((d) => d.cumulative), totalSolved);
      return Math.ceil(maxVal * 1.1);
    } else if (activeTab === "daily") {
      const maxVal = Math.max(...graphData.map((d) => d.daily), 10);
      return Math.ceil(maxVal * 1.25);
    } else {
      // difficulty
      const maxVal = Math.max(...graphData.map((d) => d.medium), mediumSolved);
      return Math.ceil(maxVal * 1.2);
    }
  }, [activeTab, graphData, totalSolved, mediumSolved]);

  // Map data coordinates to SVG space
  const coords = useMemo(() => {
    const len = graphData.length;
    return graphData.map((d, i) => {
      const x =
        padding.left + (len > 1 ? (i / (len - 1)) * graphW : graphW / 2);

      const yCum =
        padding.top + graphH - (d.cumulative / maxY) * graphH;
      const yDaily =
        padding.top + graphH - (d.daily / maxY) * graphH;
      const yEasy =
        padding.top + graphH - (d.easy / maxY) * graphH;
      const yMed =
        padding.top + graphH - (d.medium / maxY) * graphH;
      const yHard =
        padding.top + graphH - (d.hard / maxY) * graphH;

      return {
        ...d,
        x,
        yCum,
        yDaily,
        yEasy,
        yMed,
        yHard,
      };
    });
  }, [graphData, graphW, graphH, maxY, padding.left, padding.top]);

  // Cubic Bezier curve path generator
  const createSmoothPath = (pts, keyY) => {
    if (!pts || pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0][keyY]}`;

    let d = `M ${pts[0].x.toFixed(1)} ${pts[0][keyY].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1[keyY] + (p2[keyY] - p0[keyY]) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2[keyY] - (p3[keyY] - p1[keyY]) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(
        1
      )} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2[keyY].toFixed(1)}`;
    }
    return d;
  };

  // Area under path generator
  const createAreaPath = (linePath, pts, keyY) => {
    if (!pts || pts.length === 0) return "";
    const firstX = pts[0].x.toFixed(1);
    const lastX = pts[pts.length - 1].x.toFixed(1);
    const bottomY = (padding.top + graphH).toFixed(1);

    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const cumulativeLine = createSmoothPath(coords, "yCum");
  const cumulativeArea = createAreaPath(cumulativeLine, coords, "yCum");

  const dailyLine = createSmoothPath(coords, "yDaily");
  const dailyArea = createAreaPath(dailyLine, coords, "yDaily");

  const easyLine = createSmoothPath(coords, "yEasy");
  const medLine = createSmoothPath(coords, "yMed");
  const hardLine = createSmoothPath(coords, "yHard");

  // Y-axis grid ticks
  const gridTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    val: Math.round(maxY * pct),
    y: padding.top + graphH - pct * graphH,
  }));

  // Peak daily solved
  const peakDaily = Math.max(...graphData.map((d) => d.daily), 0);

  return (
    <div className="flex flex-col gap-4 mt-2">
      {/* View Switcher Tabs */}
      <div className="flex justify-center sm:justify-start items-center w-full overflow-x-auto pb-1">
        <div
          className={`flex items-center gap-1.5 p-1.5 rounded-xl border shrink-0 ${
            isNight ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
          }`}
        >
          <button
            onClick={() => setActiveTab("cumulative")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "cumulative"
                ? "bg-blue-500 text-white shadow-sm"
                : isNight
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📈 Cumulative
          </button>
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "daily"
                ? "bg-blue-500 text-white shadow-sm"
                : isNight
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ⚡ Activity Spikes
          </button>
          <button
            onClick={() => setActiveTab("difficulty")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "difficulty"
                ? "bg-blue-500 text-white shadow-sm"
                : isNight
                ? "text-slate-400 hover:text-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🎯 Difficulty
          </button>
        </div>
      </div>

      {/* Stats Highlight Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between ${
            isNight ? "bg-slate-950/60 border-slate-800/80" : "bg-slate-50/80 border-slate-200/80"
          }`}
        >
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Total Target Solved
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-poppins text-blue-500">
              {totalSolved}
            </span>
            <span className="text-xs text-emerald-500 font-semibold">↑ 100%</span>
          </div>
        </div>

        <div
          className={`p-3 rounded-xl border flex flex-col justify-between ${
            isNight ? "bg-slate-950/60 border-slate-800/80" : "bg-slate-50/80 border-slate-200/80"
          }`}
        >
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Single-Day Peak
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-poppins text-amber-500">
              {peakDaily}
            </span>
            <span className="text-xs text-slate-400">problems</span>
          </div>
        </div>

        <div
          className={`p-3 rounded-xl border flex flex-col justify-between ${
            isNight ? "bg-slate-950/60 border-slate-800/80" : "bg-slate-50/80 border-slate-200/80"
          }`}
        >
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Active Milestone
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-poppins text-emerald-500">
              {graphData.length}
            </span>
            <span className="text-xs text-slate-400">active sessions</span>
          </div>
        </div>

        <div
          className={`p-3 rounded-xl border flex flex-col justify-between ${
            isNight ? "bg-slate-950/60 border-slate-800/80" : "bg-slate-50/80 border-slate-200/80"
          }`}
        >
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Med & Hard Ratio
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-poppins text-indigo-400">
              {Math.round(((mediumSolved + hardSolved) / totalSolved) * 100)}%
            </span>
            <span className="text-xs text-slate-400">advanced & core</span>
          </div>
        </div>
      </div>

      {/* Main Graph Card Container */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border relative overflow-hidden transition-all shadow-md ${
          isNight ? "bg-slate-950/80 border-slate-800" : "bg-slate-50/90 border-slate-200"
        }`}
      >
        {/* Line Chart SVG */}
        <div className="w-full overflow-x-auto select-none">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[650px] overflow-visible"
          >
            <defs>
              {/* Cumulative Gradient */}
              <linearGradient id="cumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#6366f1" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>

              {/* Daily Activity Gradient */}
              <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>

              {/* Glow Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Horizontal Grid Lines & Y-Axis Labels */}
            {gridTicks.map((tick, i) => (
              <g key={`grid-${i}`}>
                <line
                  x1={padding.left}
                  y1={tick.y}
                  x2={padding.left + graphW}
                  y2={tick.y}
                  stroke={isNight ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}
                  strokeDasharray={i === 0 ? "0" : "4 4"}
                />
                <text
                  x={padding.left - 10}
                  y={tick.y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="monospace"
                  fill={isNight ? "#94a3b8" : "#64748b"}
                >
                  {tick.val}
                </text>
              </g>
            ))}

            {/* X-Axis Date Labels */}
            {coords.map((pt, i) => {
              // Render labels selectively so they don't overlap
              const step = Math.max(1, Math.floor(coords.length / 7));
              if (i % step !== 0 && i !== coords.length - 1) return null;
              return (
                <text
                  key={`xlabel-${i}`}
                  x={pt.x}
                  y={padding.top + graphH + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="sans-serif"
                  fill={isNight ? "#94a3b8" : "#64748b"}
                >
                  {pt.dateStr}
                </text>
              );
            })}

            {/* Graph Views Rendering */}

            {/* TAB 1: CUMULATIVE GROWTH */}
            {activeTab === "cumulative" && (
              <g>
                {/* Area Fill */}
                <path d={cumulativeArea} fill="url(#cumGradient)" />

                {/* Main Curve Line */}
                <path
                  d={cumulativeLine}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />

                {/* Hover / Data Nodes */}
                {coords.map((pt, i) => {
                  const isHovered = hoveredPoint?.ts === pt.ts;
                  return (
                    <g key={`node-cum-${i}`}>
                      <circle
                        cx={pt.x}
                        cy={pt.yCum}
                        r={isHovered ? "6" : "3.5"}
                        fill={isHovered ? "#38bdf8" : "#0284c7"}
                        stroke={isNight ? "#0f172a" : "#ffffff"}
                        strokeWidth="2"
                        className="transition-all duration-150 cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      {/* Invisible larger hit box for smooth hovering */}
                      <circle
                        cx={pt.x}
                        cy={pt.yCum}
                        r="14"
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  );
                })}
              </g>
            )}

            {/* TAB 2: DAILY ACTIVITY SPIKES */}
            {activeTab === "daily" && (
              <g>
                <path d={dailyArea} fill="url(#dailyGradient)" />
                <path
                  d={dailyLine}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                />

                {coords.map((pt, i) => {
                  const isHovered = hoveredPoint?.ts === pt.ts;
                  return (
                    <g key={`node-daily-${i}`}>
                      <circle
                        cx={pt.x}
                        cy={pt.yDaily}
                        r={isHovered ? "6" : "3.5"}
                        fill={isHovered ? "#fbbf24" : "#d97706"}
                        stroke={isNight ? "#0f172a" : "#ffffff"}
                        strokeWidth="2"
                        className="transition-all duration-150 cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      <circle
                        cx={pt.x}
                        cy={pt.yDaily}
                        r="14"
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  );
                })}
              </g>
            )}

            {/* TAB 3: DIFFICULTY BREAKDOWN */}
            {activeTab === "difficulty" && (
              <g>
                {/* Easy Line */}
                <path
                  d={easyLine}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Medium Line */}
                <path
                  d={medLine}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
                {/* Hard Line */}
                <path
                  d={hardLine}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {coords.map((pt, i) => {
                  const isHovered = hoveredPoint?.ts === pt.ts;
                  return (
                    <g key={`node-diff-${i}`}>
                      <circle
                        cx={pt.x}
                        cy={pt.yMed}
                        r={isHovered ? "6" : "3.5"}
                        fill="#f59e0b"
                        stroke={isNight ? "#0f172a" : "#ffffff"}
                        strokeWidth="2"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      <circle
                        cx={pt.x}
                        cy={pt.yMed}
                        r="14"
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* Legend Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-700/20 text-xs">
          <div className="flex items-center gap-4">
            {activeTab === "cumulative" && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded bg-sky-400" />
                <span className={isNight ? "text-slate-300" : "text-slate-700"}>
                  Cumulative Problems Line
                </span>
              </div>
            )}
            {activeTab === "daily" && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded bg-amber-400" />
                <span className={isNight ? "text-slate-300" : "text-slate-700"}>
                  Daily Solved Submissions
                </span>
              </div>
            )}
            {activeTab === "difficulty" && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className={isNight ? "text-slate-300" : "text-slate-700"}>Easy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className={isNight ? "text-slate-300" : "text-slate-700"}>Medium</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className={isNight ? "text-slate-300" : "text-slate-700"}>Hard</span>
                </div>
              </>
            )}
          </div>

          <span className={`text-[11px] ${isNight ? "text-slate-400" : "text-slate-500"}`}>
            Hover over graph points for exact metrics
          </span>
        </div>

        {/* Interactive Floating Tooltip */}
        {hoveredPoint && (
          <div
            className={`mt-2 p-3 rounded-xl border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all duration-200 animate-in fade-in ${
              isNight
                ? "bg-slate-900 border-slate-700 text-slate-100 shadow-blue-950/40"
                : "bg-white border-slate-200 text-slate-900 shadow-slate-300/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-semibold text-xs font-mono">
                {hoveredPoint.fullDateStr}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-slate-400">Solved on day: </span>
                <span className="font-bold text-amber-500">
                  {hoveredPoint.daily} {hoveredPoint.daily === 1 ? "problem" : "problems"}
                </span>
              </div>
              <div className="h-3 w-px bg-slate-700/40" />
              <div>
                <span className="text-slate-400">Total Cumulative: </span>
                <span className="font-bold text-blue-500">
                  {hoveredPoint.cumulative} solved
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsistencyLineGraph;
