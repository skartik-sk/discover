"use client";

import { useEffect, useRef } from "react";

export function CursorEffects() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    // Don't apply cursor effects on touch devices
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return;
    }

    // Create cursor elements
    const cursorDot = document.createElement("div");
    cursorDot.className = "cursor-dot";
    document.body.appendChild(cursorDot);
    cursorDotRef.current = cursorDot;

    const cursorOutline = document.createElement("div");
    cursorOutline.className = "cursor-outline";
    document.body.appendChild(cursorOutline);
    cursorOutlineRef.current = cursorOutline;

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update dot position immediately
      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      }

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.onclick !== null ||
        target.classList.contains("cursor-pointer") ||
        window.getComputedStyle(target).cursor === "pointer";

      if (isInteractive) {
        cursorDot.classList.add("cursor-dot-hover");
        cursorOutline.classList.add("cursor-outline-hover");
      } else {
        cursorDot.classList.remove("cursor-dot-hover");
        cursorOutline.classList.remove("cursor-outline-hover");
      }
    };

    const handleMouseDown = () => {
      cursorDot.classList.add("cursor-dot-click");
      cursorOutline.classList.add("cursor-outline-click");
    };

    const handleMouseUp = () => {
      cursorDot.classList.remove("cursor-dot-click");
      cursorOutline.classList.remove("cursor-outline-click");
    };

    const animate = () => {
      // Smooth follow for outline
      const speed = 0.15;
      outlineX += (mouseX - outlineX) * speed;
      outlineY += (mouseY - outlineY) * speed;

      if (cursorOutline) {
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    // Hide default cursor
    document.body.style.cursor = "none";

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Start animation loop
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      // Cleanup
      document.body.style.cursor = "auto";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      cursorDot?.remove();
      cursorOutline?.remove();
    };
  }, []);

  return null;
}
