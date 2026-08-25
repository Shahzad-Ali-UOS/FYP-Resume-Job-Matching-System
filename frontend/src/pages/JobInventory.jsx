import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/uplink';
import { FaTrash, FaBriefcase, FaBuilding, FaMapMarkerAlt, FaArrowLeft, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const JobInventory = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            // Uses the same ListCreateAPIView but for Admins it returns their jobs
            const res = await API.get("jobs/create/"); 
            setJobs(res.data);
        } catch (err) {
            console.error("Vault access denied");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Permanently delete this job from the database?")) {
            try {
                await API.delete(`jobs/delete/${id}/`);
                setJobs(jobs.filter(job => job.id !== id));
            } catch (err) {
                alert("Delete failed.");
            }
        }
    };

    const filteredJobs = jobs.filter(j => 
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white p-8 md:p-12 text-slate-900">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase mb-4 hover:text-indigo-600 transition-all">
                            <FaArrowLeft /> Command Hub
                        </button>
                        <h1 className="text-5xl font-black tracking-tighter italic">Job_Inventory</h1>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Database Management & Records Purge</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input 
                            type="text" 
                            placeholder="Filter by title/company..." 
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold text-xs"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 font-black text-indigo-500 animate-pulse uppercase tracking-widest">Accessing_Database...</div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence>
                            {filteredJobs.map((job) => (
                                <motion.div 
                                    key={job.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between hover:shadow-xl transition-all group"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">
                                            <FaBriefcase />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-slate-900 leading-tight">{job.title}</h3>
                                            <div className="flex gap-4 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1"><FaBuilding /> {job.company_name}</span>
                                                <span className="flex items-center gap-1"><FaMapMarkerAlt /> {job.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right mr-4 hidden md:block">
                                            <p className="text-[9px] font-black text-slate-300 uppercase">Created On</p>
                                            <p className="text-xs font-bold text-slate-500">{new Date(job.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(job.id)}
                                            className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobInventory;