import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/uplink";
import { 
    FaHistory, FaEye, FaCalendarAlt, FaPercentage, 
    FaBriefcase, FaBuilding, FaSearch 
} from "react-icons/fa";
import { motion } from "framer-motion";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      // Fetches the enhanced history with job titles from our new serializer
      const res = await API.get("jobs/history/");
      setHistory(res.data);
    } catch (error) {
      console.error("History Sync Failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#f8fafc] min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-slate-900 rounded-[2rem] flex items-center justify-center text-indigo-400 shadow-2xl shadow-indigo-100 border border-white/10">
            <FaHistory size={24} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Neural Timeline</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Audit trail of your compatibility scans</p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/jobs')}
          className="bg-white border border-slate-200 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center gap-3 active:scale-95"
        >
          <FaSearch /> New Analysis
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-r-transparent"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Retrieving Records...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white p-24 rounded-[4rem] text-center border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBriefcase className="text-slate-200" size={30} />
          </div>
          <p className="text-slate-400 font-black text-xl tracking-tight">No Match Records Found</p>
          <p className="text-slate-300 text-sm mt-2">Run your first neural match from the Job Feed.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-10 py-8">Role & Company</th>
                  <th className="px-10 py-8 text-center">Compatibility</th>
                  <th className="px-10 py-8">Scanned On</th>
                  <th className="px-10 py-8 text-right">Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={index} 
                    className="hover:bg-slate-50/80 transition-all group"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-inner">
                          <FaBriefcase size={18} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                            {item.job_title || "Unknown Role"}
                          </p>
                          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-2 flex items-center gap-2">
                            <FaBuilding size={10} /> {item.company_name || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-10 py-8">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`text-2xl font-black ${
                          item.match_percentage > 75 ? 'text-emerald-500' : 
                          item.match_percentage > 40 ? 'text-indigo-500' : 'text-slate-400'
                        }`}>
                          {item.match_percentage}%
                        </span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div 
                             className={`h-full rounded-full ${item.match_percentage > 75 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                             style={{ width: `${item.match_percentage}%` }}
                           />
                        </div>
                      </div>
                    </td>

                    <td className="px-10 py-8 text-slate-500 font-bold text-xs">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-slate-300" />
                        {new Date(item.created_at).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric', year: 'numeric' 
                        })}
                      </div>
                    </td>

                    <td className="px-10 py-8 text-right">
                      <button 
                        onClick={() => navigate(`/match/${item.job}/${item.resume}`)}
                        className="inline-flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-lg active:scale-90"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50 p-6 flex justify-center border-t border-slate-100">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                End of Neural Records
             </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;