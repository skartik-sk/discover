'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  category: string;
  upvotes: number;
  createdAt: Date;
  user: {
    username: string;
  };
}

interface Props {
  projects: Project[];
}

export function LeaderboardClient({ projects }: Props) {
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'all'>('daily');

  // Filter projects based on time period
  const getFilteredProjects = () => {
    const now = new Date();
    let filtered = projects;

    if (timePeriod === 'daily') {
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      filtered = projects.filter(p => new Date(p.createdAt) >= yesterday);
    } else if (timePeriod === 'weekly') {
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = projects.filter(p => new Date(p.createdAt) >= lastWeek);
    }

    // If no projects match the time filter, show all projects
    if (filtered.length === 0) {
      filtered = projects;
    }

    return filtered.slice(0, 10);
  };

  const filteredProjects = getFilteredProjects();
  const top3 = filteredProjects.slice(0, 3);
  const rest = filteredProjects.slice(3);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-header-text text-4xl font-bold leading-tight tracking-tight md:text-5xl">Project Leaderboard</h1>
        <p className="max-w-2xl text-body-text text-base font-normal leading-relaxed md:text-lg">Discover the top trending Web3 projects, ranked by the community.</p>
      </div>
      <div className="flex items-center justify-center my-8 md:my-12">
        <div className="flex space-x-1 rounded-btn bg-primary-green/10 p-1">
          <button 
            onClick={() => setTimePeriod('daily')}
            className={`px-4 py-2 text-sm font-semibold rounded-[0.6rem] transition-all ${
              timePeriod === 'daily' 
                ? 'text-primary-green bg-white shadow-sm' 
                : 'text-primary-green/70 hover:text-primary-green'
            }`}
          >
            Daily
          </button>
          <button 
            onClick={() => setTimePeriod('weekly')}
            className={`px-4 py-2 text-sm font-semibold rounded-[0.6rem] transition-all ${
              timePeriod === 'weekly' 
                ? 'text-primary-green bg-white shadow-sm' 
                : 'text-primary-green/70 hover:text-primary-green'
            }`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setTimePeriod('all')}
            className={`px-4 py-2 text-sm font-semibold rounded-[0.6rem] transition-all ${
              timePeriod === 'all' 
                ? 'text-primary-green bg-white shadow-sm' 
                : 'text-primary-green/70 hover:text-primary-green'
            }`}
          >
            All Time
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-end mb-12">
        {/* Silver - 2nd Place */}
        {top3[1] && (
          <Link href={`/${top3[1].user.username}/${top3[1].slug}`} className="relative flex flex-col items-center justify-center text-center p-6 bg-card-bg rounded-soft shadow-card hover:shadow-card-hover transition-all duration-300 lg:col-start-1 h-full">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center size-10 rounded-full bg-rank-silver text-white font-bold text-lg border-4 border-main-bg shadow-silver-glow">2</div>
            <img alt={`${top3[1].name} Logo`} className="size-20 rounded-full mt-6" src={top3[1].logoUrl} />
            <h3 className="text-xl font-bold text-header-text mt-4">{top3[1].name}</h3>
            <p className="text-sm text-body-text mt-1">{top3[1].upvotes.toLocaleString()} Votes</p>
          </Link>
        )}
        {/* Gold - 1st Place */}
        {top3[0] && (
          <Link href={`/${top3[0].user.username}/${top3[0].slug}`} className="relative flex flex-col items-center justify-center text-center p-8 bg-card-bg rounded-soft shadow-gold-glow hover:shadow-card-hover transition-all duration-300 lg:col-span-3 order-first lg:order-0">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center justify-center size-12 rounded-full bg-rank-gold text-white font-extrabold text-xl border-4 border-main-bg">1</div>
            <img alt={`${top3[0].name} Logo`} className="size-28 rounded-full mt-8" src={top3[0].logoUrl} />
            <h3 className="text-3xl font-bold text-header-text mt-5">{top3[0].name}</h3>
            <p className="text-base text-body-text mt-1">{top3[0].upvotes.toLocaleString()} Votes</p>
          </Link>
        )}
        {/* Bronze - 3rd Place */}
        {top3[2] && (
          <Link href={`/${top3[2].user.username}/${top3[2].slug}`} className="relative flex flex-col items-center justify-center text-center p-6 bg-card-bg rounded-soft shadow-card hover:shadow-card-hover transition-all duration-300 lg:col-start-5 h-full">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center size-10 rounded-full bg-rank-bronze text-white font-bold text-lg border-4 border-main-bg shadow-bronze-glow">3</div>
            <img alt={`${top3[2].name} Logo`} className="size-20 rounded-full mt-6" src={top3[2].logoUrl} />
            <h3 className="text-xl font-bold text-header-text mt-4">{top3[2].name}</h3>
            <p className="text-sm text-body-text mt-1">{top3[2].upvotes.toLocaleString()} Votes</p>
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-body-text w-16">Rank #</th>
              <th className="p-4 text-sm font-semibold text-body-text">Project Name</th>
              <th className="p-4 text-sm font-semibold text-body-text">Category</th>
              <th className="p-4 text-sm font-semibold text-body-text">24h Growth</th>
              <th className="p-4 text-sm font-semibold text-body-text text-right">Total Votes</th>
            </tr>
          </thead>
          <tbody>
            {rest.map((project, idx) => (
              <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50/70">
                <td className="p-4 font-bold text-header-text">{idx + 4}</td>
                <td className="p-4">
                  <Link href={`/${project.user.username}/${project.slug}`} className="flex items-center gap-3 hover:underline">
                    <img alt={`${project.name} Logo`} className="size-8 rounded-md" src={project.logoUrl} />
                    <span className="font-semibold text-header-text">{project.name}</span>
                  </Link>
                </td>
                <td className="p-4">
                  <div className="flex h-6 items-center justify-center rounded-tag bg-accent-blue/20 px-3 w-fit">
                    <p className="text-accent-blue text-xs font-semibold">{project.category}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-green-600">
                    <span className="material-symbols-outlined text-base! font-semibold!">arrow_drop_up</span>
                    <span className="text-sm font-semibold">--</span>
                  </div>
                </td>
                <td className="p-4 text-right font-semibold text-header-text">{project.upvotes.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
