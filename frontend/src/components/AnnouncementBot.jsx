import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaArrowRight, FaChartLine, FaBriefcase, FaHandPaper } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Typewriter from 'typewriter-effect';

function AnnouncementBot({ forceOpen, setForceOpen }) {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [isWaving, setIsWaving] = useState(false);

    const data = {
        id: 'neural-match-alert-01',
        title: 'High-Value Neural Match',
        description: 'AI has detected a 94% compatibility with a new Python Architect role.',
        company: 'UOS Neural Systems',
        match: '94%',
        link: '/jobs',
    };

    // 1. 🌊 SCROLL TRIGGER: Updated to respect manual dismissal
    useEffect(() => {
        const handleScroll = () => {
            // Check if the user has already clicked 'X' in this session
            const isDismissed = localStorage.getItem('bot_manually_closed');

            if (window.scrollY > 100 && !isVisible && !isDismissed) {
                setIsVisible(true);
                setIsWaving(true);
                // Stop waving after 3 seconds
                setTimeout(() => setIsWaving(false), 3000);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isVisible]);

   // 2. 🔔 BELL TRIGGER: Re-opens and resets the parent trigger
    useEffect(() => {
        if (forceOpen) {
            localStorage.removeItem('bot_manually_closed'); // Clear the "hide" memory
            setIsVisible(true);
            setIsWaving(true);
            
            if (setForceOpen) {
                setTimeout(() => setForceOpen(false), 100); 
            }
            
            setTimeout(() => setIsWaving(false), 3000);
        }
    }, [forceOpen, setForceOpen]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('bot_manually_closed', 'true'); // Save dismissal to storage
        if (setForceOpen) setForceOpen(false); // Reset the bell trigger
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 100, y: 100 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="fixed bottom-10 right-10 z-[1000] flex flex-col items-end gap-4"
                >
                    {/* --- THE BUBBLE --- */}
                    <motion.div 
                        className="relative p-8 bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-[3rem] rounded-br-none shadow-[0_30px_60px_rgba(0,0,0,0.6)] max-w-[350px] overflow-hidden group"
                    >
                        <button onClick={handleDismiss} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors z-20">
                            <FaTimes size={14} />
                        </button>

                        <div className="relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2 block">Agent Alert</span>
                            <h3 className="text-xl font-black text-white leading-tight mb-6">
                                <Typewriter
                                    options={{
                                        strings: ['Neural Match Found', 'Identity Sync Complete', 'New Career Path'],
                                        autoStart: true, loop: true, delay: 50
                                    }}
                                />
                            </h3>

                            <div className="bg-white/5 border border-white/5 p-5 rounded-2xl mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-emerald-400 font-black text-xl">{data.match}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none">Match Score</span>
                                </div>
                                <p className="text-slate-400 text-[11px] italic">"{data.description}"</p>
                            </div>

                            <button 
                                onClick={() => navigate(data.link)}
                                className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
                            >
                                Analyze <FaArrowRight size={10} />
                            </button>
                        </div>
                    </motion.div>

                    {/* --- ROBOT AGENT WITH WAVE --- */}
                    <div className="relative mr-4">
                        <motion.div 
                            animate={{ 
                                y: [0, -10, 0],
                                rotate: isWaving ? [0, -15, 15, -15, 0] : [0, 2, 0]
                            }}
                            transition={{ 
                                repeat: isWaving ? 2 : Infinity, 
                                duration: isWaving ? 0.5 : 4 
                            }}
                            className="w-20 h-20 bg-slate-900 border-4 border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 shadow-2xl relative"
                        >
                            <FaRobot size={36} />
                            
                            {/* Wave Hand Overlay */}
                            {isWaving && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute -top-4 -right-2 text-yellow-400 text-2xl"
                                >
                                    <FaHandPaper className="animate-bounce" />
                                </motion.div>
                            )}
                        </motion.div>
                        <div className="absolute -left-10 -top-2 bg-indigo-600 px-4 py-1 rounded-full text-[9px] font-black text-white shadow-lg uppercase tracking-widest border border-white/20">
                            Neural
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default AnnouncementBot;