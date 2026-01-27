import React from 'react';
import { Project } from '../types';
import { Star, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const [logoError, setLogoError] = React.useState(false);
  const [coverError, setCoverError] = React.useState(false);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group flex flex-col h-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden cursor-pointer hover:border-lime-primary/40 transition-all duration-300"
    >
      {/* Image Area */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900">
        {project.coverImage && !coverError ? (
          <img 
            src={project.coverImage} 
            alt={project.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={() => setCoverError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-lime-primary/10 to-neutral-900">
            <div className="text-6xl font-bold text-lime-primary/20">
              {project.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        <div className="absolute top-4 left-4">
             <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-950 bg-white/90 backdrop-blur px-2 py-1 rounded-md">
                {project.category}
             </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
                 {project.logo && !logoError ? (
                   <img 
                     src={project.logo} 
                     alt={project.name}
                     className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 object-cover" 
                     onError={() => setLogoError(true)}
                   />
                 ) : (
                   <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-primary/20 to-neutral-800 border border-neutral-700 flex items-center justify-center">
                     <span className="text-lime-primary font-bold text-lg">
                       {project.name.charAt(0).toUpperCase()}
                     </span>
                   </div>
                 )}
                 <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-1">
                        {project.name}
                        {project.verified && <ShieldCheck className="w-4 h-4 text-lime-primary" />}
                    </h3>
                    <p className="text-xs text-gray-500">{project.chain}</p>
                 </div>
            </div>
            <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold bg-yellow-400/10 px-2 py-1 rounded-lg">
                <Star className="w-3 h-3 fill-yellow-400" />
                {project.averageRating?.toFixed(1) || '0.0'}
            </div>
        </div>

        <p className="text-sm text-gray-400 mb-6 line-clamp-2 flex-1">
            {project.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
            <div className="text-xs">
                <span className="text-gray-500 block">TVL</span>
                <span className="text-white font-mono font-medium">{project.tvl || 'N/A'}</span>
            </div>
            <button className="p-2 rounded-xl bg-neutral-800 text-white hover:bg-lime-primary hover:text-black transition-colors">
                <ArrowUpRight className="w-4 h-4" />
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
