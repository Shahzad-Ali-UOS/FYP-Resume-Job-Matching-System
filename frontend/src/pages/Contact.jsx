import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaPaperPlane, FaEnvelope, FaUser, FaCommentDots, 
    FaMapMarkerAlt, FaStar, FaArrowLeft, FaSync 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API from '../api/uplink';

const Contact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [rating, setRating] = useState(0); 
    const [hover, setHover] = useState(0);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    // 🚀 Reset scroll position when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // 🕒 Auto-clear status messages
    useEffect(() => {
        if (status.msg) {
            const timer = setTimeout(() => setStatus({ type: '', msg: '' }), 5000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 🛡️ Ensure a rating is provided
        if (rating === 0) {
            setStatus({ type: 'error', msg: 'Please select a Neural Rating' });
            return;
        }

        setLoading(true);
        try {
            // Uplink to Django backend
            await API.post("users/contact/", { ...formData, rating });
            
            setStatus({ type: 'success', msg: 'Neural Message Transmitted!' });
            
            // Reset form on success
            setFormData({ name: '', email: '', message: '' });
            setRating(0);
        } catch (err) {
            setStatus({ type: 'error', msg: 'Uplink failed. Check connection.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#030712] min-h-screen text-white pt-32 pb-20 px-6 font-sans relative overflow-hidden">
            
            {/* 🌌 Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10"></div>

            {/* Back Button */}
            <button 
                onClick={() => navigate('/')}
                className="fixed top-10 left-10 z-50 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-400 transition-all bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-xl"
            >
                <FaArrowLeft /> Back to Home
            </button>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
                
                {/* --- FORM SECTION --- */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    className="bg-[#0b1220] p-10 md:p-16 rounded-[3.5rem] border border-white/5 shadow-2xl relative"
                >
                    <h2 className="text-6xl font-black mb-4 italic tracking-tighter">Get In <span className="text-indigo-600">Touch_</span></h2>
                    <p className="text-gray-500 mb-10 font-bold uppercase text-[10px] tracking-[0.3em]">Direct Neural Communication Link</p>
                    
                    {/* STAR RATING SYSTEM */}
                    <div className="mb-10 p-8 bg-indigo-500/5 rounded-[2rem] border border-indigo-500/10 flex flex-col items-center md:items-start gap-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Rate our AI Experience:</span>
                        <div className="flex gap-3">
                            {[...Array(5)].map((_, i) => {
                                const ratingValue = i + 1;
                                return (
                                    <label key={i} className="relative">
                                        <input 
                                            type="radio" 
                                            className="hidden" 
                                            value={ratingValue} 
                                            onClick={() => setRating(ratingValue)} 
                                        />
                                        <FaStar 
                                            className="cursor-pointer transition-all duration-300 transform hover:scale-125" 
                                            color={ratingValue <= (hover || rating) ? "#6366f1" : "#111827"} 
                                            size={32}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(0)}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                            <FaUser className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-indigo-500 transition-colors" />
                            <input required type="text" placeholder="Identity Name" className="w-full bg-[#030712] border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all placeholder:text-gray-800" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="relative group">
                            <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-indigo-500 transition-colors" />
                            <input required type="email" placeholder="Communication Email" className="w-full bg-[#030712] border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all placeholder:text-gray-800" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div className="relative group">
                            <FaCommentDots className="absolute left-6 top-6 text-gray-700 group-focus-within:text-indigo-500 transition-colors" />
                            <textarea required rows="4" placeholder="Transmit your inquiry..." className="w-full bg-[#030712] border border-white/5 rounded-2xl py-6 pl-16 pr-8 text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all resize-none placeholder:text-gray-800" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                        </div>
                        
                        <button 
                            disabled={loading} 
                            className="w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-[0_0_40px_rgba(99,102,241,0.2)] flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <FaSync className="animate-spin" /> : <>Initialize Uplink <FaPaperPlane /></>}
                        </button>

                        <AnimatePresence>
                            {status.msg && (
                                <motion.p 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`text-center font-black text-[9px] uppercase tracking-widest mt-4 ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}
                                >
                                    {status.msg}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>

                {/* --- LOCATION SECTION --- */}
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                    <div className="flex items-start gap-6 bg-white/5 p-10 rounded-[3rem] border border-white/5">
                        <div className="bg-indigo-600/20 p-5 rounded-3xl text-indigo-500">
                            <FaMapMarkerAlt size={30} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tighter italic">CS Department_</h3>
                            <p className="font-bold text-indigo-500/50 uppercase text-[9px] tracking-[0.4em] mb-4">University of Sargodha</p>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                Department of Computer Science & Information Technology,<br/>
                                Sargodha, Punjab, Pakistan.
                            </p>
                        </div>
                    </div>

                    {/* INTERACTIVE MAP */}
                    <div className="w-full h-[450px] rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 group">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.344445353526!2d72.6841723!3d32.0747443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3921770000000001%3A0x67343e746a5b485!2sUniversity%20of%20Sargodha!5e0!3m2!1sen!2spk!4v1700000000000"
                            width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy">
                        </iframe>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;