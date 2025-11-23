'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function SubmitPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full px-6 py-8 md:px-8 md:py-12">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-header-text text-3xl md:text-4xl font-bold tracking-tight">Submit Your Project</h1>
              <p className="text-body-text text-base md:text-lg">Share your Web3 innovation with the world. Get discovered by thousands of users.</p>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-6 bg-white p-6 md:p-8 rounded-soft shadow-card border border-gray-100">
              
              {/* Basic Information Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-header-text border-b border-gray-100 pb-3">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-header-text">Project Name *</label>
                    <input 
                      className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                      placeholder="e.g. Quantum Ledger"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-header-text">Website URL *</label>
                    <input 
                      className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                      placeholder="https://yourproject.com"
                      type="url"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-header-text">Tagline *</label>
                  <input 
                    className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                    placeholder="Briefly describe your project in one sentence"
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-header-text">Description *</label>
                  <textarea 
                    className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none min-h-[120px] resize-y"
                    placeholder="Tell us more about your project. What problem does it solve? What makes it unique?"
                  />
                </div>
              </div>

              {/* Media Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-header-text border-b border-gray-100 pb-3">Media</h3>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-header-text">Logo URL *</label>
                  <input 
                    className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                    placeholder="https://yourproject.com/logo.png"
                    type="url"
                  />
                  <p className="text-xs text-muted-text">Square image recommended (512x512px minimum)</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-header-text">Cover Image URL *</label>
                  <input 
                    className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                    placeholder="https://yourproject.com/cover.jpg"
                    type="url"
                  />
                  <p className="text-xs text-muted-text">Landscape image recommended (1200x630px minimum)</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-header-text">Demo Video URL (Optional)</label>
                  <input 
                    className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                    placeholder="https://youtube.com/watch?v=..."
                    type="url"
                  />
                </div>
              </div>

              {/* Category & Tags Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-header-text border-b border-gray-100 pb-3">Category & Tags</h3>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-header-text">Primary Category *</label>
                  <div className="flex flex-wrap gap-3">
                    {['DeFi', 'NFT', 'DAO', 'Gaming', 'Infrastructure', 'Social', 'Other'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                        <input 
                          type="radio" 
                          name="category" 
                          className="text-primary-green focus:ring-primary-green/20"
                        />
                        <span className="text-sm text-body-text font-medium">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-header-text">Additional Tags (Optional)</label>
                  <input 
                    className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                    placeholder="e.g. Ethereum, Layer2, ZK-Proof (comma separated)"
                    type="text"
                  />
                </div>
              </div>

              {/* Blockchain Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-header-text border-b border-gray-100 pb-3">Blockchain</h3>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-header-text">Select Blockchain(s) *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'Solana'].map((chain) => (
                      <label key={chain} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-primary-green focus:ring-primary-green/20"
                        />
                        <span className="text-sm text-body-text">{chain}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Links Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-header-text border-b border-gray-100 pb-3">Social Links</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-header-text">Twitter</label>
                    <input 
                      className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                      placeholder="@yourproject"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-header-text">Discord</label>
                    <input 
                      className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                      placeholder="discord.gg/yourserver"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-header-text">GitHub</label>
                    <input 
                      className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                      placeholder="github.com/yourproject"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-header-text">Telegram</label>
                    <input 
                      className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                      placeholder="t.me/yourgroup"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-6 flex gap-4 justify-end border-t border-gray-100">
                <Link href="/">
                  <Button variant="secondary" size="lg">Cancel</Button>
                </Link>
                <Button variant="primary" size="lg">Submit Project</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}