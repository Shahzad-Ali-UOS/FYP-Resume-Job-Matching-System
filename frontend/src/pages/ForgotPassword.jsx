import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/uplink";
import { FaEnvelope, FaArrowLeft, FaPaperPlane, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isError, setIsError] = useState(false); 

    const handleResetRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setIsError(false); 

        const formData = new FormData();
        formData.append("email", email);

        try {
            await API.post("users/password-reset/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSubmitted(true);
        } catch (err) {
           
            if (err.response && err.response.status === 404) {
                setIsError(true);
                
                setTimeout(() => setIsError(false), 500);
            } else {
                alert("Neural link failed. Check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-white rounded-[3rem] p-10 md:p-16 max-w-[500px] w-full shadow-2xl border border-gray-100 text-center"
            >
                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.div key="form">
                            <div className="mb-10">
                                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
                                    <FaEnvelope />
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Recover Access</h2>
                                <p className="text-slate-500 font-medium mt-3">Enter your email to receive a neural reset link.</p>
                            </div>

                            <form onSubmit={handleResetRequest} className="space-y-6 text-left">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600 ml-1">Registered Email</label>
                                    
                                    {/* 🚀 SHAKE WRAPPER */}
                                    <motion.div 
                                        animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
                                        transition={{ duration: 0.4 }}
                                        className="relative"
                                    >
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            placeholder="your-email@uos.edu.pk"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if(isError) setIsError(false); // Remove error color as they type
                                            }}
                                            className={`w-full pl-12 pr-4 py-5 bg-gray-50 border rounded-2xl outline-none transition-all font-medium text-slate-900 ${isError ? 'border-red-500 ring-4 ring-red-500/10' : 'border-gray-100 focus:border-indigo-500'}`}
                                            required
                                        />
                                    </motion.div>
                                    
                                    {/* Error Message Text */}
                                    {isError && (
                                        <motion.p 
                                            initial={{ opacity: 0, y: -5 }} 
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 text-[10px] font-bold uppercase tracking-tight flex items-center gap-1 mt-1 ml-1"
                                        >
                                            <FaExclamationTriangle /> Email not found in database
                                        </motion.p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex justify-center items-center gap-3"
                                >
                                    {loading ? "Verifying..." : "Send Reset Link"}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div key="success">
                            {/* Success UI remains the same as before */}
                            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
                                <FaCheckCircle />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4">Email Sent</h2>
                            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                                Link dispatched! Check your inbox to secure your workspace.
                            </p>
                            <button onClick={() => navigate("/login")} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold">Return to Login</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-10 pt-8 border-t border-gray-50">
                    <button onClick={() => navigate("/login")} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-indigo-600 flex items-center justify-center gap-2 mx-auto">
                        <FaArrowLeft /> Back to Login
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default ForgotPassword;