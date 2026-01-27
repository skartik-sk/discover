import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Globe, Twitter, Disc, ChevronDown, Coins, Link2, Image as ImageIcon, Calendar, Tag, Shield, Plus, Trash2, BarChart3, Users as UsersIcon, TrendingUp, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../src/hooks/useAuth';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { ImageUpload } from '../src/components/ImageUpload';
import { TeamMemberEditor, TeamMember } from '../src/components/TeamMemberEditor';
import { ScreenshotManager, ScreenshotItem } from '../src/components/ScreenshotManager';
import { useToast } from '../src/components/Toast';
import type { Id } from '../convex/_generated/dataModel';

interface Props {
  projectId: Id<"projects">;
  onBack: () => void;
}

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

const EditProject: React.FC<Props> = ({ projectId, onBack }) => {
  const { address, isConnected } = useAuth();
  const { success, error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Queries
  const project = useQuery(api.projects.get, { id: projectId });
  
  // Mutations
  const updateProject = useMutation(api.projects.update);
  const updateTeam = useMutation(api.projects.updateTeam);
  const updateScreenshots = useMutation(api.projects.updateScreenshots);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  
  const [formData, setFormData] = useState({
      name: '',
      tagline: '',
      category: '',
      chain: '',
      launchDate: '',
      description: '',
      tags: '',
      website: '',
      twitter: '',
      discord: '',
      github: '',
      auditUrl: '',
      tokenSymbol: '',
      tokenAddress: '',
      tvl: '',
      users: '',
      transactions: '',
  });

  // Image state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [currentCover, setCurrentCover] = useState<string | null>(null);

  // Team state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Screenshot state
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>([]);

  // Load project data when available
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        tagline: project.tagline,
        category: project.category,
        chain: project.chain,
        launchDate: project.launchDate,
        description: project.description,
        tags: project.tags.join(', '),
        website: project.website || '',
        twitter: project.twitter || '',
        discord: project.discord || '',
        github: project.github || '',
        auditUrl: project.auditUrl || '',
        tokenSymbol: project.tokenSymbol || '',
        tokenAddress: project.tokenAddress || '',
        tvl: project.tvl || '',
        users: project.users || '',
        transactions: project.transactions || '',
      });
      
      // Load images
      setCurrentLogo(project.logo);
      setCurrentCover(project.coverImage);
      
      // Load team members
      if (project.team) {
        setTeamMembers(project.team.map((member: any) => ({
          name: member.name,
          role: member.role,
          avatarUrl: member.avatar || member.avatarUrl,
        })));
      }
      
      // Load screenshots
      if (project.screenshotDetails && project.screenshotDetails.length > 0) {
        setScreenshots(project.screenshotDetails.map((detail: any, index: number) => ({
          id: `screenshot-${index}`,
          url: detail.url,
          preview: detail.url,
          storageId: detail.storageId, // Preserve storage ID
        })));
      } else if (project.screenshots && project.screenshots.length > 0) {
        // Fallback for old data without screenshotDetails
        setScreenshots(project.screenshots.map((url: string, index: number) => ({
          id: `screenshot-${index}`,
          url,
          preview: url,
        })));
      }
    }
  }, [project]);

  const categories = ['DeFi', 'NFT', 'Gaming', 'Infrastructure', 'DAO', 'Social', 'AI'];

  // Upload file to Convex storage
  const uploadFile = async (file: File): Promise<string> => {
    const uploadUrl = await generateUploadUrl();
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    
    const { storageId } = await response.json();
    return storageId;
  };

  const handleSubmit = async () => {
    if (!isConnected || !address) {
      showError('Please connect your wallet');
      return;
    }

    if (!project || project.ownerWallet !== address) {
      showError('You are not the owner of this project');
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse tags
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

      // Upload new logo if changed
      let logoStorageId = project.logoStorageId;
      if (logoFile) {
        logoStorageId = await uploadFile(logoFile) as any;
      }

      // Upload new cover if changed
      let coverImageStorageId = project.coverImageStorageId;
      if (coverFile) {
        coverImageStorageId = await uploadFile(coverFile) as any;
      }

      // Update project
      await updateProject({
        id: projectId,
        ownerWallet: address,
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        category: formData.category,
        tags,
        chain: formData.chain,
        launchDate: formData.launchDate,
        logoStorageId: logoStorageId as any,
        coverImageStorageId: coverImageStorageId as any,
        website: formData.website || undefined,
        twitter: formData.twitter || undefined,
        discord: formData.discord || undefined,
        github: formData.github || undefined,
        auditUrl: formData.auditUrl || undefined,
        tokenSymbol: formData.tokenSymbol || undefined,
        tokenAddress: formData.tokenAddress || undefined,
        tvl: formData.tvl || undefined,
        users: formData.users || undefined,
        transactions: formData.transactions || undefined,
      });

      // Update team members
      await updateTeam({
        projectId,
        ownerWallet: address,
        team: teamMembers,
      });

      // Upload and update screenshots
      const screenshotStorageIds: string[] = [];
      for (const screenshot of screenshots) {
        if (screenshot.file) {
          // New file - upload it
          const storageId = await uploadFile(screenshot.file);
          screenshotStorageIds.push(storageId);
        } else if (screenshot.storageId) {
          // Existing screenshot - preserve its storage ID
          screenshotStorageIds.push(screenshot.storageId);
        }
      }
      
      // Update screenshots if there are any changes
      if (screenshotStorageIds.length > 0) {
        await updateScreenshots({
          projectId,
          ownerWallet: address,
          screenshotStorageIds,
        });
      }

      success('Project updated successfully!');
      onBack();
    } catch (error: any) {
      console.error('Error updating project:', error);
      showError(`Failed to update project: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (project === undefined) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  // Not found or unauthorized
  if (!project || project.ownerWallet !== address) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-24 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-2">Unauthorized</h2>
          <p className="text-gray-400 mb-6">You don't have permission to edit this project.</p>
          <button onClick={onBack} className="px-6 py-3 rounded-xl bg-lime-primary text-neutral-950 font-bold hover:bg-lime-400 transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-3xl font-bold text-white">Edit Project</h1>
        </div>

        {/* Form Container */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-8 md:p-12 shadow-2xl"
        >
            <div className="space-y-6">
                {/* Basic Information */}
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
                        <label className="text-sm font-medium text-gray-300">Blockchain</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Ethereum, Solana" 
                            value={formData.chain}
                            onChange={(e) => setFormData({...formData, chain: e.target.value})}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none focus:ring-1 focus:ring-lime-primary transition-all placeholder:text-neutral-700" 
                        />
                    </div>
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

                {/* Images Section */}
                <div className="space-y-6 pt-6 border-t border-neutral-800">
                    <h2 className="text-2xl font-bold text-white">Project Images</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ImageUpload
                            label="Project Logo"
                            currentImage={currentLogo || undefined}
                            onUpload={(file) => setLogoFile(file)}
                            onRemove={() => {
                                setLogoFile(null);
                                setCurrentLogo(null);
                            }}
                            maxSizeMB={2}
                        />
                        <ImageUpload
                            label="Cover Image"
                            currentImage={currentCover || undefined}
                            onUpload={(file) => setCoverFile(file)}
                            onRemove={() => {
                                setCoverFile(null);
                                setCurrentCover(null);
                            }}
                            maxSizeMB={3}
                        />
                    </div>
                </div>

                {/* Description & Tags */}
                <div className="space-y-6 pt-6 border-t border-neutral-800">
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
                            <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Github className="w-3 h-3" /> GitHub</label>
                            <input type="text" placeholder="github.com/..." value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-lime-primary focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Disc className="w-3 h-3" /> Discord</label>
                            <input type="text" placeholder="discord.gg/..." value={formData.discord} onChange={(e) => setFormData({...formData, discord: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-lime-primary focus:outline-none transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="pt-4 border-t border-neutral-800">
                    <h3 className="text-lg font-bold text-white mb-4">Project Statistics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" /> TVL
                            </label>
                            <input 
                              type="text" 
                              placeholder="e.g. $4.2B" 
                              value={formData.tvl}
                              onChange={(e) => setFormData({...formData, tvl: e.target.value})}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none transition-colors placeholder:text-neutral-700" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <UsersIcon className="w-4 h-4" /> Users
                            </label>
                            <input 
                              type="text" 
                              placeholder="e.g. 3.5M+" 
                              value={formData.users}
                              onChange={(e) => setFormData({...formData, users: e.target.value})}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none transition-colors placeholder:text-neutral-700" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" /> Transactions
                            </label>
                            <input 
                              type="text" 
                              placeholder="e.g. 10M+" 
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
                              placeholder="e.g. UNI" 
                              value={formData.tokenSymbol}
                              onChange={(e) => setFormData({...formData, tokenSymbol: e.target.value})}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none transition-colors" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><Link2 className="w-4 h-4" /> Contract Address</label>
                            <input 
                              type="text" 
                              placeholder="0x..." 
                              value={formData.tokenAddress}
                              onChange={(e) => setFormData({...formData, tokenAddress: e.target.value})}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-lime-primary focus:outline-none transition-colors" 
                            />
                        </div>
                    </div>
                </div>

                {/* Team Members */}
                <div className="pt-6 border-t border-neutral-800">
                    <TeamMemberEditor
                        initialTeam={teamMembers}
                        onChange={setTeamMembers}
                    />
                </div>

                {/* Screenshots */}
                <div className="pt-6 border-t border-neutral-800">
                    <ScreenshotManager
                        initialScreenshots={screenshots}
                        onChange={setScreenshots}
                        maxScreenshots={5}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 mt-12 pt-8 border-t border-neutral-800">
                <button 
                    onClick={onBack}
                    className="px-6 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-medium hover:bg-neutral-900 transition-colors"
                >
                    Cancel
                </button>
                
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl bg-lime-primary text-neutral-950 font-bold hover:bg-lime-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                </button>
            </div>
        </motion.div>

      </div>
    </div>
  );
};

export default EditProject;
