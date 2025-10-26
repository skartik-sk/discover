"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{
        backgroundColor: "var(--bg-tertiary)",
        color: "var(--text-primary)",
      }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-[#FFDF00] transition-transform duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-[#6366f1] transition-transform duration-300" />
      )}
    </button>
  );
}
