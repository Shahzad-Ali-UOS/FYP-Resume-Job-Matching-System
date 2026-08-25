import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/uplink";
import { 
    FaEnvelope, FaLock, FaArrowRight, 
    FaExclamationCircle, FaEye, FaEyeSlash 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from '@react-oauth/google';

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError(""); // Clear error when user types
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const res = await API.post("token/", form);
            // 🚀 Determine storage based on "Remember Me"
            const storage = rememberMe ? localStorage : sessionStorage;

            // 🔑 RBAC LOGIC: Store the role (admin/student)
            const role = res.data.role || "student";
            storage.setItem("role", role);
            storage.setItem("access", res.data.access);
            storage.setItem("refresh", res.data.refresh);
            storage.setItem("email", form.email); 
            storage.setItem("username", res.data.username);
            storage.setItem("first_name", res.data.first_name || res.data.username);
            
            // 🛡️ Bypassing verification check as per your request
            storage.setItem("is_verified", "true");

            // Meta Info for Dashboard
            const now = new Date().toLocaleString('en-US', { 
                weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
            });
            storage.setItem("last_login", now);
            
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const res = await API.post("users/google-login/", {
                token: credentialResponse.credential
            });
            
            const storage = localStorage; // Google users usually persistent

            const role = res.data.role || "student";
            storage.setItem("role", role);
            storage.setItem("access", res.data.access);
            storage.setItem("refresh", res.data.refresh);
            storage.setItem("is_verified", "true");
            storage.setItem("email", res.data.email);
            storage.setItem("first_name", res.data.first_name || res.data.username);
            storage.setItem("username", res.data.username);

            const now = new Date().toLocaleString('en-US', { 
                weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
            });
            storage.setItem("last_login", now);

            navigate("/dashboard");
        } catch (err) {
            setError("Google Authentication failed on server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full"></div>

            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[1000px] min-h-[600px] flex flex-col md:flex-row overflow-hidden border border-gray-100">
                
                {/* --- LEFT PANEL --- */}
                <div className="w-full md:w-[40%] bg-indigo-600 text-white flex flex-col justify-center items-center text-center p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
                    
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl font-black mb-6 tracking-tight">New Here?</h1>
                        <p className="text-indigo-100 mb-10 leading-relaxed font-medium">
                            Join our AI-driven community and discover your true career potential.
                        </p>
                        <button
                            onClick={() => navigate("/register")}
                            className="group flex items-center gap-2 border-2 border-white/50 px-10 py-3 rounded-2xl font-bold hover:bg-white hover:text-indigo-600 transition-all active:scale-95 shadow-lg"
                        >
                            Create Account <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>

                {/* --- RIGHT PANEL (Form) --- */}
                <div className="w-full md:w-[60%] p-12 md:p-20 flex flex-col justify-center bg-white">
                    <div className="mb-10">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Access Hub</h2>
                        <p className="text-slate-400 font-medium mt-2">Resume optimization and job matching awaits.</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600"
                            >
                                <FaExclamationCircle className="shrink-0" />
                                <span className="text-xs font-bold uppercase tracking-tight">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-900"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium text-slate-900"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            <div className="flex justify-between items-center px-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">Keep me synced</span>
                                </label>

                                <button 
                                    type="button"
                                    onClick={() => navigate("/forgot-password")}
                                    className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all active:scale-95 flex justify-center items-center"
                        >
                            {loading ? "Decrypting..." : "Initiate Login"}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black">
                            <span className="bg-white px-4 text-slate-300 tracking-[0.3em]">Neural Bridge</span>
                        </div>
                    </div>

                    <div className="flex justify-center scale-110">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError("Google Handshake Failed")}
                            useOneTap
                            theme="filled_blue"
                            shape="pill"
                            text="signin_with"
                        />
                    </div>
                    
                    <p className="mt-8 text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">
                        Neural Security Protocol Active
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;