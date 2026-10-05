import React, { useRef, useEffect } from "react";

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE; // 20px per cell

const SnakeCanvas = ({ snake, food, direction, isGameOver }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // 1. Draw sleek dark grid background
    ctx.fillStyle = "#0f172a"; // slate-900
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Subtle Grid checker pattern
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if ((r + c) % 2 === 0) {
          ctx.fillStyle = "rgba(30, 41, 59, 0.4)"; // slate-800 soft
          ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    // Outer grid border
    ctx.strokeStyle = "rgba(51, 65, 85, 0.6)"; // slate-700
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // 2. Draw Food (Glossy Apple)
    if (food) {
      const foodX = food.x * CELL_SIZE + CELL_SIZE / 2;
      const foodY = food.y * CELL_SIZE + CELL_SIZE / 2;
      const radius = (CELL_SIZE / 2) * 0.82;

      // Food ambient glow
      const glowGrad = ctx.createRadialGradient(foodX, foodY, 2, foodX, foodY, radius * 1.8);
      glowGrad.addColorStop(0, "rgba(239, 68, 68, 0.5)"); // red glow
      glowGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(foodX, foodY, radius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Apple Body Gradient
      const appleGrad = ctx.createRadialGradient(
        foodX - radius * 0.3,
        foodY - radius * 0.3,
        1,
        foodX,
        foodY,
        radius
      );
      appleGrad.addColorStop(0, "#f87171"); // bright red-400
      appleGrad.addColorStop(0.7, "#dc2626"); // red-600
      appleGrad.addColorStop(1, "#991b1b"); // dark red-800

      ctx.fillStyle = appleGrad;
      ctx.beginPath();
      ctx.arc(foodX, foodY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Apple Highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.beginPath();
      ctx.arc(foodX - radius * 0.35, foodY - radius * 0.35, radius * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // Apple Stem
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(foodX, foodY - radius * 0.7);
      ctx.quadraticCurveTo(foodX + 3, foodY - radius * 1.2, foodX + 2, foodY - radius * 1.3);
      ctx.stroke();

      // Leaf
      ctx.fillStyle = "#22c55e"; // green-500
      ctx.beginPath();
      ctx.ellipse(foodX + 3, foodY - radius * 1.1, 3.5, 2, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Draw Snake
    if (snake && snake.length > 0) {
      snake.forEach((segment, index) => {
        const segX = segment.x * CELL_SIZE;
        const segY = segment.y * CELL_SIZE;
        const centerX = segX + CELL_SIZE / 2;
        const centerY = segY + CELL_SIZE / 2;

        if (index === 0) {
          // --- SNAKE HEAD ---
          const headRadius = (CELL_SIZE / 2) * 0.92;

          // Head Gradient
          const headGrad = ctx.createRadialGradient(
            centerX - 2,
            centerY - 2,
            2,
            centerX,
            centerY,
            headRadius
          );

          if (isGameOver) {
            headGrad.addColorStop(0, "#f87171");
            headGrad.addColorStop(1, "#b91c1c");
          } else {
            headGrad.addColorStop(0, "#34d399"); // emerald-400
            headGrad.addColorStop(0.7, "#10b981"); // emerald-500
            headGrad.addColorStop(1, "#047857"); // emerald-700
          }

          ctx.fillStyle = headGrad;
          ctx.beginPath();
          ctx.arc(centerX, centerY, headRadius, 0, Math.PI * 2);
          ctx.fill();

          // Subtle head border
          ctx.strokeStyle = isGameOver ? "#7f1d1d" : "#064e3b";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Snake Eyes (Direction Aware)
          const eyeOffset = headRadius * 0.45;
          const eyeRadius = 3;
          const pupilRadius = 1.6;

          let eye1 = { x: centerX, y: centerY };
          let eye2 = { x: centerX, y: centerY };

          if (direction.x === 1) {
            // Right
            eye1 = { x: centerX + eyeOffset * 0.7, y: centerY - eyeOffset * 0.7 };
            eye2 = { x: centerX + eyeOffset * 0.7, y: centerY + eyeOffset * 0.7 };
          } else if (direction.x === -1) {
            // Left
            eye1 = { x: centerX - eyeOffset * 0.7, y: centerY - eyeOffset * 0.7 };
            eye2 = { x: centerX - eyeOffset * 0.7, y: centerY + eyeOffset * 0.7 };
          } else if (direction.y === -1) {
            // Up
            eye1 = { x: centerX - eyeOffset * 0.7, y: centerY - eyeOffset * 0.7 };
            eye2 = { x: centerX + eyeOffset * 0.7, y: centerY - eyeOffset * 0.7 };
          } else {
            // Down
            eye1 = { x: centerX - eyeOffset * 0.7, y: centerY + eyeOffset * 0.7 };
            eye2 = { x: centerX + eyeOffset * 0.7, y: centerY + eyeOffset * 0.7 };
          }

          // White of eyes
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(eye1.x, eye1.y, eyeRadius, 0, Math.PI * 2);
          ctx.arc(eye2.x, eye2.y, eyeRadius, 0, Math.PI * 2);
          ctx.fill();

          // Pupils
          ctx.fillStyle = isGameOver ? "#7f1d1d" : "#0f172a";
          ctx.beginPath();
          ctx.arc(eye1.x + direction.x * 0.8, eye1.y + direction.y * 0.8, pupilRadius, 0, Math.PI * 2);
          ctx.arc(eye2.x + direction.x * 0.8, eye2.y + direction.y * 0.8, pupilRadius, 0, Math.PI * 2);
          ctx.fill();

          // Cute pink tongue flicker when moving
          if (!isGameOver && (direction.x !== 0 || direction.y !== 0)) {
            const tongueLength = 5;
            const tongueX = centerX + direction.x * (headRadius + 1);
            const tongueY = centerY + direction.y * (headRadius + 1);

            ctx.strokeStyle = "#f43f5e"; // rose-500
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(tongueX, tongueY);
            ctx.lineTo(tongueX + direction.x * tongueLength, tongueY + direction.y * tongueLength);
            ctx.stroke();
          }

        } else {
          // --- SNAKE BODY SEGMENT ---
          const isTail = index === snake.length - 1;
          const shrinkFactor = isTail ? 0.7 : 0.85;
          const radius = (CELL_SIZE / 2) * shrinkFactor;

          // Gradient fading down snake body
          const bodyGrad = ctx.createRadialGradient(
            centerX - 1,
            centerY - 1,
            1,
            centerX,
            centerY,
            radius
          );

          if (isGameOver) {
            bodyGrad.addColorStop(0, "#fca5a5");
            bodyGrad.addColorStop(1, "#991b1b");
          } else {
            const opacity = Math.max(0.6, 1 - index * 0.02);
            bodyGrad.addColorStop(0, `rgba(52, 211, 153, ${opacity})`);
            bodyGrad.addColorStop(1, `rgba(5, 150, 105, ${opacity})`);
          }

          ctx.fillStyle = bodyGrad;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.fill();

          // Segment highlight stroke
          ctx.strokeStyle = isGameOver ? "rgba(153, 27, 27, 0.4)" : "rgba(4, 120, 87, 0.4)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    }
  }, [snake, food, direction, isGameOver]);

  return (
    <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[380px] mx-auto rounded-2xl overflow-hidden border border-slate-700/80 shadow-inner bg-slate-900 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="w-full h-full object-contain select-none"
      />
    </div>
  );
};

export default SnakeCanvas;
export { GRID_SIZE, CANVAS_SIZE };
