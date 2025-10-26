"use client";

import dynamic from "next/dynamic";

// Lazy load heavy components for better performance
export const CursorEffects = dynamic(
  () =>
    import("@/components/CursorEffects").then((mod) => ({
      default: mod.CursorEffects,
    })),
  {
    ssr: false,
    loading: () => null,
  },
);

export const AnimatedBackground = dynamic(
  () =>
    import("@/components/AnimatedBackground").then((mod) => ({
      default: mod.AnimatedBackground,
    })),
  {
    ssr: false,
    loading: () => null,
  },
);
