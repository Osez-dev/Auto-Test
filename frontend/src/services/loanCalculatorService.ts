import axios from 'axios';

export interface LeasingCompany {
  id: number;
  companyName: string;
  interestRate: number;
  termInMonths: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoanCalculationParams {
  vehiclePrice: number;
  downPayment: number;
  interestRate: number;
  termInMonths: number;
}

export interface LoanCalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/loan-calculator';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
);

export const loanCalculatorService = {
  getAllCompanies: async (): Promise<LeasingCompany[]> => {
    try {
      const response = await api.get('/leasing-companies');
      return response.data;
    } catch (error) {
      console.error('Error in getAllCompanies:', error);
      throw error;
    }
  },

  getCompanyById: async (id: number): Promise<LeasingCompany> => {
    try {
      const response = await api.get(`/leasing-company/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getCompanyById:', error);
      throw error;
    }
  },

  createCompany: async (company: Omit<LeasingCompany, 'id' | 'createdAt' | 'updatedAt'>): Promise<LeasingCompany> => {
    try {
      const response = await api.post('/leasing-company', company);
      return response.data;
    } catch (error) {
      console.error('Error in createCompany:', error);
      throw error;
    }
  },

  updateCompany: async (id: number, company: Omit<LeasingCompany, 'id' | 'createdAt' | 'updatedAt'>): Promise<LeasingCompany> => {
    try {
      const response = await api.put(`/leasing-company/${id}`, company);
      return response.data;
    } catch (error) {
      console.error('Error in updateCompany:', error);
      throw error;
    }
  },

  deleteCompany: async (id: number): Promise<void> => {
    try {
      await api.delete(`/leasing-company/${id}`);
    } catch (error) {
      console.error('Error in deleteCompany:', error);
      throw error;
    }
  },

  calculateLoan: async (params: LoanCalculationParams): Promise<LoanCalculationResult> => {
    try {
      const response = await api.get('/calculate', { params });
      return response.data;
    } catch (error) {
      console.error('Error in calculateLoan:', error);
      throw error;
    }
  },
};