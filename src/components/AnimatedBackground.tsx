"use client";

import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Floating Shapes */}
      <div className="floating-shapes">
        <div className="floating-shape floating-shape-1" />
        <div className="floating-shape floating-shape-2" />
        <div className="floating-shape floating-shape-3" />
      </div>

      {/* Animated Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.02] z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            color: "#ffdf00",
          }}
        />
      </div>

      {/* Radial Gradient Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top Left Glow */}
        <div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-5 dark:opacity-10 blur-3xl animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(255,223,0,0.15) 0%, transparent 70%)",
            animation: "drift-1 40s ease-in-out infinite",
          }}
        />

        {/* Bottom Right Glow */}
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-5 dark:opacity-10 blur-3xl animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,0,0.1) 0%, transparent 70%)",
            animation: "drift-2 45s ease-in-out infinite",
            animationDelay: "5s",
          }}
        />

        {/* Center Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-3 dark:opacity-8 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,223,0,0.08) 0%, transparent 70%)",
            animation: "drift-3 50s ease-in-out infinite",
            animationDelay: "10s",
          }}
        />
      </div>

      {/* Particle Dots */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 dark:opacity-50">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
