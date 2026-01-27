import React, { useState } from 'react';
import { Upload, X, Check, ArrowRight, Globe, Twitter, Disc, ChevronDown, Coins, Link2, Image as ImageIcon, Calendar, Tag, Shield, Plus, Trash2, User, BarChart3, Users as UsersIcon, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../src/hooks/useAuth';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { ImageUpload } from '../src/components/ImageUpload';
import type { Id } from '../convex/_generated/dataModel';

// Custom Select Component
const CustomSelect = ({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-2 relative">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-neutral-950 border rounded-xl px-4 py-3 text-white cursor-pointer flex justify-between items-center transition-all ${isOpen ? 'border-lime-primary ring-1 ring-lime-primary' : 'border-neutral-800 hover:border-neutral-700'}`}
            >
                <span className={value ? 'text-white' : 'text-gray-500'}>{value || 'Select an option'}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto"
                    >
                        {options.map(opt => (
                            <div 
                                key={opt}
                                onClick={() => { onChange(opt); setIsOpen(false); }}
                                className="px-4 py-3 text-sm text-gray-300 hover:bg-neutral-800 hover:text-white cursor-pointer transition-colors"
                            >
                                {opt}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Custom Multi-Select for Chains
const MultiSelect = ({ label, options, values, onChange }: { label: string, options: string[], values: string[], onChange: (vals: string[]) => void }) => {
    const toggleOption = (opt: string) => {
        if (values.includes(opt)) {
            onChange(values.filter(v => v !== opt));
        } else {
            onChange([...values, opt]);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <div className="flex flex-wrap gap-2 p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                {options.map(opt => (
                    <button
                        key={opt}
                        onClick={() => toggleOption(opt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            values.includes(opt)
                            ? 'bg-lime-primary text-black border-lime-primary'
                            : 'bg-neutral-900 text-gray-400 border-neutral-800 hover:border-neutral-600'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};


const SubmitProject: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [customChain, setCustomChain] = useState('');
  
  const { address, isConnected } = useAuth();
  const createProject = useMutation(api.projects.create);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  
  const [formData, setFormData] = useState({
      name: '',
      tagline: '',
      category: '',
      chains: [] as string[],
      launchDate: '',
      description: '',
      tags: '',
      website: '',
      twitter: '',
      discord: '',
      github: '',
      auditUrl: '',
      tokenTicker: '',
      contractAddress: '',
      tvl: '',
      users: '',
      transactions: '',
      team: [{ name: '', role: '', avatar: '' }]
  });

  const categories = ['DeFi', 'NFT', 'Gaming', 'Infrastructure', 'DAO', 'Social', 'AI'];
  const chains = ['Ethereum', 'Solana', 'Arbitrum', 'Polygon', 'Base', 'Optimism', 'Avalanche', 'BSC', 'Sui', 'Other'];

  // Upload a file to Convex storage
  const uploadFile = async (file: File): Promise<Id<"_storage">> => {
    const uploadUrl = await generateUploadUrl();
    
    const result = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    
    const { storageId } = await result.json();
    return storageId as Id<"_storage">;
  };

  const handleSubmit = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet to submit a project');
      return;
    }

    // Validation
    if (!formData.name || !formData.tagline || !formData.category || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (!logoFile || !coverFile) {
      alert('Please upload both a logo and cover image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload logo and cover image
      const logoStorageId = await uploadFile(logoFile);
      const coverStorageId = await uploadFile(coverFile);

      // Upload screenshots if any
      const screenshotStorageIds = await Promise.all(
        screenshotFiles.map(file => uploadFile(file))
      );

      // Parse tags
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

      // Determine the primary chain to use
      let primaryChain = formData.chains[0] || 'Ethereum';
      if (formData.chains.includes('Other') && customChain) {
        primaryChain = customChain;
      }

      // Create project
      const projectId = await createProject({
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        logo: '', // Will be resolved from storage
        logoStorageId,
        coverImage: '', // Will be resolved from storage
        coverImageStorageId: coverStorageId,
        category: formData.category,
        tags,
        chain: primaryChain,
        launchDate: formData.launchDate,
        verified: false,
        featured: false,
        ownerWallet: address,
        users: formData.users || '0',
        transactions: formData.transactions || '0',
        tvl: formData.tvl || undefined,
        growth: 0,
        website: formData.website || undefined,
        twitter: formData.twitter || undefined,
        discord: formData.discord || undefined,
        github: formData.github || undefined,
        tokenSymbol: formData.tokenTicker || undefined,
        tokenAddress: formData.contractAddress || undefined,
        screenshotStorageIds: screenshotStorageIds.length > 0 ? screenshotStorageIds : undefined,
      });

      alert('Project submitted successfully! It will be reviewed within 24-48 hours.');
      
      // Reset form
      setStep(1);
      setFormData({
        name: '',
        tagline: '',
        category: '',
        chains: [],
        launchDate: '',
        description: '',
        tags: '',
        website: '',
        twitter: '',
        discord: '',
        github: '',
        auditUrl: '',
        tokenTicker: '',
        contractAddress: '',
        tvl: '',
        users: '',
        transactions: '',
        team: [{ name: '', role: '', avatar: '' }]
      });
      setLogoFile(null);
      setCoverFile(null);
      setScreenshotFiles([]);
      setCustomChain('');
    } catch (error: any) {
      console.error('Error submitting project:', error);
      alert(`Failed to submit project: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
      const newTeam = [...formData.team];
      newTeam[index] = { ...newTeam[index], [field]: value };
      setFormData({ ...formData, team: newTeam });
  };

  const addTeamMember = () => {
      setFormData({ ...formData, team: [...formData.team, { name: '', role: '', avatar: '' }] });
  };

  const removeTeamMember = (index: number) => {
      const newTeam = formData.team.filter((_, i) => i !== index);
      setFormData({ ...formData, team: newTeam });
  };

  // Check wallet connection
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-24 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-lime-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Wallet Required</h2>
          <p className="text-gray-400 mb-8">
            You need to connect your wallet to submit a project. This helps verify ownership and prevents spam.
          </p>
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl text-left">
            <p className="text-sm text-gray-300 mb-2">✓ Connect your wallet</p>
            <p className="text-sm text-gray-300">✓ Fill in project details</p>
            <p className="text-sm text-gray-300">✓ Get reviewed in 24-48 hours</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
           <h1 className="text-4xl font-bold text-white mb-4">Submit your Project</h1>
           <p className="text-gray-400">Join 500+ builders showcasing on Discover. Get verified in less than 24 hours.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-900 rounded-full -z-10" />
            <div className={`w-full h-1 bg-lime-primary absolute left-0 top-1/2 -translate-y-1/2 -z-10 transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} />
            
            {[1, 2, 3].map((i) => (
                <div key={i} className={`flex flex-col items-center gap-2 bg-neutral-950 px-2`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-colors ${step >= i ? 'bg-lime-primary border-lime-primary text-neutral-950 font-bold' : 'bg-neutral-900 border-neutral-800 text-gray-500'}`}>
                        {step > i ? <Check className="w-6 h-6" /> : i}
                    </div>
                    <span className={`text-xs font-medium ${step >= i ? 'text-white' : 'text-gray-600'}`}>
                        {i === 1 ? 'Basics' : i === 2 ? 'Deep Dive' : 'Review'}
                    </span>
                </div>
            ))}
        </div>

        {/* Form Container */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-8 md:p-12 shadow-2xl"
        >
            {step === 1 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Project Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Nebula Fi" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none focus:ring-1 focus:ring-lime-primary transition-all placeholder:text-neutral-700" 
                            />
                        </div>
                        <CustomSelect 
                            label="Category" 
                            options={categories} 
                            value={formData.category} 
                            onChange={(val) => setFormData({...formData, category: val})} 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Tagline</label>
                            <input 
                                type="text" 
                                placeholder="e.g. The fastest yield aggregator" 
                                value={formData.tagline}
                                onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none focus:ring-1 focus:ring-lime-primary transition-all placeholder:text-neutral-700" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Calendar className="w-4 h-4"/> Launch Date</label>
                            <input 
                                type="date" 
                                value={formData.launchDate}
                                onChange={(e) => setFormData({...formData, launchDate: e.target.value})}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none focus:ring-1 focus:ring-lime-primary transition-all placeholder:text-neutral-700 [color-scheme:dark]" 
                            />
                        </div>
                    </div>

                    <MultiSelect 
                        label="Supported Networks" 
                        options={chains} 
                        values={formData.chains} 
                        onChange={(vals) => setFormData({...formData, chains: vals})} 
                    />

                    {/* Custom Chain Input - Shows when "Other" is selected */}
                    {formData.chains.includes('Other') && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Custom Blockchain Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Cosmos, Aptos, Near" 
                                value={customChain}
                                onChange={(e) => setCustomChain(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none focus:ring-1 focus:ring-lime-primary transition-all placeholder:text-neutral-700" 
                            />
                            <p className="text-xs text-gray-500">Enter the name of the blockchain network</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ImageUpload
                          label="Project Logo *"
                          onUpload={setLogoFile}
                          maxSizeMB={1}
                        />
                        <ImageUpload
                          label="Cover Image *"
                          onUpload={setCoverFile}
                          maxSizeMB={1}
                        />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-8">
                    {/* Description & Tags */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Project Details</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Full Description</label>
                            <textarea 
                                rows={5} 
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Describe your project, features, and roadmap..." 
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none focus:ring-1 focus:ring-lime-primary transition-all resize-none placeholder:text-neutral-700" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Tag className="w-4 h-4"/> Tags</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Yield, AMM, Lending (Comma separated)" 
                                value={formData.tags}
                                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none transition-colors" 
                            />
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="space-y-4 pt-4 border-t border-neutral-800">
                        <h3 className="text-lg font-bold text-white">Links & Resources</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Globe className="w-3 h-3" /> Website</label>
                                <input type="text" placeholder="https://" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-lime-primary focus:outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Twitter className="w-3 h-3" /> Twitter</label>
                                <input type="text" placeholder="@handle" value={formData.twitter} onChange={(e) => setFormData({...formData, twitter: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-lime-primary focus:outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Disc className="w-3 h-3" /> GitHub</label>
                                <input type="text" placeholder="github.com/..." value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-lime-primary focus:outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Shield className="w-3 h-3" /> Audit Report</label>
                                <input type="text" placeholder="https://" value={formData.auditUrl} onChange={(e) => setFormData({...formData, auditUrl: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-lime-primary focus:outline-none transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="space-y-4 pt-4 border-t border-neutral-800">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">Team Members</h3>
                            <button onClick={addTeamMember} className="text-xs flex items-center gap-1 text-lime-primary hover:underline">
                                <Plus className="w-3 h-3" /> Add Member
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.team.map((member, idx) => (
                                <div key={idx} className="flex gap-3 items-start">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <input 
                                            type="text" 
                                            placeholder="Name" 
                                            value={member.name} 
                                            onChange={(e) => updateTeamMember(idx, 'name', e.target.value)}
                                            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-lime-primary focus:outline-none"
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Role" 
                                            value={member.role} 
                                            onChange={(e) => updateTeamMember(idx, 'role', e.target.value)}
                                            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-lime-primary focus:outline-none"
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Avatar URL" 
                                            value={member.avatar} 
                                            onChange={(e) => updateTeamMember(idx, 'avatar', e.target.value)}
                                            className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:border-lime-primary focus:outline-none"
                                        />
                                    </div>
                                    {formData.team.length > 1 && (
                                        <button onClick={() => removeTeamMember(idx)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Screenshot Upload Section */}
                    <div className="space-y-2 pt-4 border-t border-neutral-800">
                        <label className="text-sm font-medium text-gray-300">Gallery Screenshots (Max 5)</label>
                        <p className="text-xs text-gray-500 mb-4">Add screenshots to showcase your project</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {screenshotFiles.map((file, idx) => (
                                <div key={idx} className="aspect-square rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center relative group">
                                    <div className="w-full h-full rounded-xl overflow-hidden">
                                        <img 
                                          src={URL.createObjectURL(file)} 
                                          alt={`Screenshot ${idx + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setScreenshotFiles(screenshotFiles.filter((_, i) => i !== idx))}
                                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-red-500 transition-colors"
                                    >
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                </div>
                            ))}
                            {screenshotFiles.length < 5 && (
                              <ImageUpload
                                label=""
                                onUpload={(file) => setScreenshotFiles([...screenshotFiles, file])}
                                maxSizeMB={1}
                              />
                            )}
                        </div>
                    </div>

                    {/* Project Statistics */}
                    <div className="pt-4 border-t border-neutral-800">
                        <h3 className="text-lg font-bold text-white mb-4">Project Statistics (Optional)</h3>
                        <p className="text-xs text-gray-500 mb-4">Provide current metrics to showcase your project's traction</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" /> Total Value Locked (TVL)
                                </label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. $4.2B or 1.5M" 
                                  value={formData.tvl}
                                  onChange={(e) => setFormData({...formData, tvl: e.target.value})}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none transition-colors placeholder:text-neutral-700" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <UsersIcon className="w-4 h-4" /> Total Users
                                </label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. 3.5M+ or 125K" 
                                  value={formData.users}
                                  onChange={(e) => setFormData({...formData, users: e.target.value})}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none transition-colors placeholder:text-neutral-700" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" /> Total Transactions
                                </label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. 10M+ or 500K" 
                                  value={formData.transactions}
                                  onChange={(e) => setFormData({...formData, transactions: e.target.value})}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none transition-colors placeholder:text-neutral-700" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tokenomics */}
                    <div className="pt-4 border-t border-neutral-800">
                        <h3 className="text-lg font-bold text-white mb-4">Tokenomics (Optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Coins className="w-4 h-4" /> Token Ticker</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. BTC" 
                                  value={formData.tokenTicker}
                                  onChange={(e) => setFormData({...formData, tokenTicker: e.target.value})}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none transition-colors" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Link2 className="w-4 h-4" /> Contract Address</label>
                                <input 
                                  type="text" 
                                  placeholder="0x..." 
                                  value={formData.contractAddress}
                                  onChange={(e) => setFormData({...formData, contractAddress: e.target.value})}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none transition-colors" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                 <div className="text-center py-10">
                    <div className="w-20 h-20 bg-lime-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-lime-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Ready to Submit?</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Your project "{formData.name || 'Project Name'}" will be submitted for verification. This usually takes 24-48 hours. You can track status in your dashboard.
                    </p>
                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 max-w-sm mx-auto mb-8 text-left">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center font-bold text-gray-500">
                                {formData.name ? formData.name.charAt(0) : '?'}
                            </div>
                            <div>
                                <h4 className="font-bold text-white">{formData.name || 'Project Name'}</h4>
                                <p className="text-xs text-gray-500">{formData.category || 'Category'} • {formData.chains.length > 0 ? formData.chains.join(', ') : 'Chains'}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <span className="text-[10px] bg-neutral-800 text-gray-300 px-2 py-1 rounded">Pending</span>
                            <span className="text-[10px] bg-neutral-800 text-gray-300 px-2 py-1 rounded">V2</span>
                        </div>
                    </div>
                 </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-neutral-800">
                {step > 1 ? (
                    <button 
                        onClick={() => setStep(step - 1)}
                        className="px-6 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-medium hover:bg-neutral-900 transition-colors"
                    >
                        Back
                    </button>
                ) : <div />}
                
                <button 
                    onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl bg-lime-primary text-neutral-950 font-bold hover:bg-lime-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : step === 3 ? (
                      'Confirm Submission'
                    ) : (
                      <>
                        Next Step
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                </button>
            </div>
        </motion.div>

      </div>
    </div>
  );
};

export default SubmitProject;
