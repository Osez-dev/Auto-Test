// File: src/services/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "./authService";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  id: number;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  googleLogin: () => void;
  facebookLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check URL parameters for role
        const params = new URLSearchParams(window.location.search);
        const role = params.get("role");

        if (role) {
          sessionStorage.setItem("userRole", role);
          await checkAuthStatus();
        } else {
          await checkAuthStatus();
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const profile = await authService.getProfile();
      if (profile) {
        setUser(profile);
        // Only store non-sensitive role information in sessionStorage
        sessionStorage.setItem("userRole", profile.role);
        
        // Only navigate if we're not already on the correct page
        const currentPath = window.location.pathname;
        const shouldNavigate = !currentPath.includes(profile.role === 'admin' || profile.role === 'Shop_manager' ? '/admin' : 
                                                   profile.role === 'customer' ? '/customer' : 
                                                   profile.role === 'Manager' ? '/admin' : 
                                                   profile.role === 'news_manager' ? '/adminnews' : '/');
                                            
        if (shouldNavigate) {
          navigateBasedOnRole(profile.role);
        }
      } else {
        // Clear session data and redirect to login
        sessionStorage.removeItem("userRole");
        setUser(null);
        if (!window.location.pathname.includes('/login')) {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error("Auth status check failed:", error);
      // On error, clear session data and redirect to login
      sessionStorage.removeItem("userRole");
      setUser(null);
      if (!window.location.pathname.includes('/login')) {
        navigate('/login');
      }
    }
  };

  const navigateBasedOnRole = (role: string) => {
    if (role === "admin" || role === "Shop_manager" || role === "Manager") {
      navigate("/admin");
    } else if (role === "customer") {
      navigate("/customer");
    } else if (role === "news_manager") {
      navigate("/adminnews");
    } else {
      navigate("/");
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await authService.login(credentials);
      if (response.profile) {
        setUser(response.profile);
        // Store only role in sessionStorage
        sessionStorage.setItem("userRole", response.profile.role);
        navigateBasedOnRole(response.profile.role);
      }
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const googleLogin = () => {
    authService.googleLogin();
  };

  const facebookLogin = () => {
    authService.facebookLogin();
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      sessionStorage.removeItem("userRole");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value = {
    user,
    login,
    googleLogin,
    facebookLogin,
    logout,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};