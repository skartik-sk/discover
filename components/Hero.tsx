import React from 'react';
import { ArrowRight, Zap, Shield, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onCtaClick: () => void;
  onVideoClick?: () => void;
}

const Hero: React.FC<Props> = ({ onCtaClick, onVideoClick }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="relative bg-neutral-900 rounded-[2.5rem] border border-neutral-800 overflow-hidden p-8 md:p-16 isolate">
        
        {/* Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-lime-primary/20 blur-[100px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -z-10" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col items-start text-left space-y-8">
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-lime-primary text-xs font-bold uppercase tracking-wider"
            >
               <Zap className="w-3 h-3 fill-lime-primary" />
               v2.0 Live Now
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]"
            >
              Find Your Next <br/>
              <span className="text-lime-primary">Gem</span> With Ease.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-400 max-w-lg leading-relaxed"
            >
              Discover, verify, and track the best decentralized applications across the Web3 ecosystem. Trusted by 10,000+ daily users.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={onCtaClick}
                className="px-8 py-4 rounded-xl bg-lime-primary text-neutral-950 font-bold text-sm hover:bg-lime-400 transition-colors flex items-center gap-2"
              >
                Start Discovering
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={onVideoClick}
                className="px-8 py-4 rounded-xl bg-neutral-800 text-white font-bold text-sm border border-neutral-700 hover:bg-neutral-700 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                How it works
              </button>
            </motion.div>

            <div className="flex items-center gap-8 pt-4">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center overflow-hidden">
                       <img src={`https://randomuser.me/api/portraits/thumb/men/${i+10}.jpg`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
               <div className="text-sm">
                  <p className="text-white font-bold">10k+ Builders</p>
                  <p className="text-gray-500 text-xs">Joined this month</p>
               </div>
            </div>
          </div>

          {/* Right Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative lg:h-[500px] w-full rounded-3xl bg-neutral-800/50 border border-neutral-700 overflow-hidden group"
          >
             <img 
               src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop" 
               className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
               alt="Dashboard Preview"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent" />
             
             {/* Floating Cards Mockup */}
             <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-4">
                <div className="bg-neutral-900/90 backdrop-blur-md p-4 rounded-2xl border border-neutral-800">
                   <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-lime-primary flex items-center justify-center">
                         <Shield className="w-4 h-4 text-black" />
                      </div>
                      <div>
                         <div className="text-xs text-gray-400">Status</div>
                         <div className="text-sm font-bold text-white">Verified</div>
                      </div>
                   </div>
                </div>
                <div className="bg-neutral-900/90 backdrop-blur-md p-4 rounded-2xl border border-neutral-800">
                   <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                         <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                         <div className="text-xs text-gray-400">Growth</div>
                         <div className="text-sm font-bold text-white">+124%</div>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
