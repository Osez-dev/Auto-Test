import axios from "axios";

/**
 * Fetch all spare parts for a specific listing.
 * @param listingId - ID of the listing to fetch spare parts for
 * @returns Array of spare parts matching the listing's make or model
 */
export const getSpareParts = async (listingId: number) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/listings/${listingId}/spare-parts`);
    return response.data; // Return the spare parts data
  } catch (error) {
    console.error("Error fetching spare parts:", error);
    throw error; // Re-throw the error for the calling function to handle
  }
};


const BASE_URL = `${import.meta.env.VITE_BASE_URL}/spare-parts`;

/**
 * Fetch all spare parts
 */
export const getAllSparePart = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

/**
 * Fetch all spare parts for a specific listing.
 * @param listingId - ID of the listing to fetch spare parts for
 * @returns Array of spare parts matching the listing's make or model
 */

/**
 * Create a new spare part
 * @param sparePart - Data for the new spare part
 */
export const createSparePart = async (sparePart: any) => {
  const response = await axios.post(BASE_URL, sparePart);
  return response.data;
};

/**
 * Update an existing spare part
 * @param id - ID of the spare part to update
 * @param updatedData - Updated data
 */
export const updateSparePart = async (id: number, updatedData: any) => {
  const response = await axios.patch(`${BASE_URL}/${id}`, updatedData);
  return response.data;
};

/**
 * Delete a spare part
 * @param id - ID of the spare part to delete
 */
export const deleteSparePart = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
