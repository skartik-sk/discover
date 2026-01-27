import React, { useState, useEffect } from 'react';
import { MessageSquare, Flame, Clock, Filter, Plus, Share2, ChevronUp, ArrowLeft, Send, User } from 'lucide-react';
import { ForumPost } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useToast } from '../src/components/Toast';
import { useAuth } from '../src/hooks/useAuth';
import type { Id } from '../convex/_generated/dataModel';

interface Props {
    initialPostId?: string | null;
}

const Forum: React.FC<Props> = ({ initialPostId }) => {
  const [view, setView] = useState<'list' | 'detail' | 'create'>('list');
  const [activeTab, setActiveTab] = useState('Trending');
  const [selectedPostId, setSelectedPostId] = useState<Id<"forumPosts"> | null>(null);
  const [commentText, setCommentText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  
  const { success, error: showError, warning } = useToast();
  const { isConnected, address } = useAuth();
  
  // Convex queries
  const forumPosts = useQuery(api.forum.listPosts, selectedCategory ? { category: selectedCategory } : {});
  const selectedPost = useQuery(
    api.forum.getPost,
    selectedPostId ? { id: selectedPostId } : "skip"
  );
  
  // Convex mutations
  const addComment = useMutation(api.forum.addComment);
  const toggleLike = useMutation(api.forum.togglePostLike);

  // Effect to handle deep linking via initialPostId
  useEffect(() => {
      if (initialPostId && forumPosts) {
          // Try to find the post - initialPostId could be a Convex _id
          const post = forumPosts.find(p => p._id === initialPostId);
          if (post) {
              setSelectedPostId(post._id);
              setView('detail');
              window.scrollTo(0,0);
          }
      }
  }, [initialPostId, forumPosts]);

  const handlePostClick = (postId: Id<"forumPosts">) => {
    setSelectedPostId(postId);
    setView('detail');
    window.scrollTo(0,0);
  };

  const handleBack = () => {
      setView('list');
      setSelectedPostId(null);
  };

  const handleAddComment = async () => {
      if (!commentText.trim() || !selectedPostId) return;
      
      if (!isConnected || !address) {
          warning('Please connect your wallet to comment');
          return;
      }
      
      try {
          await addComment({
              postId: selectedPostId,
              authorWallet: address,
              authorName: `${address.slice(0, 6)}...${address.slice(-4)}`,
              authorAvatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
              content: commentText,
          });
          
          setCommentText('');
          success('Comment posted successfully!');
      } catch (err) {
          console.error('Error adding comment:', err);
          showError('Failed to post comment. Please try again.');
      }
  };
  
  const handleUpvote = async (postId: Id<"forumPosts">, e: React.MouseEvent) => {
      e.stopPropagation();
      
      if (!isConnected || !address) {
          warning('Please connect your wallet to upvote');
          return;
      }
      
      try {
          await toggleLike({ postId, userWallet: address });
      } catch (err) {
          console.error('Error toggling like:', err);
          showError('Failed to upvote. Please try again.');
      }
  };
  
  const handleShare = (postId: string, title: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const url = `${window.location.origin}?post=${postId}`;
      
      if (navigator.share) {
          navigator.share({
              title: title,
              url: url,
          }).catch(() => {
              // User cancelled sharing
          });
      } else {
          navigator.clipboard.writeText(url);
          success('Link copied to clipboard!');
      }
  };
  
  const formatDate = (timestamp: number) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Loading state
  if (forumPosts === undefined) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading forum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header (Only on List View) */}
        {view === 'list' && (
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-neutral-800 pb-8">
            <div>
                <h1 className="text-4xl font-bold text-white mb-3">Community Forum</h1>
                <p className="text-gray-400 max-w-2xl">
                Join the conversation. Discuss protocols, governance proposals, and the latest in Web3 technology.
                </p>
            </div>
            <button 
                onClick={() => setView('create')}
                className="px-6 py-3 rounded-xl bg-lime-primary text-neutral-950 font-bold text-sm hover:bg-lime-400 transition-colors flex items-center gap-2 shadow-lg shadow-lime-primary/10"
            >
                <Plus className="w-4 h-4" />
                New Discussion
            </button>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar (Always visible) */}
            <div className="space-y-6 hidden lg:block">
                <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 lg:sticky lg:top-24">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Filter className="w-4 h-4 text-lime-primary" /> Categories
                    </h3>
                    <div className="space-y-1">
                        {['All Topics', 'Technical', 'Governance', 'Analysis', 'Security', 'General'].map(cat => (
                            <button 
                                key={cat} 
                                onClick={() => setSelectedCategory(cat === 'All Topics' ? undefined : cat)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                    (cat === 'All Topics' && !selectedCategory) || selectedCategory === cat
                                    ? 'text-white bg-neutral-800'
                                    : 'text-gray-400 hover:text-white hover:bg-neutral-800'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-neutral-800">
                        <h3 className="font-bold text-white mb-4">Trending Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {['#DeFi', '#Layer2', '#Yield', '#Security', '#Airdrop'].map(tag => (
                                <span key={tag} className="px-3 py-1 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-gray-400 hover:border-gray-600 cursor-pointer transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                    
                    {/* LIST VIEW */}
                    {view === 'list' && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* Tabs */}
                            <div className="flex items-center gap-4 mb-6">
                                {['Trending', 'New', 'Top'].map(tab => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                                            activeTab === tab 
                                            ? 'bg-neutral-800 text-white' 
                                            : 'text-gray-500 hover:text-white'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Posts List */}
                            <div className="space-y-4">
                                {forumPosts.map((post) => (
                                    <div 
                                        key={post._id} 
                                        onClick={() => handlePostClick(post._id)}
                                        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-lime-primary/30 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex flex-col items-center gap-2 min-w-[50px]">
                                                <button 
                                                    onClick={(e) => handleUpvote(post._id, e)}
                                                    className="flex flex-col items-center p-2 rounded-lg bg-neutral-950 border border-neutral-800 group-hover:border-lime-primary/20 transition-colors hover:bg-neutral-800"
                                                >
                                                    <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-lime-primary transition-colors" />
                                                    <span className="font-bold text-white text-sm">{post.likeCount}</span>
                                                </button>
                                            </div>
                                            
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-0.5 rounded bg-lime-primary/10 text-lime-primary text-[10px] font-bold uppercase tracking-wider border border-lime-primary/20">
                                                        {post.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                                                        Posted by <span className="text-gray-300 font-medium">{post.authorName}</span>
                                                    </span>
                                                    <span className="text-xs text-gray-600 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {formatDate(post.createdAt)}
                                                    </span>
                                                </div>
                                                
                                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-lime-primary transition-colors">
                                                    {post.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                                    {post.excerpt}
                                                </p>
                                                
                                                <div className="flex items-center gap-4">
                                                    <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
                                                        <MessageSquare className="w-4 h-4" />
                                                        {post.commentCount} Comments
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleShare(post._id, post.title, e)}
                                                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
                                                    >
                                                        <Share2 className="w-4 h-4" />
                                                        Share
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {forumPosts.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No posts yet. Be the first to start a discussion!</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* DETAIL VIEW */}
                    {view === 'detail' && selectedPost && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Back to Discussions
                            </button>

                            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 mb-8 overflow-hidden">
                                {selectedPost.coverImage && (
                                    <div className="w-[calc(100%+4rem)] -mx-8 -mt-8 mb-8 h-80 relative">
                                        <img src={selectedPost.coverImage} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mb-6">
                                     <span className="px-3 py-1 rounded-lg bg-lime-primary/10 text-lime-primary text-xs font-bold uppercase tracking-wider border border-lime-primary/20">
                                        {selectedPost.category}
                                    </span>
                                    <span className="text-gray-500 text-sm flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> {formatDate(selectedPost.createdAt)}
                                    </span>
                                </div>
                                
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">{selectedPost.title}</h1>
                                
                                <div className="flex items-center gap-4 mb-8 border-b border-neutral-800 pb-8">
                                    <div className="flex items-center gap-3">
                                        <img src={selectedPost.authorAvatar} className="w-10 h-10 rounded-full border border-neutral-700" />
                                        <div>
                                            <p className="text-white font-bold">{selectedPost.authorName}</p>
                                            <p className="text-gray-500 text-xs">Original Poster</p>
                                        </div>
                                    </div>
                                    <div className="ml-auto flex gap-2">
                                         <button 
                                            onClick={(e) => handleUpvote(selectedPost._id, e)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-gray-300 hover:text-lime-primary hover:border-lime-primary/30 transition-all"
                                         >
                                             <ChevronUp className="w-4 h-4" /> {selectedPost.likeCount} Upvotes
                                         </button>
                                         <button 
                                            onClick={(e) => handleShare(selectedPost._id, selectedPost.title, e)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-gray-300 hover:text-white hover:border-neutral-700 transition-all"
                                         >
                                             <Share2 className="w-4 h-4" /> Share
                                         </button>
                                    </div>
                                </div>

                                <div className="prose prose-invert max-w-none mb-8 text-gray-300 leading-relaxed whitespace-pre-line">
                                    {selectedPost.content || selectedPost.excerpt}
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    {selectedPost.commentsList?.length || 0} Comments
                                </h3>

                                {/* Comment Input */}
                                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex gap-4">
                                     <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-gray-500">
                                         <User className="w-6 h-6" />
                                     </div>
                                     <div className="flex-1">
                                         <textarea 
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder={isConnected ? "What are your thoughts?" : "Connect wallet to comment..."}
                                            disabled={!isConnected}
                                            className="w-full bg-transparent text-white placeholder:text-gray-600 focus:outline-none resize-none min-h-[80px] disabled:opacity-50"
                                         />
                                         <div className="flex justify-end mt-2">
                                             <button 
                                                onClick={handleAddComment}
                                                disabled={!commentText.trim() || !isConnected}
                                                className="px-4 py-2 rounded-lg bg-lime-primary text-black font-bold text-xs hover:bg-lime-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                             >
                                                 Post Comment
                                             </button>
                                         </div>
                                     </div>
                                </div>

                                {/* Comments List */}
                                <div className="space-y-4">
                                    {selectedPost.commentsList?.map((comment: any) => (
                                        <div key={comment.id} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                                            <div className="flex items-start gap-4">
                                                 <img src={comment.avatar} className="w-10 h-10 rounded-full border border-neutral-800" />
                                                 <div className="flex-1">
                                                     <div className="flex justify-between items-start mb-2">
                                                         <div>
                                                             <span className="font-bold text-white text-sm mr-2">{comment.author}</span>
                                                             <span className="text-gray-500 text-xs">{comment.date}</span>
                                                         </div>
                                                         <button className="text-gray-500 hover:text-lime-primary text-xs flex items-center gap-1">
                                                             <ChevronUp className="w-3 h-3" /> {comment.likes}
                                                         </button>
                                                     </div>
                                                     <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                                                 </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {(!selectedPost.commentsList || selectedPost.commentsList.length === 0) && (
                                        <div className="text-center py-8 text-gray-500">
                                            No comments yet. Be the first to share your thoughts!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* CREATE VIEW */}
                    {view === 'create' && (
                         <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                         >
                            <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Cancel
                            </button>
                            
                            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-3xl mx-auto">
                                <h2 className="text-2xl font-bold text-white mb-6">Start a New Discussion</h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                                        <input type="text" placeholder="e.g. Analysis of the new EIP-4844 proposal" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-primary" />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {['Technical', 'Governance', 'Analysis', 'Security', 'General'].map(cat => (
                                                <button key={cat} className="px-4 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-gray-400 text-sm hover:border-lime-primary hover:text-white transition-colors">
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
                                        <textarea rows={8} placeholder="Write your discussion here..." className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-primary resize-none" />
                                    </div>

                                    <div className="pt-4 border-t border-neutral-800 flex justify-end">
                                        <button onClick={() => setView('list')} className="px-8 py-3 rounded-xl bg-lime-primary text-neutral-950 font-bold hover:bg-lime-400 transition-colors flex items-center gap-2">
                                            <Send className="w-4 h-4" /> Publish Discussion
                                        </button>
                                    </div>
                                </div>
                            </div>
                         </motion.div>
                    )}

                </AnimatePresence>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Forum;
