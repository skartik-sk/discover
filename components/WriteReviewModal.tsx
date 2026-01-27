import React, { useState } from 'react';
import { X, Star, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useAuth } from '../src/hooks/useAuth';
import { useToast } from '../src/components/Toast';
import type { Id } from '../convex/_generated/dataModel';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: Id<"projects">;
  projectName: string;
}

const WriteReviewModal: React.FC<Props> = ({ isOpen, onClose, projectId, projectName }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { address, isConnected } = useAuth();
  const { success, error: showError, warning } = useToast();
  const addReview = useMutation(api.reviews.add);

  const handleSubmit = async () => {
    if (!isConnected || !address) {
      warning('Please connect your wallet to write a review');
      return;
    }

    if (rating === 0) {
      warning('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      warning('Please write a comment');
      return;
    }

    setIsSubmitting(true);

    try {
      await addReview({
        projectId,
        rating,
        comment: comment.trim(),
        userWallet: address,
        userName: address.slice(0, 6) + '...' + address.slice(-4),
        userAvatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`,
      });

      // Success! Close modal and reset
      success('Review submitted successfully!');
      onClose();
      setRating(0);
      setComment('');
    } catch (err: any) {
      console.error('Review error:', err);
      
      // Better error handling
      const errorMessage = err.message || err.toString() || 'Failed to submit review';
      
      if (errorMessage.includes('already reviewed')) {
        showError('You have already reviewed this project. You can only submit one review per project.');
      } else if (errorMessage.includes('wallet')) {
        warning('Please connect your wallet first');
      } else {
        showError('Failed to submit review. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
             {/* Decorative blob */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-lime-primary/10 blur-[50px] rounded-full pointer-events-none" />

             <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-white">Review {projectName}</h2>
                 <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-800 text-gray-400 hover:text-white transition-colors">
                     <X className="w-5 h-5" />
                 </button>
             </div>

             <div className="space-y-6">
                 <div>
                     <label className="block text-sm font-medium text-gray-400 mb-2">Overall Rating</label>
                     <div className="flex gap-2">
                         {[1, 2, 3, 4, 5].map((star) => (
                             <button
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="p-1 transition-transform hover:scale-110"
                             >
                                 <Star 
                                    className={`w-8 h-8 ${
                                        star <= (hoverRating || rating) 
                                        ? 'fill-yellow-400 text-yellow-400' 
                                        : 'text-neutral-700 fill-neutral-800'
                                    }`} 
                                 />
                             </button>
                         ))}
                     </div>
                 </div>

                 <div>
                     <label className="block text-sm font-medium text-gray-400 mb-2">Your Review</label>
                     <textarea 
                        rows={4}
                        placeholder="Share your experience with the protocol..."
                        value={comment}
                     onChange={(e) => setComment(e.target.value)}
                     className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-lime-primary transition-colors resize-none placeholder:text-neutral-700"
                  />
              </div>

              <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isConnected}
                    className="w-full py-3.5 rounded-xl bg-lime-primary text-neutral-950 font-bold hover:bg-lime-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                 >
                    {!isConnected ? (
                      'Connect Wallet First'
                    ) : isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                        </>
                    ) : 'Post Review'}
                 </button>
             </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WriteReviewModal;
