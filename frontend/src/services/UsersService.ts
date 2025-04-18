import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BASE_URL}/users`;

export const UsersService = {
  /**
   * Fetch all users from the backend.
   */
  fetchUsers: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
      throw new Error('Failed to fetch users');
    }
  },

  /**
   * Get a specific user by ID.
   * @param userId - The ID of the user to fetch.
   */
  getUserById: async (userId: string | number) => {
    try {
      if (!userId || isNaN(Number(userId))) {
        throw new Error('Invalid user ID');
      }

      const response = await axios.get(`${API_URL}/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user:', error.message);
      throw new Error('Failed to fetch user');
    }
  },

  /**
   * Update a specific user by ID.
   * @param userId - The ID of the user to update.
   * @param updatedUser - The updated user data.
   */
  updateUser: async (userId: string | number, updatedUser: any) => {
    try {
      if (!userId || isNaN(Number(userId))) {
        throw new Error('Invalid user ID');
      }
  
      const response = await axios.patch(`${API_URL}/${userId}`, updatedUser, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error updating user:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to update user');
      } else {
        console.error('Error updating user:', error.message);
        throw new Error('Failed to update user');
      }
    }
  },
  /**
   * Delete a specific user by ID.
   * @param userId - The ID of the user to delete.
   */
  deleteUser: async (userId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting user:', error.message);
      throw new Error('Failed to delete user');
    }
  },

};
