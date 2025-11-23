'use client';

import { useState } from 'react';

interface VideoPlayerProps {
  videoUrl?: string | null;
  coverUrl: string;
  projectName: string;
}

export default function VideoPlayer({ videoUrl, coverUrl, projectName }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoUrl) {
    return (
      <div 
        className="relative flex items-center justify-center bg-gray-900 bg-cover bg-center aspect-video rounded-xl shadow-lg"
        style={{backgroundImage: `url("${coverUrl}")`}}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent rounded-xl"></div>
      </div>
    );
  }

  if (isPlaying) {
    return (
      <div className="relative aspect-video rounded-xl shadow-lg overflow-hidden">
        <iframe
          src={videoUrl}
          title={`${projectName} video`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return (
    <div 
      className="relative flex items-center justify-center bg-gray-900 bg-cover bg-center aspect-video rounded-xl shadow-lg cursor-pointer"
      style={{backgroundImage: `url("${coverUrl}")`}}
      onClick={() => setIsPlaying(true)}
    >
      <button className="flex shrink-0 items-center justify-center rounded-full size-16 bg-black/40 text-white hover:bg-black/60 transition-colors">
        <span className="material-symbols-outlined text-4xl">play_arrow</span>
      </button>
    </div>
  );
}
