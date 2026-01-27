import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';
import { useAuth } from '../src/hooks/useAuth';
import { ArrowLeft, Download, TrendingUp, MessageSquare, Star, Award, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { exportProjectPdf } from '../src/utils/exportPdf';

type TimeRange = '7d' | '30d' | '90d' | 'all';

const ProjectAnalytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { address } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [isExporting, setIsExporting] = useState(false);

  const projectId = id as Id<"projects">;
  const project = useQuery(api.projects.get, { id: projectId });
  const analytics = useQuery(api.analytics.getProjectAnalytics, { 
    projectId, 
    timeRange 
  });

  // Check if user is owner
  const isOwner = address && project?.ownerWallet.toLowerCase() === address.toLowerCase();

  const handleExportPdf = async () => {
    if (!analytics || !project) return;
    
    setIsExporting(true);
    try {
      await exportProjectPdf(project, analytics);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Loading state
  if (project === undefined || analytics === undefined) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Check authorization
  if (!isOwner) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-24 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-2">Unauthorized</h2>
          <p className="text-gray-400 mb-6">Only the project owner can view analytics.</p>
          <button
            onClick={() => navigate(`/project/${id}`)}
            className="px-6 py-3 rounded-xl bg-lime-primary text-black font-medium hover:bg-lime-400 transition-colors"
          >
            Back to Project
          </button>
        </div>
      </div>
    );
  }

  const timeRangeButtons: { value: TimeRange; label: string }[] = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/project/${id}`)}
            className="flex items-center gap-2 text-neutral-400 hover:text-lime-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Project
          </button>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{project.name} Analytics</h1>
              <p className="text-neutral-400">Track your project's performance and engagement</p>
            </div>

            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-lime-primary text-black rounded-lg hover:bg-lime-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {timeRangeButtons.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTimeRange(value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                timeRange === value
                  ? 'bg-lime-primary text-black'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-lime-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-lime-primary" />
              </div>
              <h3 className="text-neutral-400 text-sm font-medium">Total Upvotes</h3>
            </div>
            <p className="text-3xl font-bold text-white">{analytics.totalUpvotes}</p>
          </div>

          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-neutral-400 text-sm font-medium">Total Reviews</h3>
            </div>
            <p className="text-3xl font-bold text-white">{analytics.totalReviews}</p>
          </div>

          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-neutral-400 text-sm font-medium">Average Rating</h3>
            </div>
            <p className="text-3xl font-bold text-white">{analytics.averageRating.toFixed(1)}</p>
          </div>

          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-neutral-400 text-sm font-medium">Category Rank</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              #{analytics.categoryRank}
              <span className="text-sm text-neutral-400 ml-2">of {analytics.categoryTotal}</span>
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upvotes Over Time */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-lime-primary" />
              Upvotes Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.upvotesByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis 
                  dataKey="date" 
                  stroke="#737373"
                  tick={{ fill: '#737373', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#737373"
                  tick={{ fill: '#737373', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    border: '1px solid #262626',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#CCFF00" 
                  strokeWidth={2}
                  dot={{ fill: '#CCFF00', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Rating Distribution */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Rating Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis 
                  dataKey="rating" 
                  stroke="#737373"
                  tick={{ fill: '#737373', fontSize: 12 }}
                  label={{ value: 'Stars', position: 'insideBottom', offset: -5, fill: '#737373' }}
                />
                <YAxis 
                  stroke="#737373"
                  tick={{ fill: '#737373', fontSize: 12 }}
                  label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#737373' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    border: '1px solid #262626',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="count" fill="#FACC15" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            Recent Reviews ({analytics.recentReviews.length})
          </h3>

          {analytics.recentReviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-500">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={review.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user}`}
                      alt={review.user}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-white">{review.user}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-neutral-700'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-neutral-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-neutral-300 text-sm">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics;
