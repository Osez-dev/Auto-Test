// Get user's favorites from sessionStorage
export const getFavorites = (userId: number): number[] => {
  const savedFavorites = sessionStorage.getItem(`favorites_${userId}`);
  return savedFavorites ? JSON.parse(savedFavorites) : [];
};

// Add a listing to favorites
export const addToFavorites = (userId: number, listingId: number): void => {
  const favorites = getFavorites(userId);
  if (!favorites.includes(listingId)) {
    favorites.push(listingId);
    sessionStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
  }
};

// Remove a listing from favorites
export const removeFromFavorites = (userId: number, listingId: number): void => {
  const favorites = getFavorites(userId);
  const updatedFavorites = favorites.filter(id => id !== listingId);
  sessionStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
};

// Check if a listing is in favorites
export const isInFavorites = (userId: number, listingId: number): boolean => {
  const favorites = getFavorites(userId);
  return favorites.includes(listingId);
}; 