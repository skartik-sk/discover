import React, { useState, useMemo, useEffect } from 'react';
import { Project, ProjectCategory, Chain } from '../types';
import ProjectCard from '../components/ProjectCard';
import { Search, SlidersHorizontal, CheckSquare } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

interface Props {
  onProjectSelect: (p: Project) => void;
  initialSearch?: string;
}

const SearchProjects: React.FC<Props> = ({ onProjectSelect, initialSearch = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedChains, setSelectedChains] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  // Update search term when initialSearch changes (from Navbar)
  useEffect(() => {
    if (initialSearch) {
      setSearchTerm(initialSearch);
    }
  }, [initialSearch]);

  // Query all projects from Convex
  const allProjects = useQuery(api.projects.list, {});

  const categories = ['All', ...Object.values(ProjectCategory)];
  const chains = ['Ethereum', 'Solana', 'Polygon', 'Arbitrum', 'Base', 'Avalanche'];
  const years = ['All', '2024', '2023', '2022', '2021'];

  const toggleChain = (chain: string) => {
    if (selectedChains.includes(chain)) {
        setSelectedChains(selectedChains.filter(c => c !== chain));
    } else {
        setSelectedChains([...selectedChains, chain]);
    }
  };

  const filteredProjects = useMemo(() => {
    if (!allProjects) return [];
    
    return allProjects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      const matchesChain = selectedChains.length === 0 || selectedChains.includes(project.chain);
      const matchesYear = selectedYear === 'All' || project.launchDate.startsWith(selectedYear);
      
      return matchesSearch && matchesCategory && matchesChain && matchesYear;
    });
  }, [allProjects, searchTerm, selectedCategory, selectedChains, selectedYear]);

  // Loading state
  if (allProjects === undefined) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-8 border-b border-neutral-800">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Browse Projects</h1>
            <p className="text-gray-400">Explore {allProjects.length} verified DApps across the ecosystem.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-lime-primary focus:ring-1 focus:ring-lime-primary transition-all text-white placeholder:text-neutral-600"
                />
             </div>
             <button 
               onClick={() => setShowFilters(!showFilters)}
               className={`md:hidden p-3 rounded-xl border ${showFilters ? 'bg-lime-primary text-neutral-950 border-lime-primary' : 'bg-neutral-900 text-gray-300 border-neutral-800'}`}
             >
               <SlidersHorizontal className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative">
          
          {/* Sidebar Filters - Sticky */}
          <aside className={`lg:w-64 flex-shrink-0 space-y-8 ${showFilters ? 'block' : 'hidden lg:block'} lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto scrollbar-hide`}>
             
             {/* Category Filter */}
             <div>
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Categories</h3>
               <div className="space-y-1">
                 {categories.map(cat => (
                   <button
                     key={cat}
                     onClick={() => setSelectedCategory(cat)}
                     className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                       selectedCategory === cat 
                         ? 'bg-lime-primary text-neutral-950 font-semibold' 
                         : 'text-gray-400 hover:text-white hover:bg-neutral-900'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
             </div>

             {/* Chain Filter (Checkboxes) */}
             <div>
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Chains</h3>
               <div className="space-y-2">
                 {chains.map(chain => (
                   <label key={chain} className="flex items-center gap-3 cursor-pointer group px-2 py-1.5 hover:bg-neutral-900 rounded-lg transition-colors">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedChains.includes(chain) ? 'bg-lime-primary border-lime-primary' : 'border-neutral-700 group-hover:border-gray-500'}`}>
                          {selectedChains.includes(chain) && <CheckSquare className="w-3.5 h-3.5 text-black" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={selectedChains.includes(chain)} 
                        onChange={() => toggleChain(chain)} 
                      />
                      <span className={`text-sm ${selectedChains.includes(chain) ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                        {chain}
                      </span>
                   </label>
                 ))}
               </div>
             </div>

             {/* Year Filter */}
             <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Launch Year</h3>
                <div className="flex flex-wrap gap-2 px-2">
                    {years.map(year => (
                        <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                                selectedYear === year
                                ? 'bg-lime-primary text-black border-lime-primary font-bold'
                                : 'bg-neutral-900 text-gray-400 border-neutral-800 hover:border-gray-600'
                            }`}
                        >
                            {year}
                        </button>
                    ))}
                </div>
             </div>
          </aside>

          {/* Results Grid */}
          <main className="flex-1 min-h-[500px]">
             {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProjects.map(project => (
                    <ProjectCard 
                      key={project._id} 
                      project={project} 
                      onClick={() => onProjectSelect(project)} 
                    />
                  ))}
                </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-neutral-800 rounded-3xl bg-neutral-900/50">
                 <Search className="w-12 h-12 text-gray-600 mb-4" />
                 <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
                 <p className="text-gray-400">Try adjusting your filters or search term.</p>
                 <button 
                    onClick={() => {setSearchTerm(''); setSelectedCategory('All'); setSelectedChains([]); setSelectedYear('All')}}
                    className="mt-6 px-6 py-2.5 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 transition-colors font-medium"
                 >
                    Clear Filters
                 </button>
               </div>
             )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default SearchProjects;
