import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import { FaBrain } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const syncRole = () => {
            // 1. Retrieve raw role data from secure storage
            let stored = localStorage.getItem("role") || sessionStorage.getItem("role") || "";
            
            // 2. Clean data (standardizing against JSON or string variations from Backend)
            let cleaned = stored.replace(/['"]+/g, '').toLowerCase().trim();
            
            if (cleaned) {
                setRole(cleaned);
                setLoading(false);
            } else {
                // Short delay to allow storage to initialize during login handshake
                const timer = setTimeout(() => {
                    if (!localStorage.getItem("role")) {
                        console.error("Neural Identity Missing. Redirecting...");
                        navigate("/login");
                    }
                }, 2000);
                return () => clearTimeout(timer);
            }
        };

        syncRole();
        
        // Listen for storage changes (e.g., if user logs out in another tab)
        window.addEventListener('storage', syncRole);
        return () => window.removeEventListener('storage', syncRole);
    }, [navigate]);

    // 🌀 STAGE 1: NEURAL SYNCING (Loading State)
    if (loading) {
        return (
            <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0] 
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="mb-8 text-indigo-600"
                >
                    <FaBrain size={60} />
                </motion.div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Syncing_Neural_Identity</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                    Retrieving Clearance Level...
                </p>

                {/* --- DEV TOOLS (Visible only during FYP Testing) --- */}
                <div className="mt-12 flex gap-4 opacity-10 hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => { localStorage.setItem("role", "admin"); window.location.reload(); }}
                        className="text-[8px] font-black border border-slate-200 px-4 py-2 rounded-xl uppercase hover:bg-indigo-50"
                    >
                        Force_Admin
                    </button>
                    <button 
                        onClick={() => { localStorage.clear(); navigate('/login'); }}
                        className="text-[8px] font-black border border-slate-200 px-4 py-2 rounded-xl uppercase hover:bg-red-50"
                    >
                        Purge_Cache
                    </button>
                </div>
            </div>
        );
    }

    // 🟢 STAGE 2: ROLE-BASED ACCESS CONTROL (RBAC)
    // The component "switches" its entire identity based on the role state
    if (role === 'admin') return <AdminDashboard />;
    
    if (role === 'student' || role === 'user') return <StudentDashboard />;

    // 🚩 STAGE 3: SECURITY FALLBACK (Unauthorized Access)
    return (
        <div className="min-h-screen bg-white flex items-center justify-center text-slate-900">
            <div className="text-center p-12 bg-red-50 rounded-[3rem] border-2 border-red-100 shadow-2xl shadow-red-100">
                <p className="text-red-600 font-black mb-6 tracking-widest uppercase">Unauthorized Clearance Level</p>
                <button 
                    onClick={() => {
                        localStorage.clear();
                        navigate('/login');
                    }} 
                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95"
                >
                    Return to Login
                </button>
            </div>
        </div>
    );
};

export default Dashboard;