import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

const MeteorShower = () => {
  const { isNight } = useTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Dynamic Collections
    let meteors = [];
    let smokeTrails = [];

    // Bi-Directional Meteor Spawner Function (Spawns from Left AND Right sides)
    const spawnMeteor = () => {
      const fromLeft = Math.random() > 0.5;
      let startX, angle;

      if (fromLeft) {
        // Spawns from top-left, traveling down-right
        startX = Math.random() * (width * 0.7) - width * 0.1;
        angle = (Math.PI / 180) * (35 + Math.random() * 20); // 35° to 55°
      } else {
        // Spawns from top-right, traveling down-left
        startX = Math.random() * (width * 0.7) + width * 0.4;
        angle = (Math.PI / 180) * (125 + Math.random() * 20); // 125° to 145°
      }

      const startY = -30;
      const speed = 6 + Math.random() * 6;
      const length = 70 + Math.random() * 80;

      meteors.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        angle,
        speed,
        length,
        size: 1.8 + Math.random() * 1.4,
        life: 0,
        maxLife: 110 + Math.random() * 50,
      });
    };

    let lastSpawnTime = 0;
    const spawnInterval = 3800; // Subtle meteor spawn every ~3.8s to 5.5s

    // Main Animation Loop
    const render = (timestamp) => {
      ctx.clearRect(0, 0, width, height);

      // Spawn meteors subtly and bi-directionally
      if (timestamp - lastSpawnTime > spawnInterval + Math.random() * 1800) {
        spawnMeteor();
        lastSpawnTime = timestamp;
      }

      // --- 1. UPDATE & DRAW STARDUST / FIRE SMOKE TRAILS ---
      for (let i = smokeTrails.length - 1; i >= 0; i--) {
        const p = smokeTrails[i];
        p.x += p.vx;
        p.y += p.vy;
        p.radius += p.growth;
        p.alpha -= p.fade;

        if (p.alpha <= 0) {
          smokeTrails.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (isNight) {
          // Night Smoke: Visible cosmic stardust smoke stream
          const grad = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, p.radius
          );
          grad.addColorStop(0, `rgba(199, 210, 254, ${p.alpha * 0.7})`);
          grad.addColorStop(0.5, `rgba(147, 197, 253, ${p.alpha * 0.4})`);
          grad.addColorStop(1, `rgba(99, 102, 241, 0)`);
          ctx.fillStyle = grad;
        } else {
          // Day Fire: Fiery golden flame trail
          const grad = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, p.radius
          );
          grad.addColorStop(0, `rgba(253, 224, 71, ${p.alpha * 0.85})`);
          grad.addColorStop(0.4, `rgba(249, 115, 22, ${p.alpha * 0.6})`);
          grad.addColorStop(1, `rgba(239, 68, 68, 0)`);
          ctx.fillStyle = grad;
        }
        ctx.fill();
      }

      // --- 2. UPDATE & DRAW METEORS ---
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.dx;
        m.y += m.dy;
        m.life++;

        // Add trailing smoke particles behind meteor head
        smokeTrails.push({
          x: m.x - m.dx * 0.5,
          y: m.y - m.dy * 0.5,
          vx: (Math.random() - 0.5) * 0.25 - m.dx * 0.04,
          vy: (Math.random() - 0.5) * 0.25 - m.dy * 0.04,
          radius: m.size * (isNight ? 1.8 : 2.2),
          growth: isNight ? 0.12 : 0.08,
          alpha: isNight ? 0.65 : 0.85,
          fade: isNight ? 0.012 : 0.022,
        });

        // Check bounds
        if (m.y > height + 100 || m.x < -100 || m.x > width + 100 || m.life > m.maxLife) {
          meteors.splice(i, 1);
          continue;
        }

        // Draw Meteor Streak Line
        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const streakGrad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        if (isNight) {
          // Night meteor: Silver-cyan core with blue stardust trail
          streakGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
          streakGrad.addColorStop(0.25, "rgba(186, 230, 253, 0.8)");
          streakGrad.addColorStop(0.75, "rgba(129, 140, 248, 0.35)");
          streakGrad.addColorStop(1, "rgba(99, 102, 241, 0)");
        } else {
          // Day meteor: Fiery orange flame core with golden tail
          streakGrad.addColorStop(0, "rgba(255, 240, 150, 1)");
          streakGrad.addColorStop(0.3, "rgba(251, 146, 60, 0.85)");
          streakGrad.addColorStop(0.7, "rgba(239, 68, 68, 0.4)");
          streakGrad.addColorStop(1, "rgba(220, 38, 38, 0)");
        }

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = streakGrad;
        ctx.lineWidth = m.size;
        ctx.lineCap = "round";
        ctx.stroke();

        // Glowing Meteor Head
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = isNight
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(254, 240, 138, 0.95)";
        ctx.shadowColor = isNight ? "#38bdf8" : "#f97316";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isNight]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1]"
    />
  );
};

export default MeteorShower;
