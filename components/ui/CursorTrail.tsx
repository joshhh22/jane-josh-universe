"use client";

import { useEffect, useRef } from "react";

export function CursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hearts = ["💗", "🌸", "✨", "💕", "⭐"];
    let lastTime = 0;
    const minInterval = 120; // Throttle to prevent high CPU / lag

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < minInterval) return;
      lastTime = now;

      const el = document.createElement("span");
      el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      el.style.position = "fixed";
      el.style.pointerEvents = "none"; // CRITICAL: Never block clicks!
      el.style.userSelect = "none";
      el.style.zIndex = "99999";
      el.style.fontSize = "14px";
      el.style.left = `${e.clientX - 7}px`;
      el.style.top = `${e.clientY - 7}px`;
      el.style.transition = "transform 0.6s ease-out, opacity 0.6s ease-out";
      el.style.opacity = "1";

      document.body.appendChild(el);

      requestAnimationFrame(() => {
        el.style.transform = `translateY(-20px) scale(0.6)`;
        el.style.opacity = "0";
      });

      setTimeout(() => {
        el.remove();
      }, 600);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return <div ref={containerRef} className="pointer-events-none" />;
}
