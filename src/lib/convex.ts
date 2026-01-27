import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL || 'https://courteous-jaguar-161.convex.cloud';

if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL is not set");
}

export const convex = new ConvexReactClient(convexUrl);
