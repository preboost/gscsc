"use client";

import React, { useEffect, useRef } from "react";

export default function SciFiCursorVFX() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only enable on devices with hover/pointer (desktop/laptops)
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let glowX = -100;
    let glowY = -100;
    let isVisible = false;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        if (cursorRef.current) cursorRef.current.style.opacity = "1";
        if (glowRef.current) glowRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
      if (glowRef.current) glowRef.current.style.opacity = "0";
    };

    const render = () => {
      // Smooth lerp interpolation for buttery physics
      currentX += (mouseX - currentX) * 0.22;
      currentY += (mouseY - currentY) * 0.22;
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
    >
      {/* Large Neon Blue Ambient Atmosphere Glow */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[380px] h-[380px] rounded-full opacity-0 transition-opacity duration-500 ease-out will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(14, 165, 233, 0.08) 40%, rgba(2, 132, 199, 0.02) 65%, transparent 75%)",
        }}
      />

      {/* Sci-Fi Precision Neon Core Cursor Reticle */}
      <div
        ref={cursorRef}
        className="absolute top-0 left-0 w-8 h-8 rounded-full opacity-0 transition-opacity duration-300 ease-out will-change-transform flex items-center justify-center"
      >
        {/* Outer glowing pulsing ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.7)] animate-pulse" />
        {/* Inner bright blue energy particle */}
        <div className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#38bdf8]" />
      </div>
    </div>
  );
}
