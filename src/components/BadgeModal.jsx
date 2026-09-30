import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const BadgeModal = ({ cert, onClose }) => {
  const { isNight } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!cert) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl border shadow-2xl transition-all transform scale-100 overflow-hidden ${
          isNight
            ? "bg-slate-900 border-slate-700/80 text-white shadow-sky-950/50"
            : "bg-white border-slate-200 text-slate-900 shadow-sky-500/20"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Title & Close Button */}
        <div
          className={`sticky top-0 z-20 px-5 sm:px-6 py-4 border-b flex items-center justify-between gap-3 ${
            isNight
              ? "bg-slate-900/95 border-slate-800 text-white backdrop-blur-md"
              : "bg-white/95 border-slate-100 text-slate-900 backdrop-blur-md"
          }`}
        >
          <div className="flex items-center gap-3 pr-2 min-w-0">
            {cert.icon && (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center p-1.5 shadow-inner shrink-0"
                style={{ backgroundColor: cert.iconBg || "#e2e8f0" }}
              >
                <img
                  src={cert.icon}
                  alt={cert.company_name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-500 block">
                Verified Credential
              </span>
              <h3 className="text-base sm:text-lg font-bold font-poppins leading-tight truncate">
                {cert.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            aria-label="Close modal"
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all shrink-0 active:scale-90 ${
              isNight
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
            }`}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-4 sm:space-y-5">
          {/* Badge Image Showcase */}
          {cert.badgeImage && (
            <div className="flex flex-col items-center justify-center">
              <div
                className={`group relative p-4 sm:p-5 rounded-2xl border flex items-center justify-center transition-all w-full max-w-[260px] ${
                  isNight
                    ? "bg-slate-950/60 border-slate-800 shadow-inner"
                    : "bg-slate-50 border-slate-200/80"
                }`}
              >
                <img
                  src={cert.badgeImage}
                  alt={`${cert.title} Badge`}
                  className="w-44 h-44 sm:w-52 sm:h-52 object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {cert.verificationPlatform || "Official"} Verified
                </div>
              </div>
            </div>
          )}

          {/* Certificate Metadata Details */}
          <div
            className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm space-y-2 border ${
              isNight ? "bg-slate-800/40 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex justify-between items-center gap-2">
              <span className={isNight ? "text-slate-400" : "text-slate-500"}>
                Issuing Body:
              </span>
              <span className="font-semibold text-right">{cert.issuer || cert.company_name}</span>
            </div>
            {cert.date && (
              <div className="flex justify-between items-center gap-2">
                <span className={isNight ? "text-slate-400" : "text-slate-500"}>
                  Issue Date:
                </span>
                <span className="font-semibold text-right">{cert.date}</span>
              </div>
            )}
            {cert.validUntil && (
              <div className="flex justify-between items-center gap-2">
                <span className={isNight ? "text-slate-400" : "text-slate-500"}>
                  Valid Until:
                </span>
                <span className="font-semibold text-emerald-500 text-right">{cert.validUntil}</span>
              </div>
            )}
            {cert.certId && (
              <div className="flex justify-between items-center gap-2">
                <span className={isNight ? "text-slate-400" : "text-slate-500"}>
                  Credential ID:
                </span>
                <span className="font-mono text-[11px] sm:text-xs font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 break-all text-right">
                  {cert.certId}
                </span>
              </div>
            )}
            {cert.verificationPlatform && (
              <div className="flex justify-between items-center gap-2">
                <span className={isNight ? "text-slate-400" : "text-slate-500"}>
                  Platform:
                </span>
                <span className="font-semibold text-sky-500 flex items-center gap-1 text-right">
                  🛡️ {cert.verificationPlatform}
                </span>
              </div>
            )}
          </div>

          {/* Skills Tags */}
          {cert.skills && cert.skills.length > 0 && (
            <div>
              <h4
                className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Validated Technical Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      isNight
                        ? "bg-slate-800/80 border-slate-700 text-slate-300"
                        : "bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div
          className={`p-3.5 sm:p-4 border-t flex flex-col sm:flex-row items-center gap-2.5 ${
            isNight ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
          }`}
        >
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <span>Verify on {cert.verificationPlatform || "Official Site"}</span>
              <span className="text-sm">↗</span>
            </a>
          )}
          <button
            onClick={onClose}
            type="button"
            className={`w-full sm:w-auto py-2.5 px-5 rounded-xl font-medium text-xs sm:text-sm transition-all active:scale-95 border ${
              isNight
                ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeModal;
