import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaBell, FaBars, FaTimes, FaUserCircle, 
    FaTachometerAlt, FaFileAlt, FaBrain, FaPhone, FaSearch, FaRobot
} from "react-icons/fa";

import LogoImg from "../assets/websitelogo.jpg";

function Navbar({ onBellClick }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
        { name: "Resumes", path: "/history", icon: <FaFileAlt /> },
        { name: "Identity Profile", path: "/profile", icon: <FaUserCircle /> },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("access") || sessionStorage.getItem("access");
        setIsLoggedIn(!!token);
    }, [location]);

    const scrollToSection = (e, id) => {
        e.preventDefault();
        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                const section = document.getElementById(id);
                if (section) section.scrollIntoView({ behavior: "smooth" });
            }, 150);
        } else {
            const section = document.getElementById(id);
            if (section) section.scrollIntoView({ behavior: "smooth" });
        }
        setOpen(false);
    };

    const handleBellTrigger = (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.removeItem('bot_manually_closed');
        if (onBellClick) {
            onBellClick(false);
            setTimeout(() => onBellClick(true), 10);
        }
    };

    return (
        <nav className={`fixed w-full top-0 z-[900] transition-all duration-500 ${scrolled ? "bg-[#030712]/80 backdrop-blur-2xl border-b border-white/10 py-3 shadow-2xl" : "bg-transparent py-5"}`}>
            <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
                
                <button type="button" className="flex items-center cursor-pointer active:scale-95 transition-all duration-300 group" onClick={(e) => scrollToSection(e, "home")}>
                    <img src={LogoImg} alt="Logo" className="h-16 w-auto object-contain rounded-xl shadow-2xl" />
                </button>

                <div className="hidden lg:flex gap-8 items-center font-black text-[10px] uppercase tracking-[0.2em]">
                    <button type="button" onClick={(e) => scrollToSection(e, "features")} className="text-slate-400 hover:text-white">AI Features</button>
                    <button type="button" onClick={(e) => scrollToSection(e, "about")} className="text-slate-400 hover:text-white">About</button>
                    <button type="button" onClick={(e) => scrollToSection(e, "guidelines")} className="text-slate-400 hover:text-white">Guidelines</button>
                    
                    <button type="button" onClick={() => navigate("/jobs")} className="text-slate-400 hover:text-indigo-400 flex items-center gap-2">
                        <FaSearch size={14}/> Jobs
                    </button>

                    <button type="button" onClick={() => navigate("/contact")} className="text-slate-400 hover:text-indigo-400 flex items-center gap-2">
                        <FaPhone size={12} /> Contact
                    </button>

                    <button type="button" onClick={handleBellTrigger} className="relative p-2 text-slate-400 hover:text-white">
                        <FaBell size={18} />
                    </button>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            <button type="button" onClick={() => navigate("/dashboard")} className="text-indigo-400">Dashboard</button>
                            <button type="button" onClick={() => navigate("/profile")} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl">Profile</button>
                        </div>
                    ) : (
                        <div className="flex gap-6 items-center">
                            <button type="button" onClick={() => navigate("/login")} className="text-white">Login</button>
                            <button type="button" onClick={() => navigate("/register")} className="bg-white text-slate-900 px-8 py-2.5 rounded-xl">Join</button>
                        </div>
                    )}
                </div>

                <div className="lg:hidden flex items-center gap-4">
                    <button type="button" onClick={handleBellTrigger} className="text-slate-400 p-2"><FaBell size={20}/></button>
                    <button type="button" onClick={() => setOpen(true)} className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white">
                        <FaBars size={20} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 bg-[#030712]/80 backdrop-blur-md z-[1000]" />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-screen w-[300px] bg-[#0b1220] border-l border-white/10 z-[1001] p-10 flex flex-col shadow-2xl">
                            <div className="flex justify-between items-center mb-12">
                                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><FaRobot/></div>
                                <button type="button" onClick={() => setOpen(false)} className="text-slate-500 hover:text-white"><FaTimes size={24}/></button>
                            </div>
                            <div className="space-y-6 flex-1">
                                <button type="button" onClick={(e) => scrollToSection(e, "features")} className="block text-xl font-black text-white uppercase">AI Features</button>
                                <button type="button" onClick={(e) => scrollToSection(e, "about")} className="block text-xl font-black text-white uppercase">About</button>
                                <button type="button" onClick={() => {navigate("/jobs"); setOpen(false);}} className="block text-xl font-black text-white uppercase">Jobs</button>
                                <button type="button" onClick={() => {navigate("/contact"); setOpen(false);}} className="block text-xl font-black text-indigo-400 uppercase">Contact</button>
                                <div className="h-[1px] bg-white/10 my-4"></div>
                                {isLoggedIn ? (
                                    <div className="space-y-4">
                                        {menuItems.map((item) => (
                                            <button type="button" key={item.name} onClick={() => { navigate(item.path); setOpen(false); }} className="w-full flex items-center gap-4 bg-white/5 p-4 rounded-2xl font-black text-white text-sm uppercase">{item.icon} {item.name}</button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4 pt-4">
                                        <button type="button" onClick={() => {navigate("/login"); setOpen(false);}} className="w-full py-5 border border-white/10 rounded-2xl text-white">Login</button>
                                        <button type="button" onClick={() => {navigate("/register"); setOpen(false);}} className="w-full bg-indigo-600 py-5 rounded-2xl text-white">Join</button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}

export default Navbar;