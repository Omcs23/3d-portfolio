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

        {/* Interactive DevTerminal Modal */}

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
