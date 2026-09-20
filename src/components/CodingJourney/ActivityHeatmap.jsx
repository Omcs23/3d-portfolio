import { useMemo, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const ActivityHeatmap = ({ submissionCalendar = {} }) => {
  const { isNight } = useTheme();
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate 365 days ending today
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
    
    // Calculate start date (364 days ago)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);

    // Align start to the preceding Sunday to make a neat grid
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

    // Group into weeks (columns of 7 days)
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    // Generate Month Labels
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
        ? "bg-slate-800/70 border-slate-700/50"
        : "bg-slate-200/80 border-slate-300/60";
    if (count === 1)
      return isNight
        ? "bg-emerald-900/90 border-emerald-700/80 text-emerald-200"
        : "bg-emerald-200 border-emerald-300 text-emerald-900";
    if (count <= 3)
      return isNight
        ? "bg-emerald-700 border-emerald-600 text-emerald-100"
        : "bg-emerald-400 border-emerald-500 text-emerald-900";
    if (count <= 5)
      return isNight
        ? "bg-emerald-500 border-emerald-400 text-white"
        : "bg-emerald-500 border-emerald-600 text-white";
    return isNight
      ? "bg-emerald-400 border-emerald-300 text-slate-950 font-bold"
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
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4
          className={`text-sm font-semibold tracking-wide font-poppins uppercase ${
            isNight ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Yearly Activity Heatmap
        </h4>
        <span
          className={`text-xs ${
            isNight ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Past 365 Days
        </span>
      </div>

      <div
        className={`p-4 sm:p-5 rounded-xl border transition-colors overflow-x-auto relative ${
          isNight ? "bg-slate-950/60 border-slate-800" : "bg-slate-50/80 border-slate-200"
        }`}
      >
        <div className="min-w-[680px] flex flex-col gap-2">
          {/* Month Labels Header */}
          <div className="flex text-xs pl-8 relative h-4">
            {heatmapData.months.map((m, idx) => (
              <span
                key={`${m.name}-${idx}`}
                className={`absolute ${
                  isNight ? "text-slate-400" : "text-slate-500"
                } font-medium text-[11px]`}
                style={{ left: `${m.weekIndex * 15 + 32}px` }}
              >
                {m.name}
              </span>
            ))}
          </div>

          {/* Grid Container with Day Labels */}
          <div className="flex gap-2">
            {/* Day Labels Column */}
            <div className="flex flex-col gap-[3px] text-[10px] font-mono justify-between pr-1 select-none">
              {daysOfWeek.map((day, i) => (
                <span
                  key={day}
                  className={`h-3 flex items-center ${
                    i % 2 === 1
                      ? isNight
                        ? "text-slate-400"
                        : "text-slate-500"
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
                      className={`w-3 h-3 rounded-[3px] border transition-transform duration-100 cursor-pointer hover:scale-125 hover:z-10 ${getIntensityClass(
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
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/20 text-xs">
            <span
              className={`text-[11px] ${
                isNight ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Hover over a day to view details
            </span>

            <div className="flex items-center gap-1.5 text-[11px]">
              <span className={isNight ? "text-slate-400" : "text-slate-500"}>
                Less
              </span>
              <div
                className={`w-3 h-3 rounded-[3px] border ${
                  isNight
                    ? "bg-slate-800/70 border-slate-700/50"
                    : "bg-slate-200/80 border-slate-300/60"
                }`}
              />
              <div
                className={`w-3 h-3 rounded-[3px] border ${
                  isNight ? "bg-emerald-900/90 border-emerald-700/80" : "bg-emerald-200 border-emerald-300"
                }`}
              />
              <div
                className={`w-3 h-3 rounded-[3px] border ${
                  isNight ? "bg-emerald-700 border-emerald-600" : "bg-emerald-400 border-emerald-500"
                }`}
              />
              <div
                className={`w-3 h-3 rounded-[3px] border ${
                  isNight ? "bg-emerald-500 border-emerald-400" : "bg-emerald-500 border-emerald-600"
                }`}
              />
              <div
                className={`w-3 h-3 rounded-[3px] border ${
                  isNight ? "bg-emerald-400 border-emerald-300" : "bg-emerald-600 border-emerald-700"
                }`}
              />
              <span className={isNight ? "text-slate-400" : "text-slate-500"}>
                More
              </span>
            </div>
          </div>
        </div>

        {/* Floating Tooltip */}
        {hoveredDay && (
          <div
            className={`mt-2 p-2.5 rounded-lg text-xs border shadow-xl flex items-center justify-between transition-opacity ${
              isNight
                ? "bg-slate-900 border-slate-700 text-slate-100"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            <span className="font-medium">{formatDate(hoveredDay.date)}</span>
            <span className="font-bold text-emerald-500">
              {hoveredDay.count === 0
                ? "No submissions"
                : `${hoveredDay.count} problem${
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
