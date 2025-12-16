import { useState, useEffect } from "react";
import { apiService } from "./services/api";
import LoginModal from "./components/LoginModal";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import ExploreView from "./components/ExploreView";
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

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        loadFavorites();
      } catch (error) {
        console.log("Error parsing user data:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      }
    }
    fetchAsteroids();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await apiService.getFavorites();
      setFavorites(response.data || []);
    } catch (error) {
      console.log("Error loading favorites:", error);
      setFavorites([]);
    }
  };

  const fetchAsteroids = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAsteroids();
      if (response && response.data && response.data.length > 0) {
        setAsteroids(response.data);
      } else {
        setAsteroids(getFallbackData());
      }
    } catch (error) {
      console.error("Error fetching asteroids:", error);
      setAsteroids(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackData = () => [
    {
      id: 1,
      name: "Ceres",
      ra: "10.5934",
      dec: "+7.3401",
      vmag: "6.64",
      date: "2024-01-15",
      diameter: "939 km",
      distance: "2.8 AU",
      value: "$950M",
      hazard: "Low",
    },
    {
      id: 2,
      name: "Vesta",
      ra: "14.2845",
      dec: "-5.7812",
      vmag: "5.20",
      date: "2024-01-20",
      diameter: "525 km",
      distance: "2.4 AU",
      value: "$650M",
      hazard: "Low",
    },
    {
      id: 3,
      name: "Pallas",
      ra: "22.4521",
      dec: "+15.9234",
      vmag: "7.45",
      date: "2024-02-01",
      diameter: "512 km",
      distance: "2.8 AU",
      value: "$580M",
      hazard: "Low",
    },
  ];

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
    loadFavorites();
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setFavorites([]);
    setView("explore");
  };

  const addToFavorites = (asteroid) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    const newFavorite = {
      id: Date.now(),
      asteroid_id: asteroid.id,
      asteroid: asteroid,
      note: "",
      created_at: new Date().toISOString(),
    };
    setFavorites([...favorites, newFavorite]);
  };

  const updateNote = (id, note) => {
    const updated = favorites.map((f) => (f.id === id ? { ...f, note } : f));
    setFavorites(updated);
  };

  const deleteFavorite = (id) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
  };

  const isFavorite = (id) =>
    favorites.some((f) => f.asteroid_id === id || f.asteroid?.id === id);

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
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-black text-white">
      <Header
        user={user}
        view={view}
        setView={setView}
        favorites={favorites}
        handleLogout={handleLogout}
        onShowLogin={() => setShowLoginModal(true)}
      />

      <main className="pt-24">
        {view === "explore" ? (
          <div className="container mx-auto px-4">
            <ExploreView
              loading={loading}
              asteroids={asteroids}
              isFavorite={isFavorite}
              addToFavorites={addToFavorites}
              setSelectedAsteroid={setSelectedAsteroid}
              onRefresh={fetchAsteroids}
            />
          </div>
        ) : (
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              My Favorite Space Objects
            </h2>
            <FavoritesView
              favorites={favorites}
              updateNote={updateNote}
              deleteFavorite={deleteFavorite}
            />
          </div>
        )}
      </main>

      {selectedAsteroid && (
        <AsteroidDetailModal
          asteroid={selectedAsteroid}
          onClose={() => setSelectedAsteroid(null)}
          isFavorite={isFavorite}
          addToFavorites={addToFavorites}
        />
      )}
    </div>
  );
}

export default App;
