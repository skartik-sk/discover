'use client';

import { useState } from 'react';

interface QuizButtonProps {
  projectName: string;
}

export default function QuizButton({ projectName }: QuizButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center rounded-lg h-12 px-6 border-2 border-forest-green text-forest-green font-bold hover:bg-forest-green/10 transition-colors"
      >
        <span className="material-symbols-outlined mr-2">quiz</span>
        Take Quiz
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-charcoal-grey">Test Your Knowledge: {projectName}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="font-semibold mb-3 text-dark-grey">1. What is the primary purpose of {projectName}?</p>
                <div className="space-y-2">
                  {['Option A', 'Option B', 'Option C', 'Option D'].map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="q1" value={opt} className="w-4 h-4 text-forest-green" />
                      <span className="text-dark-grey">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold mb-3 text-dark-grey">2. Which blockchain does {projectName} use?</p>
                <div className="space-y-2">
                  {['Ethereum', 'Solana', 'Polygon', 'Multiple chains'].map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="q2" value={opt} className="w-4 h-4 text-forest-green" />
                      <span className="text-dark-grey">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => alert('Quiz submitted! (Demo - feature not fully implemented)')}
                  className="flex-1 bg-forest-green text-white rounded-lg h-12 font-bold hover:opacity-90 transition-opacity"
                >
                  Submit Quiz
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 border-2 border-gray-300 text-dark-grey rounded-lg h-12 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
