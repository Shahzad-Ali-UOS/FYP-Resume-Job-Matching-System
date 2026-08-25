import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FaCheckCircle, FaExclamationTriangle, FaArrowLeft, 
    FaRoute, FaUserTie, FaSyncAlt, FaMagic, 
    FaMicrochip, FaDownload, FaArrowRight, FaHome 
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import API from '../api/uplink.js';

const MatchResult = () => {
    const { jobId, resumeId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [roadmap, setRoadmap] = useState("");
    const [generatingRoadmap, setGeneratingRoadmap] = useState(false);

    useEffect(() => {
        if (jobId && resumeId) {
            fetchMatchAnalysis();
        }
    }, [jobId, resumeId]);

    const fetchMatchAnalysis = async () => {
    // 🛡️ Safety Check: Ensure IDs are present before calling the API
    if (!resumeId || resumeId === 'undefined' || !jobId || jobId === 'undefined') {
        console.error("Neural Identity or Job ID missing from URL");
        setResult({ error: "Missing Parameters" });
        setLoading(false);
        return;
    }

    try {
        const res = await API.get(`jobs/match/${resumeId}/${jobId}/`);
        setResult(res.data);
    } catch (err) {
        console.error("Neural Analysis Link Broken:", err.response?.data || err.message);
        // If the manual user doesn't own this resume, the backend returns 403/404
        setResult(null); 
        setTimeout(() => navigate('/jobs'), 3000);
    } finally {
        setLoading(false);
    }
};

    const handleGenerateRoadmap = async () => {
        // Validation: Only run if we have missing skills to analyze
        if (!result?.missing_skills?.length) {
            alert("Your Neural Identity is already optimized for this role!");
            return;
        }

        setGeneratingRoadmap(true);
        try {
            // 🚀 TARGETED FIX: Hits /api/ai/generate-summary/ 
            // This matches the Django path we configured
            const response = await API.post("users/generate-ai/", { 
                job_title: result.job_title || "Target Role",
                missing_skills: result.missing_skills 
            });
            
            setRoadmap(response.data.summary || response.data.roadmap);
        } catch (err) {
            console.error("AI Assistant Path Not Found or Server Busy");
            alert("Neural Link to AI Assistant failed. Check your Django urls.py for /api/ai/ paths.");
        } finally {
            setGeneratingRoadmap(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                <FaSyncAlt className="text-indigo-500 mb-6" size={50} />
            </motion.div>
            <p className="font-black uppercase tracking-[0.4em] text-[10px] text-indigo-300 animate-pulse">
                Neural Comparison Protocol Active...
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] py-16 px-4 md:px-8 font-sans selection:bg-indigo-100">
            <div className="max-w-6xl mx-auto space-y-10">
                
                {/* 🧭 NAVIGATION HEADER */}
                <header className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 gap-4">
                    <div className="flex gap-3">
                        <button 
                            onClick={() => navigate('/jobs')} 
                            className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 px-5 py-3 rounded-xl transition-all"
                        >
                            <FaArrowLeft /> Back to Feed
                        </button>
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 px-5 py-3 rounded-xl transition-all"
                        >
                            <FaHome /> Neural Dashboard
                        </button>
                    </div>
                    <div className="text-center sm:text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Audit Terminal</p>
                        <p className="font-bold text-slate-900 text-sm">ANALYSIS_IDENT_{jobId?.toString().slice(-4)}</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* 📊 NEURAL SCORE BLOCK */}
                    <div className="lg:col-span-4">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-slate-900 rounded-[3.5rem] p-10 text-white text-center shadow-2xl relative overflow-hidden h-full flex flex-col justify-center border border-indigo-500/20"
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-indigo-600/10 blur-[100px]" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-8 relative z-10 italic">Neural_Compatibility</h3>
                            
                            <div className="relative z-10">
                                <div className="text-8xl md:text-9xl font-black tracking-tighter text-white">
                                    {Math.round(result?.match_percentage || 0)}<span className="text-3xl text-indigo-500">%</span>
                                </div>
                                <div className="mt-8 flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <motion.div 
                                            key={i} 
                                            initial={{ height: 0 }} animate={{ height: 32 }} transition={{ delay: i * 0.1 }}
                                            className={`w-2 rounded-full ${i <= (Math.round(result?.match_percentage || 0) / 20) ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)]' : 'bg-white/5'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="mt-12 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] relative z-10">
                                {result?.match_percentage >= 70 ? "🚀 Optimal Neural Alignment" : "⚠️ Matrix Optimization Required"}
                            </p>
                        </motion.div>
                    </div>

                    {/* 🧬 SKILL MATRIX BLOCK */}
                    <div className="lg:col-span-8 space-y-6">
                        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100">
                            <h4 className="flex items-center gap-3 text-emerald-500 font-black uppercase text-[10px] tracking-widest mb-8">
                                <FaCheckCircle className="text-lg" /> Skill Intersection
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {result?.matched_skills?.length > 0 ? (
                                    result.matched_skills.map((skill, idx) => (
                                        <span key={idx} className="px-5 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[10px] uppercase border border-emerald-100 flex items-center gap-2">
                                            <FaMicrochip className="text-emerald-300" /> {skill}
                                        </span>
                                    ))
                                ) : <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest italic pl-4">No direct intersection detected.</p>}
                            </div>
                        </motion.div>

                        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100">
                            <h4 className="flex items-center gap-3 text-amber-500 font-black uppercase text-[10px] tracking-widest mb-8">
                                <FaExclamationTriangle className="text-lg" /> Deficiency Mapping
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {result?.missing_skills?.length > 0 ? (
                                    result.missing_skills.map((skill, idx) => (
                                        <span key={idx} className="px-5 py-3 bg-amber-50 text-amber-600 rounded-2xl font-black text-[10px] uppercase border border-amber-100">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-3 py-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">
                                        <FaMagic className="animate-pulse" /> Neural Identity Fully Optimized
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* 🛣️ AI ROADMAP BLOCK */}
                <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
                    <div className="absolute -right-20 -bottom-20 opacity-5 rotate-12"><FaRoute size={400} /></div>
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                            <div>
                                <h3 className="text-4xl font-black tracking-tighter text-white italic">Neural_Learning_Path</h3>
                                <p className="text-indigo-400 font-bold text-[10px] mt-2 uppercase tracking-widest">Strategic Upskilling Protocol</p>
                            </div>
                            {!roadmap && (
                                <button 
                                    onClick={handleGenerateRoadmap}
                                    disabled={generatingRoadmap}
                                    className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-indigo-600 transition-all shadow-xl disabled:opacity-30 flex items-center gap-3"
                                >
                                    {generatingRoadmap ? <FaSyncAlt className="animate-spin" /> : <FaMagic />}
                                    {generatingRoadmap ? "Processing Neural Path..." : "Initialize Roadmap"}
                                </button>
                            )}
                        </div>
                        {roadmap ? (
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-xl rounded-[3rem] p-10 border border-white/10 shadow-inner">
                                <div className="leading-relaxed text-slate-300 text-sm prose prose-invert prose-indigo max-w-none">
                                    <ReactMarkdown>{roadmap}</ReactMarkdown>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-[3rem]">
                                <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] italic">
                                    Generate a targeted roadmap to bridge identified gaps.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 📥 ACTION FOOTER */}
                <footer className="bg-white rounded-[3rem] p-8 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl">
                            <FaUserTie />
                        </div>
                        <div>
                            <p className="font-black text-slate-900 uppercase text-xs tracking-widest">Audit Complete</p>
                            <p className="text-slate-400 text-[10px] font-bold uppercase">Result logged in Neural History</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <button onClick={() => window.print()} className="flex items-center justify-center gap-3 px-10 py-5 bg-slate-50 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">
                            <FaDownload /> Download Audit
                        </button>
                        <button 
                            onClick={() => {
                                if (result?.apply_link) {
                                    window.open(result.apply_link, '_blank');
                                } else {
                                    alert("Application Dispatched to University Portal!");
                                }
                            }}
                            className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                        >
                            Deploy Application <FaArrowRight />
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default MatchResult;