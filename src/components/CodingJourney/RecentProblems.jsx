import { useTheme } from "../../context/ThemeContext";

const RecentProblems = ({ submissions = [] }) => {
  const { isNight } = useTheme();

  if (!submissions || submissions.length === 0) {
    return null;
  }

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <div className="flex items-center justify-between">
        <h4
          className={`text-sm font-semibold tracking-wide font-poppins uppercase ${
            isNight ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Recent Solved Problems
        </h4>
        <span
          className={`text-xs ${
            isNight ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Latest Submissions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {submissions.slice(0, 6).map((item, idx) => (
          <a
            key={`${item.titleSlug}-${idx}`}
            href={`https://leetcode.com/problems/${item.titleSlug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 group hover:-translate-y-0.5 ${
              isNight
                ? "bg-slate-950/60 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80"
                : "bg-slate-50/80 border-slate-200/80 hover:border-blue-400 hover:bg-white hover:shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm shrink-0">
                ✓
              </div>
              <div className="truncate">
                <h5
                  className={`text-sm font-semibold truncate group-hover:text-blue-500 transition-colors ${
                    isNight ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {item.title}
                </h5>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      isNight
                        ? "bg-slate-800 text-slate-300"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {item.lang || "Java"}
                  </span>
                  <span
                    className={`text-[11px] ${
                      isNight ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {formatTimeAgo(item.timestamp)}
                  </span>
                </div>
              </div>
            </div>

            <span className="text-slate-400 group-hover:text-blue-500 transition-colors ml-2">
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RecentProblems;
