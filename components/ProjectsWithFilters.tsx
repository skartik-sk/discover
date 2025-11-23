'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProjectCard } from './ProjectCard';

interface Project {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logoUrl: string;
  coverUrl: string;
  category: string;
  tags: string;
  blockchains: string;
  upvotes: number;
  user: {
    username: string;
  };
}

interface Props {
  initialProjects: Project[];
}

export function ProjectsWithFilters({ initialProjects }: Props) {
  const [projects, setProjects] = useState(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBlockchains, setSelectedBlockchains] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const categories = ['DeFi', 'NFT', 'DAO', 'Gaming'];
  const blockchains = ['Ethereum', 'Solana', 'Polygon'];
  const statuses = ['Live', 'In Development'];

  useEffect(() => {
    // Filter projects based on selected filters
    let filtered = initialProjects;

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedBlockchains.length > 0) {
      filtered = filtered.filter(p => 
        selectedBlockchains.some(b => p.blockchains.includes(b))
      );
    }

    setProjects(filtered);
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [searchQuery, selectedCategories, selectedBlockchains, selectedStatuses, ratingFilter, initialProjects]);

  // Calculate pagination
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleBlockchain = (chain: string) => {
    setSelectedBlockchains(prev => 
      prev.includes(chain) ? prev.filter(c => c !== chain) : [...prev, chain]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBlockchains([]);
    setSelectedStatuses([]);
    setRatingFilter(0);
    setSearchQuery('');
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <main className="grow flex w-full">
      {/* Sidebar Filters */}
      <aside className="w-64 shrink-0 p-8 hidden md:block border-r border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-header-text">Filters</h3>
          <button 
            onClick={clearAllFilters}
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
              {categories.map(cat => (
                <label key={cat} className="flex items-center text-sm cursor-pointer">
                  <input 
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green/50" 
                    type="checkbox"
                  />
                  <span className="ml-2">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Blockchain Filter */}
          <div>
            <h4 className="font-semibold text-header-text mb-3">Blockchain</h4>
            <div className="space-y-2">
              {blockchains.map(chain => (
                <label key={chain} className="flex items-center text-sm cursor-pointer">
                  <input 
                    checked={selectedBlockchains.includes(chain)}
                    onChange={() => toggleBlockchain(chain)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green/50" 
                    type="checkbox"
                  />
                  <span className="ml-2">{chain}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h4 className="font-semibold text-header-text mb-3">Status</h4>
            <div className="space-y-2">
              {statuses.map(status => (
                <label key={status} className="flex items-center text-sm cursor-pointer">
                  <input 
                    checked={selectedStatuses.includes(status)}
                    onChange={() => toggleStatus(status)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green/50" 
                    type="checkbox"
                  />
                  <span className="ml-2">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h4 className="font-semibold text-header-text mb-3">Rating</h4>
            <input 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider" 
              max="5" 
              min="0" 
              type="range" 
              value={ratingFilter}
              onChange={(e) => setRatingFilter(parseInt(e.target.value))}
              style={{
                background: `linear-gradient(to right, #6A8EAB 0%, #6A8EAB ${(ratingFilter / 5) * 100}%, #E5E7EB ${(ratingFilter / 5) * 100}%, #E5E7EB 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-body-text mt-1">
              <span>0+</span>
              <span>5</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="grow p-8">
        {/* Search Bar */}
        <div className="w-full">
          <div className="group relative flex w-full items-stretch">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-body-text/60">
              <span className="material-symbols-outlined text-xl!">search</span>
            </div>
            <input 
              className="form-input flex w-full min-w-0 flex-1 rounded-btn border border-gray-200 bg-white/80 py-3 pl-11 pr-32 text-base text-header-text shadow-search transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20" 
              placeholder="Search for projects, tags, or DAOs..." 
              type="search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              className="absolute inset-y-1.5 right-1.5 flex cursor-pointer items-center justify-center rounded-lg h-auto px-5 bg-primary-green text-white text-sm font-semibold transition-transform duration-200 ease-in-out hover:scale-105"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="my-6">
          <p className="text-sm text-body-text">
            Showing <span className="font-semibold text-header-text">{projects.length}</span> results
            {searchQuery && <span> for &quot;<span className="font-semibold text-header-text">{searchQuery}</span>&quot;</span>}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-body-text">
              No projects found. Try adjusting your filters.
            </div>
          ) : (
            currentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center">
            <nav aria-label="Pagination" className="flex items-center gap-2">
              <button 
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-200 text-body-text hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-xl!">chevron_left</span>
              </button>
              
              {getPageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                  <button
                    key={index}
                    onClick={() => goToPage(page)}
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-md font-semibold transition-colors ${
                      currentPage === page
                        ? 'text-white bg-primary-green'
                        : 'text-header-text hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={index} className="inline-flex items-center justify-center w-9 h-9 text-header-text">
                    {page}
                  </span>
                )
              ))}
              
              <button 
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-200 text-body-text hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-xl!">chevron_right</span>
              </button>
            </nav>
          </div>
        )}
        
        {/* Showing X-Y of Z */}
        {projects.length > itemsPerPage && (
          <div className="mt-4 text-center">
            <p className="text-sm text-body-text">
              Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
              <span className="font-semibold">{Math.min(endIndex, projects.length)}</span> of{' '}
              <span className="font-semibold">{projects.length}</span> results
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
