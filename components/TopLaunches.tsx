import React from 'react';
import { Project } from '../types';
import { ChevronUp, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

interface Props {
  onSelect: (p: Project) => void;
}

const TopLaunches: React.FC<Props> = ({ onSelect }) => {
  const featuredProjects = useQuery(api.projects.getFeatured, {});
  
  if (featuredProjects === undefined) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-lime-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-4 h-4 text-lime-primary fill-lime-primary" />
        <h2 className="text-lg font-bold text-white">Top Launches</h2>
        <div className="ml-auto flex gap-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
            <span className="text-white cursor-pointer hover:text-lime-primary transition-colors">Today</span>
        </div>
      </div>

      <div className="space-y-1">
        {featuredProjects.map((project, index) => (
          <motion.div 
            key={project._id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-800/50 transition-colors cursor-pointer group border border-transparent hover:border-neutral-800"
            onClick={() => onSelect(project)}
          >
            <div className="flex-shrink-0 relative">
               <img src={project.logo} className="w-10 h-10 rounded-lg object-cover bg-neutral-800" />
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-neutral-900 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-neutral-800 shadow-sm">
                   {index + 1}
               </div>
            </div>
            
            <div className="flex-1 min-w-0">
               <h3 className="font-bold text-sm text-white truncate leading-tight group-hover:text-lime-primary transition-colors">{project.name}</h3>
               <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-1">
                  <span className="text-gray-400 font-medium">{project.category}</span>
                  <span className="w-0.5 h-0.5 rounded-full bg-gray-600" />
                  <span>{project.chain}</span>
               </div>
            </div>

            <button 
                className="flex flex-col items-center justify-center w-9 h-9 rounded-lg bg-neutral-950 border border-neutral-800 group-hover:border-lime-primary/30 transition-all hover:bg-neutral-900"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <ChevronUp className="w-3 h-3 text-lime-primary" />
                <span className="text-[10px] font-bold text-white leading-none mt-0.5">{project.upvoteCount}</span>
            </button>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-bold text-gray-300 hover:text-white hover:bg-neutral-900 transition-colors">
          View All Launches
      </button>
    </div>
  );
};

export default TopLaunches;
