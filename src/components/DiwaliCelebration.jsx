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

  return (
    <div className="fixed inset-0 z-[999999] pointer-events-none select-none">
      {/* Firecracker Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />
    </div>
  );
};

export default DiwaliCelebration;
