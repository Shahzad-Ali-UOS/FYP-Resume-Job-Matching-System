import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaCpu, FaProjectDiagram } from "react-icons/fa";

const AboutSection = () => {
  return (
    <section className="relative bg-[#030712] py-24 px-8 overflow-hidden" id="about">
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full -z-10"></div>
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        {/* Left: Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-4 py-1.5 mb-6 border border-emerald-500/30 bg-emerald-500/5 rounded-full">
            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">Our Vision</span>
          </div>
          <h2 className="text-5xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
            Redefining Career <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500">
              Intelligence
            </span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
            CareerCoachAI is not just a resume builder; it's a neural bridge between talent and opportunity. 
            We leverage advanced machine learning to decode job market trends and align your unique 
            professional DNA with industry-leading roles.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-emerald-500 border border-white/10">
                <FaCpu size={20}/>
              </div>
              <h4 className="text-white font-bold">Neural Scoring</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Proprietary AI models that grade your resume against thousands of real job descriptions.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-indigo-500 border border-white/10">
                <FaProjectDiagram size={20}/>
              </div>
              <h4 className="text-white font-bold">Smart Matching</h4>
              <p className="text-slate-500 text-xs leading-relaxed">Algorithmic job discovery based on verified skill sets and career trajectory.</p>
            </div>
          </div>
        </motion.div>

        {/* Right: Visual Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-[#0b1220] border border-white/10 p-4 rounded-[3rem] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=80" 
              alt="AI Workspace" 
              className="rounded-[2.5rem] grayscale group-hover:grayscale-0 transition duration-700 object-cover h-[450px] w-full"
            />
          </div>
        </motion.div>
      </div>

      {/* 🌊 Organic Wave Transition */}
      <div className="absolute bottom-0 left-0 w-full leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[80px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.43,151,125,221.72,105.41,250.5,97.46,286.35,71.4,321.39,56.44Z" fill="#0b1220"></path>
        </svg>
      </div>
    </section>
  );
};