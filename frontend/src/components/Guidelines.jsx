import React from "react";
import { motion } from "framer-motion";
import { FaUserEdit, FaFileSignature, FaSearchDollar, FaEnvelopeOpenText } from "react-icons/fa";

const GuidelinesSection = () => {
  const steps = [
    {
      icon: <FaUserEdit className="text-emerald-500" />,
      title: "Define Identity",
      text: "Complete your profile with verified skills and experiences to let our AI understand your unique value."
    },
    {
      icon: <FaFileSignature className="text-indigo-500" />,
      title: "Score Resume",
      text: "Upload your CV to the AI Assistant. Aim for a 90+ score by following real-time optimization suggestions."
    },
    {
      icon: <FaSearchDollar className="text-emerald-500" />,
      title: "Job Discovery",
      text: "Access the Job Matching portal to view roles curated specifically for your AI-verified score."
    }
  ];

  return (
    <section className="bg-[#0b1220] py-24 px-8 relative" id="guidelines">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-emerald-500 text-xs font-black uppercase tracking-[0.5em] mb-4">Platform Roadmap</h2>
          <h3 className="text-4xl font-black text-white tracking-tighter">System Guidelines</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] hover:bg-white/[0.05] transition group"
            >
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition duration-500">
                {step.icon}
              </div>
              <h4 className="text-xl font-black text-white mb-4 tracking-tight">{step.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{step.text}</p>
            </motion.div>
          ))}
        </div>

        {/* 📧 PROFESSIONAL SUPPORT BANNER */}
        <div className="mt-20 bg-gradient-to-r from-emerald-600 to-indigo-700 p-1 rounded-[3rem] shadow-2xl shadow-indigo-600/20">
          <div className="bg-[#030712] rounded-[2.9rem] p-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <FaEnvelopeOpenText className="text-emerald-500" size={24}/>
              </div>
              <div>
                <h4 className="text-2xl font-black text-white tracking-tight">Technical Assistance</h4>
                <p className="text-slate-500 text-sm font-medium">Have questions? Reach out to our engineering team.</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Official Domain Email</span>
              <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl backdrop-blur-xl group hover:border-emerald-500/50 transition">
                <p className="text-xl font-black text-white tracking-tight cursor-copy">info@careercoachai.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};