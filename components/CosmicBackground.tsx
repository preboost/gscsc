"use client";

import React, { useRef, useEffect } from "react";

export default function CosmicBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "#030712",
      }}
    >
      {/* 4K Sci-Fi Orbitfall Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate3d(-50%, -50%, 0)",
          minWidth: "100%",
          minHeight: "100%",
          width: "auto",
          height: "auto",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      >
        <source src="/orbitfall-protocol.mp4" type="video/mp4" />
      </video>

      {/* Light Sci-Fi Glass Tint Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(3, 7, 18, 0.15) 0%, rgba(3, 7, 18, 0.45) 85%, rgba(1, 4, 12, 0.65) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle Top & Bottom Gradient for Header / Footer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(3, 7, 18, 0.45) 0%, transparent 18%, transparent 82%, rgba(3, 7, 18, 0.55) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
