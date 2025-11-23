'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function SubmitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    logoUrl: '',
    coverUrl: '',
    videoUrl: '',
    websiteUrl: '',
    category: '',
    tags: '',
    blockchains: [] as string[],
    twitter: '',
    discord: '',
    github: '',
    telegram: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          blockchains: formData.blockchains.join(','),
        }),
      });

      if (response.ok) {
        const project = await response.json();
        router.push(`/project/${project.slug}`);
      } else {
        alert('Failed to submit project. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockchain = (blockchain: string) => {
    setFormData(prev => ({
      ...prev,
      blockchains: prev.blockchains.includes(blockchain)
        ? prev.blockchains.filter(b => b !== blockchain)
        : [...prev.blockchains, blockchain]
    }));
  };

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
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-6 md:p-8 rounded-soft shadow-card border border-gray-100">
              
              {/* Basic Information Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-header-text border-b border-gray-100 pb-3">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-header-text">Project Name *</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                      placeholder="e.g. Quantum Ledger"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-header-text">Website URL *</label>
                    <input 
                      required
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                      className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                      placeholder="https://yourproject.com"
                      type="url"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-header-text">Tagline *</label>
                  <input 
                    required
                    value={formData.tagline}
                    onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                    className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                    placeholder="Briefly describe your project in one sentence"
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-header-text">Description *</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                    required
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                    className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                    placeholder="https://yourproject.com/logo.png"
                    type="url"
                  />
                  <p className="text-xs text-body-text">Square image recommended (512x512px minimum)</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-header-text">Cover Image URL *</label>
                  <input 
                    required
                    value={formData.coverUrl}
                    onChange={(e) => setFormData({...formData, coverUrl: e.target.value})}
                    className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                    placeholder="https://yourproject.com/cover.jpg"
                    type="url"
                  />
                  <p className="text-xs text-body-text">Landscape image recommended (1200x630px minimum)</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-header-text">Demo Video URL (Optional)</label>
                  <input 
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
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
                          required
                          type="radio" 
                          name="category" 
                          value={cat}
                          checked={formData.category === cat}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
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
                          checked={formData.blockchains.includes(chain)}
                          onChange={() => toggleBlockchain(chain)}
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
                      value={formData.twitter}
                      onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                      className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                      placeholder="@yourproject"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-header-text">Discord</label>
                    <input 
                      value={formData.discord}
                      onChange={(e) => setFormData({...formData, discord: e.target.value})}
                      className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                      placeholder="discord.gg/yourserver"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-header-text">GitHub</label>
                    <input 
                      value={formData.github}
                      onChange={(e) => setFormData({...formData, github: e.target.value})}
                      className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                      placeholder="github.com/yourproject"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-header-text">Telegram</label>
                    <input 
                      value={formData.telegram}
                      onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                      className="flex w-full rounded-btn border border-gray-200 bg-white/80 px-4 py-3 text-base text-header-text shadow-sm transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20 focus:outline-none"
                      placeholder="t.me/yourgroup"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-6 flex gap-4 justify-end border-t border-gray-100">
                <Link 
                  href="/"
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-btn h-10 px-5 border-2 border-primary-green text-primary-green text-sm font-semibold transition-transform duration-200 ease-in-out hover:scale-105"
                >
                  Cancel
                </Link>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-btn h-10 px-5 bg-primary-green text-white text-sm font-semibold transition-transform duration-200 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
