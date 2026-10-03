import { useMemo, useState, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

const ConsistencyLineGraph = ({ submissionCalendar = {}, stats = {} }) => {
  const { isNight } = useTheme();
  const [activeTab, setActiveTab] = useState("cumulative"); // "cumulative" | "daily" | "difficulty"
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const svgRef = useRef(null);

  const totalSolved = stats?.totalSolved || 78;
  const easySolved = stats?.easySolved || 30;
  const mediumSolved = stats?.mediumSolved || 34;
  const hardSolved = stats?.hardSolved || 14;

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
      const cumulative = idx === rawEntries.length - 1 ? totalSolved : Math.min(runningSum, totalSolved);

      const easy = Math.round(cumulative * (easySolved / (totalSolved || 1)));
      const medium = Math.round(cumulative * (mediumSolved / (totalSolved || 1)));
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

  const svgWidth = 800;
  const svgHeight = 220;
  const padding = { top: 25, right: 25, bottom: 40, left: 40 };
  const graphW = svgWidth - padding.left - padding.right;
  const graphH = svgHeight - padding.top - padding.bottom;

  const maxY = useMemo(() => {
    if (activeTab === "cumulative") {
      const maxVal = Math.max(...graphData.map((d) => d.cumulative), totalSolved);
      return Math.ceil(maxVal * 1.12);
    } else if (activeTab === "daily") {
      const maxVal = Math.max(...graphData.map((d) => d.daily), 10);
      return Math.ceil(maxVal * 1.25);
    } else {
      const maxVal = Math.max(...graphData.map((d) => d.medium), mediumSolved);
      return Math.ceil(maxVal * 1.2);
    }
  }, [activeTab, graphData, totalSolved, mediumSolved]);

  const coords = useMemo(() => {
    const len = graphData.length;
    return graphData.map((d, i) => {
      const x = padding.left + (len > 1 ? (i / (len - 1)) * graphW : graphW / 2);
      const yCum = padding.top + graphH - (d.cumulative / maxY) * graphH;
      const yDaily = padding.top + graphH - (d.daily / maxY) * graphH;
      const yEasy = padding.top + graphH - (d.easy / maxY) * graphH;
      const yMed = padding.top + graphH - (d.medium / maxY) * graphH;
      const yHard = padding.top + graphH - (d.hard / maxY) * graphH;

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

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2[keyY].toFixed(1)}`;
    }
    return d;
  };

  const createAreaPath = (linePath, pts) => {
    if (!pts || pts.length === 0) return "";
    const firstX = pts[0].x.toFixed(1);
    const lastX = pts[pts.length - 1].x.toFixed(1);
    const bottomY = (padding.top + graphH).toFixed(1);

    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const cumulativeLine = createSmoothPath(coords, "yCum");
  const cumulativeArea = createAreaPath(cumulativeLine, coords);

  const dailyLine = createSmoothPath(coords, "yDaily");
  const dailyArea = createAreaPath(dailyLine, coords);

  const easyLine = createSmoothPath(coords, "yEasy");
  const medLine = createSmoothPath(coords, "yMed");
  const hardLine = createSmoothPath(coords, "yHard");

  const gridTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    val: Math.round(maxY * pct),
    y: padding.top + graphH - pct * graphH,
  }));

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const scaleX = svgWidth / rect.width;
    const svgX = clientX * scaleX;

    let closest = coords[0];
    let minDistance = Infinity;

    coords.forEach((pt) => {
      const dist = Math.abs(pt.x - svgX);
      if (dist < minDistance) {
        minDistance = dist;
        closest = pt;
      }
    });

    if (closest) {
      setHoveredPoint(closest);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="flex flex-col gap-3 mt-1">
      {/* View Switcher Tabs Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse" />
          <span className={`text-xs font-bold font-mono uppercase tracking-wider ${isNight ? "text-slate-300" : "text-slate-700"}`}>
            Analytics Graph
          </span>
        </div>

        {/* Clean Individual Capsule Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("cumulative")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
              activeTab === "cumulative"
                ? "bg-blue-600 text-white border border-blue-500 shadow-blue-500/25"
                : isNight
                ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
            }`}
          >
            <span>📈 Cumulative</span>
          </button>
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
              activeTab === "daily"
                ? "bg-amber-600 text-white border border-amber-500 shadow-amber-500/25"
                : isNight
                ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
            }`}
          >
            <span>⚡ Activity Spikes</span>
          </button>
          <button
            onClick={() => setActiveTab("difficulty")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
              activeTab === "difficulty"
                ? "bg-emerald-600 text-white border border-emerald-500 shadow-emerald-500/25"
                : isNight
                ? "bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
            }`}
          >
            <span>🎯 Difficulty Split</span>
          </button>
        </div>
      </div>

      {/* Minimal Graph Card Container */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border relative overflow-hidden transition-all duration-300 shadow-xl backdrop-blur-xl ${
          isNight
            ? "bg-gradient-to-b from-slate-950/90 to-slate-900/90 border-slate-800/90 shadow-slate-950/60"
            : "bg-gradient-to-b from-white to-slate-50 border-slate-200/90 shadow-slate-200/50"
        }`}
      >
        {/* Line Chart SVG */}
        <div className="w-full overflow-x-auto select-none no-scrollbar">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto min-w-[600px] overflow-visible cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id="cumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isNight ? "#38bdf8" : "#2563eb"} stopOpacity="0.45" />
                <stop offset="100%" stopColor={isNight ? "#6366f1" : "#2563eb"} stopOpacity="0.0" />
              </linearGradient>

              <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>

              <filter id="glowEffect" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Grid Background Lines */}
            {gridTicks.map((tick, i) => (
              <g key={`grid-${i}`}>
                <line
                  x1={padding.left}
                  y1={tick.y}
                  x2={padding.left + graphW}
                  y2={tick.y}
                  stroke={isNight ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}
                  strokeDasharray={i === 0 ? "0" : "3 3"}
                />
                <text
                  x={padding.left - 10}
                  y={tick.y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                  fill={isNight ? "#94a3b8" : "#475569"}
                >
                  {tick.val}
                </text>
              </g>
            ))}

            {/* X-Axis Date Labels */}
            {coords.map((pt, i) => {
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
                  fontWeight="600"
                  fill={isNight ? "#94a3b8" : "#475569"}
                >
                  {pt.dateStr}
                </text>
              );
            })}

            {/* Crosshair Vertical Scan Line */}
            {hoveredPoint && (
              <line
                x1={hoveredPoint.x}
                y1={padding.top}
                x2={hoveredPoint.x}
                y2={padding.top + graphH}
                stroke={activeTab === "daily" ? "#f59e0b" : isNight ? "#38bdf8" : "#2563eb"}
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            )}

            {/* TAB 1: CUMULATIVE GROWTH */}
            {activeTab === "cumulative" && (
              <g>
                <path d={cumulativeArea} fill="url(#cumGradient)" />
                <path
                  d={cumulativeLine}
                  fill="none"
                  stroke={isNight ? "#38bdf8" : "#2563eb"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glowEffect)"
                />

                {coords.map((pt, i) => {
                  const isHovered = hoveredPoint?.ts === pt.ts;
                  return (
                    <g key={`node-cum-${i}`}>
                      <circle
                        cx={pt.x}
                        cy={pt.yCum}
                        r={isHovered ? "6" : "3"}
                        fill={isHovered ? (isNight ? "#38bdf8" : "#2563eb") : (isNight ? "#0284c7" : "#1d4ed8")}
                        stroke={isNight ? "#090d16" : "#ffffff"}
                        strokeWidth="2"
                        className="transition-all duration-150"
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
                  filter="url(#glowEffect)"
                />

                {coords.map((pt, i) => {
                  const isHovered = hoveredPoint?.ts === pt.ts;
                  return (
                    <g key={`node-daily-${i}`}>
                      <circle
                        cx={pt.x}
                        cy={pt.yDaily}
                        r={isHovered ? "6" : "3"}
                        fill={isHovered ? "#fbbf24" : "#d97706"}
                        stroke={isNight ? "#090d16" : "#ffffff"}
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
              </g>
            )}

            {/* TAB 3: DIFFICULTY BREAKDOWN */}
            {activeTab === "difficulty" && (
              <g>
                <path
                  d={easyLine}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d={medLine}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#glowEffect)"
                />
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
                        r={isHovered ? "6" : "3"}
                        fill="#f59e0b"
                        stroke={isNight ? "#090d16" : "#ffffff"}
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* Legend Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3 font-medium">
            {activeTab === "cumulative" && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 rounded bg-blue-600 dark:bg-cyan-400" />
                <span className={isNight ? "text-slate-300" : "text-slate-800"}>
                  Cumulative Total Growth
                </span>
              </div>
            )}
            {activeTab === "daily" && (
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 rounded bg-amber-500" />
                <span className={isNight ? "text-slate-300" : "text-slate-800"}>
                  Daily Submissions
                </span>
              </div>
            )}
            {activeTab === "difficulty" && (
              <>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className={isNight ? "text-slate-300" : "text-slate-800"}>Easy</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className={isNight ? "text-slate-300" : "text-slate-800"}>Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className={isNight ? "text-slate-300" : "text-slate-800"}>Hard</span>
                </div>
              </>
            )}
          </div>

          <span className={`text-[11px] font-mono ${isNight ? "text-slate-400" : "text-slate-600"}`}>
            Hover graph points for exact metrics
          </span>
        </div>

        {/* Dynamic Glass Tooltip Bar */}
        {hoveredPoint && (
          <div
            className={`mt-2 p-2.5 rounded-lg border shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
              isNight
                ? "bg-slate-900 border-slate-700 text-slate-100"
                : "bg-white border-slate-300 text-slate-900 shadow-md"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse" />
              <span className="font-bold text-xs font-mono">
                {hoveredPoint.fullDateStr}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-poppins">
              <div>
                <span className={isNight ? "text-slate-400" : "text-slate-600"}>Daily: </span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                  +{hoveredPoint.daily} {hoveredPoint.daily === 1 ? "prob" : "probs"}
                </span>
              </div>
              <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />
              <div>
                <span className={isNight ? "text-slate-400" : "text-slate-600"}>Total: </span>
                <span className="font-extrabold text-blue-600 dark:text-cyan-400 font-mono">
                  {hoveredPoint.cumulative}
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
