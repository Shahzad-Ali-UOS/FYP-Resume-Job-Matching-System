import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaTerminal, FaCheckCircle, FaMicrochip, FaShieldAlt, FaSync, FaHistory } from 'react-icons/fa';

const NeuralResumeScorer = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('ai');
  const [scan, setScan] = useState(false);
  const scrollRef = useRef(null);

  const profiles = {
    ai: { title: "AI/ML Engineer", score: 92, status: "VERIFIED" },
    web: { title: "Full-Stack Dev", score: 31, status: "MISMATCH" },
    cyber: { title: "Security Analyst", score: 12, status: "REJECTED" }
  };

  // Simulate scanning effect
  useEffect(() => {
    setScan(true);
    const t = setTimeout(() => setScan(false), 2000);
    return () => clearTimeout(t);
  }, [selected]);

  return (
    <div className="fixed inset-0 bg-[#030712] text-white font-sans overflow-hidden p-4">
      {/* Revolving Border Animation */}
      <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden p-[2px] bg-transparent">
        <div className="absolute inset-0 animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_340deg,#4f46e5_360deg)] rounded-[2.5rem]" />
        
        <div className="absolute inset-[2px] bg-[#030712] rounded-[2.5rem] flex flex-col p-6 md:p-10">
          
          {/* Header Area */}
          <header className="flex justify-between items-center mb-10 shrink-0">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-400 hover:text-white transition">
              <FaArrowLeft /> Back to Dashboard
            </button>
            <div className="flex bg-white/5 p-1 rounded-xl">
              {Object.keys(profiles).map(key => (
                <button key={key} onClick={() => setSelected(key)} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase transition ${selected === key ? 'bg-indigo-600' : 'hover:bg-white/10'}`}>
                  {key}
                </button>
              ))}
            </div>
          </header>

          {/* Immersive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
            
            {/* Pipeline Visualization (Left 8 Columns) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-[#0b1220]/50 border border-white/5 rounded-3xl p-8 flex-1 flex flex-col">
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-8">System Diagnostic Pipeline</h3>
                
                {/* SVG Flow Chart */}
                <div className="flex justify-between items-center px-4 mb-12 relative">
                  {[ {icon: FaTerminal, label: 'OCR'}, {icon: FaMicrochip, label: 'NLP'}, {icon: FaShieldAlt, label: 'Affinity'} ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 z-10">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${scan ? 'border-indigo-500 animate-pulse' : 'border-white/10'}`}>
                        <step.icon size={24} />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest">{step.label}</span>
                    </div>
                  ))}
                  <div className="absolute top-8 left-12 right-12 h-[1px] bg-white/10 -z-0" />
                </div>

                <div className="flex-1 bg-black/40 rounded-2xl p-6 font-mono text-[10px] text-emerald-400 overflow-y-auto">
                  <p>&gt; [SYS] Diagnostic sequence initialized...</p>
                  <p>&gt; [OCR] Scanning token parameters for {profiles[selected].title}...</p>
                  <AnimatePresence>
                    {scan && <motion.p initial={{opacity:0}} animate={{opacity:1}}>&gt; [ANALYSIS] Mapping semantic affinity weightings...</motion.p>}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Verdict Panel (Right 4 Columns) */}
            <div className="lg:col-span-4 bg-[#0d1527] border border-indigo-500/20 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
              <span className="text-[10px] font-black uppercase text-indigo-400">Match Verdict</span>
              <motion.div key={selected} initial={{scale:0.8}} animate={{scale:1}} className="text-8xl font-black italic my-8">
                {profiles[selected].score}<span className="text-3xl">%</span>
              </motion.div>
              <div className="w-full bg-white/5 h-2 rounded-full mb-6">
                <motion.div initial={{width:0}} animate={{width:`${profiles[selected].score}%`}} className="h-full bg-indigo-600 rounded-full" />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed italic">
                {profiles[selected].status === 'VERIFIED' ? "Candidate exceeds technical competency thresholds for deep learning model design." : "Domain mismatch detected. Incompatible semantic fingerprint for active neural stacks."}
              </p>
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

export default NeuralResumeScorer;