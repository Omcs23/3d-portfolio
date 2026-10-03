import { useState, useEffect } from "react";
import { Route, HashRouter as Router, Routes, useLocation } from "react-router-dom";
import { Footer, Navbar, Preloader, PortfolioGuideRobot, DevTerminal } from "./components";
import { About, Contact, Home, Projects } from "./pages";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

const MainContent = () => {
  const { isNight } = useTheme();
  const [hasPreloaded, setHasPreloaded] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Global Ctrl+K / Cmd+K keyboard shortcut listener to toggle Developer Terminal
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <>
      {!hasPreloaded && (
        <Preloader onComplete={() => setHasPreloaded(true)} />
      )}
      <main
        className={`w-full relative ${
          isHome ? "h-screen h-[100dvh] overflow-hidden" : "min-h-screen"
        } ${
          isNight ? "bg-slate-950 text-slate-100" : "bg-slate-300/20 text-slate-800"
        }`}
      >
        <Navbar onOpenTerminal={() => setIsTerminalOpen(true)} />
        <Routes>
          <Route path="/" element={<Home hasPreloaded={hasPreloaded} />} />
          <Route
            path="/*"
            element={
              <>
                <Routes>
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>
        <PortfolioGuideRobot />

        {/* Global Floating Cyberpunk Terminal Launcher */}
        <button
          onClick={() => setIsTerminalOpen(true)}
          title="Open Developer Terminal (Ctrl+K)"
          aria-label="Open Developer CLI Terminal"
          className={`fixed bottom-4 left-4 z-40 p-2.5 sm:p-3 rounded-2xl border shadow-2xl flex items-center gap-2 transition-all duration-300 hover:scale-110 active:scale-95 group ${
            isNight
              ? "bg-slate-950/90 text-cyan-400 border-cyan-500/40 hover:border-cyan-400 shadow-cyan-950/50 backdrop-blur-md"
              : "bg-white/90 text-cyan-700 border-cyan-500/50 hover:border-cyan-600 shadow-cyan-500/20 backdrop-blur-md"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span className="font-mono font-extrabold text-xs sm:text-sm tracking-wider">&gt;_ CLI</span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700/60 opacity-80 group-hover:opacity-100">
            Ctrl+K
          </span>
        </button>

        {/* Interactive DevTerminal Modal */}
        <DevTerminal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
        />
      </main>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <MainContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
