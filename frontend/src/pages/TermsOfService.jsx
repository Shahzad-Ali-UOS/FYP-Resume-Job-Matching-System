import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaGavel, FaUserCheck, FaRobot, FaExclamationTriangle } from 'react-icons/fa';

const TermsOfService = () => {
  const navigate = useNavigate();

  const clauses = [
    { icon: FaUserCheck, title: "Acceptable Use", text: "By using this platform, you agree to engage solely in professional skill evaluation. Misuse for automated bot activity or unauthorized scraping is strictly prohibited." },
    { icon: FaRobot, title: "Diagnostic Accuracy", text: "AI-generated scores are diagnostic guides, not definitive career outcomes. We advise consulting with career counselors to validate our neural assessments." },
    { icon: FaExclamationTriangle, title: "Limitation of Liability", text: "Access is provided 'as-is'. We disclaim responsibility for incidental damages arising from platform usage or employment decisions based on our output." }
  ];

  return (
    <div className="fixed inset-0 bg-[#030712] text-white p-6 font-sans">
      {/* Revolving Neon Border */}
      <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden p-[2px]">
        <div className="absolute inset-0 animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_340deg,#6366f1_360deg)] opacity-40 rounded-[2.5rem]" />
        
        <div className="absolute inset-[2px] bg-[#030712] rounded-[2.5rem] p-12 overflow-y-auto">
          {/* Header */}
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-400 mb-12 hover:text-white transition">
            <FaArrowLeft /> Exit Terms
          </button>
          
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/30">
                  <FaGavel size={40} className="text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-5xl font-black italic tracking-tighter">Terms of Service</h1>
                  <p className="text-gray-500 font-medium mt-1">Version 1.1.2 | Legal Framework & Usage</p>
                </div>
              </div>
            </motion.div>

            {/* Clauses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {clauses.map((clause, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="bg-white/5 border border-white/5 p-8 rounded-3xl hover:border-indigo-500/30 transition-all group"
                >
                  <clause.icon className="text-indigo-400 mb-6 group-hover:scale-110 transition" size={24} />
                  <h3 className="font-bold text-white mb-3">{clause.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{clause.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 bg-indigo-900/10 p-8 rounded-2xl border border-indigo-500/20">
              <h3 className="text-indigo-400 font-black uppercase text-[10px] mb-2 tracking-widest">Compliance Commitment</h3>
              <p className="text-gray-300 text-sm italic">
                By entering the platform, you acknowledge that your usage is subject to the terms above. We reserve the right to refine these terms as our neural technology evolves, ensuring continued safety and fairness for all users.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin-slow { animation: spin-slow 15s linear infinite; }`}</style>
    </div>
  );
};

export default TermsOfService;