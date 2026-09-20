import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";

import sakura from "../assets/sakura.mp3";
import { HomeInfo, Loader } from "../components";
import { Bird, Island, Plane, Sky } from "../models";
import { useTheme } from "../context/ThemeContext";

const Home = ({ hasPreloaded = false }) => {
  const { isNight } = useTheme();

  const audioRef = useRef(null);

  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(sakura);
      audio.volume = 0.4;
      audio.loop = true;
      audioRef.current = audio;
    }

    if (hasPreloaded && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("Audio play deferred or blocked:", error);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [hasPreloaded]);

  const adjustBiplaneForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [0, -1.5, 0];
    } else {
      screenScale = [3, 3, 3];
      screenPosition = [0, -4, -4];
    }

    return [screenScale, screenPosition];
  };

  const adjustIslandForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
      screenPosition = [0, -6.5, -43.4];
    } else {
      screenScale = [1, 1, 1];
      screenPosition = [0, -6.5, -43.4];
    }

    return [screenScale, screenPosition];
  };

  const [biplaneScale, biplanePosition] = adjustBiplaneForScreenSize();
  const [islandScale, islandPosition] = adjustIslandForScreenSize();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <section className="w-full h-screen h-[100dvh] relative overflow-hidden touch-none select-none">
      {/* Night mode ambient starry sky backdrop overlay */}
      {isNight && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/60 pointer-events-none transition-opacity duration-700 z-0">
          <div className="stars-overlay absolute inset-0 opacity-60 pointer-events-none" />
        </div>
      )}

      <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
        {currentStage && <HomeInfo currentStage={currentStage} />}
      </div>

      <Canvas
        className={`w-full h-screen h-[100dvh] bg-transparent touch-none ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<Loader />}>
          <directionalLight
            position={[1, 1, 1]}
            intensity={isNight ? 0.7 : 2}
            color={isNight ? "#a5b4fc" : "#ffffff"}
          />
          <ambientLight intensity={isNight ? 0.3 : 0.5} />
          <pointLight
            position={[10, 5, 10]}
            intensity={isNight ? 0.8 : 2}
            color={isNight ? "#818cf8" : "#ffffff"}
          />
          <spotLight
            position={[0, 50, 10]}
            angle={0.15}
            penumbra={1}
            intensity={isNight ? 0.8 : 2}
            color={isNight ? "#6366f1" : "#ffffff"}
          />
          <hemisphereLight
            skyColor={isNight ? "#1e1b4b" : "#b1e1ff"}
            groundColor={isNight ? "#020617" : "#000000"}
            intensity={isNight ? 0.6 : 1}
          />

          <Bird />
          <Sky isRotating={isRotating} isNight={isNight} />
          <Island
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
            position={islandPosition}
            rotation={[0.1, 4.7077, 0]}
            scale={islandScale}
          />
          <Plane
            isRotating={isRotating}
            position={biplanePosition}
            rotation={[0, 20.1, 0]}
            scale={biplaneScale}
          />
        </Suspense>
      </Canvas>
    </section>
  );
};

export default Home;
