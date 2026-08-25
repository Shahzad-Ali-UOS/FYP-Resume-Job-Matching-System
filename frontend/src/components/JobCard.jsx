import React, { useState } from "react";
import { motion } from "framer-motion";

import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaBolt,
  FaExternalLinkAlt,
  FaInfoCircle,
  FaSync,
  FaRobot,
} from "react-icons/fa";

import API from "../api/uplink";

const JobCard = ({ job, resumeId }) => {
  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(false);

  const [isAnalyzed, setIsAnalyzed] = useState(false);

  // =========================
  // AI ANALYSIS
  // =========================
  const handleAIAnalysis = async () => {
    if (!resumeId) {
      alert("Please select a resume first.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("jobs/analyze/", {
        resume_id: resumeId,
        job_id: job.id,
      });

      setAnalysis(response.data);

      setIsAnalyzed(true);
    } catch (err) {
      console.error("Analysis Failed:", err);

      alert("AI analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SCORE
  // =========================
  const score = analysis?.score || 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full hover:border-indigo-200 transition-colors relative"
    >
      {/* TOP SECTION */}
      <div className="flex justify-between items-start mb-6">
        <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
          <FaBriefcase size={22} />
        </div>

        {isAnalyzed && (
          <span
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
              score >= 80
                ? "bg-emerald-500 text-white"
                : "bg-indigo-600 text-white"
            }`}
          >
            <FaBolt />
            {score}% Match
          </span>
        )}
      </div>

      {/* JOB INFO */}
      <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 uppercase italic tracking-tighter">
        {job.title}
      </h3>

      <p className="text-indigo-600 font-bold text-sm mb-4">
        {job.company_name}
      </p>

      <div className="flex items-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-6">
        <span className="flex items-center gap-1">
          <FaMapMarkerAlt />
          {job.location}
        </span>
      </div>

      {/* AI ANALYSIS BUTTON */}
      <button
        onClick={handleAIAnalysis}
        disabled={loading}
        className="w-full mb-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <FaSync className="animate-spin" />
        ) : (
          <FaRobot />
        )}

        {loading
          ? "Analyzing Resume..."
          : isAnalyzed
          ? "Re-Analyze Resume"
          : "Analyze Resume"}
      </button>

      {/* AI ANALYSIS REPORT */}
      {isAnalyzed && analysis && (
        <div className="bg-[#0b1220] p-6 rounded-3xl border border-indigo-500/20 shadow-2xl mb-6">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-5">
            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
              Neural Gap Analysis
            </h4>

            <span className="text-white text-xs font-black">
              {score}% Match
            </span>
          </div>

          {/* MATCHED + MISSING */}
          <div className="grid grid-cols-2 gap-4">
            {/* MATCHED */}
            <div>
              <p className="text-[9px] font-bold text-emerald-500 uppercase mb-2">
                Matched
              </p>

              <div className="flex flex-wrap gap-1">
                {analysis.matched_skills?.length > 0 ? (
                  analysis.matched_skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold rounded"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-[9px] text-gray-500">
                    No matched skills
                  </p>
                )}
              </div>
            </div>

            {/* MISSING */}
            <div>
              <p className="text-[9px] font-bold text-rose-500 uppercase mb-2">
                Missing
              </p>

              <div className="flex flex-wrap gap-1">
                {analysis.missing_skills?.length > 0 ? (
                  analysis.missing_skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-rose-500/10 text-rose-400 text-[9px] font-bold rounded"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-[9px] text-gray-500">
                    No missing skills
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* AI REASON */}
          {analysis.ai_reason && (
            <div className="mt-6 pt-4 border-t border-white/5 flex items-start gap-2">
              <FaInfoCircle
                className="text-indigo-400 mt-0.5 shrink-0"
                size={12}
              />

              <p className="text-[10px] text-gray-400 italic">
                {analysis.ai_reason}
              </p>
            </div>
          )}
        </div>
      )}

      {/* FOOTER BUTTONS */}
      <div className="mt-auto flex gap-3">
        <div className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] text-center uppercase tracking-widest">
          {isAnalyzed
            ? score >= 60
              ? "Strong Match"
              : "Weak Match"
            : "Pending Analysis"}
        </div>

        {job.apply_link && (
          <a
            href={job.apply_link}
            target="_blank"
            rel="noreferrer"
            className="w-14 h-14 border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
          >
            <FaExternalLinkAlt size={16} />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default JobCard;