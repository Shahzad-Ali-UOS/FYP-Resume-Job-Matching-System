import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShieldAlt, FaLock, FaUserSecret, FaDatabase } from 'react-icons/fa';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    { icon: FaLock, title: "Encryption Standards", text: "We utilize AES-256 bit encryption for all data-in-transit and at-rest, ensuring your resumes remain shielded from unauthorized third-party access." },
    { icon: FaDatabase, title: "Data Ephemerality", text: "Your analytical sessions are strictly transient. Upon log-out or session expiration, all processed vectors are purged from our active memory banks." },
    { icon: FaUserSecret, title: "Zero-Training Policy", text: "Your personal data is never utilized for large-scale AI training or model refinement. Your resume is a tool for your success, not our data commodity." }
  ];

  return (
    <div className="fixed inset-0 bg-[#030712] text-white p-6 font-sans">
      {/* Revolving Neon Border */}
      <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden p-[2px]">
        <div className="absolute inset-0 animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_340deg,#6366f1_360deg)] opacity-40 rounded-[2.5rem]" />
        
        <div className="absolute inset-[2px] bg-[#030712] rounded-[2.5rem] p-12 overflow-y-auto">
          {/* Header */}
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-400 mb-12 hover:text-white transition">
            <FaArrowLeft /> Exit Policy
          </button>
          
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/30">
                  <FaShieldAlt size={40} className="text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-5xl font-black italic tracking-tighter">Privacy Policy</h1>
                  <p className="text-gray-500 font-medium mt-1">Version 2.0.4 | Data Sovereignty Directive</p>
                </div>
              </div>
            </motion.div>

            {/* Grid Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {sections.map((sec, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="bg-white/5 border border-white/5 p-8 rounded-3xl hover:border-indigo-500/30 transition-all group"
                >
                  <sec.icon className="text-indigo-400 mb-6 group-hover:scale-110 transition" size={24} />
                  <h3 className="font-bold text-white mb-3">{sec.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{sec.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 bg-gradient-to-r from-indigo-900/20 to-transparent p-8 rounded-2xl border-l-2 border-indigo-500">
              <h3 className="text-indigo-400 font-black uppercase text-[10px] mb-2 tracking-widest">Commitment Statement</h3>
              <p className="text-gray-300 italic text-sm">
                "We believe that true AI advancement must be rooted in transparency. Our privacy architecture is designed not just to comply with regulations, but to ensure you maintain absolute agency over your professional footprint."
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin-slow { animation: spin-slow 15s linear infinite; }`}</style>
    </div>
  );
};

export default PrivacyPolicy;