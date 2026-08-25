import React, { useState } from 'react';
import API from '../api/uplink'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaCloudUploadAlt, FaFilePdf, FaCheckCircle, 
    FaExclamationCircle, FaRocket, FaArrowLeft, FaBriefcase 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function UploadResume() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusMsg, setStatusMsg] = useState("");
    const [status, setStatus] = useState({ type: '', message: '' });

    // 🚀 Constraint Logic: PDF only & Max 2MB
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        setFile(selectedFile);
        setStatus({ type: '', message: '' });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setProgress(10);
        setStatusMsg("Initializing Neural Link...");
        setStatus({ type: '', message: '' });

        const formData = new FormData();
        formData.append("file", file);

        try {
            // Fake progress animation for high-tech UI feel
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev < 30) { setStatusMsg("Scanning Document Structure..."); return prev + 2; }
                    if (prev < 60) { setStatusMsg("Extracting Technical Metadata..."); return prev + 1; }
                    if (prev < 90) { setStatusMsg("Neural Skill Synchronization..."); return prev + 0.5; }
                    return prev;
                });
            }, 150);

            // ✅ POST to your Django ResumeViewSet
            const response = await API.post("users/resume-upload/", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            clearInterval(interval);
            setProgress(100);
            setStatusMsg("Synchronization Complete!");

            // 🔑 Store active resume ID for Job Matching
            if (response.data.id) {
                localStorage.setItem('active_resume_id', response.data.id);
            }

            setStatus({ 
                type: 'success', 
                message: "AI Analysis Complete! Your Identity has been synced." 
            });
            setFile(null);

            // 🚀 Automatic redirect to Job Feed after 2 seconds
            setTimeout(() => navigate('/job-search'), 2000);

        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error.response?.data?.error || "Neural Link Failed. Check server connectivity." 
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-[#f8fafc] flex flex-col items-center justify-center font-sans">
            
            {/* Navigation UI */}
            <div className="fixed top-10 left-10 right-10 flex justify-between items-center">
                <motion.button 
                    whileHover={{ x: -5 }}
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-400 font-black uppercase text-xs tracking-widest hover:text-indigo-600 transition-colors"
                >
                    <FaArrowLeft /> Dashboard
                </motion.button>

                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate('/jobs')}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-indigo-600 font-black uppercase text-xs tracking-widest px-4 py-2 rounded-full shadow-sm hover:border-indigo-600 transition-all"
                >
                    <FaBriefcase /> Job Feed
                </motion.button>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="max-w-2xl w-full"
            >
                <div className="text-center mb-10">
                    <h1 className="text-7xl font-black text-gray-900 tracking-tighter">
                        Neural <span className="text-indigo-600">Scan</span>
                    </h1>
                    <p className="text-gray-400 mt-4 text-lg font-bold uppercase tracking-[0.3em]">
                        Intelligence Portal v2.0
                    </p>
                    
                </div>

                <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.05)] p-12 border border-gray-100 relative overflow-hidden">
                    <form onSubmit={handleUpload} className="space-y-8 relative z-10">
                        
                        <motion.div 
                            className={`relative border-4 border-dashed rounded-[3rem] p-16 transition-all duration-500 flex flex-col items-center justify-center group ${
                                file ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-100 bg-gray-50/30'
                            }`}
                        >
                            <input 
                                type="file" 
                                accept=".pdf" 
                                onChange={handleFileChange} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                            />
                            
                            <AnimatePresence mode="wait">
                                {file ? (
                                    <motion.div key="file" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                                        <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-indigo-200">
                                            <FaFilePdf size={44} />
                                        </div>
                                        <p className="text-gray-900 font-black text-2xl mb-1">{file.name}</p>
                                        <p className="text-indigo-500 font-bold uppercase text-xs tracking-[0.3em]">Ready for Uplink</p>
                                    </motion.div>
                                ) : (
                                    <motion.div key="no-file" className="text-center">
                                        <FaCloudUploadAlt className="text-9xl text-gray-100 mx-auto mb-6 group-hover:text-indigo-100 transition-all duration-700" />
                                        <p className="text-gray-400 font-black text-xl uppercase tracking-widest">Select Resume</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {uploading && (
                            <div className="space-y-4 px-4">
                                <div className="flex justify-between text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">
                                    <span className="animate-pulse">{statusMsg}</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${progress}%` }}
                                        className="bg-indigo-600 h-full rounded-full"
                                    />
                                </div>
                            </div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={!file || uploading}
                            className={`w-full py-8 rounded-[2.5rem] font-black text-xl tracking-widest uppercase transition-all shadow-2xl flex items-center justify-center gap-4 ${
                                !file || uploading 
                                ? 'bg-gray-100 text-gray-300' 
                                : 'bg-slate-900 text-white hover:bg-indigo-600'
                            }`}
                        >
                            {uploading ? "Analyzing..." : "Deploy AI Engine"}
                            <FaRocket className={uploading ? "animate-bounce" : ""} />
                        </motion.button>
                    </form>
                </div>

                <AnimatePresence>
                    {status.message && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className={`mt-8 p-8 rounded-[2.5rem] flex items-center gap-5 font-black text-lg border-2 ${
                                status.type === 'success' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-xl' 
                                : 'bg-red-50 text-red-700 border-red-100'
                            }`}
                        >
                            {status.type === 'success' ? <FaCheckCircle size={32}/> : <FaExclamationCircle size={32}/>}
                            {status.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center mt-12 text-[10px] font-black text-gray-400 uppercase tracking-[0.6em] opacity-50">
                    Sargodha University • Computer Science • 2026
                </p>
            </motion.div>
        </div>
    );
}

export default UploadResume;