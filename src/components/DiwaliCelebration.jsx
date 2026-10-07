import { useState, useEffect, useRef } from "react";

const DiwaliCelebration = ({ hasPreloaded = true }) => {
  const [stage, setStage] = useState("hidden"); // 'hidden' | 'slidingIn' | 'visible' | 'slidingOut'
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!hasPreloaded) return;

    // 1. Trigger slide-in
    setStage("slidingIn");

    // 2. Full visibility
    const visibleTimer = setTimeout(() => {
      setStage("visible");
    }, 600);

    // 3. Trigger slide-out after 5 seconds
    const exitTimer = setTimeout(() => {
      setStage("slidingOut");
    }, 5000);

    // 4. Hide completely after slide-out completes
    const hideTimer = setTimeout(() => {
      setStage("hidden");
    }, 5800);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [hasPreloaded]);

  // Canvas Firecracker Blast Effect
  useEffect(() => {
    if (stage === "hidden") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const colors = ["#FFD700", "#FF5722", "#E91E63", "#00E5FF", "#76FF03", "#FFC107"];

    const createExplosion = (targetX, targetY) => {
      const particleCount = 45 + Math.floor(Math.random() * 30);
      const baseColor = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5.5;
        particlesRef.current.push({
          x: targetX,
          y: targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: Math.random() > 0.25 ? baseColor : "#FFFFFF",
          alpha: 1,
          decay: 0.02 + Math.random() * 0.02,
          radius: 1.5 + Math.random() * 2,
          gravity: 0.06,
          sparkle: Math.random() > 0.4,
        });
      }
    };

    // Initial bursts
    createExplosion(width * 0.35, height * 0.35);
    createExplosion(width * 0.65, height * 0.38);

    const burstInterval = setInterval(() => {
      const rx = width * 0.2 + Math.random() * width * 0.6;
      const ry = height * 0.2 + Math.random() * height * 0.35;
      createExplosion(rx, ry);
    }, 800);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;
        p.vx *= 0.98;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.sparkle ? 8 : 2;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(burstInterval);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [stage]);

  if (stage === "hidden") return null;

  const isExiting = stage === "slidingOut";
  const isEntering = stage === "slidingIn";

  return (
    <div className="fixed inset-0 z-[999999] pointer-events-none flex flex-col justify-end items-center pb-8 sm:pb-12 px-4 select-none">
      {/* Firecracker Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Clean Pure Visual Motion Deepak (No Text, Overflow-Visible Flame) */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center p-4 overflow-visible transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
          isEntering
            ? "translate-y-24 opacity-0 scale-90"
            : isExiting
            ? "translate-y-28 opacity-0 scale-95"
            : "translate-y-0 opacity-100 scale-100"
        }`}
      >
        {/* Cute Motion Deepak Container */}
        <div className="relative w-28 h-32 sm:w-32 sm:h-36 flex items-center justify-center overflow-visible">
          {/* Glowing Aura Background */}
          <div className="absolute inset-0 bg-amber-400/40 rounded-full blur-2xl animate-pulse" />

          {/* SVG with overflow-visible to ensure top flame is NEVER lost or clipped */}
          <svg
            viewBox="0 0 64 72"
            className="w-28 h-32 sm:w-32 sm:h-36 filter drop-shadow-[0_0_20px_rgba(255,193,7,0.95)] overflow-visible"
          >
            {/* Clay Diya Base */}
            <path
              d="M12 44 C12 58, 52 58, 52 44 C42 50, 22 50, 12 44 Z"
              fill="url(#slideDiyaGradNoText)"
            />
            <ellipse cx="32" cy="44" rx="20" ry="4" fill="#B7791F" />

            {/* Flame Group - Smooth natural pulse/flicker without clipping */}
            <g className="origin-bottom animate-[flamePulse_1.2s_ease-in-out_infinite]">
              {/* Outer Golden Flame */}
              <path
                d="M32 12 Q24 28 32 42 Q40 28 32 12 Z"
                fill="url(#slideFlameGradNoText)"
              />
              {/* Inner Bright Yellow Core */}
              <path
                d="M32 22 Q27 32 32 41 Q37 32 32 22 Z"
                fill="#FFF59D"
              />
              {/* White Center Hotspot */}
              <circle cx="32" cy="34" r="3" fill="#FFFFFF" className="opacity-90" />
            </g>

            <defs>
              <linearGradient id="slideDiyaGradNoText" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
              <linearGradient id="slideFlameGradNoText" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFEE58" />
                <stop offset="50%" stopColor="#FF9800" />
                <stop offset="100%" stopColor="#E65100" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <style>{`
          @keyframes flamePulse {
            0%, 100% {
              transform: translateY(0px) scale(1);
            }
            50% {
              transform: translateY(-4px) scale(1.05);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default DiwaliCelebration;
