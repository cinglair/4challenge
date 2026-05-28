"use client";

import { useEffect, useRef } from "react";

interface BackgroundCanvasProps {
  nivel: number;
}

export default function BackgroundCanvas({ nivel }: BackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajusta o tamanho do canvas para a tela toda
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationId: number;
    let time = 0;

    const drawBackground = () => {
      if (!ctx || !canvas) return;

      time += 0.01;

      switch (nivel) {
        case 1: // Ursinhos - Corações e estrelas
          ctx.fillStyle = "#fce7f3";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < 50; i++) {
            const x =
              (Math.sin(time + i) * 200 + canvas.width / 2 + i * 40) %
              canvas.width;
            const y =
              (Math.cos(time * 0.5 + i * 0.5) * 100 +
                canvas.height / 2 +
                i * 30) %
              canvas.height;
            ctx.fillStyle = `rgba(236, 72, 153, ${0.3 + Math.sin(time + i) * 0.2})`;
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fill();
          }
          break;

        case 2: // Jardim - Flores
          ctx.fillStyle = "#fef3c7";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < 30; i++) {
            const x = (i * 100 + Math.sin(time + i) * 50) % canvas.width;
            const y = (i * 80 + Math.cos(time + i) * 30) % canvas.height;
            ctx.fillStyle = `rgba(251, 146, 60, ${0.4 + Math.sin(time + i * 2) * 0.2})`;
            for (let j = 0; j < 6; j++) {
              ctx.beginPath();
              const angle = (j * Math.PI * 2) / 6;
              ctx.arc(
                x + Math.cos(angle) * 20,
                y + Math.sin(angle) * 20,
                10,
                0,
                Math.PI * 2,
              );
              ctx.fill();
            }
          }
          break;

        case 3: // Floresta - Folhas
          ctx.fillStyle = "#d1fae5";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < 40; i++) {
            const x =
              (Math.sin(time * 0.3 + i * 0.5) * 300 +
                canvas.width / 2 +
                i * 50) %
              canvas.width;
            const y = (time * 20 + i * 40) % canvas.height;
            ctx.fillStyle = `rgba(16, 185, 129, ${0.3 + Math.sin(time + i) * 0.2})`;
            ctx.beginPath();
            ctx.ellipse(
              x,
              y,
              15,
              8,
              Math.sin(time + i) * Math.PI,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }
          break;

        case 4: // Oceano - Bolhas
          ctx.fillStyle = "#cffafe";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < 60; i++) {
            const x = (i * 70 + Math.sin(time * 0.5 + i) * 40) % canvas.width;
            const y = canvas.height - ((time * 30 + i * 50) % canvas.height);
            const size = 5 + Math.abs(Math.sin(time + i)) * 10;
            ctx.fillStyle = `rgba(34, 211, 238, ${0.3 + Math.sin(time + i * 2) * 0.15})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
          break;

        case 5: // Crepúsculo - Nuvens
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, "#c084fc");
          gradient.addColorStop(0.5, "#f472b6");
          gradient.addColorStop(1, "#fb923c");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < 15; i++) {
            const x = ((time * 10 + i * 150) % (canvas.width + 200)) - 100;
            const y = 100 + i * 50;
            ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + Math.sin(time + i) * 0.1})`;
            ctx.beginPath();
            ctx.ellipse(x, y, 80, 30, 0, 0, Math.PI * 2);
            ctx.fill();
          }
          break;

        case 6: // Cyberpunk - Grid neon
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.3 + Math.sin(time) * 0.1})`;
          ctx.lineWidth = 2;
          for (let i = 0; i < canvas.width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
          }
          for (let i = 0; i < canvas.height; i += 50) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
          }
          // Particulas neon
          for (let i = 0; i < 30; i++) {
            const x = (time * 100 + i * 80) % canvas.width;
            const y = (time * 50 + i * 60) % canvas.height;
            ctx.fillStyle = `rgba(236, 72, 153, ${0.6 + Math.sin(time * 2 + i) * 0.3})`;
            ctx.fillRect(x, y, 4, 4);
          }
          break;

        case 7: // Névoa - Fumaça
          ctx.fillStyle = "#374151";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < 20; i++) {
            const x =
              (Math.sin(time * 0.2 + i * 0.3) * 200 +
                canvas.width / 2 +
                i * 100) %
              canvas.width;
            const y = (time * 15 + i * 80) % canvas.height;
            const size = 80 + Math.sin(time + i) * 30;
            const grad = ctx.createRadialGradient(x, y, 0, x, y, size);
            grad.addColorStop(
              0,
              `rgba(107, 114, 128, ${0.4 + Math.sin(time + i) * 0.2})`,
            );
            grad.addColorStop(1, "rgba(107, 114, 128, 0)");
            ctx.fillStyle = grad;
            ctx.fillRect(x - size, y - size, size * 2, size * 2);
          }
          break;

        case 8: // Gótico - Relâmpagos
          ctx.fillStyle = "#1c1917";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          if (Math.sin(time * 3) > 0.95) {
            ctx.strokeStyle = `rgba(220, 38, 38, ${0.6})`;
            ctx.lineWidth = 3;
            for (let i = 0; i < 5; i++) {
              ctx.beginPath();
              const x = Math.random() * canvas.width;
              ctx.moveTo(x, 0);
              ctx.lineTo(x + (Math.random() - 0.5) * 100, canvas.height / 3);
              ctx.lineTo(x + (Math.random() - 0.5) * 150, canvas.height / 2);
              ctx.lineTo(x + (Math.random() - 0.5) * 100, canvas.height);
              ctx.stroke();
            }
          }
          // Particulas vermelhas
          for (let i = 0; i < 40; i++) {
            const x =
              (Math.sin(time + i) * 300 + canvas.width / 2 + i * 50) %
              canvas.width;
            const y =
              (Math.cos(time * 0.7 + i) * 200 + canvas.height / 2 + i * 40) %
              canvas.height;
            ctx.fillStyle = `rgba(185, 28, 28, ${0.3 + Math.sin(time * 2 + i) * 0.2})`;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
          break;

        case 9: // Inferno - Chamas
          const flameGrad = ctx.createLinearGradient(0, canvas.height, 0, 0);
          flameGrad.addColorStop(0, "#7c2d12");
          flameGrad.addColorStop(0.5, "#991b1b");
          flameGrad.addColorStop(1, "#000000");
          ctx.fillStyle = flameGrad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < 50; i++) {
            const x = (i * 40 + Math.sin(time * 2 + i) * 30) % canvas.width;
            const baseY = canvas.height - 50;
            const height = 100 + Math.sin(time * 3 + i) * 80;
            const grad = ctx.createLinearGradient(x, baseY, x, baseY - height);
            grad.addColorStop(0, `rgba(251, 146, 60, ${0.8})`);
            grad.addColorStop(0.5, `rgba(239, 68, 68, ${0.6})`);
            grad.addColorStop(1, "rgba(239, 68, 68, 0)");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(x - 15, baseY);
            ctx.quadraticCurveTo(x, baseY - height, x + 15, baseY);
            ctx.fill();
          }
          break;

        case 10: // Reino das Trevas - Pentagrama
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // Pentagrama girando
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = 300;
          ctx.strokeStyle = `rgba(220, 38, 38, ${0.4 + Math.sin(time) * 0.2})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (let i = 0; i <= 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2 + time * 0.5;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
          // Círculo externo
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
          // Partículas vermelhas flutuando
          for (let i = 0; i < 100; i++) {
            const angle = time + i * 0.1;
            const dist = 150 + Math.sin(time + i) * 100;
            const x = centerX + Math.cos(angle) * dist;
            const y = centerY + Math.sin(angle) * dist;
            ctx.fillStyle = `rgba(185, 28, 28, ${0.5 + Math.sin(time * 2 + i) * 0.3})`;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
          break;

        default:
          ctx.fillStyle = "#f3f4f6";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationId = requestAnimationFrame(drawBackground);
    };

    drawBackground();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [nivel]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: "none" }}
    />
  );
}
