"use client";
import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        let tick = 0;
        let animId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const COLORS = ["#00e5cc", "#00c9a7", "#00b894", "#00fff0", "#0af5d5"];

        const particles = Array.from({ length: 90 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 2.2 + 0.4,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            alpha: Math.random() * 0.6 + 0.2,
        }));

        const orbs = [
            { x: 0.15, y: 0.2,  r: 200, color: "#00e5cc", alpha: 0.07 },
            { x: 0.85, y: 0.75, r: 260, color: "#00b894", alpha: 0.06 },
            { x: 0.5,  y: 0.95, r: 180, color: "#00fff0", alpha: 0.05 },
            { x: 0.05, y: 0.85, r: 150, color: "#00c9a7", alpha: 0.04 },
            { x: 0.92, y: 0.08, r: 160, color: "#00e5cc", alpha: 0.05 },
        ];

        const loop = () => {
            tick++;
            const W = canvas.width;
            const H = canvas.height;
            ctx.clearRect(0, 0, W, H);

            ctx.fillStyle = "#0a0a0f";
            ctx.fillRect(0, 0, W, H);

            const size = 60;
            const ox = (tick * 0.2) % size;
            const oy = (tick * 0.15) % size;
            ctx.strokeStyle = "#00e5cc";
            ctx.lineWidth = 0.3;
            for (let x = -size + ox; x < W + size; x += size) {
                ctx.globalAlpha = 0.04;
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
            }
            for (let y = -size + oy; y < H + size; y += size) {
                ctx.globalAlpha = 0.04;
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            }
            ctx.globalAlpha = 1;

            orbs.forEach((o, i) => {
                const pulse = 1 + 0.08 * Math.sin(tick * 0.012 + i * 1.3);
                const grad = ctx.createRadialGradient(
                    o.x * W, o.y * H, 0,
                    o.x * W, o.y * H, o.r * pulse
                );
                grad.addColorStop(0, o.color + "cc");
                grad.addColorStop(0.4, o.color + "33");
                grad.addColorStop(1, "transparent");
                ctx.globalAlpha = o.alpha;
                ctx.beginPath();
                ctx.arc(o.x * W, o.y * H, o.r * pulse, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.globalAlpha = 1;
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        ctx.globalAlpha = (1 - dist / 110) * 0.18;
                        ctx.strokeStyle = "#00e5cc";
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;

            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = W;
                if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H;
                if (p.y > H) p.y = 0;
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            });

            animId = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
            }}
        />
    );
}