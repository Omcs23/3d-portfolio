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
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <h4
            className={`text-sm font-bold tracking-wider font-mono uppercase ${
              isNight ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Recent Solved Problems
          </h4>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Latest Verified Submissions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {submissions.slice(0, 6).map((item, idx) => (
          <a
            key={`${item.titleSlug}-${idx}`}
            href={`https://leetcode.com/problems/${item.titleSlug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl ${
              isNight
                ? "bg-slate-950/70 border-slate-800/90 hover:border-cyan-500/50 hover:bg-slate-900/80 shadow-slate-950/40"
                : "bg-slate-50/90 border-slate-200/90 hover:border-cyan-400 hover:bg-white hover:shadow-lg"
            }`}
          >
            <div className="flex items-center gap-3.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-emerald-500/10">
                ✓
              </div>
              <div className="truncate">
                <h5
                  className={`text-sm font-bold truncate font-outfit group-hover:text-cyan-400 transition-colors ${
                    isNight ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {item.title}
                </h5>
                <div className="flex items-center gap-2.5 mt-1 font-mono">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700/60 uppercase">
                    {item.lang || "Java"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatTimeAgo(item.timestamp)}
                  </span>
                </div>
              </div>
            </div>

            <span className="text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all text-sm font-bold ml-2">
              ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RecentProblems;
