import React from 'react';
import { Project } from '../types';
import { ArrowUpRight, Flame } from 'lucide-react';

interface Props {
  projects: Project[];
  onSelect: (p: Project) => void;
}

const TrendingBento: React.FC<Props> = ({ projects, onSelect }) => {
  if (projects.length < 3) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center gap-2 mb-8">
        <Flame className="w-6 h-6 text-lime-primary" />
        <h2 className="text-2xl font-bold text-white">Trending Now</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px] md:h-[500px]">
        {/* Main Feature - Large Card */}
        <div 
          onClick={() => onSelect(projects[0])}
          className="col-span-1 md:col-span-2 row-span-2 relative group rounded-3xl overflow-hidden border border-neutral-800 cursor-pointer"
        >
          <img src={projects[0].coverImage} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <div className="inline-block px-3 py-1 bg-lime-primary text-neutral-950 text-xs font-bold rounded-full mb-3">
              #1 Trending
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{projects[0].name}</h3>
            <p className="text-gray-300 line-clamp-2 max-w-md">{projects[0].description}</p>
          </div>
        </div>

        {/* Secondary Feature - Top Right */}
        <div 
           onClick={() => onSelect(projects[1])}
           className="col-span-1 md:col-span-2 row-span-1 relative group rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 cursor-pointer p-6 flex flex-col justify-between hover:border-lime-primary/30 transition-colors"
        >
             <div className="flex justify-between items-start">
                 <div className="flex items-center gap-3">
                     <img src={projects[1].logo} className="w-12 h-12 rounded-xl" />
                     <div>
                         <h3 className="text-xl font-bold text-white">{projects[1].name}</h3>
                         <span className="text-sm text-gray-400">{projects[1].tagline}</span>
                     </div>
                 </div>
                 <div className="p-2 rounded-full bg-neutral-800 text-white group-hover:bg-lime-primary group-hover:text-black transition-colors">
                     <ArrowUpRight className="w-5 h-5" />
                 </div>
             </div>
             <div className="mt-4 flex gap-4">
                  <div>
                      <p className="text-xs text-gray-500">Users</p>
                      <p className="text-lg font-mono font-bold text-white">{projects[1].users}</p>
                  </div>
                  <div>
                      <p className="text-xs text-gray-500">Growth</p>
                      <p className="text-lg font-mono font-bold text-lime-primary">+{projects[1].growth}%</p>
                  </div>
              </div>
        </div>

        {/* Tertiary Features - Bottom Right Split */}
        <div 
           onClick={() => onSelect(projects[2])}
           className="col-span-1 row-span-1 relative group rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 cursor-pointer p-6 hover:bg-neutral-800 transition-colors"
        >
             <h3 className="text-lg font-bold text-white mb-1">{projects[2].name}</h3>
             <p className="text-xs text-gray-400 mb-4">{projects[2].category}</p>
             <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                 <div className="h-full bg-lime-primary w-3/4" />
             </div>
             <p className="text-xs text-right text-lime-primary mt-1">Trending Score: 92</p>
        </div>

        <div className="col-span-1 row-span-1 rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-lime-primary/10 flex items-center justify-center cursor-pointer hover:border-lime-primary/50 transition-colors">
            <span className="text-lime-primary font-bold">View All Trending</span>
        </div>
      </div>
    </div>
  );
};

export default TrendingBento;
