import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaShieldAlt, FaUsers, FaDatabase, FaChartLine, 
    FaPlus, FaSignOutAlt, FaHome, FaSyncAlt, FaArrowRight 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import API from '../api/uplink';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total_students: 0, total_jobs: 0, total_resumes: 0, avg_score: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ✅ Real-time Data Fetching from Django Backend
        API.get("jobs/dashboard-stats/")
            .then(res => setStats(res.data))
            .catch(err => console.error("Neural Link Refused", err))
            .finally(() => setLoading(false));
    }, []);

    const containerVars = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVars = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) return (
        <div className="h-screen bg-white flex flex-col items-center justify-center text-indigo-600 font-black tracking-widest">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="text-4xl mb-4"
            >
                <FaSyncAlt />
            </motion.div>
            SYNCING_ADMIN_CORE...
        </div>
    );

    return (
        <motion.div 
            initial="hidden" animate="visible" variants={containerVars}
            className="min-h-screen bg-white text-slate-900 p-6 md:p-12 relative overflow-hidden"
        >
            {/* 🌌 Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 blur-[150px] -z-10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 blur-[120px] -z-10 rounded-full"></div>

            {/* --- TOP NAV BAR --- */}
            <motion.div variants={itemVars} className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2.5rem] mb-12 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-lg shadow-indigo-100">
                        <FaShieldAlt size={24}/>
                    </div>
                    <div>
                        <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Command_Hub</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UOS Institutional Intelligence</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3">
                    <button onClick={() => navigate('/')} className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-600 rounded-xl font-black uppercase text-[10px] transition-all border border-slate-200 flex items-center gap-2 shadow-sm">
                        <FaHome /> Home
                    </button>
                    <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="px-5 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl font-black uppercase text-[10px] transition-all border border-red-100 flex items-center gap-2">
                        <FaSignOutAlt /> Terminate
                    </button>
                </div>
            </motion.div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                
                {/* 👥 STUDENT NODES */}
                <motion.div whileHover={{ y: -5 }} onClick={() => navigate('/student-directory')} className="cursor-pointer">
                    <StatCard icon={<FaUsers />} label="Student Nodes" value={stats.total_students} color="text-blue-500" bg="bg-blue-50" />
                </motion.div>
                
                {/* 🚀 JOB INVENTORY */}
                <motion.div whileHover={{ y: -5 }} onClick={() => navigate('/job-inventory')} className="cursor-pointer">
                    <StatCard icon={<FaDatabase />} label="Job Inventory" value={stats.total_jobs} color="text-indigo-500" bg="bg-indigo-50" />
                </motion.div>

                {/* 📈 MATCH CYCLES (Fixed Linkage) */}
                <div 
                    onClick={() => navigate('/history')} 
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate('/history')}
                    className="w-full cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                >
                    <StatCard icon={<FaChartLine />} label="Match Cycles" value={stats.total_resumes} color="text-emerald-500" bg="bg-emerald-50" />
                </div>

                {/* 🛡️ SYSTEM PULSE */}
                <StatCard icon={<FaShieldAlt />} label="System Pulse" value="Online" color="text-amber-500" bg="bg-amber-50" />
            </div> {/* 👈 FIXED: Added missing closing tag for Stats Grid */}

            {/* --- OPERATIONS AREA --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* PRIMARY MODULE: THE ARCHITECT */}
                <motion.div 
                    variants={itemVars}
                    whileHover={{ y: -5 }}
                    onClick={() => navigate('/create-job')}
                    className="lg:col-span-2 bg-slate-900 p-12 rounded-[3.5rem] cursor-pointer group relative overflow-hidden shadow-2xl shadow-indigo-100"
                >
                    <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000 text-white">
                        <FaPlus size={300} />
                    </div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-4 block italic">Operation: Ingestion</span>
                        <h2 className="text-5xl font-black mb-6 italic tracking-tighter text-white">Job Architect_</h2>
                        <p className="text-slate-400 max-w-lg mb-10 text-sm leading-relaxed font-medium">
                            Create manual job listings or trigger the Llama-3 synchronized scraper to automatically ingest roles from the global matrix.
                        </p>
                        <div className="inline-flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest group-hover:bg-white group-hover:text-indigo-600 transition-all shadow-xl">
                            Launch Architect <FaPlus />
                        </div>
                    </div>
                </motion.div>

                {/* SECONDARY MODULE: THE DIRECTORY */}
                <motion.div 
                    variants={itemVars}
                    whileHover={{ y: -5 }}
                    onClick={() => navigate('/student-directory')}
                    className="bg-white p-10 rounded-[3rem] border border-slate-100 cursor-pointer group flex flex-col justify-between hover:border-blue-200 transition-all shadow-xl shadow-slate-100"
                >
                    <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 text-3xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                        <FaUsers />
                    </div>
                    <div className="mt-8">
                        <h3 className="text-2xl font-black italic mb-2 tracking-tighter text-slate-900">Student Directory</h3>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">
                            Audit the registered user base. Inspect institutional nodes and manage verified student identities.
                        </p>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 tracking-widest group-hover:translate-x-2 transition-transform">
                        Explore Registry <FaArrowRight />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

// Internal StatCard Component (Stateless)
const StatCard = ({ icon, label, value, color, bg }) => (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group h-full">
        <div className={`${bg} ${color} w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
            {icon}
        </div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
        <h3 className="text-4xl font-black italic tracking-tighter text-slate-900">{value}</h3>
    </div>
);

export default AdminDashboard;