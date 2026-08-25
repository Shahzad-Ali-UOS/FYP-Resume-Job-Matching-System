import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/uplink';
import { FaUserGraduate, FaEnvelope, FaCalendarAlt, FaArrowLeft, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StudentDirectory = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // ✅ Hits the new users/students/ endpoint
        API.get("users/students/")
            .then(res => setStudents(res.data))
            .catch(err => console.error("Identity Registry Offline", err))
            .finally(() => setLoading(false));
    }, []);

    const filteredStudents = students.filter(s => 
        s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white p-8 md:p-12 text-slate-900">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase mb-4 hover:text-indigo-600 transition-all">
                            <FaArrowLeft /> Command Hub
                        </button>
                        <h1 className="text-5xl font-black tracking-tighter italic">Student_Nodes</h1>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Verified Institutional Registry</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input 
                            type="text" 
                            placeholder="Filter by name/email..." 
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold text-xs shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 font-black text-indigo-500 animate-pulse tracking-widest uppercase">Fetching_Registry_Data...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredStudents.map((student) => (
                            <motion.div 
                                key={student.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                                className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all group"
                            >
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                        <FaUserGraduate />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-slate-900 leading-tight tracking-tight">{student.username}</h3>
                                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1 italic">Status: Verified</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <div className="flex items-center gap-3 text-slate-500 text-[11px] font-bold">
                                        <FaEnvelope className="text-slate-300" /> {student.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 text-[11px] font-bold">
                                        <FaCalendarAlt className="text-slate-300" /> Member since {new Date(student.date_joined).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
                                    <span className="px-4 py-2 bg-slate-900 text-white text-[8px] font-black uppercase rounded-xl tracking-widest">
                                        Role: {student.role}
                                    </span>
                                    <button className="text-[10px] font-black uppercase text-indigo-600 hover:underline tracking-tighter">Inspect Profile</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDirectory;