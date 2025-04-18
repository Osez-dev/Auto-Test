import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/news`;

// Fetch all reviews
export const getAllReviews = async () => {
    const response = await axios.get(API_URL);
    return response.data;
  };

// Create a new review
export const createReview = async (review: any) => {
    const response = await axios.post(API_URL, review);
    return response.data;
  };

// Update a review
export const updateReview = async (id: number, review: any) => {
  const response = await axios.put(`${API_URL}/${id}`, review);
  return response.data;
};

// Delete a review
export const deleteReview = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
