import React from "react";

interface FigmaServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: "dark" | "yellow";
}

export function FigmaServiceCard({
  icon,
  title,
  description,
  variant = "dark",
}: FigmaServiceCardProps) {
  const isYellow = variant === "yellow";

  return (
    <div
      className={`
        rounded-3xl p-10
        transition-all duration-300
        hover:scale-[1.02] hover:shadow-2xl
        ${
          isYellow
            ? "bg-[#FFDF00] text-[#151515]"
            : "bg-[#1B1B1B] text-white border border-white/5"
        }
      `}
    >
      {/* Icon Circle */}
      <div
        className={`
          w-[72px] h-[72px] rounded-full
          flex items-center justify-center mb-6
          ${
            isYellow
              ? "bg-[#151515] text-white"
              : "bg-white text-[#151515]"
          }
        `}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className={`
          text-2xl font-extrabold mb-3 capitalize
          ${isYellow ? "text-[#151515]" : "text-white"}
        `}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className={`
          text-lg font-medium capitalize leading-relaxed
          ${isYellow ? "text-[#151515]/80" : "text-white/60"}
        `}
      >
        {description}
      </p>
    </div>
  );
}
