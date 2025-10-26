"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ViewTrackerProps {
  projectId: string;
  onViewIncremented?: (newCount: number) => void;
}

export function ViewTracker({
  projectId,
  onViewIncremented,
}: ViewTrackerProps) {
  const hasTracked = useRef(false);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // Only track once per page load
    if (hasTracked.current || !projectId) return;
    hasTracked.current = true;

    const trackView = async () => {
      try {
        setIsTracking(true);

        // Use RPC function for atomic increment
        const { data, error } = await supabase.rpc("increment_project_views", {
          project_id: projectId,
        });

        if (error) {
          console.error("Error tracking view:", error);

          // Fallback to regular update if RPC fails
          const { data: project, error: fetchError } = await supabase
            .from("projects")
            .select("views")
            .eq("id", projectId)
            .single();

          if (!fetchError && project) {
            const { error: updateError } = await supabase
              .from("projects")
              .update({ views: (project.views || 0) + 1 })
              .eq("id", projectId);

            if (updateError) {
              console.error("Error updating view count:", updateError);
            } else if (onViewIncremented) {
              onViewIncremented((project.views || 0) + 1);
            }
          }
        } else if (data && onViewIncremented) {
          // RPC successful, notify parent component
          onViewIncremented(data);
        }
      } catch (error) {
        console.error("Error tracking view:", error);
      } finally {
        setIsTracking(false);
      }
    };

    // Track view after 2 seconds to ensure it's a real visit
    const timer = setTimeout(trackView, 2000);

    return () => clearTimeout(timer);
  }, [projectId, onViewIncremented]);

  // This component doesn't render anything
  return null;
}

// Hook for using view tracking with optimistic updates
export function useViewTracking(projectId: string, initialViews: number = 0) {
  const [views, setViews] = useState(initialViews);
  const [hasIncremented, setHasIncremented] = useState(false);

  const handleViewIncremented = (newCount: number) => {
    setViews(newCount);
    setHasIncremented(true);
  };

  // Optimistic update - show +1 immediately, then sync with actual value
  useEffect(() => {
    if (!hasIncremented) {
      // Show optimistic increment after 2 seconds (when tracking happens)
      const timer = setTimeout(() => {
        setViews((prev) => prev + 1);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [hasIncremented]);

  return { views, handleViewIncremented };
}
