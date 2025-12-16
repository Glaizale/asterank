import axios from "axios";

// Create an axios instance with your LARAVEL backend URL (port 8000)
const api = axios.create({
  baseURL: "http://localhost:8001/api", // Changed to Laravel port 8000
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Important for Laravel Sanctum cookies
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login page
      window.location.href = "/";
    }

    if (error.response?.status === 419) {
      // CSRF token mismatch - refresh page
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

// Helper methods for common API calls
export const apiService = {
  // Auth methods
  register: (userData) => api.post("/register", userData),
  login: (credentials) => api.post("/login", credentials),
  logout: () => api.post("/logout"),
  getCurrentUser: () => api.get("/user"),

  // Asteroid methods
  getAsteroids: () => api.get("/asteroids"),
  getAsteroid: (id) => api.get(`/asteroids/${id}`),
  testAsterankApi: () => api.get("/asteroids/test"),
  syncAsteroids: () => api.post("/asteroids/sync"),

  // Favorite methods
  getFavorites: () => api.get("/favorites"),
  addFavorite: (asteroidId, note = "") =>
    api.post("/favorites", { asteroid_id: asteroidId, note }),
  updateFavorite: (favoriteId, note) =>
    api.put(`/favorites/${favoriteId}`, { note }),
  deleteFavorite: (favoriteId) => api.delete(`/favorites/${favoriteId}`),

  // Health check
  healthCheck: () => api.get("/health"),
};

// Also export the raw axios instance if needed
export default api;
