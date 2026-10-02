import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

const BadgeModal = ({ cert, onClose }) => {
  const { isNight } = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (cert && typeof cert.activeBadgeIndex === "number") {
      setActiveTab(cert.activeBadgeIndex);
    } else {
      setActiveTab(0);
    }
  }, [cert]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!cert) return null;

  const hasMultipleBadges = cert.badges && cert.badges.length > 0;
  const currentBadge = hasMultipleBadges ? cert.badges[activeTab] || cert.badges[0] : cert;

  const displayBadgeImage = currentBadge.badgeImage || cert.badgeImage;
  const displayTitle = currentBadge.title || cert.title;
  const displayIssuer = currentBadge.issuer || cert.issuer || cert.company_name;
  const displayDate = currentBadge.date || cert.date;
  const displayPlatform = currentBadge.verificationPlatform || cert.verificationPlatform || "Official";
  const displaySkills = currentBadge.skills || cert.skills;

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
          className={`sticky top-0 z-20 px-5 sm:px-6 py-4 border-b flex items-center justify-between gap-3 font-outfit ${
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
                {hasMultipleBadges ? `Verified Credential (${activeTab + 1}/${cert.badges.length})` : "Verified Credential"}
              </span>
              <h3 className="text-base sm:text-lg font-bold font-poppins leading-tight truncate">
                {displayTitle}
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

        {/* Multi-Badge Tab Switcher */}
        {hasMultipleBadges && (
          <div
            className={`px-4 sm:px-6 py-2.5 border-b flex items-center gap-1.5 overflow-x-auto custom-scrollbar ${
              isNight ? "bg-slate-950/50 border-slate-800" : "bg-slate-50 border-slate-100"
            }`}
          >
            {cert.badges.map((b, index) => {
              const isActive = index === activeTab;
              return (
                <button
                  key={b.id || index}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                      : isNight
                      ? "bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{b.title.includes("MERN") ? "💻 MERN Stack" : b.title.includes("DSA") ? "⚡ DSA (Java)" : "☕ Java Foundation"}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-4 sm:space-y-5">
          {/* Badge Image Showcase */}
          {displayBadgeImage && (
            <div className="flex flex-col items-center justify-center">
              <div
                className={`group relative p-3 sm:p-4 rounded-2xl border flex items-center justify-center transition-all w-full max-w-[200px] ${
                  isNight
                    ? "bg-slate-950/60 border-slate-800 shadow-inner"
                    : "bg-slate-50 border-slate-200/80"
                }`}
              >
                <img
                  src={displayBadgeImage}
                  alt={`${displayTitle} Badge`}
                  className="w-28 h-28 sm:w-32 sm:h-32 object-contain aspect-square drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {displayPlatform} Verified
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
              <span className="font-semibold text-right">{displayIssuer}</span>
            </div>
            {displayDate && (
              <div className="flex justify-between items-center gap-2">
                <span className={isNight ? "text-slate-400" : "text-slate-500"}>
                  Completion Date:
                </span>
                <span className="font-semibold text-right">{displayDate}</span>
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
            {displayPlatform && (
              <div className="flex justify-between items-center gap-2">
                <span className={isNight ? "text-slate-400" : "text-slate-500"}>
                  Platform:
                </span>
                <span className="font-semibold text-sky-500 flex items-center gap-1 text-right">
                  🛡️ {displayPlatform}
                </span>
              </div>
            )}
          </div>

          {/* Skills Tags */}
          {displaySkills && displaySkills.length > 0 && (
            <div>
              <h4
                className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Validated Technical Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {displaySkills.map((skill) => (
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
              <span>Verify on {displayPlatform}</span>
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
