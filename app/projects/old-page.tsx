'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BentoCard } from '@/components/ui/BentoCard';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <Navbar />
      <main className="flex-grow flex w-full">
        {/* Filters Sidebar */}
        <aside className="w-64 flex-shrink-0 p-8 hidden md:block border-r border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-header-text">Filters</h3>
            <button className="text-sm font-medium text-accent-blue hover:underline">Clear all</button>
          </div>
          <div className="mt-6 space-y-6">
            {/* Category Filter */}
            <div>
              <h4 className="font-semibold text-header-text mb-3">Category</h4>
              <div className="space-y-2">
                <label className="flex items-center text-sm">
                  <input defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green/50" type="checkbox" />
                  <span className="ml-2">DeFi</span>
                </label>
                <label className="flex items-center text-sm">
                  <input className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green/50" type="checkbox" />
                  <span className="ml-2">NFT</span>
                </label>
                <label className="flex items-center text-sm">
                  <input className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green/50" type="checkbox" />
                  <span className="ml-2">DAO</span>
                </label>
                <label className="flex items-center text-sm">
                  <input className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green/50" type="checkbox" />
                  <span className="ml-2">Gaming</span>
                </label>
              </div>
            </div>

            {/* Blockchain Filter */}
            <div>
              <h4 className="font-semibold text-header-text mb-3">Blockchain</h4>
              <div className="space-y-2">
                <label className="flex items-center text-sm">
                  <input className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green/50" type="checkbox" />
                  <span className="ml-2">Ethereum</span>
                </label>
                <label className="flex items-center text-sm">
                  <input defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green/50" type="checkbox" />
                  <span className="ml-2">Solana</span>
                </label>
                <label className="flex items-center text-sm">
                  <input className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green/50" type="checkbox" />
                  <span className="ml-2">Polygon</span>
                </label>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h4 className="font-semibold text-header-text mb-3">Status</h4>
              <div className="space-y-2">
                <label className="flex items-center text-sm">
                  <input className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green/50" type="checkbox" />
                  <span className="ml-2">Live</span>
                </label>
                <label className="flex items-center text-sm">
                  <input className="h-4 w-4 rounded border-gray-300 text-primary-green focus:ring-primary-green/50" type="checkbox" />
                  <span className="ml-2">In Development</span>
                </label>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="font-semibold text-header-text mb-3">Rating</h4>
              <input 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                max="5" 
                min="0" 
                type="range" 
                defaultValue="4"
              />
              <div className="flex justify-between text-xs text-body-text mt-1">
                <span>0+</span>
                <span>5</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow p-8">
          {/* Search Bar */}
          <div className="w-full">
            <div className="group relative flex w-full items-stretch">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-body-text/60">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input 
                className="form-input flex w-full min-w-0 flex-1 rounded-btn border border-gray-200 bg-white/80 py-3 pl-11 pr-32 text-base text-header-text shadow-search transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                placeholder="Search for projects, tags, or DAOs..." 
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="absolute inset-y-1.5 right-1.5 flex cursor-pointer items-center justify-center rounded-lg h-auto px-5 bg-primary-green text-white text-sm font-semibold transition-transform duration-200 ease-in-out hover:scale-105">
                Search
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="my-6">
            <p className="text-sm text-body-text">
              Showing <span className="font-semibold text-header-text">12</span> results
              {searchTerm && (
                <> for "<span className="font-semibold text-header-text">{searchTerm}</span>"</>
              )}
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Featured */}
            <BentoCard 
              title="Quantum Ledger" 
              subtitle="Decentralized asset management powered by quantum computing."
              size="2x2"
              image="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop"
              logo="https://api.dicebear.com/7.x/shapes/svg?seed=quantum&backgroundColor=3A5A40"
            >
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <Badge variant="defi">DeFi</Badge>
                  <Badge variant="ai">AI</Badge>
                </div>
                <div className="flex flex-col items-center justify-center rounded-btn border border-white/20 bg-white/10 px-3 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                  <span className="material-symbols-outlined text-2xl">arrow_drop_up</span>
                  <span className="text-sm font-bold tracking-tight">1245</span>
                </div>
              </div>
            </BentoCard>

            {/* Regular Cards */}
            {[
              { title: "Artifex Prime", desc: "A generative art platform for creating and trading unique NFTs.", votes: 987, badges: ["nft", "default"], image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop" },
              { title: "DAOhaus v3", desc: "The next generation of community-owned and operated DAOs.", votes: 852, badges: ["dao", "default"], image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop" },
              { title: "ChainBridge Pro", desc: "Seamless cross-chain asset transfers.", votes: 743, badges: ["defi"], image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&auto=format&fit=crop" },
              { title: "MetaVerse Studios", desc: "Build, play, and earn in the gaming metaverse.", votes: 612, badges: ["nft", "default"], image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop" },
              { title: "TrustNode Network", desc: "Decentralized infrastructure for Web3.", votes: 534, badges: ["default"], image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop" },
            ].map((project, i) => (
              <BentoCard
                key={i}
                title={project.title}
                subtitle={project.desc}
                image={project.image}
                logo={`https://api.dicebear.com/7.x/shapes/svg?seed=${project.title}`}
                size="1x1"
              >
                <div className="flex items-center gap-2 mt-3">
                  {project.badges.map((badge, j) => (
                    <Badge key={j} variant={badge as any}>{badge.toUpperCase()}</Badge>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-sm font-semibold text-header-text">{project.votes}</span>
                  <button className="flex items-center justify-center rounded-full h-8 w-8 transition-colors bg-gray-100 hover:bg-gray-200">
                    <span className="material-symbols-outlined text-xl text-body-text">arrow_drop_up</span>
                  </button>
                </div>
              </BentoCard>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center">
            <nav aria-label="Pagination" className="flex items-center gap-2">
              <a className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-200 text-body-text hover:bg-gray-100" href="#">
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </a>
              <a aria-current="page" className="inline-flex items-center justify-center w-9 h-9 rounded-md text-white bg-primary-green font-semibold" href="#">1</a>
              <a className="inline-flex items-center justify-center w-9 h-9 rounded-md text-header-text hover:bg-gray-100 font-medium" href="#">2</a>
              <a className="inline-flex items-center justify-center w-9 h-9 rounded-md text-header-text hover:bg-gray-100 font-medium" href="#">3</a>
              <span className="inline-flex items-center justify-center w-9 h-9 text-header-text">...</span>
              <a className="inline-flex items-center justify-center w-9 h-9 rounded-md text-header-text hover:bg-gray-100 font-medium" href="#">8</a>
              <a className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-200 text-body-text hover:bg-gray-100" href="#">
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </a>
            </nav>
          </div>
        </div>
      </main>
    </>
  );
}