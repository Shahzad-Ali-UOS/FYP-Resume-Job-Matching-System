import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const rawRole = localStorage.getItem("role") || sessionStorage.getItem("role") || "student";
    const cleanRole = rawRole.replace(/['"]+/g, '').toLowerCase().trim();
    const token = localStorage.getItem("access") || sessionStorage.getItem("access");

    
    console.log("ProtectedRoute -> Role:", cleanRole, "Allowed:", allowedRoles);

    if (!token) {
        return <Navigate to="/login" replace />;
    }


    if (allowedRoles.length > 0 && !allowedRoles.includes(cleanRole)) {
        console.warn("Access Denied. Redirecting to Dashboard.");
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;