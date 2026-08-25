import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/uplink"; 
import { 
  FaMagic, FaRobot, FaSyncAlt, FaTrash, FaLink, FaGlobe
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function CreateJob() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    location: "",
    job_type: "Full-time",
    description: "",
    requirements: "",
    skills_required: [], 
    salary_range: "",
    experience_level: "Senior",
    apply_link: "",   
    source: "External" 
  });

  useEffect(() => {
    const rawRole = localStorage.getItem("role") || sessionStorage.getItem("role") || "";
    const cleanRole = rawRole.replace(/['"]+/g, '').toLowerCase().trim();
    setRole(cleanRole === 'admin' ? 'admin' : 'denied');
  }, []);

  const handleNeuralSync = async () => {
    if (!aiPrompt) return setMessage({ text: "Enter a domain to sync.", type: "error" });
    setIsFetching(true);
    setMessage({ text: "Establishing Neural Link...", type: "success" });

    try {
        const res = await API.post("jobs/sync-jobs/", { search: aiPrompt });
        setMessage({ text: res.data.message, type: "success" });
    } catch (err) {
        setMessage({ text: "Sync Failed: Connection refused.", type: "error" });
    } finally { setIsFetching(false); }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt) return setMessage({ text: "Enter a job title first.", type: "error" });
    
    setIsGenerating(true);
    try {
      const res = await API.post('jobs/generate-ai/', { prompt: aiPrompt });
      
      setFormData({
        title: res.data.title || aiPrompt,
        company_name: res.data.company_name || "Enterprise AI",
        location: res.data.location || "Sargodha, Pakistan",
        job_type: res.data.job_type || "Full-time",
        description: res.data.description || "",
        requirements: res.data.requirements || "", 
        skills_required: res.data.skills_required || [], 
        salary_range: res.data.salary_range || "Negotiable",
        experience_level: res.data.experience_level || "Junior",
        apply_link: res.data.apply_link || "", 
        source: res.data.source || "AI Generated"
      });

      setMessage({ text: "Neural Architecture Injected! ✅", type: "success" });
    } catch (err) {
      setMessage({ text: "AI Generation failed.", type: "error" });
    } finally { setIsGenerating(false); }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills_required.includes(skillInput.trim())) {
      setFormData({ ...formData, skills_required: [...formData.skills_required, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setFormData({ ...formData, skills_required: formData.skills_required.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.skills_required.length === 0) return setMessage({ text: "Skills Matrix required.", type: "error" });
    
    setLoading(true);
    try {
      await API.post("jobs/create/", formData);
      setMessage({ text: "Position Published to Matrix! ✅", type: "success" });
      setTimeout(() => navigate('/job-inventory'), 2000);
    } catch (error) {
      setMessage({ text: "Protocol Error. Check backend fields.", type: "error" });
    } finally { setLoading(false); }
  };

  if (role === 'denied') return <div className="h-screen bg-white flex items-center justify-center font-black">ACCESS_DENIED</div>;

  return (
    <div className="min-h-screen bg-white py-20 px-8 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* TOP DUAL PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <FaRobot className="absolute -right-6 -bottom-6 text-white/5 text-[12rem]" />
                <h2 className="text-2xl font-black mb-4 italic flex items-center gap-3"><FaMagic className="text-indigo-400" /> AI Architect_</h2>
                <div className="flex gap-3 relative z-10">
                    <input value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="e.g. Software Engineer" className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-400 text-sm font-bold" />
                    <button onClick={handleAIGenerate} disabled={isGenerating} className="bg-indigo-600 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-indigo-600 transition-all">
                        {isGenerating ? "MAPPING..." : "DRAFT"}
                    </button>
                </div>
            </div>

            <div className="bg-blue-50 p-10 rounded-[3rem] border border-blue-100 shadow-xl text-center">
                <h2 className="text-2xl font-black mb-4 italic text-blue-900 flex items-center justify-center gap-3"><FaSyncAlt className={isFetching ? "animate-spin" : ""} /> Matrix Sync_</h2>
                <button onClick={handleNeuralSync} disabled={isFetching} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg">
                    {isFetching ? "ESTABLISHING LINK..." : `FETCH ${aiPrompt.toUpperCase() || 'GLOBAL'} ROLES`}
                </button>
            </div>
        </div>

        {/* FORM SECTION */}
        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 p-8 md:p-16">
            <AnimatePresence>
                {message.text && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className={`mb-10 p-6 rounded-2xl border-2 font-black text-xs uppercase ${message.type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* COLUMN 1: CORE IDENTITY */}
                <div className="space-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.3em]">Position Identity</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full bg-transparent border-b-2 border-slate-100 py-4 font-black text-3xl outline-none focus:border-indigo-600 transition-all" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                      <input value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} placeholder="Company" className="bg-slate-50 p-4 rounded-xl font-bold text-sm" />
                      <input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Location" className="bg-slate-50 p-4 rounded-xl font-bold text-sm" />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.3em]">Primary Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="8" className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl outline-none focus:bg-white transition-all text-sm" placeholder="Core duties and role details..." />
                    </div>
                </div>

                {/* COLUMN 2: PARAMETERS & LINKS */}
                <div className="space-y-10">
                    {/* APPLY LINK SECTION */}
                    <div className="bg-indigo-50 p-8 rounded-[2.5rem] space-y-4 border border-indigo-100">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-600 tracking-[0.3em]">
                          <FaLink /> External Application Link
                        </label>
                        <input 
                          type="url" 
                          value={formData.apply_link} 
                          onChange={(e) => setFormData({...formData, apply_link: e.target.value})} 
                          placeholder="https://company.com/apply" 
                          className="w-full bg-white p-4 rounded-xl font-bold text-sm border border-indigo-200 outline-none focus:ring-2 ring-indigo-400" 
                        />
                        
                        <div className="flex items-center gap-4 pt-2">
                           <FaGlobe className="text-indigo-400" />
                           <input 
                            value={formData.source} 
                            onChange={(e) => setFormData({...formData, source: e.target.value})} 
                            placeholder="Source (e.g. Internal, LinkedIn)" 
                            className="bg-transparent border-b border-indigo-200 text-xs font-bold outline-none flex-1"
                           />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.3em]">Skill Matrix</label>
                        <div className="flex gap-2">
                            <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 outline-none" placeholder="Add a skill..." />
                            <button type="button" onClick={addSkill} className="bg-slate-900 text-white px-6 rounded-xl font-bold">+</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.skills_required.map((skill, i) => (
                                <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase border border-indigo-100 flex items-center gap-2">
                                    {skill} <FaTrash size={10} onClick={() => removeSkill(i)} className="cursor-pointer hover:text-red-500" />
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <input value={formData.salary_range} onChange={(e) => setFormData({...formData, salary_range: e.target.value})} placeholder="Salary (e.g. 80k)" className="bg-slate-50 p-4 rounded-xl font-bold text-sm" />
                        <select value={formData.experience_level} onChange={(e) => setFormData({...formData, experience_level: e.target.value})} className="bg-slate-50 p-4 rounded-xl font-bold text-xs">
                            <option value="Junior">Junior</option>
                            <option value="Mid-Level">Mid-Level</option>
                            <option value="Senior">Senior</option>
                            <option value="Lead">Lead</option>
                        </select>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] text-white hover:bg-slate-900 transition-all shadow-xl">
                        {loading ? "INGESTING..." : "PUBLISH POSITION"}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}

export default CreateJob;