'use client';

import { useState, useEffect } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { Project } from '@prisma/client';

interface ProjectWithUser extends Project {
  user: {
    username: string;
  };
}

interface ProjectsClientProps {
  initialProjects: ProjectWithUser[];
}

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [projects, setProjects] = useState<ProjectWithUser[]>(initialProjects);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [blockchainFilter, setBlockchainFilter] = useState<string[]>([]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter.length > 0) params.append('category', categoryFilter[0]);
      if (blockchainFilter.length > 0) params.append('blockchain', blockchainFilter[0]);

      const response = await fetch(`/api/projects?${params.toString()}`);
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, categoryFilter, blockchainFilter]);

  const toggleFilter = (filterArray: string[], setFilter: (val: string[]) => void, value: string) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter(f => f !== value));
    } else {
      setFilter([value]); // Only one filter at a time for simplicity
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter([]);
    setBlockchainFilter([]);
  };

  return (
    <main className="flex-grow flex w-full">
      {/* Filters Sidebar */}
      <aside className="w-64 flex-shrink-0 p-8 hidden md:block border-r border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-header-text">Filters</h3>
          <button 
            onClick={clearFilters}
            className="text-sm font-medium text-accent-blue hover:underline"
          >
            Clear all
          </button>
        </div>
        <div className="mt-6 space-y-6">
          {/* Category Filter */}
          <div>
            <h4 className="font-semibold text-header-text mb-3">Category</h4>
            <div className="space-y-2">
              {['DeFi', 'NFT', 'DAO', 'Gaming'].map((category) => (
                <label key={category} className="flex items-center text-sm cursor-pointer">
                  <input 
                    checked={categoryFilter.includes(category)}
                    onChange={() => toggleFilter(categoryFilter, setCategoryFilter, category)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green/50" 
                    type="checkbox" 
                  />
                  <span className="ml-2">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Blockchain Filter */}
          <div>
            <h4 className="font-semibold text-header-text mb-3">Blockchain</h4>
            <div className="space-y-2">
              {['Ethereum', 'Solana', 'Polygon'].map((blockchain) => (
                <label key={blockchain} className="flex items-center text-sm cursor-pointer">
                  <input 
                    checked={blockchainFilter.includes(blockchain)}
                    onChange={() => toggleFilter(blockchainFilter, setBlockchainFilter, blockchain)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green/50" 
                    type="checkbox" 
                  />
                  <span className="ml-2">{blockchain}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow p-8">
        <div className="w-full">
          <div className="group relative flex w-full items-stretch">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-body-text/60">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 rounded-btn border border-gray-200 bg-white/80 py-3 pl-11 pr-32 text-base text-header-text shadow-search transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none" 
              placeholder="Search for projects, tags, or DAOs..." 
              type="search" 
            />
            <button className="absolute inset-y-1.5 right-1.5 flex cursor-pointer items-center justify-center rounded-lg h-auto px-5 bg-primary-green text-white text-sm font-semibold transition-transform duration-200 ease-in-out hover:scale-105">
              Search
            </button>
          </div>
        </div>

        <div className="my-6">
          <p className="text-sm text-body-text">
            Showing <span className="font-semibold text-header-text">{projects.length}</span> results
            {search && ` for "${search}"`}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-body-text">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
