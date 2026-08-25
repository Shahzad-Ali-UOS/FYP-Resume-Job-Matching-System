import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/uplink";
import { 
  FaUser, FaEnvelope, FaPhone, FaLock, FaRocket, FaArrowLeft, FaIdCard, 
  FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "", last_name: "", username: "", email: "", phone: "", password: "", confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  
  // States for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState("");

  const checkStrength = (pass) => {
    let score = 0;
    if (pass.length > 6) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    setStrength(score);
    const labels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
    setStrengthLabel(pass.length > 0 ? labels[score - 1] : "");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      checkStrength(e.target.value);
    }
  };

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
        setError("Passwords do not match! ❌");
        return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = form;
      await API.post("users/register/", registerData);
      setShowSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "ENROLLMENT_FAILED: Data conflict detected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* 🌌 Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 blur-[120px] rounded-full"></div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#030712]/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[3rem] p-12 max-w-[450px] w-full text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">
                <FaCheckCircle />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4 italic">Welcome_Aboard!</h2>
              <p className="text-gray-500 font-medium mb-10">Account <b>{form.username}</b> created successfully.</p>
              <button onClick={() => navigate("/login")} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl transition-all">
                Continue to Login
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-[1100px] flex flex-col md:flex-row-reverse overflow-hidden border border-gray-100">
        
        {/* Right Side Info */}
        <div className="w-full md:w-[35%] bg-indigo-600 text-white flex flex-col justify-center items-center text-center p-12">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-4xl mb-8 border border-white/20">
              <FaRocket className="animate-pulse" />
            </div>
            <h1 className="text-4xl font-black mb-6 italic">Join_The_Matrix</h1>
            <p className="text-indigo-100 mb-10 font-medium opacity-80 text-sm">Unlock AI-powered career growth and precise job matching.</p>
            <button onClick={() => navigate("/login")} className="flex items-center gap-2 border-2 border-white/20 px-8 py-3 rounded-2xl font-bold hover:bg-white hover:text-indigo-600 transition-all">
              <FaArrowLeft /> Back to Login
            </button>
        </div>

        {/* Left Side: Form */}
        <div className="flex-1 p-10 md:p-16">
          <div className="mb-10">
            <span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Enrollment Portal</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">Create Account</h2>
          </div>

          {error && (
              <motion.div initial={{ x: -10 }} animate={{ x: 0 }} className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
                  <FaExclamationTriangle /> {error}
              </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative"><FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/><input name="first_name" placeholder="First Name" onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white border border-gray-100 transition-all font-bold text-slate-800" required /></div>
              <div className="relative"><FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/><input name="last_name" placeholder="Last Name" onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white border border-gray-100 transition-all font-bold text-slate-800" required /></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative"><FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/><input name="username" placeholder="Username" onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white border border-gray-100 transition-all font-bold text-slate-800" required /></div>
              <div className="relative"><FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/><input name="phone" placeholder="Phone Number" onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white border border-gray-100 transition-all font-bold text-slate-800" /></div>
            </div>

            <div className="relative"><FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/><input name="email" type="email" placeholder="Email Address" onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white border border-gray-100 transition-all font-bold text-slate-800" required /></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password Field with Toggle */}
                <div className="relative">
                    <FaLock className="absolute left-4 top-[24px] text-gray-400" />
                    <input 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Password" 
                      onChange={handleChange} 
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl outline-none focus:border-indigo-500 border border-gray-100 transition-all font-bold text-slate-800" 
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-[24px] text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                    {form.password && (
                        <div className="mt-3 px-1">
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(strength / 5) * 100}%` }} className={`h-full transition-all duration-500 ${getStrengthColor()}`} />
                            </div>
                            <span className="text-[8px] font-black uppercase text-slate-400 mt-2 block">Strength: {strengthLabel}</span>
                        </div>
                    )}
                </div>

                {/* Confirm Password Field with Toggle */}
                <div className="relative">
                    <FaLock className="absolute left-4 top-[24px] text-gray-400" />
                    <input 
                      name="confirmPassword" 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Confirm" 
                      onChange={handleChange} 
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl outline-none focus:border-indigo-500 border border-gray-100 transition-all font-bold text-slate-800" 
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-[24px] text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                </div>
            </div>

            <button disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl transition-all active:scale-95 mt-4 flex justify-center items-center">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Complete Enrollment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;