"use client";

import { useEffect, useRef } from "react";

export function CursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hearts = ["💗", "🌸", "✨", "💕", "⭐", "🌷"];
    let lastTime = 0;
    const minInterval = 80; // ms between hearts

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < minInterval) return;
      lastTime = now;

      const el = document.createElement("span");
      el.className = "cursor-heart";
      el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      el.style.left = `${e.clientX - 8}px`;
      el.style.top = `${e.clientY - 8}px`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 800);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return <div ref={containerRef} />;
}
