'use client';

import React from 'react';
import Link from 'next/link';
import UpvoteButton from './UpvoteButton';

interface Project {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logoUrl: string;
  coverUrl: string;
  category: string;
  tags: string;
  upvotes: number;
  user: {
    username: string;
  };
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const tags = project.tags.split(',').filter(Boolean);
  const username = project.user?.username || 'unknown';
  
  return (
    <Link href={`/${username}/${project.slug}`}>
      <div className="group relative flex flex-col overflow-hidden rounded-soft bg-card-bg shadow-card transition-all duration-300 hover:shadow-card-hover transform hover:-translate-y-1 h-full min-h-[340px]">
        <div 
          className="absolute inset-x-0 top-0 h-32 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
          style={{
            backgroundImage: `url("${project.coverUrl}")`,
            filter: 'saturate(0.8) contrast(0.9)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-main-bg"></div>
        </div>
        <div className="relative mt-30 flex flex-col h-full p-5 pt-0">
          <div className="flex items-center gap-3 mb-3">
            <img 
              alt={`${project.name} Logo`}
              className="h-11 w-11 rounded-full border-2 border-white bg-gray-700 shadow-md ring-2 ring-white/30" 
              src={project.logoUrl}
            />
            <h3 className="text-lg font-bold text-header-text line-clamp-1" style={{textShadow: '0 0 20px rgba(255, 255, 255, 0.9), 0 0 10px rgba(255, 255, 255, 0.7), 0 1px 2px rgba(255, 255, 255, 0.5)'}}>{project.name}</h3>
          </div>
          <p className="text-sm text-body-text line-clamp-2 mb-3 min-h-[40px]">{project.tagline}</p>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <div className="flex h-6 shrink-0 items-center justify-center rounded-tag bg-accent-terracotta/20 px-3">
              <p className="text-accent-terracotta text-xs font-semibold">{project.category}</p>
            </div>
            {tags.slice(0, 2).map((tag, index) => (
              <div key={index} className="flex h-6 shrink-0 items-center justify-center rounded-tag px-3 bg-gray-500/10">
                <p className="text-body-text text-xs font-semibold">{tag.trim()}</p>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-body-text">arrow_drop_up</span>
              <span className="text-sm font-semibold text-header-text">{project.upvotes}</span>
            </div>
            <div onClick={(e) => e.preventDefault()}>
              <UpvoteButton projectId={project.id} initialUpvotes={project.upvotes} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
