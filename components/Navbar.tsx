import React, { useState } from 'react';
import { Menu, X, Wallet, Search, Compass, Home as HomeIcon, PlusCircle, MessageSquare, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewState } from '../types';
import { useAuth } from '../src/hooks/useAuth';
import { useAppKit } from '@reown/appkit/react';

interface Props {
  onNavigate: (view: string) => void;
  currentView: ViewState | string;
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<Props> = ({ onNavigate, currentView, onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isConnected, address } = useAuth();
  const { open } = useAppKit();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const navLinkClass = (view: ViewState) => 
    `px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
      currentView === view 
        ? 'text-lime-primary bg-neutral-900 border border-neutral-800' 
        : 'text-gray-400 hover:text-white hover:bg-neutral-800/50'
    }`;

  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex-shrink-0 flex items-center cursor-pointer group"
          >
            <img 
              src="/logo.png" 
              alt="Discover" 
              className="h-8 w-auto group-hover:scale-105 transition-transform"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <div 
                onClick={() => onNavigate('home')} 
                className={navLinkClass('home')}
              >
                <HomeIcon className="w-4 h-4" />
                Home
              </div>
              <div 
                onClick={() => onNavigate('search')} 
                className={navLinkClass('search')}
              >
                <Compass className="w-4 h-4" />
                Browse
              </div>
              <div 
                onClick={() => onNavigate('blog')} 
                className={navLinkClass('blog')}
              >
                <MessageSquare className="w-4 h-4" />
                Forum
              </div>
              <div 
                 onClick={() => onNavigate('submit')}
                 className={navLinkClass('submit')}
              >
                <PlusCircle className="w-4 h-4" />
                Submit
              </div>
            </div>
          </div>

          {/* Search & Wallet */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative group hidden lg:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-lime-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="bg-neutral-900 border border-neutral-800 text-sm rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-lime-primary w-40 transition-all focus:w-64 placeholder:text-neutral-600 text-gray-200"
              />
            </div>
            
            {isConnected && address && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-700"
              >
                <User className="w-4 h-4" />
                Profile
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => open()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                isConnected 
                  ? 'bg-neutral-900 text-lime-primary border-lime-primary/20' 
                  : 'bg-lime-primary text-neutral-950 border-lime-primary hover:bg-lime-400'
              }`}
            >
              <Wallet className="w-4 h-4" />
              {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-neutral-800 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-neutral-900 border-b border-neutral-800 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button onClick={() => {onNavigate('home'); setIsOpen(false)}} className="w-full text-left text-white block px-3 py-2 rounded-xl text-base font-medium hover:bg-neutral-800">Home</button>
              <button onClick={() => {onNavigate('search'); setIsOpen(false)}} className="w-full text-left text-gray-300 block px-3 py-2 rounded-xl text-base font-medium hover:bg-neutral-800">Browse Projects</button>
              <button onClick={() => {onNavigate('blog'); setIsOpen(false)}} className="w-full text-left text-gray-300 block px-3 py-2 rounded-xl text-base font-medium hover:bg-neutral-800">Forum</button>
              <button onClick={() => {onNavigate('submit'); setIsOpen(false)}} className="w-full text-left text-gray-300 block px-3 py-2 rounded-xl text-base font-medium hover:bg-neutral-800">Submit Project</button>
              {isConnected && (
                <button onClick={() => {onNavigate('profile'); setIsOpen(false)}} className="w-full text-left text-gray-300 block px-3 py-2 rounded-xl text-base font-medium hover:bg-neutral-800">Profile</button>
              )}
              <div className="pt-4 pb-2">
                <button
                  onClick={() => open()}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold ${
                    isConnected 
                      ? 'bg-neutral-800 text-lime-primary' 
                      : 'bg-lime-primary text-neutral-950'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
