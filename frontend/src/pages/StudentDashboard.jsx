import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBrain, FaCheckCircle, FaChartBar, FaHistory, FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const StudentDashboard = () => {
    const navigate = useNavigate();
    

    const skillsData = [ 
        { subject: 'Python', A: 80 }, { subject: 'React', A: 70 }, 
        { subject: 'SQL', A: 90 }, { subject: 'Linux', A: 60 } 
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8 md:p-12">
            {/* --- HEADER --- */}
            <header className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-5">
                    <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
                        <FaBrain size={24}/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight italic text-slate-900">Career_Intelligence</h1>
                        <p className="text-indigo-500 text-[9px] font-black uppercase tracking-widest">Neural Identity Synced</p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    {/* 🏠 NEW: BACK TO HOME BUTTON */}
                    <button 
                        onClick={() => navigate('/')} 
                        className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase hover:bg-slate-200 transition-all flex items-center gap-2"
                    >
                        <FaHome /> Home
                    </button>

                    <button 
                        onClick={() => navigate('/report')} 
                        className="px-6 py-3 bg-indigo-100 text-indigo-600 rounded-xl font-black text-[10px] uppercase hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
                    >
                        <FaChartBar /> Intelligence Report
                    </button>

                    <button 
                        onClick={() => navigate('/history')} 
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase hover:shadow-xl transition-all flex items-center gap-2"
                    >
                        <FaHistory /> History
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- RADAR MATRIX --- */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col items-center shadow-2xl"
                >
                    <h3 className="text-[10px] font-black uppercase text-indigo-400 mb-10 tracking-[0.3em] italic text-center">
                        Neural Skill Matrix_
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={skillsData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10}} />
                                <Radar dataKey="A" stroke="#818cf8" fill="#6366f1" fillOpacity={0.6}/>
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* --- READINESS CHECKLIST --- */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between"
                >
                    <div>
                        <h3 className="text-xl font-black mb-8 italic tracking-tighter text-slate-800">
                            System Readiness_
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4">
                                <FaCheckCircle className="text-emerald-500 text-xl" />
                                <span className="text-[10px] font-black uppercase text-emerald-900">
                                    Resume Neural Extraction
                                </span>
                            </div>
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4 opacity-50">
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                                <span className="text-[10px] font-black uppercase text-slate-400">
                                    AI Interview Simulation
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => navigate('/jobs')}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all"
                    >
                        Access Neural Opportunity Matrix
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default StudentDashboard;