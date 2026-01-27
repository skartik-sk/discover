import React from 'react';
import { Twitter, Github, Disc } from 'lucide-react';
import { ViewState } from '../types';

interface Props {
  onNavigate: (view: string) => void;
}

const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center mb-4">
                <img 
                  src="/logo.png" 
                  alt="Discover" 
                  className="h-10 w-auto"
                />
            </div>
            <p className="text-gray-400 text-sm max-w-sm">
                The premier platform for discovering, verifying, and launching the next generation of Web3 applications. Built for the community, by the community.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
                <li onClick={() => onNavigate('search')} className="hover:text-lime-primary cursor-pointer transition-colors">Explore</li>
                <li onClick={() => onNavigate('search')} className="hover:text-lime-primary cursor-pointer transition-colors">Trending</li>
                <li onClick={() => onNavigate('submit')} className="hover:text-lime-primary cursor-pointer transition-colors">Submit Project</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-gray-400">
                <li onClick={() => onNavigate('governance')} className="hover:text-lime-primary cursor-pointer transition-colors">Governance</li>
                <li onClick={() => onNavigate('blog')} className="hover:text-lime-primary cursor-pointer transition-colors">Blog</li>
                <li onClick={() => onNavigate('docs')} className="hover:text-lime-primary cursor-pointer transition-colors">Docs</li>
                <li onClick={() => onNavigate('brand')} className="hover:text-lime-primary cursor-pointer transition-colors">Brand Assets</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">© 2025 Discover Web3. All rights reserved.</p>
            <div className="flex gap-4">
                <a href="https://x.com/skartik_sk" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                </a>
                <a href="https://github.com/skartik-sk" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                </a>
                <Disc className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
