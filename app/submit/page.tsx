'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Step = 'basic' | 'details' | 'media' | 'review';

export default function SubmitPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    logoUrl: '',
    coverUrl: '',
    videoUrl: '',
    websiteUrl: '',
    contactEmail: '',
    contractAddress: '',
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
        const data = await response.json();
        const project = data.project;
        router.push(`/${project.user.username}/${project.slug}`);
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

  const nextStep = () => {
    // Validate current step before proceeding
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 'basic') {
      if (!formData.name.trim()) newErrors.name = 'Project name is required';
      if (!formData.tagline.trim()) newErrors.tagline = 'Tagline is required';
      if (!formData.websiteUrl.trim()) newErrors.websiteUrl = 'Website URL is required';
      if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
        newErrors.contactEmail = 'Invalid email format';
      }
    } else if (currentStep === 'details') {
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.category) newErrors.category = 'Please select a category';
      if (formData.blockchains.length === 0) newErrors.blockchains = 'Select at least one blockchain';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    if (currentStep === 'basic') setCurrentStep('details');
    else if (currentStep === 'details') setCurrentStep('media');
    else if (currentStep === 'media') setCurrentStep('review');
  };

  const prevStep = () => {
    if (currentStep === 'review') setCurrentStep('media');
    else if (currentStep === 'media') setCurrentStep('details');
    else if (currentStep === 'details') setCurrentStep('basic');
  };

  const getStepNumber = (step: Step) => {
    const steps = { basic: 1, details: 2, media: 3, review: 4 };
    return steps[step];
  };

  return (
    <main className="flex flex-col md:flex-row w-full grow">
      {/* Left Sidebar - Progress */}
      <aside className="w-full md:w-1/4 lg:w-1/5 p-6 md:p-8 border-b md:border-r md:border-b-0 border-frame-border bg-white/30">
        <h3 className="text-lg font-semibold text-header-text mb-6">Submission Progress</h3>
            <nav>
              <ul className="space-y-4">
                <li>
                  <button onClick={() => setCurrentStep('basic')} className={`flex items-center gap-3 w-full text-left ${currentStep === 'basic' ? 'text-primary-green font-semibold' : 'text-body-text hover:text-header-text'}`}>
                    <span className={`flex items-center justify-center size-6 ${currentStep === 'basic' || getStepNumber(currentStep) > 1 ? 'bg-primary-green text-white' : 'bg-gray-200 text-body-text'} rounded-full text-sm`}>1</span>
                    <span>Basic Info</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentStep('details')} className={`flex items-center gap-3 w-full text-left ${currentStep === 'details' ? 'text-primary-green font-semibold' : 'text-body-text hover:text-header-text'}`}>
                    <span className={`flex items-center justify-center size-6 ${currentStep === 'details' || getStepNumber(currentStep) > 2 ? 'bg-primary-green text-white' : 'bg-gray-200 text-body-text'} rounded-full text-sm`}>2</span>
                    <span>Details</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentStep('media')} className={`flex items-center gap-3 w-full text-left ${currentStep === 'media' ? 'text-primary-green font-semibold' : 'text-body-text hover:text-header-text'}`}>
                    <span className={`flex items-center justify-center size-6 ${currentStep === 'media' || getStepNumber(currentStep) > 3 ? 'bg-primary-green text-white' : 'bg-gray-200 text-body-text'} rounded-full text-sm`}>3</span>
                    <span>Media</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentStep('review')} className={`flex items-center gap-3 w-full text-left ${currentStep === 'review' ? 'text-primary-green font-semibold' : 'text-body-text hover:text-header-text'}`}>
                    <span className={`flex items-center justify-center size-6 ${currentStep === 'review' ? 'bg-primary-green text-white' : 'bg-gray-200 text-body-text'} rounded-full text-sm`}>4</span>
                    <span>Review</span>
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Form */}
          <div className="flex-1 p-6 md:p-8 lg:p-10">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-header-text">Submit Your Project</h1>
              <p className="mt-2 text-body-text">Fill out the form below to get your project listed on Discover. Fields marked with * are required.</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                {/* STEP 1: Basic Info */}
                {currentStep === 'basic' && (
                  <>
                    <section>
                      <h2 className="text-xl font-bold text-charcoal-gray">Basic Info</h2>
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-header-text" htmlFor="project-name">Project Name *</label>
                      <input 
                        required
                        value={formData.name}
                        onChange={(e) => { setFormData({...formData, name: e.target.value}); setErrors(prev => ({...prev, name: ''})); }}
                        className={`mt-1 block w-full py-3 px-4 rounded-input shadow-sm placeholder-placeholder-gray focus:ring focus:ring-primary-green focus:ring-opacity-20 ${
                          errors.name ? 'border-red-500 focus:border-red-500' : 'border-input-border focus:border-primary-green'
                        }`}
                        id="project-name" 
                        placeholder="e.g., Quantum Ledger" 
                        type="text"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-header-text" htmlFor="tagline">Tagline *</label>
                      <input 
                        required
                        value={formData.tagline}
                        onChange={(e) => { setFormData({...formData, tagline: e.target.value}); setErrors(prev => ({...prev, tagline: ''})); }}
                        className={`mt-1 block w-full py-3 px-4 rounded-input shadow-sm placeholder-placeholder-gray focus:ring focus:ring-primary-green focus:ring-opacity-20 ${
                          errors.tagline ? 'border-red-500 focus:border-red-500' : 'border-input-border focus:border-primary-green'
                        }`}
                        id="tagline" 
                        placeholder="A short, catchy phrase describing your project" 
                        type="text"
                      />
                      {errors.tagline && <p className="mt-1 text-sm text-red-600">{errors.tagline}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-header-text" htmlFor="website">Website URL *</label>
                      <input 
                        required
                        value={formData.websiteUrl}
                        onChange={(e) => { setFormData({...formData, websiteUrl: e.target.value}); setErrors(prev => ({...prev, websiteUrl: ''})); }}
                        className={`mt-1 block w-full py-3 px-4 rounded-input shadow-sm placeholder-placeholder-gray focus:ring focus:ring-primary-green focus:ring-opacity-20 ${
                          errors.websiteUrl ? 'border-red-500 focus:border-red-500' : 'border-input-border focus:border-primary-green'
                        }`}
                        id="website" 
                        placeholder="https://example.com" 
                        type="url"
                      />
                      {errors.websiteUrl && <p className="mt-1 text-sm text-red-600">{errors.websiteUrl}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-header-text" htmlFor="contact-email">Contact Email *</label>
                      <input 
                        required
                        value={formData.contactEmail}
                        onChange={(e) => { setFormData({...formData, contactEmail: e.target.value}); setErrors(prev => ({...prev, contactEmail: ''})); }}
                        className={`mt-1 block w-full py-3 px-4 rounded-input shadow-sm placeholder-placeholder-gray focus:ring focus:ring-primary-green focus:ring-opacity-20 ${
                          errors.contactEmail ? 'border-red-500 focus:border-red-500' : 'border-input-border focus:border-primary-green'
                        }`}
                        id="contact-email" 
                        placeholder="you@example.com" 
                        type="email"
                      />
                      {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
                    </div>
                  </div>
                </section>

                {/* On-chain Verification */}
                <section>
                  <h2 className="text-xl font-bold text-charcoal-gray">On-chain Verification</h2>
                  <div className="mt-4 grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-header-text" htmlFor="contract-address">Primary Contract Address (Optional)</label>
                      <input 
                        value={formData.contractAddress}
                        onChange={(e) => setFormData({...formData, contractAddress: e.target.value})}
                        className="mt-1 block w-full py-3 px-4 rounded-input border-input-border shadow-sm placeholder-placeholder-gray focus:border-primary-green focus:ring focus:ring-primary-green focus:ring-opacity-20" 
                        id="contract-address" 
                        placeholder="0x..." 
                        type="text"
                      />
                    </div>
                    <div className="mt-2 p-4 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
                      <p className="text-sm text-accent-blue font-medium"><span className="font-bold">Why Verification Matters:</span> Adding an on-chain address helps build trust with the community by providing a verifiable link to your project's smart contracts.</p>
                    </div>
                  </div>
                </section>

                {/* Project Logo & Cover */}
                <section>
                  <h2 className="text-xl font-bold text-charcoal-gray">Project Logo & Cover</h2>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-header-text mb-1">Project Logo *</label>
                      <div className="flex justify-center items-center w-full px-6 py-10 border-2 border-dashed border-input-border rounded-lg text-center cursor-pointer hover:border-primary-green transition-colors">
                        <div className="text-body-text">
                          <span className="material-symbols-outlined !text-4xl text-gray-400">cloud_upload</span>
                          <p className="mt-2 text-sm">Drag & drop or <span className="font-semibold text-primary-green">browse files</span></p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      </div>
                      <input 
                        required
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                        className="mt-2 block w-full py-3 px-4 text-xs rounded-input border-input-border shadow-sm placeholder-placeholder-gray focus:border-primary-green focus:ring focus:ring-primary-green focus:ring-opacity-20" 
                        placeholder="Or paste URL: https://yourproject.com/logo.png"
                        type="url"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-header-text mb-1">Cover Image</label>
                      <div className="flex justify-center items-center w-full px-6 py-10 border-2 border-dashed border-input-border rounded-lg text-center cursor-pointer hover:border-primary-green transition-colors">
                        <div className="text-body-text">
                          <span className="material-symbols-outlined !text-4xl text-gray-400">image</span>
                          <p className="mt-2 text-sm">Drag & drop or <span className="font-semibold text-primary-green">browse files</span></p>
                          <p className="text-xs text-gray-500 mt-1">16:9 ratio recommended</p>
                        </div>
                      </div>
                      <input 
                        required
                        value={formData.coverUrl}
                        onChange={(e) => setFormData({...formData, coverUrl: e.target.value})}
                        className="mt-2 block w-full py-3 px-4 text-xs rounded-input border-input-border shadow-sm placeholder-placeholder-gray focus:border-primary-green focus:ring focus:ring-primary-green focus:ring-opacity-20" 
                        placeholder="Or paste URL: https://yourproject.com/cover.jpg"
                        type="url"
                      />
                    </div>
                  </div>
                    </section>
                  </>
                )}

                {/* STEP 2: Details */}
                {currentStep === 'details' && (
                  <>
                    <section>
                      <h2 className="text-xl font-bold text-charcoal-gray">Description</h2>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-header-text" htmlFor="description">Full Description *</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={(e) => { setFormData({...formData, description: e.target.value}); setErrors(prev => ({...prev, description: ''})); }}
                      className={`mt-1 block w-full py-3 px-4 rounded-input shadow-sm placeholder-placeholder-gray focus:ring focus:ring-primary-green focus:ring-opacity-20 min-h-[120px] ${
                        errors.description ? 'border-red-500 focus:border-red-500' : 'border-input-border focus:border-primary-green'
                      }`}
                      id="description" 
                      placeholder="Tell us more about your project..."
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                  </div>
                </section>

                {/* Category */}
                <section>
                  <h2 className="text-xl font-bold text-charcoal-gray">Category *</h2>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {['DeFi', 'NFT', 'DAO', 'Gaming', 'Infrastructure', 'Social', 'Other'].map((cat) => (
                      <label key={cat} className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full border ${formData.category === cat ? 'border-primary-green bg-primary-green/10' : 'border-gray-200'} hover:bg-gray-50 transition-colors`}>
                        <input 
                          required
                          type="radio" 
                          name="category" 
                          value={cat}
                          checked={formData.category === cat}
                          onChange={(e) => { setFormData({...formData, category: e.target.value}); setErrors(prev => ({...prev, category: ''})); }}
                          className="text-primary-green focus:ring-primary-green/20"
                        />
                        <span className="text-sm text-body-text font-medium">{cat}</span>
                      </label>
                    ))}
                  </div>
                  {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
                </section>

                {/* Blockchain Selection */}
                <section>
                  <h2 className="text-xl font-bold text-charcoal-gray">Blockchain(s) *</h2>
                  <p className="text-sm text-body-text mt-1">Select all that apply</p>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'Solana', 'Avalanche', 'BSC'].map((chain) => (
                      <label key={chain} className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border ${formData.blockchains.includes(chain) ? 'border-primary-green bg-primary-green/10' : 'border-gray-200'} hover:bg-gray-50 transition-colors`}>
                        <input 
                          type="checkbox" 
                          checked={formData.blockchains.includes(chain)}
                          onChange={() => { toggleBlockchain(chain); setErrors(prev => ({...prev, blockchains: ''})); }}
                          className="rounded border-gray-300 text-primary-green focus:ring-primary-green/20"
                        />
                        <span className="text-sm text-body-text font-medium">{chain}</span>
                      </label>
                    ))}
                  </div>
                  {errors.blockchains && <p className="mt-2 text-sm text-red-600">{errors.blockchains}</p>}
                </section>

                <section>
                  <h2 className="text-xl font-bold text-charcoal-gray">Tags</h2>
                  <p className="text-sm text-body-text mt-1">Add relevant tags (comma separated)</p>
                  <div className="mt-4">
                    <input 
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="mt-1 block w-full py-3 px-4 rounded-input border-input-border shadow-sm placeholder-placeholder-gray focus:border-primary-green focus:ring focus:ring-primary-green focus:ring-opacity-20" 
                      placeholder="e.g., quantum, ledger, secure, fast"
                      type="text"
                    />
                  </div>
                </section>
                  </>
                )}

                {/* STEP 3: Media */}
                {currentStep === 'media' && (
                  <>
                    <section>
                      <h2 className="text-xl font-bold text-charcoal-gray">Video & Media</h2>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-header-text" htmlFor="video">Demo/Pitch Video URL (Optional)</label>
                        <input 
                          value={formData.videoUrl}
                          onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                          className="mt-1 block w-full py-3 px-4 rounded-input border-input-border shadow-sm placeholder-placeholder-gray focus:border-primary-green focus:ring focus:ring-primary-green focus:ring-opacity-20" 
                          id="video" 
                          placeholder="https://youtube.com/watch?v=..."
                          type="url"
                        />
                        <p className="text-xs text-gray-500 mt-1">YouTube or Vimeo links supported</p>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-charcoal-gray">Social Links</h2>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-header-text" htmlFor="twitter">Twitter</label>
                          <input 
                            value={formData.twitter}
                            onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                            className="mt-1 block w-full py-3 px-4 rounded-input border-input-border shadow-sm placeholder-placeholder-gray focus:border-primary-green focus:ring focus:ring-primary-green focus:ring-opacity-20" 
                            id="twitter" 
                            placeholder="@yourproject"
                            type="text"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-header-text" htmlFor="discord">Discord</label>
                          <input 
                            value={formData.discord}
                            onChange={(e) => setFormData({...formData, discord: e.target.value})}
                            className="mt-1 block w-full py-3 px-4 rounded-input border-input-border shadow-sm placeholder-placeholder-gray focus:border-primary-green focus:ring focus:ring-primary-green focus:ring-opacity-20" 
                            id="discord" 
                            placeholder="https://discord.gg/..."
                            type="url"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-header-text" htmlFor="github">GitHub</label>
                          <input 
                            value={formData.github}
                            onChange={(e) => setFormData({...formData, github: e.target.value})}
                            className="mt-1 block w-full py-3 px-4 rounded-input border-input-border shadow-sm placeholder-placeholder-gray focus:border-primary-green focus:ring focus:ring-primary-green focus:ring-opacity-20" 
                            id="github" 
                            placeholder="yourorg/yourproject"
                            type="text"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-header-text" htmlFor="telegram">Telegram</label>
                          <input 
                            value={formData.telegram}
                            onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                            className="mt-1 block w-full py-3 px-4 rounded-input border-input-border shadow-sm placeholder-placeholder-gray focus:border-primary-green focus:ring focus:ring-primary-green focus:ring-opacity-20" 
                            id="telegram" 
                            placeholder="t.me/yourproject"
                            type="text"
                          />
                        </div>
                      </div>
                    </section>
                  </>
                )}

                {/* STEP 4: Review */}
                {currentStep === 'review' && (
                  <section>
                    <h2 className="text-xl font-bold text-charcoal-gray mb-6">Review Your Submission</h2>
                    <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-header-text">Basic Info</h3>
                        <dl className="mt-2 space-y-1 text-sm">
                          <div><dt className="inline font-medium">Name:</dt> <dd className="inline text-body-text">{formData.name || 'Not provided'}</dd></div>
                          <div><dt className="inline font-medium">Tagline:</dt> <dd className="inline text-body-text">{formData.tagline || 'Not provided'}</dd></div>
                          <div><dt className="inline font-medium">Website:</dt> <dd className="inline text-body-text">{formData.websiteUrl || 'Not provided'}</dd></div>
                          <div><dt className="inline font-medium">Email:</dt> <dd className="inline text-body-text">{formData.contactEmail || 'Not provided'}</dd></div>
                        </dl>
                      </div>
                      <div>
                        <h3 className="font-semibold text-header-text">Details</h3>
                        <dl className="mt-2 space-y-1 text-sm">
                          <div><dt className="inline font-medium">Category:</dt> <dd className="inline text-body-text">{formData.category || 'Not selected'}</dd></div>
                          <div><dt className="inline font-medium">Blockchains:</dt> <dd className="inline text-body-text">{formData.blockchains.join(', ') || 'None selected'}</dd></div>
                          <div><dt className="inline font-medium">Tags:</dt> <dd className="inline text-body-text">{formData.tags || 'None'}</dd></div>
                        </dl>
                      </div>
                      <div>
                        <h3 className="font-semibold text-header-text">Media</h3>
                        <dl className="mt-2 space-y-1 text-sm">
                          <div><dt className="inline font-medium">Logo:</dt> <dd className="inline text-body-text">{formData.logoUrl ? 'Provided' : 'Not provided'}</dd></div>
                          <div><dt className="inline font-medium">Cover:</dt> <dd className="inline text-body-text">{formData.coverUrl ? 'Provided' : 'Not provided'}</dd></div>
                          <div><dt className="inline font-medium">Video:</dt> <dd className="inline text-body-text">{formData.videoUrl ? 'Provided' : 'Optional'}</dd></div>
                        </dl>
                      </div>
                    </div>
                  </section>
                )}

                {/* Form Actions */}
                <div className="flex justify-between items-center pt-6 border-t border-frame-border">
                  <button 
                    type="button"
                    onClick={currentStep === 'basic' ? () => router.push('/') : prevStep}
                    className="h-11 px-6 text-sm font-semibold rounded-btn border border-primary-green text-primary-green transition-colors hover:bg-primary-green/10"
                  >
                    {currentStep === 'basic' ? 'Cancel' : 'Back'}
                  </button>
                  <button 
                    type={currentStep === 'review' ? 'submit' : 'button'}
                    onClick={currentStep === 'review' ? undefined : nextStep}
                    disabled={loading}
                    className="h-11 px-8 text-sm font-semibold rounded-btn bg-primary-green text-white transition-transform duration-200 ease-in-out hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : currentStep === 'review' ? 'Submit Project' : 'Save & Continue'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
  );
}
