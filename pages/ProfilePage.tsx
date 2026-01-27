import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useAuth } from '../src/hooks/useAuth';
import { User, TrendingUp, Star, Award, Wallet, X, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../types';
import type { Id } from '../convex/_generated/dataModel';

interface Props {
  onNavigate: (view: 'details' | 'edit', project?: { _id: Id<"projects"> }) => void;
}

const ProfilePage: React.FC<Props> = ({ onNavigate }) => {
  const { address, isConnected } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'reviews' | 'upvoted'>('projects');

  // Queries
  const user = useQuery(api.users.getByWallet, address ? { walletAddress: address } : 'skip');
  const stats = useQuery(api.users.getStats, address ? { walletAddress: address } : 'skip');
  const userProjects = useQuery(api.projects.getUserProjects, address ? { walletAddress: address } : 'skip');
  const userReviews = useQuery(api.reviews.getUserReviews, address ? { walletAddress: address } : 'skip');
  const upvotedProjects = useQuery(api.projects.getUserUpvotedProjects, address ? { walletAddress: address } : 'skip');

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center">
            <Wallet className="w-16 h-16 text-lime-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-neutral-400">Please connect your wallet to view your profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-lime-primary to-lime-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.displayName} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <User className="w-12 h-12 text-neutral-950" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user?.displayName || 'Anonymous User'}
              </h1>
              <div className="flex items-center gap-2 text-neutral-400 font-mono text-sm">
                <Wallet className="w-4 h-4" />
                {address.slice(0, 10)}...{address.slice(-8)}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-lime-primary">{stats?.projectsSubmitted || 0}</div>
                <div className="text-sm text-neutral-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{stats?.reviewsWritten || 0}</div>
                <div className="text-sm text-neutral-400">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{stats?.upvotesGiven || 0}</div>
                <div className="text-sm text-neutral-400">Upvotes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-neutral-800">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'projects'
                ? 'text-lime-primary'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            My Projects
            {activeTab === 'projects' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-primary"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'reviews'
                ? 'text-lime-primary'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            My Reviews
            {activeTab === 'reviews' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-primary"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('upvoted')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'upvoted'
                ? 'text-lime-primary'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Upvoted
            {activeTab === 'upvoted' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-primary"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {userProjects === undefined ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-primary mx-auto" />
                </div>
              ) : userProjects.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center">
                  <Award className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Projects Yet</h3>
                  <p className="text-neutral-400">Submit your first project to get started!</p>
                </div>
              ) : (
                userProjects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 hover:border-lime-primary/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={project.logo}
                        alt={project.name}
                        className="w-16 h-16 rounded-xl object-cover cursor-pointer"
                        onClick={() => onNavigate('details', { _id: project._id })}
                      />
                      <div className="flex-1 cursor-pointer" onClick={() => onNavigate('details', { _id: project._id })}>
                        <h3 className="text-xl font-bold text-white group-hover:text-lime-primary transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-neutral-400 text-sm">{project.tagline}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-lime-primary">{project.upvoteCount}</div>
                          <div className="text-xs text-neutral-500">Upvotes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">{project.averageRating.toFixed(1)}</div>
                          <div className="text-xs text-neutral-500">Rating</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('edit', { _id: project._id });
                          }}
                          className="px-4 py-2 bg-lime-primary text-neutral-950 rounded-xl font-medium hover:bg-lime-400 transition-colors flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {userReviews === undefined ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-primary mx-auto" />
                </div>
              ) : userReviews.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center">
                  <Star className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Reviews Yet</h3>
                  <p className="text-neutral-400">Write your first review to share your experience!</p>
                </div>
              ) : (
                userReviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      {review.projectLogo && (
                        <img
                          src={review.projectLogo}
                          alt={review.projectName || 'Project'}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-white">{review.projectName}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-neutral-300">{review.comment}</p>
                        <p className="text-xs text-neutral-500 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'upvoted' && (
            <motion.div
              key="upvoted"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {upvotedProjects === undefined ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-primary mx-auto" />
                </div>
              ) : upvotedProjects.length === 0 ? (
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center">
                  <TrendingUp className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Upvoted Projects</h3>
                  <p className="text-neutral-400">Start exploring and upvote projects you like!</p>
                </div>
              ) : (
                upvotedProjects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 hover:border-lime-primary/50 transition-all group cursor-pointer"
                    onClick={() => onNavigate('details', { _id: project._id })}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={project.logo || `https://api.dicebear.com/7.x/shapes/svg?seed=${project.name}`}
                        alt={project.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-lime-primary transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-neutral-400 text-sm">{project.tagline}</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Upvoted {new Date(project.upvotedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-lime-primary">{project.upvoteCount}</div>
                          <div className="text-xs text-neutral-500">Upvotes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">{project.averageRating.toFixed(1)}</div>
                          <div className="text-xs text-neutral-500">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-neutral-400">{project.category}</div>
                          <div className="text-xs text-neutral-500">Category</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;
