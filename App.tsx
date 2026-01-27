import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchProjects from './pages/SearchProjects';
import ProjectDetails from './pages/ProjectDetails';
import ProjectAnalytics from './pages/ProjectAnalytics';
import EditProject from './pages/EditProject';
import SubmitProject from './pages/SubmitProject';
import GenericPage from './pages/GenericPage';
import Forum from './pages/Forum';
import ProfilePage from './pages/ProfilePage';
import Footer from './components/Footer';
import { Project } from './types';
import { AnimatePresence } from 'framer-motion';
import type { Id } from './convex/_generated/dataModel';

// Wrapper components that use router hooks
const HomeWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleProjectSelect = (project: Project) => {
    navigate(`/project/${project._id}`);
  };

  const handlePostSelect = (postId: string) => {
    navigate(`/forum/${postId}`);
  };

  const handleNavigate = (view: string) => {
    navigate(`/${view === 'home' ? '' : view}`);
  };

  return (
    <Home 
      onProjectSelect={handleProjectSelect}
      onPostSelect={handlePostSelect}
      onNavigate={handleNavigate}
    />
  );
};

const SearchProjectsWrapper: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const handleProjectSelect = (project: Project) => {
    navigate(`/project/${project._id}`);
  };

  return (
    <SearchProjects 
      onProjectSelect={handleProjectSelect}
      initialSearch={searchQuery}
    />
  );
};

const ProjectDetailsWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const handleProjectSelect = (project: Project) => {
    navigate(`/project/${project._id}`);
  };

  if (!id) {
    return <Navigate to="/browse" replace />;
  }

  return (
    <ProjectDetails 
      projectId={id as Id<"projects">}
      onBack={() => navigate('/browse')}
      onProjectSelect={handleProjectSelect}
    />
  );
};

const ForumWrapper: React.FC = () => {
  const { postId } = useParams<{ postId?: string }>();
  
  return <Forum initialPostId={postId || null} />;
};

const ProfileWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (view: 'details' | 'edit', project?: { _id: Id<"projects"> }) => {
    if (view === 'details' && project) {
      navigate(`/project/${project._id}`);
    } else if (view === 'edit' && project) {
      navigate(`/project/${project._id}/edit`);
    } else {
      navigate('/');
    }
  };

  return <ProfilePage onNavigate={handleNavigate} />;
};

const EditProjectWrapper: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <EditProject 
      projectId={id as Id<"projects">}
      onBack={() => navigate('/profile')}
    />
  );
};

const ProjectAnalyticsWrapper: React.FC = () => {
  return <ProjectAnalytics />;
};

// Main App Layout
const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = window.location.pathname;
  
  // Determine current view from location
  const getCurrentView = () => {
    if (location === '/' || location === '/home') return 'home';
    if (location.startsWith('/browse') || location.startsWith('/search')) return 'search';
    if (location.startsWith('/project/')) return 'details';
    if (location.startsWith('/submit')) return 'submit';
    if (location.startsWith('/forum')) return 'blog';
    if (location.startsWith('/profile')) return 'profile';
    if (location.startsWith('/governance')) return 'governance';
    if (location.startsWith('/docs')) return 'docs';
    if (location.startsWith('/brand')) return 'brand';
    return 'home';
  };

  const handleNavigate = (view: string) => {
    navigate(`/${view === 'home' ? '' : view}`);
  };

  const handleSearch = (query: string) => {
    navigate(`/browse?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="bg-neutral-950 min-h-screen text-white selection:bg-lime-primary selection:text-neutral-950">
      <Navbar 
        onNavigate={handleNavigate} 
        currentView={getCurrentView() as any} 
        onSearch={handleSearch} 
      />
      
      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomeWrapper />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/browse" element={<SearchProjectsWrapper />} />
            <Route path="/search" element={<Navigate to="/browse" replace />} />
            <Route path="/project/:id" element={<ProjectDetailsWrapper />} />
            <Route path="/project/:id/edit" element={<EditProjectWrapper />} />
            <Route path="/project/:id/analytics" element={<ProjectAnalyticsWrapper />} />
            <Route path="/submit" element={<SubmitProject />} />
            <Route path="/forum" element={<ForumWrapper />} />
            <Route path="/forum/:postId" element={<ForumWrapper />} />
            <Route path="/blog" element={<Navigate to="/forum" replace />} />
            <Route path="/profile" element={<ProfileWrapper />} />
            <Route path="/governance" element={
              <GenericPage 
                title="Governance" 
                description="Participate in the decision-making process of the Discover platform. Vote on proposals, treasury allocation, and feature requests." 
              />
            } />
            <Route path="/docs" element={
              <GenericPage 
                title="Documentation" 
                description="Technical documentation for integrating with the Discover API and submission guidelines for builders." 
              />
            } />
            <Route path="/brand" element={
              <GenericPage 
                title="Brand Assets" 
                description="Download official logos, colors, and typography guidelines for Discover." 
              />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
