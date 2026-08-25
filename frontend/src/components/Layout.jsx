import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaThLarge, FaFileUpload, FaPlusCircle, 
  FaHistory, FaChevronRight, FaRobot,
  FaDatabase, FaSignOutAlt, FaUserCircle,
  FaLayerGroup, FaUsers,
  FaUserCog
} from "react-icons/fa";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isWorkspace = location.pathname.includes("/edit-resume/");
  const getFromStorage = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);

  const userData = getFromStorage("user");
  const user = userData ? JSON.parse(userData) : { username: "Explorer" };
  
  const rawRole = getFromStorage("role") || "student";
  const userRole = rawRole.replace(/['"]+/g, '').toLowerCase().trim();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const allMenuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <FaThLarge />, roles: ["admin", "student"] },
    { path: "/profile", label: "Neural Identity", icon: <FaUserCog />, roles: ["admin", "student"] }, 
    { path: "/resumes", label: "Resume Vault", icon: <FaLayerGroup />, roles: ["admin", "student"] },
    { path: "/upload-resume", label: "Upload Resume", icon: <FaFileUpload />, roles: ["admin", "student"] },
    { path: "/create-job", label: "Job Architect", icon: <FaPlusCircle />, roles: ["admin"] },
    { path: "/job-inventory", label: "Job Inventory", icon: <FaDatabase />, roles: ["admin"] },
    { path: "/history", label: "Match History", icon: <FaHistory />, roles: ["admin", "student"] },
    { path: "/student-directory", label: "Student Nodes", icon: <FaUsers />, roles: ["admin"] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  if (isWorkspace) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0d1117] text-gray-100 font-sans">

      {/* 🚀 THE OBSIDIAN SIDEBAR */}
      {/* h-full + flex-col ensures the container takes full height and stacks its children */}
      <aside className="w-72 bg-[#000000] border-r border-gray-800/60 flex flex-col p-8 fixed h-full z-50 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
        
        {/* --- PINNED HEADER --- */}
        <div className="mb-12 flex-shrink-0">
            <h2 className="text-2xl font-black tracking-tighter text-white flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
                <span className="text-indigo-500"><FaRobot size={24}/></span>
                CareerCoach<span className="text-indigo-500">.ai</span>
            </h2>
            <div className="h-1 w-10 bg-indigo-600 mt-2 rounded-full"></div>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mt-3">
                {userRole === "admin" ? "Administrator Portal" : "Student Portal"}
            </p>
        </div>

        {/* --- SCROLLABLE NAVIGATION --- */}
        {/* flex-1 + overflow-y-auto makes this part take available space and scroll if content overflows */}
        <nav className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`group w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm border
                ${
                  isActive
                    ? "bg-indigo-600/10 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10"
                    : "border-transparent text-gray-500 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`${isActive ? "text-indigo-400" : "text-gray-700 group-hover:text-indigo-400"} transition-colors`}>
                    {item.icon}
                  </span>
                  <span className="tracking-tight">{item.label}</span>
                </div>
                {isActive && <FaChevronRight className="text-[10px] text-indigo-500" />}
              </button>
            );
          })}
        </nav>

        {/* --- PINNED FOOTER --- */}
        {/* mt-auto ensures this stays at the bottom even if nav is short */}
        <div className="mt-auto pt-8 border-t border-gray-800/30 flex-shrink-0">
            <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em] text-center leading-relaxed">
                Sargodha University <br/> 
                <span className="text-indigo-900/50">CS DEPT • 2026</span>
            </p>
        </div>
      </aside>

      {/* 💻 MAIN WORKSPACE AREA */}
      <div className="flex-1 ml-72 bg-[#0d1117] min-h-screen relative flex flex-col">
        
        {/* 🌟 FLOATING HEADER */}
        <header className="sticky top-0 z-40 w-full px-12 py-5 flex justify-between items-center bg-[#0d1117]/80 backdrop-blur-xl border-b border-gray-800/50">
            <div>
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Workspace</h3>
                <p className="text-sm font-bold text-white capitalize">
                    {location.pathname.replace("/", "").replaceAll("-", " ")}
                </p>
            </div>

            <div className="flex items-center gap-6">
                {/* 🚀 CLICKABLE USER BADGE */}
                <div 
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 hover:border-indigo-500/30 transition-all group"
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors">{user.username || "User"}</p>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                          {userRole === "admin" ? "Admin Access" : "Active Member"}
                        </p>
                    </div>
                    <FaUserCircle className="text-gray-400 text-2xl group-hover:text-white transition-colors" />
                </div>

                <button 
                    type="button"
                    onClick={handleLogout}
                    className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-500/5"
                    title="Logout"
                >
                    <FaSignOutAlt size={18} />
                </button>
            </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="max-w-6xl w-full mx-auto p-12 relative z-10">
            {children}
        </main>
      </div>

    </div>
  );
}

export default Layout;