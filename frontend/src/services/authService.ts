import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = `${import.meta.env.VITE_BASE_URL}/auth`;


// Interfaces
interface TokenPayload {
  id: number;
}

// interface LoginResponse {
//   accessToken: string;
//   profile: {
//     role: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     id: number;
//   };
// }


interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

// Helper function to extract user ID from token
export const getUserIdFromToken = (token: string): number | null => {
  try {
    const decoded: TokenPayload = jwtDecode(token);
    return decoded.id;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

const authService = {
  googleLogin: () => {
    // Clear any existing session data
    sessionStorage.removeItem('userSession');
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    
    // Redirect to Google OAuth
    window.location.href = 'http://localhost:3000/auth/google';
  },

  getGoogleProfile: async (): Promise<any> => {
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/profile`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Google profile:', error);
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      return null;
    }
  },
  // Facebook Authentication
  facebookLogin: () => {
    window.location.href = `${API_URL}/facebook`;
  },

  getFacebookProfile: async (): Promise<any> => {
    try {
      const response = await axios.get(`${API_URL}/profile`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch Facebook profile:", error);
      return null;
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    try {
      console.log('Attempting login...');
      const response = await axios.post(`${API_URL}/login`, credentials);
      console.log('Login response:', response.data);
      
      const { accessToken, user } = response.data;
      
      if (!accessToken) {
        console.error('No access token in response');
        throw new Error('Login failed: No access token received');
      }
      
      // Store the token in both localStorage and sessionStorage
      localStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('accessToken', accessToken);
      
      console.log('Token stored in localStorage and sessionStorage');
      
      // Store user profile in sessionStorage
      if (user) {
        sessionStorage.setItem('userProfile', JSON.stringify(user));
        sessionStorage.setItem('userRole', user.role);
        console.log('User profile stored in sessionStorage');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error details:', error);
      if (axios.isAxiosError(error)) {
        console.error('Login failed:', error.response?.data?.message || error.message);
      } else {
        console.error('Login failed:', (error as Error).message);
      }
      throw error;
    }
  },

  // Registration
  register: async (userData: RegisterData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  // ✅ Add email verification function
  verifyEmail: async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/verify-email?token=${token}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Profile management
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`, { withCredentials: true });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
      } else {
        
      }
      throw error;
    }
  },
  
  forgotPassword: async (email: string) => {
    return axios.post(`${API_URL}/forgot-password`, { email });
  },
  
  resetPassword: async (token: string | null, newPassword: string) => {
    return axios.post(`${API_URL}/reset-password`, { token, newPassword });
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });

      // Clear all storage
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('userProfile');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('userSession');

      console.log('User logged out successfully.');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Logout failed:', error.response?.data?.message || error.message);
      } else {
        console.error('Logout failed:', (error as Error).message);
      }
      throw error;
    }
  },

  // Error handling utility
  handleError: (error: unknown) => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message;
    }
    return (error as Error).message;
  },
};


export default authService;