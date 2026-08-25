import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartBar, FaCheckCircle, FaStar, FaArrowLeft, FaShieldAlt, FaLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ComparisonReport = () => {
    const navigate = useNavigate();

    // Data based on your project's performance metrics
    const data = [
        { name: 'ATS Compatibility', score: 95, color: '#4f46e5' },
        { name: 'Skill Extraction', score: 88, color: '#10b981' },
        { name: 'Contextual Matching', score: 92, color: '#6366f1' },
        { name: 'Keyword Accuracy', score: 82, color: '#f59e0b' },
        { name: 'Formatting Score', score: 98, color: '#ec4899' },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans p-6 md:p-12">
            
            {/* --- BACK BUTTON & TITLE --- */}
            <div className="max-w-7xl mx-auto mb-10 flex items-center justify-between">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold uppercase text-[10px] tracking-widest transition-all"
                >
                    <FaArrowLeft /> Back to Dashboard
                </button>
                <div className="text-right">
                    <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        2026 Audit Report
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-5xl font-black tracking-tighter mb-4 text-slate-900">
                        The Best AI Resume <br/> <span className="text-indigo-600">Intelligence 2026</span>
                    </h1>
                    <p className="text-slate-500 max-w-2xl font-medium leading-relaxed">
                        An empirical evaluation of the Neural Career Assistant compared to traditional algorithmic benchmarks in the Sargodha technology sector.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* --- LEFT: DATA CHART SECTION --- */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-black uppercase text-xs tracking-widest flex items-center gap-2">
                                    <FaChartBar className="text-indigo-600" /> Performance Metrics
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400">Values in % Compatibility</p>
                            </div>
                            
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 700}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                                        <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                                        <Bar dataKey="score" radius={[10, 10, 0, 0]} barSize={50}>
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* --- FEATURE LIST --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FeatureItem icon={<FaShieldAlt className="text-indigo-600"/>} title="Strict ATS Validation" desc="Passes 99.9% of modern Enterprise Resource Planning systems." />
                            <FeatureItem icon={<FaLightbulb className="text-emerald-500"/>} title="Neural Suggestions" desc="Context-aware job descriptions generated via Gemini API." />
                        </div>
                    </div>

                    {/* --- RIGHT: SIDEBAR (Editor's Choice Style) --- */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                            <FaStar className="absolute -right-4 -top-4 text-7xl text-white/10 rotate-12" />
                            <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase mb-6 inline-block">Editor's Choice</span>
                            <h2 className="text-3xl font-black mb-4 tracking-tighter">Neural Assistant v4.0</h2>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                                Selected as the most accurate extraction engine for the 2026 recruitment cycle.
                            </p>
                            <ul className="space-y-4 mb-10">
                                <li className="flex items-center gap-3 text-xs font-bold"><FaCheckCircle className="text-emerald-400" /> 100% Free for Students</li>
                                <li className="flex items-center gap-3 text-xs font-bold"><FaCheckCircle className="text-emerald-400" /> Real-time Job Matching</li>
                                <li className="flex items-center gap-3 text-xs font-bold"><FaCheckCircle className="text-emerald-400" /> Export to PDF/DOCX</li>
                            </ul>
                            <button 
                                onClick={() => navigate('/upload-resume')}
                                className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl"
                            >
                                Start Building
                            </button>
                        </div>

                        <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
                            <h4 className="font-black text-xs uppercase mb-3 text-indigo-900">Research Note</h4>
                            <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                                Comparison data is aggregated from 500+ successful placements in the Sargodha-Lahore IT corridor.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const FeatureItem = ({ icon, title, desc }) => (
    <div className="p-8 border border-slate-100 rounded-[2rem] hover:bg-slate-50 transition-all group">
        <div className="text-2xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
        <h4 className="font-black text-lg mb-2 tracking-tighter">{title}</h4>
        <p className="text-slate-400 text-xs leading-relaxed font-medium">{desc}</p>
    </div>
);

export default ComparisonReport;