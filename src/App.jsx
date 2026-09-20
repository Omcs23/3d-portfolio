import { useState } from "react";
import { Route, HashRouter as Router, Routes, useLocation } from "react-router-dom";
import { Footer, Navbar, Preloader, PortfolioGuideRobot } from "./components";
import { About, Contact, Home, Projects } from "./pages";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

const MainContent = () => {
  const { isNight } = useTheme();
  const [hasPreloaded, setHasPreloaded] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

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
        <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
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
