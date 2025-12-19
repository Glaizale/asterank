const API_BASE_URL = "http://localhost:8000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("auth_token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    : {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
};

export const apiService = {
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  async getUser() {
    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: getAuthHeader(),
    });
    return response.json();
  },

  async getAsteroids() {
    try {
      const response = await fetch(`${API_BASE_URL}/asteroids`, {
        headers: getAuthHeader(),
      });
      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, data: [], message: "Network error" };
    }
  },

  async getFavorites() {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        headers: getAuthHeader(),
      });
      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, data: [], message: "Network error" };
    }
  },

  async toggleFavorite(asteroidId, asteroidData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/favorites/${asteroidId}/toggle`,
        {
          method: "POST",
          headers: getAuthHeader(),
          body: JSON.stringify(asteroidData),
        }
      );
      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, message: "Network error" };
    }
  },

  async updateFavorite(id, notes) {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${id}`, {
        method: "PUT",
        headers: getAuthHeader(),
        body: JSON.stringify({ notes }),
      });
      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, message: "Network error" };
    }
  },

  async deleteFavorite(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, message: "Network error" };
    }
  },

  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({ email }),
      });
      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, message: "Network error" };
    }
  },

  async resetPassword(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, message: "Network error" };
    }
  },
};
