// src/pages/FavoritesPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Save } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/favorites", {
        withCredentials: true,
      });
      setFavorites(res.data);
    } catch (err) {
      console.error("Error loading favorites", err);
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
      const res = await axios.put(
        `http://localhost:8000/api/favorites/${fav.id}`,
        {
          note: fav.note,
          rating: fav.rating ? Number(fav.rating) : null,
        },
        { withCredentials: true }
      );
      setFavorites((prev) => prev.map((f) => (f.id === fav.id ? res.data : f)));
    } catch (err) {
      console.error("Error updating favorite", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/favorites/${id}`, {
        withCredentials: true,
      });
      setFavorites((prev) => prev.filter((f) => f.id !== id));
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
              <p className="text-white font-semibold">{fav.asteroid_name}</p>
              <p className="text-xs text-gray-500">API ID: {fav.asteroid_id}</p>

              <textarea
                className="mt-2 w-full bg-black/40 border border-gray-700 rounded-md text-sm text-gray-200 p-2"
                placeholder="Your personal note..."
                value={fav.note || ""}
                onChange={(e) => handleChange(fav.id, "note", e.target.value)}
              />

              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs text-gray-400">Rating (1–5):</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="w-16 bg-black/40 border border-gray-700 rounded-md text-sm text-gray-200 px-2 py-1"
                  value={fav.rating || ""}
                  onChange={(e) =>
                    handleChange(fav.id, "rating", e.target.value)
                  }
                />
              </div>
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
