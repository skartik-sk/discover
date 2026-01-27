import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

const WeeklyDigest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const subscribe = useMutation(api.subscriptions.subscribe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      await subscribe({ email });
      setMessage({ type: 'success', text: 'Successfully subscribed!' });
      setEmail('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to subscribe. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 p-8 h-full flex flex-col justify-center">
      {/* Subtle accent glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-500/5 rounded-full blur-[50px]" />
      
      <h2 className="text-2xl font-bold text-white mb-3 relative z-10">Weekly Digest</h2>
      <p className="text-gray-400 text-sm mb-6 relative z-10 leading-relaxed">
        Get the top 5 Web3 projects, airdrop alerts, and market analysis in your inbox every Monday.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3 relative z-10 mt-auto">
        <input 
            type="email" 
            placeholder="vitalik@eth.org" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-500/50 transition-colors disabled:opacity-50"
        />
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-yellow-400 text-neutral-950 font-bold text-sm hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              Subscribing...
            </>
          ) : (
            'Subscribe Now'
          )}
        </button>
        
        {message && (
          <div className={`text-xs p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default WeeklyDigest;
