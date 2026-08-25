import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API, { updateProfile } from "../api/uplink";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { 
    FaBrain, FaSave, FaCamera, FaExclamationTriangle, 
    FaTimes, FaSkull, FaTrashAlt, FaStar, FaCheckCircle, 
    FaExclamationCircle, FaDownload, FaLinkedin, FaGithub, FaMapMarkerAlt, FaPhone 
} from "react-icons/fa";

// 🚀 REUSABLE PREVIEW COMPONENT (The PDF Source)
const ResumeHeaderPreview = ({ data, innerRef }) => {
    const getImageUrl = () => {
        if (!data.profile_image) return null;
        if (data.profile_image instanceof File) return URL.createObjectURL(data.profile_image);
        if (typeof data.profile_image === 'string') {
            return data.profile_image.startsWith('http') 
                ? data.profile_image 
                : `http://127.0.0.1:8000${data.profile_image}`;
        }
        return null;
    };

    return (
        <div ref={innerRef} className="bg-white p-10 border shadow-sm rounded-xl font-serif text-slate-800 sticky top-10 h-max min-h-[550px]">
            <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full border-2 border-slate-900 flex items-center justify-center overflow-hidden text-slate-900">
                    {data.profile_image ? (
                        <img src={getImageUrl()} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-3xl font-bold">{data.first_name?.[0] || 'N'}{data.last_name?.[0] || 'U'}</span>
                    )}
                </div>
            </div>
            
            <h2 className="text-4xl font-bold uppercase tracking-tighter text-center border-b-4 border-slate-900 pb-3 mb-4 text-slate-900">
                {data.first_name || "Neural"} {data.last_name || "User"}
            </h2>

            <div className="flex justify-center gap-6 mb-4 text-slate-900">
                {data.linkedin_url && <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"><FaLinkedin className="text-indigo-600"/> LinkedIn</div>}
                {data.github_url && <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"><FaGithub/> GitHub</div>}
            </div>
            
            <div className="text-center text-xs space-y-1 mb-6 flex flex-wrap justify-center gap-x-6 italic text-slate-900 font-bold border-t border-slate-100 pt-4">
                {data.location && <span className="flex items-center gap-1"><FaMapMarkerAlt size={10}/> {data.location}</span>}
                {data.phone && <span className="flex items-center gap-1"><FaPhone size={10}/> {data.phone}</span>}
                {data.email && <span>✉️ {data.email}</span>}
            </div>
            
            <div className="mt-6">
                <h3 className="text-[10px] font-black uppercase mb-2 text-slate-900 tracking-widest border-l-4 border-slate-900 pl-2">Professional Summary</h3>
                <p className="text-xs leading-relaxed text-slate-600 text-justify">
                    {data.bio || "Your professional bio will synchronize here as you update your profile..."}
                </p>
            </div>

            <div className="mt-8">
                <h3 className="text-[10px] font-black uppercase mb-3 text-slate-900 tracking-widest border-l-4 border-slate-900 pl-2">Neural Core Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {data.skills ? data.skills.split(',').map((s, i) => (
                        <span key={i} className="text-[9px] px-3 py-1.5 bg-slate-900 text-white rounded font-bold uppercase tracking-tighter shadow-sm">
                            {s.trim()}
                        </span>
                    )) : <span className="text-[9px] text-slate-300 italic">No skills synchronized yet...</span>}
                </div>
            </div>
        </div>
    );
};

function Profile() {
    const navigate = useNavigate();
    const resumeRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [profile, setProfile] = useState({
        first_name: "", last_name: "", phone: "", bio: "",
        job_title: "", location: "", email: "", username: "",
        linkedin_url: "", github_url: "",
        skills: "", profile_image: null, role: ""
    });

    const [skillInput, setSkillInput] = useState("");
    const [skillsArray, setSkillsArray] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [rating, setRating] = useState(0);
    
    // 🚀 EXIT INTELLIGENCE STATE
    const [exitData, setExitData] = useState({
        reason: "",
        best_feature: "Resume Analyzer",
        problems: "",
        suggestions: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("users/profile/");
                setProfile(res.data);
                if (res.data.skills) setSkillsArray(res.data.skills.split(',').filter(s => s.trim() !== ""));
            } catch (err) { console.error("Fetch error:", err); }
        };
        fetchProfile();
    }, []);

    const downloadPDF = async () => {
        setIsDownloading(true);
        const element = resumeRef.current;
        const canvas = await html2canvas(element, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(`${profile.first_name || 'Neural'}_Profile_Export.pdf`);
        setIsDownloading(false);
    };

    const tasks = [
        { label: "Identity Bio", done: profile.bio?.length > 10 },
        { label: "Neural Skills", done: skillsArray.length > 0 },
        { label: "Profile Photo", done: !!profile.profile_image },
        { label: "Social Bridge", done: !!profile.linkedin_url || !!profile.github_url },
        { label: "Contact Points", done: !!profile.phone && !!profile.location }
    ];
    const progress = Math.round((tasks.filter(t => t.done).length / tasks.length) * 100);

    const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!skillsArray.includes(skillInput.trim())) {
                const newSkills = [...skillsArray, skillInput.trim()];
                setSkillsArray(newSkills);
                setProfile({ ...profile, skills: newSkills.join(',') });
            }
            setSkillInput("");
        }
    };

    const removeSkill = (skill) => {
        const newSkills = skillsArray.filter(s => s !== skill);
        setSkillsArray(newSkills);
        setProfile({ ...profile, skills: newSkills.join(',') });
    };

    const handleSave = async () => {
        const formData = new FormData();
        const protectedFields = ['email', 'username', 'role', 'id'];

        Object.keys(profile).forEach(key => {
            if (key === 'profile_image') {
                if (profile[key] instanceof File) formData.append(key, profile[key]);
            } else if (!protectedFields.includes(key) && profile[key] !== null) {
                formData.append(key, profile[key]);
            }
        });

        try {
            const res = await updateProfile(formData);
            setProfile(res.data);
            alert("Neural Identity Synchronized! 🚀");
        } catch (err) { alert("Sync Failed. Ensure all data is valid."); }
    };

    // 🚀 UPDATED PURGE HANDLER WITH FEEDBACK
    const handlePurgeAccount = async () => {
        setIsDeleting(true);
        try {
            await API.post("users/deactivate-feedback/", { 
                ...exitData, 
                rating 
            });
            localStorage.clear();
            sessionStorage.clear();
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            alert("Purge failed. Connection unstable.");
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] p-4 md:p-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* --- HUB SECTION (LEFT) --- */}
                <div className="lg:col-span-7 space-y-8">
                    
                    {/* DYNAMIC CHECKLIST */}
                    <AnimatePresence>
                        {progress < 100 && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0, marginTop: 0 }} className="bg-indigo-600/10 border border-indigo-500/30 p-6 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-2">
                                        <FaBrain className="text-indigo-400"/> Optimization Checklist
                                    </h3>
                                    <span className="text-indigo-400 font-black text-xs">{progress}% Complete</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {tasks.map((t, i) => (
                                        <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl border text-[10px] font-black uppercase transition-all ${t.done ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-gray-500'}`}>
                                            {t.done ? <FaCheckCircle/> : <FaExclamationCircle/>} {t.label}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-100">
                        <header className="mb-10 flex justify-between items-center text-slate-900">
                            <div>
                                <h1 className="text-3xl font-black tracking-tighter">Neural Identity Hub</h1>
                                <p className="text-slate-400 font-medium mt-1">Manage your master career data.</p>
                            </div>
                            <div className="relative group">
                                <div className="w-20 h-20 bg-indigo-50 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-indigo-600 text-2xl font-black overflow-hidden">
                                    {profile.profile_image ? (
                                        <img src={profile.profile_image instanceof File ? URL.createObjectURL(profile.profile_image) : (profile.profile_image.startsWith('http') ? profile.profile_image : `http://127.0.0.1:8000${profile.profile_image}`)} className="w-full h-full object-cover" alt="Profile" />
                                    ) : <span>{profile.first_name?.[0] || 'A'}</span>}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                    <FaCamera size={12} /><input type="file" className="hidden" accept="image/*" onChange={(e) => setProfile({...profile, profile_image: e.target.files[0]})} />
                                </label>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-slate-900">
                            <InputField label="First Name" name="first_name" value={profile.first_name} onChange={handleChange} />
                            <InputField label="Last Name" name="last_name" value={profile.last_name} onChange={handleChange} />
                            <InputField label="Target Role" name="job_title" value={profile.job_title} onChange={handleChange} placeholder="e.g. Developer" />
                            <InputField label="Phone" name="phone" value={profile.phone} onChange={handleChange} placeholder="+92..." />
                            <InputField label="Location" name="location" value={profile.location} onChange={handleChange} placeholder="Sargodha, PK" />
                            <InputField label="LinkedIn" name="linkedin_url" value={profile.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/..." />
                            <div className="md:col-span-2">
                                <InputField label="GitHub" name="github_url" value={profile.github_url} onChange={handleChange} placeholder="https://github.com/..." />
                            </div>

                            <div className="md:col-span-2 space-y-2 mt-2">
                                <label className="text-[10px] font-black uppercase text-indigo-600 ml-2">Neural Skills (Press Enter)</label>
                                <div className="w-full p-4 bg-gray-50 rounded-3xl border border-slate-100 min-h-[70px] flex flex-wrap gap-2">
                                    {skillsArray.map((skill, index) => (
                                        <span key={index} className="bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-bold flex items-center gap-2">
                                            {skill} <button type="button" onClick={() => removeSkill(skill)}>×</button>
                                        </span>
                                    ))}
                                    <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} placeholder="Add skill..." className="flex-1 bg-transparent outline-none font-medium" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-10">
                            <label className="text-[10px] font-black uppercase text-indigo-600 ml-2">Master Bio</label>
                            <textarea name="bio" value={profile.bio} rows="5" onChange={handleChange} className="w-full p-6 bg-gray-50 rounded-[2rem] border outline-none focus:border-indigo-500 font-medium text-slate-800" placeholder="Type your professional bio..." />
                        </div>

                        <div className="flex gap-4">
                            <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black uppercase shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                                <FaSave /> Sync Hub
                            </button>
                            <button onClick={downloadPDF} disabled={isDownloading} className="px-10 bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
                                {isDownloading ? "..." : <><FaDownload /> PDF</>}
                            </button>
                        </div>
                    </div>

                    {/* 🚀 THE PROFESSIONAL EXIT INTELLIGENCE SURVEY (DANGER ZONE) */}
                    <div className="bg-red-500/5 border border-red-500/20 rounded-[3rem] p-10 overflow-hidden relative shadow-2xl">
                        {!showFeedback ? (
                            <div className="flex flex-col items-start">
                                <h3 className="text-2xl font-black text-red-500 mb-2 uppercase tracking-tighter">Danger Zone</h3>
                                <p className="text-gray-400 text-sm mb-8 font-medium">Deactivating your neural link will permanently wipe all your data.</p>
                                <button onClick={() => setShowFeedback(true)} className="px-8 py-4 bg-red-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20">
                                    <FaTrashAlt className="inline mr-2"/> Start Deactivation
                                </button>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {!isDeleting ? (
                                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                        <div className="text-center">
                                            <h2 className="text-3xl font-black text-white italic">"Goodbye, {profile.first_name}"</h2>
                                            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Exit Intelligence Survey</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* REASON FOR LEAVING */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Reason for leaving</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {["Found Job", "Not Useful", "Difficult", "Just Testing"].map((r) => (
                                                        <button key={r} onClick={() => setExitData({...exitData, reason: r})} className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all ${exitData.reason === r ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/5'}`}>{r}</button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* STAR RATING */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest block text-center">Overall Experience</label>
                                                <div className="flex gap-2 justify-center bg-white/5 p-3 rounded-2xl w-fit mx-auto">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <FaStar key={star} className={`text-2xl cursor-pointer ${rating >= star ? "text-yellow-400" : "text-gray-800"}`} onClick={() => setRating(star)} />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* DROPDOWN - FEATURE */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Most helpful feature</label>
                                                <select 
                                                    value={exitData.best_feature}
                                                    onChange={(e) => setExitData({...exitData, best_feature: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs outline-none focus:border-indigo-500"
                                                >
                                                    <option className="bg-[#0b1220]">Resume Analyzer</option>
                                                    <option className="bg-[#0b1220]">Skill Gap Detection</option>
                                                    <option className="bg-[#0b1220]">Course Recommendations</option>
                                                    <option className="bg-[#0b1220]">AI Career Coach</option>
                                                </select>
                                            </div>

                                            {/* TEXT AREA - PROBLEMS & SUGGESTIONS */}
                                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-600 uppercase ml-2">Problems faced</label>
                                                    <textarea 
                                                        placeholder="..." 
                                                        onChange={(e) => setExitData({...exitData, problems: e.target.value})}
                                                        className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs outline-none h-24 w-full"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-600 uppercase ml-2">Suggestions</label>
                                                    <textarea 
                                                        placeholder="..." 
                                                        onChange={(e) => setExitData({...exitData, suggestions: e.target.value})}
                                                        className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs outline-none h-24 w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 border-t border-white/5 pt-8">
                                            <button onClick={() => setShowFeedback(false)} className="flex-1 py-5 bg-white/5 text-white rounded-2xl font-black uppercase text-xs tracking-widest">Abort</button>
                                            <button 
                                                disabled={!exitData.reason || rating === 0} 
                                                onClick={handlePurgeAccount} 
                                                className={`flex-1 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${(!exitData.reason || rating === 0) ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-500 shadow-red-600/20'}`}
                                            >
                                                Final Deactivation
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-20">
                                        <FaSkull className="text-red-600 text-7xl animate-bounce mb-6" />
                                        <p className="text-red-500 font-black tracking-[0.5em] uppercase animate-pulse">Neural Profile Purged</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* --- RIGHT: PREVIEW SECTION --- */}
                <div className="lg:col-span-5">
                    <div className="flex items-center gap-2 mb-4 ml-4">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Neural Master Data Preview</span>
                    </div>
                    <ResumeHeaderPreview data={profile} innerRef={resumeRef} />
                </div>
            </div>
        </div>
    );
}

const InputField = ({ label, ...props }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-indigo-600 ml-2 tracking-widest">{label}</label>
        <input {...props} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-indigo-500 font-medium text-slate-900 transition-all" />
    </div>
);

export default Profile;