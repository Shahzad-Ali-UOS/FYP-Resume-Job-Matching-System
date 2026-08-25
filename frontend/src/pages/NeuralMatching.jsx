import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaNetworkWired, FaCheckCircle, FaTimesCircle, FaUserCircle } from 'react-icons/fa';

const NeuralMatching = () => {
  const navigate = useNavigate();
  const [selectedMatch, setSelectedMatch] = useState(null);

  const candidates = [
    { id: 1, name: "Shahzad Ali", match: 94, role: "AI Research", status: "Optimal" },
    { id: 2, name: "Imtiaz Ali", match: 88, role: "Data Scientist", status: "Qualified" },
    { id: 3, name: "Haji Rahman", match: 42, role: "DevOps", status: "Low" }
  ];

  return (
    <div className="fixed inset-0 bg-[#030712] text-white p-4 overflow-hidden">
      {/* Immersive Revolving Border Wrapper */}
      <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden p-[2px] bg-transparent">
        <div className="absolute inset-0 animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_340deg,#4f46e5_360deg)] rounded-[2.5rem]" />
        
        <div className="absolute inset-[2px] bg-[#030712] rounded-[2.5rem] p-10 flex flex-col">
          
          <header className="flex justify-between items-center mb-10">
            <button onClick={() => navigate('/dashboard')} className="text-[10px] font-black uppercase text-indigo-400 flex items-center gap-2">
              <FaArrowLeft /> Back to Matrix
            </button>
            <h1 className="text-xl font-black tracking-tighter flex items-center gap-3">
              <FaNetworkWired className="text-indigo-500" /> NEURAL_MATCHING_SPACE
            </h1>
          </header>

          <div className="grid grid-cols-12 gap-8 flex-1">
            
            {/* Candidate List (Left) */}
            <div className="col-span-4 bg-[#0b1220]/50 border border-white/5 rounded-3xl p-6">
              <h2 className="text-[10px] font-black uppercase text-gray-500 mb-6">High-Probability Vectors</h2>
              <div className="space-y-4">
                {candidates.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => setSelectedMatch(c)}
                    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${selectedMatch?.id === c.id ? 'bg-indigo-600 border-indigo-500' : 'bg-black/20 border-white/5'}`}
                  >
                    <div className="flex items-center gap-4">
                      <FaUserCircle size={32} className="text-indigo-400" />
                      <div className="text-left">
                        <div className="font-bold text-xs">{c.name}</div>
                        <div className="text-[9px] text-gray-400 uppercase">{c.role}</div>
                      </div>
                    </div>
                    <span className="text-xl font-black">{c.match}%</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Neural Map Visualization (Right) */}
            <div className="col-span-8 bg-[#0b1220]/50 border border-white/5 rounded-3xl p-8 relative flex items-center justify-center">
              <AnimatePresence mode="wait">
                {selectedMatch ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="relative w-64 h-64 mx-auto mb-8">
                       <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-ping" />
                       <div className="absolute inset-4 border-4 border-indigo-500/40 rounded-full animate-spin-slow" />
                       <div className="absolute inset-8 border-4 border-indigo-500/60 rounded-full" />
                       <div className="absolute inset-0 flex items-center justify-center font-black text-4xl">
                         {selectedMatch.match}%
                       </div>
                    </div>
                    <h3 className="text-3xl font-black mb-2">{selectedMatch.name}</h3>
                    <div className="flex justify-center gap-4 text-xs font-black uppercase text-indigo-400">
                      <span className="flex items-center gap-2"><FaCheckCircle /> Verified Topology</span>
                      <span className="flex items-center gap-2"><FaNetworkWired /> Latent Space Stable</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-gray-600 font-black uppercase text-xs tracking-widest text-center">
                    Select a candidate vector to initialize neural mapping
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>
    </div>
  );
};

export default NeuralMatching;