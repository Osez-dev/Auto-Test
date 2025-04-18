import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  role: string | null; // User's role
  allowedRole: string | string[]; // Role(s) allowed to access this route
  children: React.ReactNode; // Protected component
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, allowedRole, children }) => {
  const isAllowed = Array.isArray(allowedRole)
    ? allowedRole.includes(role as string)
    : role === allowedRole;

  console.log("ProtectedRoute - role:", role, "allowedRole:", allowedRole, "isAllowed:", isAllowed);

  if (role === null) {
    // Show a loading spinner or redirect to login while waiting for role
    return <div>Loading...</div>;
  }

  if (!isAllowed) {
    return <Navigate to={role === "customer" ? "/customer" : "/login"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
