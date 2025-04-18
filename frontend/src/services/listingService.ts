import axios from "axios";
import authService from "./authService";

const API_URL = `${import.meta.env.VITE_BASE_URL}/listings`;

interface VehicleFilters {
  makeId?: number;
  modelId?: number;
  bodyType?: string;
  districtId?: number;
  maxPrice?: number;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  blueTGrade?: string;
  keywords?: string;
  isSold?: boolean;
}

// Fetch all listings with optional filtering
export const getListings = async (includePendingAndRejected = false) => {
  try {
    const response = await axios.get(API_URL);
    const listings = response.data;
    // Filter listings based on status unless explicitly requested to include all
    return includePendingAndRejected 
      ? listings 
      : listings.filter((listing: any) => listing.status === "approved");
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw new Error("Failed to fetch listings.");
  }
};

// Fetch filtered listings based on criteria
export const getFilteredListings = async (filters: VehicleFilters) => {
  try {
    // Convert filters to query params
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    // Always exclude pending/rejected listings unless explicitly requested
    if (!filters.hasOwnProperty('status')) {
      params.append('status', 'approved');
    }

    const response = await axios.get(`${API_URL}/filter?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching filtered listings:", error);
    throw new Error("Failed to fetch filtered listings.");
  }
};

// Fetch listing by ID
export const getListingById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching listing with ID ${id}:`, error);
    throw new Error("Failed to fetch listing details.");
  }
};

// Create a new listing
export const createListing = async (listingData: {
  title: string;
  condition: string;
  regno: string;
  make: string;
  model: string;
  yearofmanufacture: number;
  mileage: number;
  fuelType: string;
  bodyType: string;
  transmission: string;
  district: string;
  city: string;
  engineCc: number;
  price: number;
  sellersNotes?: string;
  status: string;
  grade?: string;
  exteriorColor?: string;
  interiorColor?: string;
  noOfOwners?: number;
  blueTGrade?: string;
  yearOfReg?: number;
  imageUrls?: string[];
  userId: number;
  userRole: string;
  listingFeatures?: {
    convenience?: string[];
    infotainment?: string[];
    safetyAndSecurity?: string[];
    interiorAndSeats?: string[];
    windowsAndLighting?: string[];
    otherFeatures?: string[];
  };
}) => {
  try {
    const response = await axios.post(API_URL, listingData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("API Error Response:", error.response.data);
      throw new Error(`Failed to create listing: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error("Unexpected error creating listing:", error);
      throw new Error("Failed to create listing. Please check your data and try again.");
    }
  }
};

// Update a listing
export const updateListing = async (id: number, listingData: any) => {
  try {
    // Exclude id, createdAt, updatedAt, and user before sending update request
    const { id: listingId, createdAt, updatedAt, user, ...updateData } = listingData;

    // If it's just a status update (isSold or status), use PATCH
    if (Object.keys(updateData).length === 1 && (updateData.hasOwnProperty('isSold') || updateData.hasOwnProperty('status'))) {
      const response = await axios.patch(`${API_URL}/${id}`, updateData);
      return response.data;
    }

    // For full updates, use PUT
    const response = await axios.put(`${API_URL}/${id}`, updateData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Error updating listing with ID ${id}:`, error.response.data);
      throw new Error(`Failed to update listing: ${error.response.data.message || 'Unknown error'}`);
    } else {
      console.error(`Unexpected error updating listing with ID ${id}:`, error);
      throw new Error("Failed to update listing. Please try again.");
    }
  }
};

// Delete a listing
export const deleteListing = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting listing with ID ${id}:`, error);
    throw new Error("Failed to delete listing.");
  }
};

// Get User ID from Profile & Fetch Only Their Listings
export const getUserListings = async () => {
  try {
    const profile = await authService.getProfile();
    if (!profile || !profile.id) {
      throw new Error("User profile not found.");
    }

    const response = await axios.get(`${API_URL}/user/${profile.id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user listings:", error);
    throw new Error("Failed to fetch user listings.");
  }
};

// Fetch listings by User ID
export const getListingsByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching listings for user ${userId}:`, error);
    throw new Error("Failed to fetch user's listings.");
  }
};

// Get popular listings (example of additional functionality)
export const getPopularListings = async (limit = 6) => {
  try {
    const response = await axios.get(`${API_URL}/popular?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching popular listings:", error);
    throw new Error("Failed to fetch popular listings.");
  }
};

// Advanced listing search
export const searchListings = async (searchParams: any) => {
  try {
    console.log(`${API_URL}?${searchParams}`); // Log the full URL for debugging
    const response = await axios.get(API_URL, { params: searchParams });
    return response.data;
  } catch (error) {
    console.error("Error searching listings:", error);
    throw new Error("Failed to search listings.");
  }
};