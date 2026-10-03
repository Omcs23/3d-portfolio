import { useMemo, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const ActivityHeatmap = ({ submissionCalendar = {} }) => {
  const { isNight } = useTheme();
  const [hoveredDay, setHoveredDay] = useState(null);

  const heatmapData = useMemo(() => {
    const activeDates = {};
    if (submissionCalendar) {
      Object.entries(submissionCalendar).forEach(([tsStr, count]) => {
        const ts = parseInt(tsStr, 10);
        if (!isNaN(ts) && count > 0) {
          const dateStr = new Date(ts * 1000).toISOString().split("T")[0];
          activeDates[dateStr] = (activeDates[dateStr] || 0) + count;
        }
      });
    }

    const today = new Date();
    const days = [];
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);

    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const currentIter = new Date(startDate);
    while (currentIter <= today || days.length % 7 !== 0) {
      const dateStr = currentIter.toISOString().split("T")[0];
      const count = activeDates[dateStr] || 0;
      
      days.push({
        date: new Date(currentIter),
        dateStr,
        count,
        isFuture: currentIter > today
      });

      currentIter.setDate(currentIter.getDate() + 1);
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    const months = [];
    let currentMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week.find((d) => !d.isFuture);
      if (firstDayOfWeek) {
        const monthIndex = firstDayOfWeek.date.getMonth();
        if (monthIndex !== currentMonth) {
          currentMonth = monthIndex;
          const monthName = firstDayOfWeek.date.toLocaleString("default", {
            month: "short",
          });
          months.push({ name: monthName, weekIndex });
        }
      }
    });

    return { weeks, months };
  }, [submissionCalendar]);

  const getIntensityClass = (count, isFuture) => {
    if (isFuture) return "opacity-0 pointer-events-none";
    if (count === 0)
      return isNight
        ? "bg-slate-900/80 border-slate-800/60"
        : "bg-slate-200 border-slate-300";
    if (count === 1)
      return isNight
        ? "bg-emerald-950/90 border-emerald-800/80 text-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.2)]"
        : "bg-emerald-200 border-emerald-300 text-emerald-900";
    if (count <= 3)
      return isNight
        ? "bg-emerald-800/90 border-emerald-600/90 text-emerald-100 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
        : "bg-emerald-300 border-emerald-400 text-emerald-950";
    if (count <= 5)
      return isNight
        ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]"
        : "bg-emerald-500 border-emerald-600 text-white";
    return isNight
      ? "bg-emerald-400 border-emerald-300 text-slate-950 font-bold shadow-[0_0_12px_rgba(52,211,153,0.6)]"
      : "bg-emerald-600 border-emerald-700 text-white font-bold";
  };

  const formatDate = (dateObj) => {
    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col gap-2.5 mt-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h4
            className={`text-xs font-bold tracking-wider font-mono uppercase ${
              isNight ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Yearly Activity Heatmap
          </h4>
        </div>
        <span className={`text-xs font-mono ${isNight ? "text-slate-400" : "text-slate-600"}`}>
          Past 365 Days
        </span>
      </div>

      <div
        className={`p-3.5 sm:p-4 rounded-xl border transition-all overflow-x-auto relative backdrop-blur-md ${
          isNight
            ? "bg-slate-950/80 border-slate-800/90 shadow-md"
            : "bg-slate-50 border-slate-200 shadow-sm"
        }`}
      >
        <div className="min-w-[650px] flex flex-col gap-1.5 select-none">
          {/* Month Labels Header */}
          <div className="flex text-xs pl-8 relative h-4">
            {heatmapData.months.map((m, idx) => (
              <span
                key={`${m.name}-${idx}`}
                className={`absolute ${
                  isNight ? "text-slate-400" : "text-slate-700"
                } font-bold font-mono text-[11px]`}
                style={{ left: `${m.weekIndex * 14.5 + 32}px` }}
              >
                {m.name}
              </span>
            ))}
          </div>

          {/* Grid Container with Day Labels */}
          <div className="flex gap-2">
            {/* Day Labels Column */}
            <div className="flex flex-col gap-[3px] text-[10px] font-mono justify-between pr-1">
              {daysOfWeek.map((day, i) => (
                <span
                  key={day}
                  className={`h-3 flex items-center ${
                    i % 2 === 1
                      ? isNight
                        ? "text-slate-400 font-semibold"
                        : "text-slate-700 font-bold"
                      : "opacity-0"
                  }`}
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Heatmap Weeks Grid */}
            <div className="flex gap-[3px] flex-1">
              {heatmapData.weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((day) => (
                    <div
                      key={day.dateStr}
                      onMouseEnter={() => !day.isFuture && setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3 h-3 rounded-[2.5px] border transition-all duration-150 cursor-pointer hover:scale-150 hover:z-20 ${getIntensityClass(
                        day.count,
                        day.isFuture
                      )}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <span
              className={`text-[11px] font-mono ${
                isNight ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Hover heatmap squares for daily details
            </span>

            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className={isNight ? "text-slate-400" : "text-slate-700"}>
                Less
              </span>
              <div
                className={`w-3 h-3 rounded-[2.5px] border ${
                  isNight
                    ? "bg-slate-900/80 border-slate-800/60"
                    : "bg-slate-200 border-slate-300"
                }`}
              />
              <div
                className={`w-3 h-3 rounded-[2.5px] border ${
                  isNight ? "bg-emerald-950/90 border-emerald-800/80" : "bg-emerald-200 border-emerald-300"
                }`}
              />
              <div
                className={`w-3 h-3 rounded-[2.5px] border ${
                  isNight ? "bg-emerald-800/90 border-emerald-600/90" : "bg-emerald-300 border-emerald-400"
                }`}
              />
              <div
                className={`w-3 h-3 rounded-[2.5px] border ${
                  isNight ? "bg-emerald-500 border-emerald-400" : "bg-emerald-500 border-emerald-600"
                }`}
              />
              <div
                className={`w-3 h-3 rounded-[2.5px] border ${
                  isNight ? "bg-emerald-400 border-emerald-300" : "bg-emerald-600 border-emerald-700"
                }`}
              />
              <span className={isNight ? "text-slate-400" : "text-slate-700"}>
                More
              </span>
            </div>
          </div>
        </div>

        {/* Floating Day Detail Bar */}
        {hoveredDay && (
          <div
            className={`mt-2 p-2.5 rounded-lg text-xs border shadow-md flex items-center justify-between transition-all ${
              isNight
                ? "bg-slate-900 border-slate-700 text-slate-100"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            <span className="font-bold font-mono text-blue-600 dark:text-cyan-400">{formatDate(hoveredDay.date)}</span>
            <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
              {hoveredDay.count === 0
                ? "No submissions"
                : `+${hoveredDay.count} problem${
                    hoveredDay.count > 1 ? "s" : ""
                  } solved`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHeatmap;
