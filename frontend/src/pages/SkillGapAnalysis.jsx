import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChartPie, FaExclamationTriangle, FaCheckCircle, FaBrain } from 'react-icons/fa';

const SkillGapAnalysis = () => {
  const navigate = useNavigate();

  const gapData = [
    { name: "Python", current: 92, required: 95, color: "bg-emerald-500" },
    { name: "Deep Learning", current: 65, required: 90, color: "bg-indigo-500" },
    { name: "Cloud Infrastructure", current: 25, required: 85, color: "bg-rose-500" },
    { name: "Neural Architecture", current: 88, required: 90, color: "bg-emerald-500" },
    { name: "Vector Databases", current: 40, required: 75, color: "bg-amber-500" }
  ];

  return (
    <div className="fixed inset-0 bg-[#030712] text-white p-6 font-sans">
      {/* Revolving Border Container */}
      <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden p-[2px]">
        <div className="absolute inset-0 animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_340deg,#6366f1_360deg)] opacity-40 rounded-[2.5rem]" />
        
        <div className="absolute inset-[2px] bg-[#030712] rounded-[2.5rem] p-10 flex flex-col">
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-400 hover:text-white transition">
              <FaArrowLeft /> Exit Analysis
            </button>
            <h1 className="text-xl font-black tracking-tighter flex items-center gap-3">
              <FaChartPie className="text-indigo-500" /> SKILL_GAP_ANALYSIS_ENGINE
            </h1>
          </header>

          {/* Immersive Dashboard Layout */}
          <div className="grid grid-cols-12 gap-8 flex-1">
            
            {/* Left: Skill Matrix Grid */}
            <div className="col-span-5 space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">Competency Topology</h2>
              <div className="space-y-3">
                {gapData.map((skill, i) => (
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition">
                    <div>
                      <div className="font-bold text-xs">{skill.name}</div>
                      <div className="text-[9px] text-gray-400 uppercase">{skill.current < skill.required ? 'Optimization Needed' : 'Threshold Met'}</div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-lg font-black">{skill.current}%</div>
                      {skill.current < skill.required ? <FaExclamationTriangle className="text-rose-500" /> : <FaCheckCircle className="text-emerald-500" />}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Visualization */}
            <div className="col-span-7 bg-[#0b1220]/50 rounded-3xl border border-white/5 flex flex-col items-center justify-center p-8">
              <div className="relative w-80 h-80 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-dashed border-indigo-500/20 rounded-full" />
                <div className="absolute inset-10 border border-indigo-500/30 rounded-full" />
                <div className="absolute inset-20 border border-indigo-500/50 rounded-full" />
                
                {/* Centerpiece */}
                <div className="w-32 h-32 bg-indigo-600/20 rounded-full flex items-center justify-center animate-pulse border border-indigo-500">
                  <FaBrain size={40} className="text-indigo-400" />
                </div>
                
                {/* Floating Indicator */}
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_15px_#6366f1]" />
                </motion.div>
              </div>
              <p className="mt-12 text-[10px] font-black uppercase tracking-widest text-gray-500">
                Vector space map: Neural mapping efficiency at 84%
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
      `}</style>
    </div>
  );
};

export default SkillGapAnalysis;