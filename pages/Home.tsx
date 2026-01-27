import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import TopLaunches from '../components/TopLaunches';
import WeeklyDigest from '../components/WeeklyDigest';
import { Project, ViewState } from '../types';
import { ArrowRight, LayoutGrid, Search, Wallet, BarChart3, Globe2, Sparkles, BookOpen, Quote, Clock, ArrowUpRight, Play, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

interface Props {
  onProjectSelect: (p: Project) => void;
  onPostSelect: (postId: string) => void;
  onNavigate: (view: ViewState) => void;
}

const TESTIMONIALS = [
    {
        name: "CryptoKing",
        role: "Pro Trader",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        content: "I wasted months searching on Twitter until I found this platform. Within days, I found my perfect gem, connected with the team, and got early access.",
        rating: 5
    },
    {
        name: "Web3Witch",
        role: "Researcher",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        content: "The verification process here gives me so much peace of mind. No more rugs, just quality projects with audited contracts.",
        rating: 5
    },
    {
        name: "SatoshiFan",
        role: "Investor",
        avatar: "https://randomuser.me/api/portraits/men/12.jpg",
        content: "An absolute game changer for finding alpha before it hits the mainstream. The analytics dashboard is top notch.",
        rating: 4
    }
];

const Home: React.FC<Props> = ({ onProjectSelect, onPostSelect, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Query projects from Convex
  const allProjects = useQuery(api.projects.list, {});
  const forumPosts = useQuery(api.forum.listPosts, {});
  
  // Rotate testimonials
  useEffect(() => {
      const interval = setInterval(() => {
          setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
      }, 5000);
      return () => clearInterval(interval);
  }, []);

  // Loading state
  if (allProjects === undefined || forumPosts === undefined) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  // Filtering logic for the main grid
  const featuredProjects = activeTab === 'All' 
    ? allProjects.slice(0, 6) 
    : allProjects.filter(p => p.category === activeTab).slice(0, 6);

  // Get forum posts that act as blogs (have cover images)
  const trendingInsights = forumPosts.filter(p => p.coverImage).slice(0, 3);

  const categories = ['All', 'DeFi', 'NFT', 'Gaming', 'Infrastructure'];

  return (
    <div className="min-h-screen bg-neutral-950">
      <Hero onCtaClick={() => onNavigate('search')} onVideoClick={() => setIsVideoOpen(true)} />
      
      {/* Category Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800 overflow-x-auto max-w-full">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                            activeTab === cat 
                            ? 'bg-lime-primary text-neutral-950 shadow-lg shadow-lime-primary/20' 
                            : 'text-gray-400 hover:text-white hover:bg-neutral-800'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            
            <button 
                onClick={() => onNavigate('search')}
                className="hidden sm:flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
                View All Projects <ArrowRight className="w-4 h-4" />
            </button>
        </div>
      </section>

      {/* Main Content Area - Projects & Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Grid (Projects) */}
            <div className="lg:col-span-2">
                <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                    {featuredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} onClick={() => onProjectSelect(project)} />
                    ))}
                </motion.div>
            </div>

            {/* Right Sidebar (Top Launches & Digest) - Sticky */}
            <div className="space-y-8 lg:sticky lg:top-24 h-fit">
                <TopLaunches onSelect={onProjectSelect} />
                <div className="h-auto">
                    <WeeklyDigest />
                </div>
            </div>
        </div>
      </section>

      {/* NEW SECTION: How it Works & Community Voices (Full Width Split) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* User Guide Card */}
             <div 
                onClick={() => setIsVideoOpen(true)}
                className="bg-neutral-900 rounded-[2rem] p-8 md:p-10 border border-neutral-800 relative overflow-hidden flex flex-col justify-between cursor-pointer group hover:border-lime-primary/30 transition-all min-h-[400px]"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-lime-primary/5 rounded-full blur-[80px] -z-0 translate-x-10 -translate-y-10" />
                
                <div className="mb-8 relative z-10 flex justify-between items-start">
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-2 leading-tight">How to Discover Gems</h3>
                        <p className="text-gray-500 font-medium">User guide for first timers.</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center group-hover:bg-lime-primary group-hover:text-black group-hover:border-lime-primary transition-all shadow-lg">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                </div>
                
                <div className="space-y-6 relative z-10 pl-2">
                    {[
                        { title: "Step 1", desc: "Use advanced filters to find projects." },
                        { title: "Step 2", desc: "Check our audit & team verification." },
                        { title: "Step 3", desc: "Review on-chain metrics & growth." },
                        { title: "Step 4", desc: "Engage with the community & team." }
                    ].map((step, idx) => (
                        <div key={idx} className="flex gap-5 items-start">
                             <div className="mt-2 w-2 h-2 rounded-full bg-lime-primary shadow-[0_0_8px_rgba(204,255,0,0.6)] flex-shrink-0" />
                             <div>
                                 <h4 className="text-white font-bold text-base">{step.title}</h4>
                                 <p className="text-gray-400 text-sm">{step.desc}</p>
                             </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Community Voices Card */}
            <div className="bg-neutral-900 rounded-[2rem] p-8 md:p-10 border border-neutral-800 flex flex-col relative overflow-hidden min-h-[400px]">
                 <div className="mb-8 flex items-center gap-3">
                     <Quote className="w-8 h-8 text-lime-primary fill-lime-primary" />
                     <h3 className="text-2xl font-bold text-white">Community Voices</h3>
                 </div>
                 
                 <div className="flex-1 flex flex-col justify-between relative z-10">
                    <div className="relative h-full flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={activeTestimonial}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 relative"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                                        <img src={TESTIMONIALS[activeTestimonial].avatar} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-lg">{TESTIMONIALS[activeTestimonial].name}</p>
                                        <p className="text-sm text-gray-500">{TESTIMONIALS[activeTestimonial].role}</p>
                                    </div>
                                    <div className="ml-auto flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < TESTIMONIALS[activeTestimonial].rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-800 fill-neutral-800'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-300 text-base leading-relaxed italic">
                                    "{TESTIMONIALS[activeTestimonial].content}"
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    
                    <div className="mt-8">
                        {/* Pagination Dots */}
                        <div className="flex justify-center gap-2 mb-6">
                            {TESTIMONIALS.map((_, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setActiveTestimonial(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${activeTestimonial === idx ? 'bg-lime-primary w-8' : 'bg-neutral-700 w-2 hover:bg-neutral-600'}`}
                                />
                            ))}
                        </div>

                        <button onClick={() => onNavigate('blog')} className="w-full py-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-bold hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2 group">
                            Read More Stories 
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                 </div>
            </div>
        </div>
      </section>

      {/* NEW SECTION: Trending Insights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
         <div className="flex items-center justify-between mb-8">
             <div>
                <h2 className="text-3xl font-bold text-white mb-2">Latest Trending Insights</h2>
                <p className="text-gray-400">Expert analysis and strategies to help you navigate the market.</p>
             </div>
             <button onClick={() => onNavigate('blog')} className="hidden md:flex px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-bold text-sm hover:bg-neutral-800 transition-colors items-center gap-2 group">
                 View All Articles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingInsights.map(post => (
                  <div 
                    key={post._id} 
                    onClick={() => onPostSelect(post._id)}
                    className="group bg-neutral-900 rounded-[2rem] border border-neutral-800 overflow-hidden cursor-pointer hover:border-lime-primary/30 transition-all flex flex-col h-full"
                  >
                      {/* Image Section */}
                      <div className="h-56 overflow-hidden relative">
                          {post.coverImage && (
                             <img src={post.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          )}
                          <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-[10px] font-bold text-lime-primary uppercase tracking-wider shadow-lg">
                                 {post.category}
                              </span>
                          </div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="p-6 flex-1 flex flex-col bg-neutral-900">
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 font-medium">
                              <div className="flex items-center gap-1.5">
                                 <Clock className="w-3.5 h-3.5" />
                                 <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              </div>
                              {post.readTime && (
                                 <>
                                     <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                     <span>{post.readTime}</span>
                                 </>
                              )}
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-lime-primary transition-colors leading-snug">
                             {post.title}
                          </h3>
                          
                          <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                             {post.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between border-t border-neutral-800 pt-5 mt-auto">
                              <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden">
                                      <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
                                 </div>
                                 <span className="text-xs font-bold text-white">
                                     {post.authorName}
                                 </span>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center group-hover:bg-lime-primary group-hover:text-black group-hover:border-lime-primary transition-all">
                                  <ArrowUpRight className="w-4 h-4" />
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Large Stat Box */}
              <div className="bg-neutral-900 rounded-[2.5rem] p-10 border border-neutral-800 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-lime-primary/10 blur-[80px] rounded-full -z-0" />
                  
                  <div>
                      <h3 className="text-lg font-medium text-gray-400 mb-2">Total Value Locked</h3>
                      <div className="text-6xl md:text-8xl font-bold text-white tracking-tighter">
                          $10B+
                      </div>
                  </div>
                  
                  <div className="relative z-10">
                      <p className="text-xl text-white max-w-md">
                          Trust is our currency. We track billions in assets across hundreds of verified protocols.
                      </p>
                  </div>
              </div>

              {/* Grid Stats */}
              <div className="grid grid-cols-2 gap-8">
                  <div className="bg-neutral-900 rounded-[2.5rem] p-8 border border-neutral-800 flex flex-col justify-center items-center text-center hover:bg-neutral-800 transition-colors">
                      <div className="w-16 h-16 rounded-2xl bg-lime-primary/10 flex items-center justify-center mb-4">
                          <BarChart3 className="w-8 h-8 text-lime-primary" />
                      </div>
                      <h4 className="text-4xl font-bold text-white mb-1">8x</h4>
                      <p className="text-gray-400 text-sm">More Growth</p>
                  </div>

                  <div className="bg-neutral-900 rounded-[2.5rem] p-8 border border-neutral-800 flex flex-col justify-center items-center text-center hover:bg-neutral-800 transition-colors">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                          <Globe2 className="w-8 h-8 text-blue-500" />
                      </div>
                      <h4 className="text-4xl font-bold text-white mb-1">150+</h4>
                      <p className="text-gray-400 text-sm">Countries</p>
                  </div>

                  <div className="col-span-2 bg-lime-primary rounded-[2.5rem] p-8 flex items-center justify-between group cursor-pointer hover:bg-lime-400 transition-colors">
                      <div>
                          <h4 className="text-2xl font-bold text-neutral-950">Join the Community</h4>
                          <p className="text-neutral-800">Start your Web3 journey today</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                          <ArrowRight className="w-6 h-6 text-neutral-950" />
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/90 backdrop-blur-sm" 
                onClick={() => setIsVideoOpen(false)}
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-5xl aspect-video bg-neutral-900 rounded-3xl overflow-hidden relative shadow-2xl border border-neutral-800" 
                    onClick={e => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setIsVideoOpen(false)} 
                        className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-neutral-800 hover:text-red-400 transition-colors z-20 backdrop-blur-sm"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    {/* Placeholder Video */}
                    <div className="w-full h-full flex items-center justify-center bg-neutral-950">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" 
                            title="How it works" 
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen 
                        />
                    </div>
                </motion.div>
            </motion.div>
        )}
     </AnimatePresence>

    </div>
  );
};

export default Home;
