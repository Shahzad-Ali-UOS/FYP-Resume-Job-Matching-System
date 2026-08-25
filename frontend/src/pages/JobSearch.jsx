import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaSync,
  FaCloudDownloadAlt,
  FaHome,
  FaExclamationTriangle,
} from "react-icons/fa";

import API from "../api/uplink";
import JobCard from "../components/JobCard";

const JobSearch = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const userRole = localStorage.getItem("role")?.toLowerCase();
  const isAdmin = userRole === "admin";

  useEffect(() => {
    fetchInitialData();
  }, []);

  // =========================
  // FETCH INITIAL DATA
  // =========================
  const fetchInitialData = async () => {
    setLoading(true);

    try {
      const [resumesRes, jobsRes] = await Promise.all([
        API.get("users/resumes/"),
        API.get("jobs/list/"),
      ]);

      setResumes(resumesRes.data);
      setJobs(jobsRes.data);

      if (resumesRes.data && resumesRes.data.length > 0) {
        setSelectedResume(resumesRes.data[0].id);
      }
    } catch (err) {
      console.error("Data Sync Failed:", err.response?.status);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SYNC EXTERNAL JOBS
  // =========================
  const handleIndeedSync = async () => {
    if (isSyncing) return;

    setIsSyncing(true);

    try {
      const query = searchTerm.trim() || "Software Engineer";

      await API.post("jobs/sync-jobs/", {
        search: query,
      });

      await fetchInitialData();
    } catch (err) {
      console.error("Sync Error:", err);

      alert("Sync Failed. Please check backend connection.");
    } finally {
      setIsSyncing(false);
    }
  };

  // =========================
  // FILTER JOBS
  // =========================
  const filteredJobs = jobs.filter((job) => {
    return (
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-indigo-500/30">
      {/* TOP NAVBAR */}
      <div className="fixed top-8 left-8 right-8 z-50 flex justify-between items-center pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          <button
            onClick={() => navigate("/")}
            className="bg-white/5 backdrop-blur-xl px-6 py-3 rounded-xl border border-white/10 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <FaHome className="inline mr-2" />
            Landing
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h1 className="text-7xl font-black tracking-tighter leading-none italic">
              Job <span className="text-indigo-600">Feed_</span>
            </h1>

            <p className="text-gray-500 font-bold mt-4 uppercase text-xs tracking-widest">
              Neural Analysis Portal
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-wrap items-center gap-4">
            {/* SEARCH BAR */}
            <div className="bg-[#0b1220] border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3">
              <FaSearch className="text-gray-500" />

              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-sm text-white placeholder:text-gray-500"
              />
            </div>

            {/* ADMIN SYNC BUTTON */}
            {isAdmin && (
              <button
                onClick={handleIndeedSync}
                disabled={isSyncing}
                className="bg-indigo-600/20 border border-indigo-500/40 px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 text-indigo-400"
              >
                {isSyncing ? (
                  <FaSync className="animate-spin" />
                ) : (
                  <FaCloudDownloadAlt />
                )}

                {isSyncing ? "Scraping..." : "Sync External Jobs"}
              </button>
            )}

            {/* RESUME SELECT */}
            <div className="bg-[#0b1220] p-5 rounded-[2rem] border border-white/5 flex items-center gap-5">
              <div className="text-right">
                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                  Active Identity
                </p>

                <select
                  value={selectedResume || ""}
                  onChange={(e) =>
                    setSelectedResume(Number(e.target.value))
                  }
                  className="bg-transparent font-black text-white outline-none cursor-pointer text-sm"
                >
                  {resumes.map((resume) => (
                    <option
                      key={resume.id}
                      value={resume.id}
                      className="bg-[#0b1220]"
                    >
                      {resume.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* JOB LIST */}
        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-20 text-center text-indigo-500">
                <FaSync className="animate-spin mx-auto" size={40} />
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  resumeId={selectedResume || ""}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                <FaExclamationTriangle
                  className="mx-auto mb-4 text-gray-700"
                  size={40}
                />

                <h3 className="text-xl font-bold italic">
                  No Jobs Available
                </h3>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobSearch;