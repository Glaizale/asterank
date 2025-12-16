const favoriteService = {
  // Get all favorites
  getFavorites: () => {
    return axios.get(`${API_BASE_URL}/favorites`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },

  // Add to favorites
  addFavorite: (asteroidId, note = "") => {
    return axios.post(
      `${API_BASE_URL}/favorites`,
      {
        asteroid_id: asteroidId,
        note: note,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  },

  // Check if favorited
  checkFavorite: (asteroidId) => {
    return axios.get(`${API_BASE_URL}/favorites/check/${asteroidId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },

  // Toggle favorite
  toggleFavorite: (asteroidId, note = "") => {
    return axios.post(
      `${API_BASE_URL}/favorites/toggle`,
      {
        asteroid_id: asteroidId,
        note: note,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  },

  // Update favorite note
  updateFavorite: (favoriteId, note) => {
    return axios.put(
      `${API_BASE_URL}/favorites/${favoriteId}`,
      {
        note: note,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  },

  // Remove from favorites
  removeFavorite: (favoriteId) => {
    return axios.delete(`${API_BASE_URL}/favorites/${favoriteId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
};

// Add to your export
export { favoriteService };
