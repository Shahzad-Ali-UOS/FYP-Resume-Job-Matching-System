import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/CreateJob";
import UploadResume from "./pages/UploadResume";
import Match from "./pages/MatchResult";
import History from "./pages/History";
import Landing from "./pages/Landing";
import Contact from "./pages/Contact"; 
import JobSearch from "./pages/JobSearch";
import ForgotPassword from "./pages/ForgotPassword"; 
import Profile from "./pages/Profile"; 
import EditResume from "./pages/EditResume"; 
import ResumeGallery from "./pages/ResumeGallery";
import ComparisonReport from "./pages/ComparisonReport";
import JobInventory from "./pages/JobInventory";
import StudentDirectory from "./pages/StudentDirectory";
import NeuralResumeScorer from './pages/NeuralResumeScorer';
import SkillGapAnalysis from './pages/SkillGapAnalysis';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NeuralMatching from './pages/NeuralMatching';

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ==============================
            🔓 PUBLIC ROUTES 
           ============================== */}
        <Route path="/" element={<><Navbar /><Landing /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* ==============================
            🔐 SHARED PROTECTED ROUTES 
           ============================== */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} 
        />
        <Route 
          path="/profile" 
          element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} 
        />
        <Route 
          path="/resumes" 
          element={<ProtectedRoute><Layout><ResumeGallery /></Layout></ProtectedRoute>} 
        />
        <Route 
          path="/upload-resume" 
          element={<ProtectedRoute><Layout><UploadResume /></Layout></ProtectedRoute>} 
        />
        <Route 
          path="/edit-resume/:resumeId" 
          element={<ProtectedRoute><Layout><EditResume /></Layout></ProtectedRoute>} 
        />
        <Route 
          path="/history" 
          element={<ProtectedRoute><Layout><History /></Layout></ProtectedRoute>} 
        />
        <Route 
          path="/jobs/match/:jobId/:resumeId" 
          element={<ProtectedRoute><Layout><Match /></Layout></ProtectedRoute>} 
        />
         <Route 
          path="/report"
          element={<ProtectedRoute><ComparisonReport /></ProtectedRoute>} 
        />
        <Route 
          path="/neural-scorer" 
          element={<ProtectedRoute><NeuralResumeScorer /></ProtectedRoute>} 
        />
        <Route 
          path="/skill-gap-analysis" 
          element={<ProtectedRoute><SkillGapAnalysis /></ProtectedRoute>} 
        />
        <Route 
          path="/smart-matching" 
          element={<ProtectedRoute><NeuralMatching /></ProtectedRoute>} 
        />

        {/* 🚀 NEURAL MATCHING  */}
        <Route 
          path="/job-search" 
          element={<ProtectedRoute><JobSearch /></ProtectedRoute>} 
        />

        {/* ==============================
            🔒 ADMIN ONLY ROUTES 
           ============================== */}
        <Route 
          path="/create-job" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout><CreateJob /></Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/job-inventory" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout><JobInventory /></Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/student-directory" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout><StudentDirectory /></Layout>
            </ProtectedRoute>
          } 
        />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;