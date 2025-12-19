import { useState, useEffect } from "react";
import { apiService } from "./services/api";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import ForgotPasswordModal from "./components/ForgotPasswordModal";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import ExploreView from "./components/ExploreView";
import FavoritesView from "./components/FavoritesView";
import AsteroidDetailModal from "./components/AsteroidDetailModal";
import Toast from "./components/Toast";
import ConfirmModal from "./components/ConfirmModal";

function App() {
  const [asteroids, setAsteroids] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("explore"); // ALWAYS start on explore
  const [user, setUser] = useState(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        loadFavorites();
        fetchAsteroids();
      } catch (error) {
        console.log("Error parsing user data:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const loadFavorites = async () => {
    // Only load favorites if user is logged in
    if (!user && !localStorage.getItem("auth_token")) {
      setFavorites([]);
      return;
    }
    
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

  const fetchAsteroids = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAsteroids();
      console.log("Real Asterank API result:", response);
      // TODO: when your real API is ready, map response.data to setAsteroids
      setAsteroids(getFallbackData());
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching asteroids:", error);
      setAsteroids(getFallbackData());
      setLastUpdate("Sample Data");
    } finally {
      setLoading(false);
    }
  };

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

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setShowLoginModal(false);
    loadFavorites();
    fetchAsteroids();
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setFavorites([]);
    setAsteroids([]);
    setView("explore");
  };

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
        await loadFavorites();
        setToast({
          message: result.removed ? "Removed from favorites!" : "Added to favorites!",
          type: "success",
        });
      } else {
        setToast({
          message: "Failed to toggle favorite: " + (result.message || "Unknown error"),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      setToast({
        message: "Error: " + error.message,
        type: "error",
      });
    }
  };

  const handleUpdateFavorite = async (favoriteId, notes) => {
    try {
      const result = await apiService.updateFavorite(favoriteId, notes);
      if (result.success) {
        loadFavorites();
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  const handleRemoveFavorite = (favoriteId, asteroidName) => {
    setConfirmModal({
      title: "Remove Favorite",
      message: `Are you sure you want to remove "${asteroidName}" from your favorites?`,
      onConfirm: async () => {
        try {
          const result = await apiService.deleteFavorite(favoriteId);
          if (result.success) {
            await loadFavorites();
            setToast({
              message: "Removed from favorites!",
              type: "success",
            });
          }
        } catch (error) {
          console.error("Failed to remove favorite:", error);
          setToast({
            message: "Failed to remove favorite",
            type: "error",
          });
        }
        setConfirmModal(null);
      },
      onCancel: () => setConfirmModal(null),
    });
  };

  // If not logged in, show Landing + Login
  if (!user) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-black">
        <LandingPage
          onShowLogin={() => setShowLoginModal(true)}
          onShowSignup={() => setShowRegisterModal(true)}
        />
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => {
              setShowLoginModal(false);
              setShowRegisterModal(true);
            }}
            onForgotPassword={() => {
              setShowLoginModal(false);
              setShowForgotPasswordModal(true);
            }}
          />
        )}
        {showRegisterModal && (
          <RegisterModal
            onClose={() => setShowRegisterModal(false)}
            onRegisterSuccess={handleLoginSuccess}
            onSwitchToLogin={() => {
              setShowRegisterModal(false);
              setShowLoginModal(true);
            }}
          />
        )}
        {showForgotPasswordModal && (
          <ForgotPasswordModal
            onClose={() => setShowForgotPasswordModal(false)}
            onBackToLogin={() => {
              setShowForgotPasswordModal(false);
              setShowLoginModal(true);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black text-white overflow-x-hidden">
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
            onSelectAsteroid={setSelectedAsteroid}
          />
        ) : view === "favorites" ? (
          <FavoritesView
            favorites={favorites}
            onRefresh={loadFavorites}
            onUpdateFavorite={handleUpdateFavorite}
            onRemoveFavorite={handleRemoveFavorite}
            onSelectAsteroid={setSelectedAsteroid}
          />
        ) : null}
      </main>

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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={confirmModal.onCancel}
        />
      )}
    </div>
  );
}

export default App;
