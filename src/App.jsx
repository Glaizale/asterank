import { useState, useEffect } from "react";
import { apiService } from "./services/api";
import LoginModal from "./components/LoginModal";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import ExploreView from "./components/ExploreView"; // Updated component with animations
import FavoritesView from "./components/FavoritesView";
import AsteroidDetailModal from "./components/AsteroidDetailModal";

function App() {
  const [asteroids, setAsteroids] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("explore");
  const [user, setUser] = useState(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState("login");
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        loadFavorites();
        fetchAsteroids(); // Fetch asteroids on login
      } catch (error) {
        console.log("Error parsing user data:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Load user's favorites
  const loadFavorites = async () => {
    try {
      const response = await apiService.getFavorites();
      if (response.success) {
        setFavorites(response.data || []);
      } else {
        console.log("Error loading favorites:", response.message);
        setFavorites([]);
      }
    } catch (error) {
      console.log("Error loading favorites:", error);
      setFavorites([]);
    }
  };

  // Fetch asteroids from API (real Asterank API)
  const fetchAsteroids = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAsteroids();
      if (
        response &&
        response.success &&
        response.data &&
        response.data.length > 0
      ) {
        setAsteroids(response.data);
        setLastUpdate(new Date().toLocaleTimeString());
      } else {
        // Fallback to sample data if API fails
        console.log("Using fallback data:", response?.message);
        setAsteroids(getFallbackData());
        setLastUpdate("Sample Data");
      }
    } catch (error) {
      console.error("Error fetching asteroids:", error);
      setAsteroids(getFallbackData());
      setLastUpdate("Sample Data");
    } finally {
      setLoading(false);
    }
  };

  // Fallback data in case API fails
  const getFallbackData = () => [
    {
      id: "ceres-001",
      name: "Ceres",
      type: "C-Type",
      diameter: "939.4 km",
      distance: "2.77 AU",
      velocity: "17.9 km/s",
      value: "$4,780B",
      composition: "Carbonaceous",
      discovery_year: 1801,
      hazard_level: "Low",
      status: "Monitored",
      magnitude: 3.34,
      right_ascension: 291.0,
      declination: 22.5,
      observation_time: "1801-01-01",
    },
    {
      id: "vesta-002",
      name: "Vesta",
      type: "M-Type",
      diameter: "525.4 km",
      distance: "2.15 AU",
      velocity: "19.34 km/s",
      value: "$3,200B",
      composition: "Metallic",
      discovery_year: 1807,
      hazard_level: "Medium",
      status: "Monitored",
      magnitude: 5.1,
      right_ascension: 103.9,
      declination: 19.7,
      observation_time: "1807-03-29",
    },
    {
      id: "pallas-003",
      name: "Pallas",
      type: "B-Type",
      diameter: "512 km",
      distance: "2.77 AU",
      velocity: "17.65 km/s",
      value: "$2,800B",
      composition: "Carbonaceous",
      discovery_year: 1802,
      hazard_level: "Low",
      status: "Monitored",
      magnitude: 4.13,
      right_ascension: 299.5,
      declination: -5.2,
      observation_time: "1802-03-28",
    },
    {
      id: "hygiea-004",
      name: "Hygiea",
      type: "C-Type",
      diameter: "434 km",
      distance: "3.14 AU",
      velocity: "16.76 km/s",
      value: "$2,100B",
      composition: "Carbonaceous",
      discovery_year: 1849,
      hazard_level: "Low",
      status: "Monitored",
      magnitude: 5.43,
      right_ascension: 238.2,
      declination: -4.4,
      observation_time: "1849-04-12",
    },
    {
      id: "eunomia-005",
      name: "Eunomia",
      type: "S-Type",
      diameter: "268 km",
      distance: "2.64 AU",
      velocity: "19.5 km/s",
      value: "$1,800B",
      composition: "Silicaceous",
      discovery_year: 1851,
      hazard_level: "Low",
      status: "Mining Candidate",
      magnitude: 5.28,
      right_ascension: 259.5,
      declination: -29.9,
      observation_time: "1851-07-29",
    },
    {
      id: "psyche-006",
      name: "Psyche",
      type: "M-Type",
      diameter: "226 km",
      distance: "2.92 AU",
      velocity: "17.34 km/s",
      value: "$10,000Q",
      composition: "Metallic",
      discovery_year: 1852,
      hazard_level: "Low",
      status: "Mining Candidate",
      magnitude: 5.9,
      right_ascension: 90.1,
      declination: -5.8,
      observation_time: "1852-03-17",
    },
  ];

  // Handle successful login
  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setShowLoginModal(false);
    loadFavorites();
    fetchAsteroids();
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setFavorites([]);
    setAsteroids([]);
    setView("explore");
  };

  // Handle adding/removing favorites
  const handleToggleFavorite = async (asteroid) => {
    try {
      const result = await apiService.toggleFavorite(asteroid.id, {
        name: asteroid.name,
        type: asteroid.type,
        distance: asteroid.distance,
        value: asteroid.value,
        notes: "",
      });

      if (result.success) {
        loadFavorites(); // Refresh favorites list
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  // Handle updating favorite notes
  const handleUpdateFavorite = async (favoriteId, notes) => {
    try {
      const result = await apiService.updateFavorite(favoriteId, notes);
      if (result.success) {
        loadFavorites(); // Refresh favorites list
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  // Handle removing favorite
  const handleRemoveFavorite = async (favoriteId) => {
    try {
      const result = await apiService.deleteFavorite(favoriteId);
      if (result.success) {
        loadFavorites(); // Refresh favorites list
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  // If user is not logged in, show landing page
  if (!user) {
    return (
      <div className="fixed inset-0 w-screen h-screen">
        <LandingPage
          onShowLogin={() => {
            setLoginMode("login");
            setShowLoginModal(true);
          }}
          onShowSignup={() => {
            setLoginMode("register");
            setShowLoginModal(true);
          }}
        />
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
            initialMode={loginMode}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black text-white overflow-x-hidden">
      {/* Header with navigation */}
      <Header
        user={user}
        view={view}
        setView={setView}
        favorites={favorites}
        handleLogout={handleLogout}
        onShowLogin={() => setShowLoginModal(true)}
        lastUpdate={lastUpdate}
        onRefresh={fetchAsteroids}
      />

      <main className="pt-20">
        {view === "explore" ? (
          <ExploreView
            asteroids={asteroids}
            loading={loading}
            onRefresh={fetchAsteroids}
            user={user}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onUpdateFavorite={handleUpdateFavorite}
            onRemoveFavorite={handleRemoveFavorite}
          />
        ) : view === "favorites" ? (
          <div className="container mx-auto px-4 py-12">
            <div className="mb-12 text-center">
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                My Favorite Asteroids
              </h2>
              <p className="text-gray-400">
                Manage your saved asteroids and notes
              </p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={loadFavorites}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
                >
                  Refresh Favorites
                </button>
                <button
                  onClick={fetchAsteroids}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Refresh Asteroids
                </button>
              </div>
            </div>
            <FavoritesView
              favorites={favorites}
              onRefresh={loadFavorites}
              onUpdateFavorite={handleUpdateFavorite}
              onRemoveFavorite={handleRemoveFavorite}
            />
          </div>
        ) : null}
      </main>

      {/* Asteroid Detail Modal */}
      {selectedAsteroid && (
        <AsteroidDetailModal
          asteroid={selectedAsteroid}
          onClose={() => setSelectedAsteroid(null)}
          user={user}
          isFavorite={favorites.some(
            (f) => f.asteroid_id === selectedAsteroid.id
          )}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Login Modal (in case user needs to re-login) */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          initialMode={loginMode}
        />
      )}

      {/* Footer */}
      <footer className="mt-20 py-6 border-t border-gray-800/50">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>
            Powered by Asterank API • Data updates: {lastUpdate || "Loading..."}
          </p>
          <p className="mt-2">© 2024 Asterank Odyssey • Educational Project</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
