import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// 🚀 Assets & Engine Imports
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import RobotModel from '../components/RobotModel'; 

import Footer from "../components/Footer";
import AnnouncementBot from "../components/AnnouncementBot";
import API from "../api/uplink";

import { 
  FaMicrochip, FaArrowRight, FaGithub, FaLinkedin,
  FaNetworkWired, FaUserEdit, FaFileSignature, FaSearchDollar, 
  FaEnvelopeOpenText, FaBrain, FaCrosshairs, FaLayerGroup 
} from "react-icons/fa";

function Landing() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactMsg, setContactMsg] = useState("");
  
  // 🔔 This handles the Bot's local state on this page
  const [isBellClicked, setIsBellClicked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access") || sessionStorage.getItem("access");
    setIsLoggedIn(!!token);
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("users/contact/", contactForm);
      setContactMsg("Message sent successfully ✅");
      setContactForm({ name: "", email: "", message: "" });
    } catch {
      setContactMsg("Failed to send message ❌");
    }
  };

  return (
    <div className="bg-[#030712] text-white min-h-screen overflow-x-hidden font-sans relative">
      
      {/* 🚀 BOT: Remains here to handle Landing-specific announcements */}
      <AnnouncementBot forceOpen={isBellClicked} setForceOpen={setIsBellClicked} />

      {/* 🌌 AI PARTICLE BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-screen -z-10 opacity-40">
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                background: { color: "transparent" },
                fpsLimit: 120,
                particles: {
                    number: { value: 50, density: { enable: true, area: 800 } },
                    color: { value: "#6366f1" },
                    links: { enable: true, distance: 150, color: "#6366f1", opacity: 0.1, width: 1 },
                    move: { enable: true, speed: 0.8 },
                    opacity: { value: 0.3 },
                    size: { value: { min: 1, max: 2 } }
                }
            }}
        />
      </div>

      {/* 🚀 HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20" id="home">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
               </span>
               Neural Core Online
            </div>
            <h1 className="text-6xl md:text-[5.5rem] font-black leading-[0.9] tracking-tighter mb-8 text-white">
              Neural <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-indigo-400 to-indigo-600">Career Hub</span>
            </h1>
            <p className="text-slate-400 text-lg mb-10 max-w-lg font-medium leading-relaxed">
              Optimize resumes and align your professional DNA with real-time industry requirements using high-precision neural intelligence.
            </p>
            <div className="flex flex-wrap gap-5">
              <button onClick={() => navigate(isLoggedIn ? "/dashboard" : "/login")} className="bg-indigo-600 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all flex items-center gap-3 shadow-xl shadow-indigo-600/30 active:scale-95">
                {isLoggedIn ? "Access Dashboard" : "Start Syncing"} <FaArrowRight />
              </button>
              
            </div>
          </motion.div>

          {/* 🤖 3D ROBOT STAGE */}
          <div className="hidden md:flex justify-center h-[500px] relative">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full"></div>
            <div className="relative z-10 w-full h-full rounded-[4rem] border border-white/10 bg-[#0b1220]/60 backdrop-blur-xl flex items-center justify-center overflow-hidden shadow-2xl">
              <Canvas dpr={[1, 2]}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.5} contactShadow={false}>
                        <RobotModel />
                    </Stage>
                </Suspense>
                <OrbitControls enableZoom={false} autoRotate />
              </Canvas>
            </div>
          </div>
        </div>
      </section>

      {/* 🧠 AI FEATURES */}
      <section className="py-32 bg-[#0b1220] border-y border-white/5 relative z-10" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-emerald-500 text-xs font-black uppercase tracking-[0.5em] mb-4">Intelligence Suite</h2>
            <h3 className="text-5xl font-black text-white tracking-tighter">Advanced Core Engine</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <FaBrain />, title: "Resume Scoring", desc: "Scans CV against 10k+ industry standards to provide a real-time competitiveness score." },
              { icon: <FaCrosshairs />, title: "Matching Engine", desc: "Automated discovery that matches your skill gaps with top-tier company requirements." },
              { icon: <FaLayerGroup />, title: "Persona Analysis", desc: "A deep dive into your professional persona to suggest the best-fitting roles." }
            ].map((feature, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="p-12 rounded-[3.5rem] bg-[#030712] border border-white/5 shadow-2xl transition-all">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center mb-8 shadow-lg text-white text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 text-white">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 📘 ABOUT SECTION */}
      <section className="relative bg-[#030712] py-32 px-8 overflow-hidden" id="about">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-emerald-500 text-xs font-black uppercase tracking-[0.4em] mb-4">Our Vision</h2>
            <h3 className="text-5xl font-black text-white mb-8 tracking-tighter leading-tight">Redefining Tech Recruitment</h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
              CareerCoachAI acts as a neural bridge between talent and opportunity, decoding market trends to align your DNA with industry roles.
            </p>
          </motion.div>
          <div className="relative rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl group">
             <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=80" className="w-full h-[500px] object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition duration-1000 shadow-2xl" alt="AI Tech"/>
          </div>
        </div>
      </section>

      {/* 📝 GUIDELINES */}
      <section className="bg-[#0b1220] py-32 px-8 relative" id="guidelines">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.6em] mb-4">The Neural Path</h2>
            <h3 className="text-4xl font-black text-white tracking-tighter">System Guidelines</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <FaUserEdit className="text-emerald-500"/>, title: "Identity Sync", text: "Complete your profile so our AI can decode your core competencies." },
              { icon: <FaFileSignature className="text-indigo-500"/>, title: "Resume Optimization", text: "Upload your resume to receive neural feedback and match scores." },
              { icon: <FaSearchDollar className="text-emerald-500"/>, title: "Market Alignment", text: "Browse matched jobs that align with your verified expertise." }
            ].map((step, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="bg-[#030712] border border-white/5 p-10 rounded-[3rem] shadow-xl">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 text-white">{step.icon}</div>
                <h4 className="text-xl font-black text-white mb-4 tracking-tight">{step.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

        {/* 📬 CONTACT SECTION */}
<section className="py-40 bg-[#030712] px-8 relative" id="contact">
  <div className="max-w-6xl mx-auto bg-[#0b1220] rounded-[4rem] border border-white/5 p-10 md:p-20 grid md:grid-cols-2 gap-20 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
    
    <div>
      <h2 className="text-6xl font-black mb-8 text-white tracking-tighter text-left">Talk to <br/><span className="text-indigo-500">Engineers</span></h2>
      <p className="text-slate-400 mb-12 font-medium text-lg leading-relaxed text-left">Have a technical query about the scoring algorithm or system integration?</p>
      
      <div className="bg-[#030712] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-all duration-700"></div>
        
        <h3 className="text-2xl font-black text-emerald-400 mb-2 text-left">Shahzad Ali</h3>
        <p className="text-slate-500 mb-8 text-sm font-medium text-left">Lead AI Architect — Building the next generation of career intelligence.</p>
        
        <div className="flex flex-col gap-6">
          {/* Social Links Row */}
          <div className="flex gap-6">
            <a 
              href="https://github.com/Shahzad-Ali-UOS" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-all transform hover:scale-110"
              title="GitHub Profile"
            >
              <FaGithub size={24} />
            </a>

            <a 
              href="https://www.linkedin.com/in/shahzad-ali-369b00360" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-400 transition-all transform hover:scale-110"
              title="LinkedIn Profile"
            >
              <FaLinkedin size={24} />
            </a>
          </div>

          {/* 📧 NEURAL EMAIL COPY BUTTON */}
          <button 
            onClick={() => {
              navigator.clipboard.writeText("your.email@example.com");
              alert("Email Address Copied to Clipboard");
            }}
            className="flex items-center gap-3 bg-white/5 border border-white/5 py-3 px-6 rounded-2xl text-[10px] font-black lowercase tracking-widest text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all w-fit"
          >
            shahzadhussaini0302@gmail.com <span className="opacity-40">| Click to Copy</span>
          </button>
        </div>
      </div>
    </div>

    <form onSubmit={handleContactSubmit} className="space-y-6 flex flex-col justify-center">
      <input type="text" placeholder="Identity Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="w-full bg-[#030712] border border-white/10 rounded-2xl px-8 py-5 focus:border-indigo-500 outline-none text-white transition-all font-bold placeholder:text-slate-600" required />
      <input type="email" placeholder="Email Channel" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full bg-[#030712] border border-white/10 rounded-2xl px-8 py-5 focus:border-indigo-500 outline-none text-white transition-all font-bold placeholder:text-slate-600" required />
      <textarea rows="4" placeholder="Message content..." value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="w-full bg-[#030712] border border-white/10 rounded-2xl px-8 py-5 focus:border-indigo-500 outline-none text-white transition-all font-bold placeholder:text-slate-600 resize-none" required />
      <button className="bg-indigo-600 w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-indigo-500 transition-all active:scale-95 text-white">Transmit Message</button>
      {contactMsg && <p className="text-center text-emerald-400 font-black text-xs uppercase tracking-widest animate-pulse mt-4">{contactMsg}</p>}
    </form>
    
  </div>
</section>

      {/* 🏁 FOOTER */}
      <div className="bg-[#030712] border-t border-white/5">
        <Footer />
      </div>
    </div>
  );
}

export default Landing;