// src/pages/FavoritesPage.jsx
import { useEffect, useState } from "react";
import { apiService } from "../services/api";
import FavoritesView from "../components/FavoritesView";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await apiService.getFavorites();
      if (res.success && Array.isArray(res.data)) {
        setFavorites(res.data);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error("Error loading favorites", err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleUpdateFavorite = async (id, notes) => {
    try {
      const res = await apiService.updateFavorite(id, notes || "");
      if (res.success && res.data) {
        setFavorites((prev) => prev.map((f) => (f.id === id ? res.data : f)));
      }
    } catch (err) {
      console.error("Error updating favorite", err);
    }
  };

  const handleRemoveFavorite = async (id) => {
    try {
      const res = await apiService.deleteFavorite(id);
      if (res.success) {
        setFavorites((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (err) {
      console.error("Error deleting favorite", err);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-black">
        <p className="text-cyan-300 text-lg">Loading favorites...</p>
      </div>
    );
  }

  return (
    <FavoritesView
      favorites={favorites}
      onUpdateFavorite={handleUpdateFavorite}
      onRemoveFavorite={handleRemoveFavorite}
    />
  );
}
