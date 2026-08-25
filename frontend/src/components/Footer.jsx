import React from "react";
import { Link } from "react-router-dom";
import LogoImg from "../assets/websitelogo.jpg";

function Footer() {
  return (
    <footer className="bg-[#030712] text-white border-t border-white/5 px-10 py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* 🔝 BRAND COLUMN */}
        <div className="space-y-6">
          <img 
            src={LogoImg} 
            alt="CareerCoachAI Logo" 
            className="h-16 w-auto object-contain brightness-110 contrast-110 rounded-md"
          />
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Empowering the next generation of professionals with neural career intelligence and automated job matching.
          </p>
        </div>

        {/* 🛠️ PLATFORM LINKS */}
        <div>
          <h2 className="font-black text-xs uppercase tracking-[0.2em] text-emerald-500 mb-6">Platform</h2>
          <ul className="space-y-4 text-slate-400 text-sm font-bold flex flex-col">
            <li>
              <Link to="/neural-scorer" className="hover:text-white cursor-pointer transition block">
                Neural Resume Scorer
              </Link>
            </li>
            <li>
              <Link to="/skill-gap-analysis" className="hover:text-white cursor-pointer transition block">
                Skill Gap Analysis
              </Link>
            </li>
            <li>
              <Link to="/smart-matching" className="hover:text-white cursor-pointer transition block">
                Smart Job Matching
              </Link>
            </li>
          </ul>
        </div>

        {/* 🛡️ LEGAL & SUPPORT */}
        <div>
          <h2 className="font-black text-xs uppercase tracking-[0.2em] text-indigo-400 mb-6">Resources</h2>
          <ul className="space-y-4 text-slate-400 text-sm font-bold flex flex-col">
            <li>
              <Link to="/privacy-policy" className="hover:text-white cursor-pointer transition block">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white cursor-pointer transition block">
                Terms of Service
              </Link>
            </li>
            <li>
              <a href="mailto:info@careercoachai.com" className="hover:text-emerald-400 cursor-pointer transition block italic">
                info@careercoachai.com
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* BOTTOM COPYRIGHT STRIP */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          © 2026 CareerCoachAI • Built for the Future
        </p>
      </div>
    </footer>
  );
}

export default Footer;