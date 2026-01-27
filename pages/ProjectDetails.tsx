import React, { useState } from 'react';
import { Project } from '../types';
import ProjectCard from '../components/ProjectCard';
import WriteReviewModal from '../components/WriteReviewModal';
import { SEO } from '../src/components/SEO';
import { 
    ArrowLeft, Globe, Twitter, MessageSquare, ShieldCheck, Share2, 
    BarChart3, Users, Clock, ExternalLink, Image as ImageIcon, 
    Copy, TrendingUp, TrendingDown, Star, ChevronUp, Github 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useAuth } from '../src/hooks/useAuth';
import { useToast } from '../src/components/Toast';
import { useNavigate } from 'react-router-dom';
import type { Id } from '../convex/_generated/dataModel';

interface Props {
  projectId: Id<"projects">;
  onBack: () => void;
  onProjectSelect?: (project: Project) => void;
}

const mockChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 700 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1200 },
];

const ProjectDetails: React.FC<Props> = ({ projectId, onBack, onProjectSelect }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1M');
  const { address, isConnected } = useAuth();
  const { success, error: showError, warning } = useToast();
  const navigate = useNavigate();
  
  // Queries
  const project = useQuery(api.projects.get, { id: projectId });
  const allProjects = useQuery(api.projects.list, {});
  const reviews = useQuery(api.reviews.getForProject, { projectId });
  const hasUpvoted = useQuery(
    api.projects.hasUpvoted, 
    address && projectId ? { projectId, userWallet: address } : "skip"
  );
  
  // Check if user is owner
  const isOwner = address && project?.ownerWallet.toLowerCase() === address.toLowerCase();
  
  // Mutations
  const toggleUpvote = useMutation(api.projects.toggleUpvote);

  const handleUpvote = async () => {
    if (!isConnected || !address) {
      warning('Please connect your wallet to upvote');
      return;
    }
    
    try {
      await toggleUpvote({ projectId, userWallet: address });
      success(hasUpvoted ? 'Upvote removed' : 'Project upvoted!');
    } catch (error) {
      console.error('Error toggling upvote:', error);
      showError('Failed to upvote. Please try again.');
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/project/${projectId}`;
    
    if (navigator.share) {
      navigator.share({ 
        title: project?.name || 'Check out this project',
        text: project?.tagline || '',
        url 
      }).catch(() => {
        // User cancelled or error, fallback to clipboard
        navigator.clipboard.writeText(url);
        success('Link copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(url);
      success('Link copied to clipboard!');
    }
  };

  const copyContractAddress = () => {
    if (project?.tokenAddress) {
      navigator.clipboard.writeText(project.tokenAddress);
      success('Contract address copied!');
    }
  };

  // Loading state
  if (project === undefined || allProjects === undefined) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!project) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-gray-400 mb-6">The project you're looking for doesn't exist.</p>
          <button onClick={onBack} className="px-6 py-3 rounded-xl bg-lime-primary text-neutral-950 font-bold hover:bg-lime-400 transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Simple logic to find similar projects
  const similarProjects = allProjects
    .filter(p => p.category === project.category && p._id !== project._id)
    .slice(0, 3);

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-neutral-950 pt-24 pb-20"
    >
      <SEO 
        title={`${project.name} - ${project.tagline} | Discover`}
        description={project.description}
        image={project.coverImage || project.logo}
        url={`${window.location.origin}/project/${projectId}`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors text-sm font-medium w-fit"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex gap-3">
                 <button 
                     onClick={handleShare}
                     className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-white transition-colors"
                 >
                     <Share2 className="w-4 h-4" />
                 </button>
                 
                 {/* Analytics Button (Owner Only) */}
                 {isOwner && (
                   <button
                     onClick={() => navigate(`/project/${projectId}/analytics`)}
                     className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-gray-400 hover:text-lime-primary hover:border-lime-primary/50 transition-colors font-medium text-sm"
                   >
                     <BarChart3 className="w-4 h-4" />
                     Analytics
                   </button>
                 )}
                 
                 {project.website ? (
                   <a 
                     href={project.website}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="px-5 py-2.5 rounded-xl bg-lime-primary text-neutral-950 font-bold text-sm hover:bg-lime-400 transition-colors flex items-center gap-2"
                   >
                     Visit Website <ExternalLink className="w-4 h-4" />
                   </a>
                 ) : (
                   <button 
                     disabled
                     className="px-5 py-2.5 rounded-xl bg-neutral-800 text-gray-500 font-bold text-sm cursor-not-allowed flex items-center gap-2"
                   >
                     No Website <ExternalLink className="w-4 h-4" />
                   </button>
                 )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Header Card */}
                <div className="bg-neutral-900 rounded-[2rem] p-8 border border-neutral-800 relative overflow-hidden group">
                     {/* Background decorative blob */}
                     <div className="absolute top-0 right-0 w-64 h-64 bg-lime-primary/5 rounded-full blur-[80px] -z-0" />
                     
                     <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                        <img src={project.logo} className="w-24 h-24 rounded-2xl border-2 border-neutral-800 shadow-lg object-cover" />
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                                {project.verified && (
                                    <div className="bg-lime-primary/10 text-lime-primary px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border border-lime-primary/20">
                                        <ShieldCheck className="w-3 h-3" /> VERIFIED
                                    </div>
                                )}
                                <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold bg-yellow-400/10 px-2 py-1 rounded-lg border border-yellow-400/20">
                                    <Star className="w-3 h-3 fill-yellow-400" />
                                    {project.averageRating?.toFixed(1) || '0.0'}
                                </div>
                            </div>
                            <p className="text-lg text-gray-400 mb-4">{project.tagline}</p>
                            
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 rounded-lg bg-neutral-800 text-gray-300 text-xs font-medium border border-neutral-700">
                                    {project.chain}
                                </span>
                                {project.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-lg bg-neutral-950 text-gray-400 text-xs font-medium border border-neutral-800">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                     </div>
                </div>

                {/* Gallery Section - Always show, with placeholder if empty */}
                <div className="bg-neutral-900 rounded-[2rem] p-6 border border-neutral-800">
                    <div className="flex items-center gap-2 mb-4">
                        <ImageIcon className="w-5 h-5 text-lime-primary" />
                        <h3 className="text-lg font-bold text-white">Gallery</h3>
                    </div>
                    {project.screenshots && project.screenshots.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="md:col-span-2 h-64 rounded-xl overflow-hidden relative group bg-neutral-950 border border-neutral-800">
                                 <img 
                                   src={project.screenshots[0]} 
                                   alt="Project screenshot 1"
                                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                   onError={(e) => {
                                     e.currentTarget.src = project.coverImage || project.logo;
                                   }}
                                 />
                             </div>
                             {project.screenshots.slice(1, 5).map((shot, idx) => (
                                 <div key={idx} className="h-40 rounded-xl overflow-hidden relative group bg-neutral-950 border border-neutral-800">
                                     <img 
                                       src={shot} 
                                       alt={`Project screenshot ${idx + 2}`}
                                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                       onError={(e) => {
                                         e.currentTarget.src = project.coverImage || project.logo;
                                       }}
                                     />
                                 </div>
                             ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2 h-64 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                                <div className="text-center">
                                    <ImageIcon className="w-12 h-12 text-neutral-700 mx-auto mb-2" />
                                    <p className="text-gray-500 text-sm">No screenshots available</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* About & Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-900 p-6 rounded-[2rem] border border-neutral-800 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">About Project</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {project.description}
                            </p>
                        </div>
                        <div className="flex gap-3 mt-6">
                            {project.twitter && (
                              <a href={project.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-neutral-950 text-gray-400 hover:text-white transition-colors border border-neutral-800"><Twitter className="w-4 h-4"/></a>
                            )}
                            {project.website && (
                              <a href={project.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-neutral-950 text-gray-400 hover:text-white transition-colors border border-neutral-800"><Globe className="w-4 h-4"/></a>
                            )}
                            {project.discord && (
                              <a href={project.discord} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-neutral-950 text-gray-400 hover:text-white transition-colors border border-neutral-800"><MessageSquare className="w-4 h-4"/></a>
                            )}
                            {project.github && (
                              <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-neutral-950 text-gray-400 hover:text-white transition-colors border border-neutral-800"><Github className="w-4 h-4"/></a>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-[#B9FF66] p-6 rounded-[2rem] text-neutral-950 flex flex-col justify-between h-[180px]">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-black/10 rounded-xl">
                                    <BarChart3 className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-60">TVL</span>
                            </div>
                            <div className="mt-auto">
                                <h4 className="text-4xl font-bold tracking-tight break-words">{project.tvl || '$0'}</h4>
                                <p className="text-sm font-medium opacity-70 mt-1">+12.5% this week</p>
                            </div>
                        </div>
                         <div className="bg-neutral-800 p-6 rounded-[2rem] text-white flex flex-col justify-between h-[140px]">
                             <div className="flex justify-between items-start">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <Users className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Users</span>
                            </div>
                             <div>
                                <h4 className="text-3xl font-bold tracking-tight">{project.users}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-neutral-900 p-6 rounded-[2rem] border border-neutral-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">Activity Growth</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                                {['1D', '1W', '1M', '1Y'].map(range => (
                                    <button 
                                        key={range} 
                                        onClick={() => setSelectedTimeRange(range)}
                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                                            selectedTimeRange === range 
                                                ? 'bg-lime-primary text-black' 
                                                : 'bg-neutral-950 text-gray-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
                                        }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                            {/* Link to source */}
                            {project.tokenAddress && (
                                <a 
                                    href={`https://dexscreener.com/search?q=${project.tokenAddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-lime-primary hover:underline flex items-center gap-1"
                                >
                                    <ExternalLink className="w-3 h-3" /> View on DexScreener
                                </a>
                            )}
                        </div>
                    </div>
                     <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockChartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#CCFF00" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#CCFF00" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="name" stroke="#555" tickLine={false} axisLine={false} fontSize={12} />
                                <YAxis stroke="#555" tickLine={false} axisLine={false} fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '12px', padding: '12px' }}
                                    itemStyle={{ color: '#CCFF00' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#CCFF00" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Reviews Section - Scrollable to prevent overflow */}
                <div className="bg-neutral-900 p-8 rounded-[2rem] border border-neutral-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">Community Reviews ({project.reviewCount})</h3>
                        <button onClick={() => setIsReviewModalOpen(true)} className="text-sm text-lime-primary hover:underline font-medium">
                          + Write a Review
                        </button>
                    </div>
                    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                        {reviews === undefined ? (
                            <div className="text-center py-8">
                                <div className="w-8 h-8 border-2 border-lime-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <p className="text-gray-500 text-sm">Loading reviews...</p>
                            </div>
                        ) : reviews && reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.id} className="p-5 bg-neutral-950 rounded-xl border border-neutral-800">
                                    <div className="flex items-start gap-4">
                                        <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <p className="font-medium text-white">{review.user}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(review.date).toLocaleDateString('en-US', { 
                                                            year: 'numeric', 
                                                            month: 'long', 
                                                            day: 'numeric' 
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            className={`w-4 h-4 ${
                                                                i < review.rating 
                                                                ? 'fill-yellow-400 text-yellow-400' 
                                                                : 'text-neutral-700'
                                                            }`} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400 leading-relaxed">{review.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <Star className="w-12 h-12 text-neutral-800 mx-auto mb-3" />
                                <p className="text-gray-500 mb-2">No reviews yet</p>
                                <p className="text-sm text-gray-600">Be the first to review this project!</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Right Sidebar Column - Sticky */}
            <div className="space-y-6 lg:sticky lg:top-24 h-fit">

                {/* UPVOTE CARD */}
                <div className="bg-neutral-900 p-6 rounded-[2rem] border border-neutral-800 text-center">
                    <h3 className="text-sm text-gray-400 mb-4 font-bold uppercase tracking-wider">Support Project</h3>
                    <button 
                        onClick={handleUpvote}
                        className={`w-full py-4 rounded-xl border font-bold transition-all flex items-center justify-center gap-2 text-lg ${
                            hasUpvoted 
                            ? 'bg-lime-primary text-neutral-950 border-lime-primary shadow-lg shadow-lime-primary/20' 
                            : 'bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700'
                        }`}
                    >
                        <ChevronUp className={`w-6 h-6 ${hasUpvoted ? 'stroke-2' : ''}`} />
                        {hasUpvoted ? 'Upvoted' : 'Upvote'} 
                        <span className={`ml-1 ${hasUpvoted ? 'text-neutral-800' : 'text-gray-400'}`}>({project.upvoteCount})</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-3">
                        Help this project trend by upvoting.
                    </p>
                </div>
                
                {/* Token Stats Card */}
                {project.tokenSymbol && (
                    <div className="bg-neutral-900 p-6 rounded-[2rem] border border-neutral-800">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white">Token Stats</h3>
                            <span className="text-xs font-mono text-gray-500 bg-neutral-950 px-2 py-1 rounded-lg border border-neutral-800">
                                ${project.tokenSymbol}
                            </span>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-end gap-3 mb-1">
                                <span className="text-3xl font-bold text-white">{project.tokenPrice || '$0.00'}</span>
                                <span className={`flex items-center text-sm font-medium mb-1.5 ${(project.tokenChange24h || 0) >= 0 ? 'text-lime-primary' : 'text-red-500'}`}>
                                    {(project.tokenChange24h || 0) >= 0 ? <TrendingUp className="w-4 h-4 mr-1"/> : <TrendingDown className="w-4 h-4 mr-1"/>}
                                    {Math.abs(project.tokenChange24h || 0)}%
                                </span>
                            </div>
                            <span className="text-xs text-gray-500">24h Price Change</span>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Market Cap</span>
                                <span className="text-white font-mono">{project.tokenMarketCap || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Contract</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-mono text-xs">{project.tokenAddress?.slice(0,6)}...{project.tokenAddress?.slice(-4)}</span>
                                    <Copy 
                                      onClick={copyContractAddress}
                                      className="w-3 h-3 text-gray-500 cursor-pointer hover:text-white" 
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <button className="w-full py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-bold hover:bg-neutral-900 transition-colors">
                            Trade {project.tokenSymbol}
                        </button>
                    </div>
                )}

                {/* Team Card */}
                <div className="bg-neutral-900 p-6 rounded-[2rem] border border-neutral-800">
                    <h3 className="text-lg font-bold text-white mb-6">Core Team</h3>
                    <div className="space-y-4">
                        {project.team && project.team.length > 0 ? (
                            project.team.map((member, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                                    <img 
                                        src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} 
                                        alt={member.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-white">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.role}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 border-dashed text-center">
                                <p className="text-sm text-gray-500">No team members added yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info List */}
                 <div className="bg-neutral-900 p-6 rounded-[2rem] border border-neutral-800">
                    <h3 className="text-lg font-bold text-white mb-4">Details</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Launch Date</span>
                            <span className="text-white font-medium">{project.launchDate}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Audit Status</span>
                            <span className="text-lime-primary font-medium flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3"/> Passed
                            </span>
                        </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Token</span>
                            <span className="text-white font-medium">{project.tokenSymbol || 'N/A'}</span>
                        </div>
                    </div>
                 </div>
            </div>

        </div>

        {/* Similar Projects Section */}
        {similarProjects.length > 0 && (
            <div className="mt-16 border-t border-neutral-800 pt-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">Similar Projects</h2>
                    <button className="text-lime-primary text-sm font-bold hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {similarProjects.map(p => (
                        <ProjectCard 
                          key={p._id} 
                          project={p} 
                          onClick={() => onProjectSelect?.(p as Project)} 
                        />
                    ))}
                </div>
            </div>
        )}
      </div>
      
      <WriteReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        projectId={projectId}
        projectName={project.name}
      />
    </motion.div>
  );
};

export default ProjectDetails;
