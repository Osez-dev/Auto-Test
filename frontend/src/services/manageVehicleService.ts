import axios from 'axios';

const API_URL = 'http://localhost:3000';

// const getToken = () => {
//   // The token is now handled by the browser's cookie storage
//   // We don't need to manually retrieve it as it will be sent automatically
//   return '';
// };

export const manageVehicleService = {
  createVehicle: async (vehicleData: any) => {
    try {
      const response = await axios.post(`${API_URL}/manage-vehicle`, vehicleData, {
        withCredentials: true, // This ensures cookies are sent with the request
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      throw error;
    }
  },

  getVehicles: async () => {
    try {
      const response = await axios.get(`${API_URL}/manage-vehicle`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      throw error;
    }
  },

  updateVehicle: async (id: number, vehicleData: any) => {
    try {
      const response = await axios.patch(`${API_URL}/manage-vehicle/${id}`, vehicleData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      throw error;
    }
  },

  deleteVehicle: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/manage-vehicle/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      throw error;
    }
  },

  getVehicle: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/manage-vehicle/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      throw error;
    }
  },

  addServiceHistory: async (serviceHistoryData: any) => {
    try {
      const response = await axios.post(`${API_URL}/manage-vehicle/service-history`, serviceHistoryData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      throw error;
    }
  },

  getServiceHistory: async (vehicleId: number) => {
    try {
      const response = await axios.get(`${API_URL}/manage-vehicle/service-history/${vehicleId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      throw error;
    }
  },
}; 