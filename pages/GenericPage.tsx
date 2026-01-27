import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  description: string;
}

const GenericPage: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="min-h-screen bg-neutral-950 pt-32 pb-20 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-lime-primary/10 rounded-3xl mx-auto mb-8 flex items-center justify-center"
        >
             <span className="text-4xl">🚧</span>
        </motion.div>
        <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
            {title}
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg leading-relaxed mb-8"
        >
            {description}
        </motion.p>
        <button className="px-8 py-3 rounded-xl bg-lime-primary text-neutral-950 font-bold hover:bg-lime-400 transition-colors">
            Notify Me When Live
        </button>
      </div>
    </div>
  );
};

export default GenericPage;
