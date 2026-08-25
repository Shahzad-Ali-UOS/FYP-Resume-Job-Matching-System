import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});

// 🔑 AUTHENTICATION INTERCEPTOR
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("access") || sessionStorage.getItem("access");
    if (token && token !== "undefined" && token !== "null") {
        const cleanToken = token.replace(/['"]+/g, '');
        config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 🛡️ SECURITY INTERCEPTOR
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// ==========================================
// 👤 IDENTITY & DASHBOARD
// ==========================================
export const updateProfile = (formData) => API.put("users/profile/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
});

export const getDashboardStats = () => API.get("users/dashboard-stats/");
export const submitFeedback = (data) => API.post("users/contact/", data);
export const getAdminFeedback = () => API.get("users/admin/feedback/");
export const getStudentList = () => API.get("users/students/");

// ==========================================
// 📄 NEURAL VAULT (RESUME)
// ==========================================
export const getUserResumes = () => API.get("users/resumes/");
export const deleteResume = (id) => API.delete(`users/resumes/${id}/`);

// 🚀 CRITICAL: This triggers the Deep OCR logic we built
export const uploadResumeFile = (formData) => API.post("users/resume-upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
});

// ==========================================
// 💼 OPPORTUNITY MATRIX (JOBS)
// ==========================================
export const getJobFeed = () => API.get("jobs/create/");
export const deleteJobEntry = (id) => API.delete(`jobs/delete/${id}/`);
export const getJobList = () => API.get("jobs/list/");
export const analyzeMatch = (resumeId, jobId) => API.post("jobs/analyze/", {
    resume_id: resumeId,
    job_id: jobId
});

export const syncIndeedJobs = (searchQuery) => API.post("jobs/sync-jobs/", { search: searchQuery });
// ==========================================
// 🤖 NEURAL MATCHING ENGINE (Llama 3.1)
// ==========================================

export const getMatchHistory = () => API.get("jobs/history/");

// AI Summary generation (moved to users app)
export const generateAISummary = (jobTitle) => {
    return API.post("users/generate-summary/", { job_title: jobTitle });
};

export default API;