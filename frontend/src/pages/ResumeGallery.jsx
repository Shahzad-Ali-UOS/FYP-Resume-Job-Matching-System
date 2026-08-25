import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API, { getUserResumes, deleteResume } from "../api/uplink";
import { 
    FaDownload, FaEdit, FaTrashAlt, FaFileAlt, 
    FaSearch, FaLayerGroup, FaPlus, FaUserGraduate, FaArrowLeft 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function ResumeGallery() {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // 🔑 Identity Sync: Normalize role for strict comparison
    const rawRole = localStorage.getItem("role") || sessionStorage.getItem("role") || "student";
    const userRole = rawRole.replace(/['"]+/g, '').toLowerCase().trim();
    const isAdmin = userRole === "admin";

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            setLoading(true);
            const res = await getUserResumes(); 
            setResumes(res.data);
        } catch (err) {
            console.error("Neural Vault Sync Failed. Connection Refused.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Permanently purge this record from the Neural Matrix?")) {
            try {
                await deleteResume(id);
                setResumes(resumes.filter(r => r.id !== id));
            } catch (err) {
                alert("Purge failed. System protection active.");
            }
        }
    };

    const filteredResumes = resumes.filter(r => 
        (r.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.user_email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.job_title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#030712] p-8 md:p-12 space-y-10 font-sans text-white relative overflow-hidden">
            
            {/* 🌌 Atmospheric Fluid Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
            </div>

            {/* 🔝 STRATEGIC HEADER */}
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4 hover:text-white transition-all"
                    >
                        <FaArrowLeft /> Intelligence Dashboard
                    </button>
                    <h2 className="text-6xl font-black tracking-tighter italic flex items-center gap-4">
                        {isAdmin ? "Talent_Pool" : "Neural_Vault"}
                    </h2>
                    <p className="text-gray-500 font-bold mt-2 uppercase text-[10px] tracking-[0.4em]">
                        {isAdmin ? "Global Synchronized Database" : "Secure Career Identity Storage"}
                    </p>
                </div>

                {/* 🔍 SEARCH MATRIX */}
                <div className="relative w-full md:w-96 group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder={isAdmin ? "Search by student email..." : "Search resume titles..."} 
                        className="w-full pl-12 pr-4 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] outline-none focus:border-indigo-500 transition-all text-xs font-black text-white placeholder:text-gray-700"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* 📄 REPOSITORY GRID */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-indigo-500/50">Accessing Vault...</p>
                </div>
            ) : (
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence>
                        {filteredResumes.map((resume) => (
                            <motion.div 
                                key={resume.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative bg-[#0b1220] border border-white/5 rounded-[2.5rem] p-6 hover:border-indigo-500/40 transition-all duration-500 shadow-2xl"
                            >
                                {/* 🚀 MINI MAP PREVIEW (Visual Insight) */}
                                <div className="aspect-[3/4] bg-[#f8fafc] rounded-3xl mb-6 overflow-hidden relative flex flex-col p-6 group-hover:scale-[1.02] transition-transform duration-500 shadow-inner">
                                    <div className="w-full h-2 bg-slate-200 rounded-full mb-4 opacity-30" style={{ backgroundColor: resume.theme_color || '#6366f1'}}></div>
                                    <div className="space-y-3">
                                        <div className="h-4 w-3/4 bg-slate-200 rounded opacity-10" style={{ backgroundColor: resume.theme_color || '#6366f1'}}></div>
                                        <div className="h-2 w-1/2 bg-slate-100 rounded opacity-40"></div>
                                        <div className="h-2 w-2/3 bg-slate-100 rounded opacity-40"></div>
                                        <div className="h-2 w-1/3 bg-slate-100 rounded opacity-40"></div>
                                    </div>
                                    
                                    <div className="mt-auto flex justify-center opacity-5 group-hover:opacity-20 transition-opacity">
                                        <FaUserGraduate size={100} className="text-slate-900" />
                                    </div>
                                    
                                    {/* 🔘 ACTION OVERLAY (The core requirement) */}
                                    <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3">
                                        <button 
                                            onClick={() => navigate(`/edit-resume/${resume.id}`)}
                                            className="w-[150px] bg-white text-slate-900 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all active:scale-95 shadow-xl"
                                        >
                                            <FaEdit /> {isAdmin ? "Inspect Workspace" : "Launch Editor"}
                                        </button>
                                        
                                        {resume.file && (
                                            <a 
                                                href={resume.file} 
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-[150px] bg-indigo-600 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-xl"
                                            >
                                                <FaDownload /> Download PDF
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* CARD DATA AREA */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-black text-xl tracking-tighter truncate text-white italic capitalize">
                                            {isAdmin ? (resume.user_email?.split('@')[0]) : (resume.title || "Identity_Node")}
                                        </h3>
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 mt-1">
                                            {isAdmin ? resume.user_email : (resume.job_title || "Unclassified Identity")}
                                        </p>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                        <span className="text-[8px] text-gray-700 font-black uppercase tracking-widest">
                                            Ingested: {new Date(resume.created_at || Date.now()).toLocaleDateString()}
                                        </span>
                                        {!isAdmin && (
                                            <button 
                                                onClick={() => handleDelete(resume.id)}
                                                className="text-gray-800 hover:text-red-500 transition-colors"
                                                title="Purge Record"
                                            >
                                                <FaTrashAlt size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* NEW INGESTION NODE (Always visible for students) */}
                    {!isAdmin && (
                        <button 
                            onClick={() => navigate('/edit-resume/${id}')}
                            className="border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-800 hover:text-indigo-500 hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all min-h-[450px] group shadow-inner"
                        >
                            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600/10 transition-all">
                                <FaPlus size={24} />
                            </div>
                            <span className="font-black uppercase tracking-[0.4em] text-[9px]">Add_New_Identity</span>
                        </button>
                    )}
                </div>
            )}

            {/* EMPTY STATE HANDLER */}
            {!loading && filteredResumes.length === 0 && (
                <div className="text-center py-24 bg-white/5 rounded-[3rem] border border-white/5 shadow-inner">
                    <div className="text-indigo-500/20 mb-6 flex justify-center">
                        <FaLayerGroup size={80} />
                    </div>
                    <p className="text-gray-700 font-black uppercase tracking-[0.5em] text-[10px]">Matrix Empty: No Records Located</p>
                    <button onClick={fetchResumes} className="mt-4 text-indigo-400 text-[8px] font-black uppercase hover:underline">Re-Sync System</button>
                </div>
            )}
        </div>
    );
}

export default ResumeGallery;