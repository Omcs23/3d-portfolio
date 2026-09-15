import { useState } from "react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { Footer, Navbar, Preloader } from "./components";
import { About, Contact, Home, Projects } from "./pages";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

const MainContent = () => {
  const { isNight } = useTheme();
  const [hasPreloaded, setHasPreloaded] = useState(false);

  return (
    <main
      className={`min-h-screen w-full transition-colors duration-500 ${
        isNight ? "bg-slate-950 text-slate-100" : "bg-slate-300/20 text-slate-800"
      }`}
    >
      {!hasPreloaded && (
        <Preloader onComplete={() => setHasPreloaded(true)} />
      )}
      <Router>
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
      </Router>
    </main>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
};

export default App;
