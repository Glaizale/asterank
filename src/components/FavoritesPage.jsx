// src/pages/FavoritesPage.jsx
import { useEffect, useState } from "react";
import { apiService } from "../services/api";
import { Trash2, Save } from "lucide-react";

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

  const handleChange = (id, field, value) => {
    setFavorites((prev) =>
      prev.map((fav) => (fav.id === id ? { ...fav, [field]: value } : fav))
    );
  };

  const handleSave = async (fav) => {
    try {
      const res = await apiService.updateFavorite(fav.id, fav.notes || "");
      if (res.success && res.data) {
        setFavorites((prev) =>
          prev.map((f) => (f.id === fav.id ? res.data : f))
        );
      }
    } catch (err) {
      console.error("Error updating favorite", err);
    }
  };

  const handleDelete = async (id) => {
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
      <p className="text-gray-400 mt-24 text-center">Loading favorites...</p>
    );
  }

  if (favorites.length === 0) {
    return <p className="text-gray-400 mt-24 text-center">No favorites yet.</p>;
  }

  return (
    <div className="mt-24 container mx-auto px-6 pb-10">
      <h2 className="text-2xl font-bold text-white mb-4">
        My Favorite Asteroids
      </h2>

      <div className="space-y-4">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="bg-gray-900/70 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div>
              <p className="text-white font-semibold">{fav.name}</p>
              <p className="text-xs text-gray-500">API ID: {fav.asteroid_id}</p>

              <textarea
                className="mt-2 w-full bg-black/40 border border-gray-700 rounded-md text-sm text-gray-200 p-2"
                placeholder="Your personal note..."
                value={fav.notes || ""}
                onChange={(e) => handleChange(fav.id, "notes", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => handleSave(fav)}
                className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm flex items-center gap-1"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => handleDelete(fav.id)}
                className="px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-white text-sm flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
