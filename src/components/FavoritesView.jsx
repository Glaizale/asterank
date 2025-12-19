import { useState } from "react";
import { Star, Trash2, Edit2, Save, X } from "lucide-react";

export default function FavoritesView({
  favorites,
  onRefresh,
  onUpdateFavorite,
  onRemoveFavorite,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState("");

  const handleUpdateNote = async (favoriteId) => {
    await onUpdateFavorite(favoriteId, editNote);
    setEditingId(null);
    setEditNote("");
  };

  const handleDelete = (favoriteId, asteroidName) => {
    onRemoveFavorite(favoriteId, asteroidName);
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20">
        <Star
          className="w-20 h-20 mx-auto mb-4 text-purple-400/50"
          style={{ animation: "pulse 2s ease-in-out infinite" }}
        />
        <p className="text-purple-300 text-2xl mb-4">
          No favorites yet. Start exploring!
        </p>
        <p className="text-gray-400 text-sm">
          Click the ⭐ button on any asteroid to save it to your favorites.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400 mb-2">
          My Favorite Planets
        </h1>
        <p className="text-gray-400">You have {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="bg-gradient-to-br from-purple-900/40 to-black/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/60 transition-all hover:shadow-lg hover:shadow-purple-500/20"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star
                  className="w-6 h-6 text-yellow-400 fill-yellow-400"
                />
                <h3 className="text-2xl font-bold text-white">{fav.name}</h3>
              </div>
              <button
                onClick={() => handleDelete(fav.id, fav.name)}
                className="p-2 hover:bg-red-600/50 rounded-lg transition-all"
                title="Remove from favorites"
              >
                <Trash2 className="w-5 h-5 text-red-400" />
              </button>
            </div>
            
            <div className="space-y-2 mb-4">
              {fav.type && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-cyan-300">{fav.type}</span>
                </div>
              )}
              {fav.distance && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Distance:</span>
                  <span className="text-purple-300">{fav.distance}</span>
                </div>
              )}
              {fav.value && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Value:</span>
                  <span className="text-green-300">{fav.value}</span>
                </div>
              )}
            </div>
            <div className="border-t border-purple-500/20 pt-4">
              {editingId === fav.id ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-400 text-sm font-semibold">
                      Edit Notes:
                    </span>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditNote("");
                      }}
                      className="p-1 hover:bg-gray-700/50 rounded"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <textarea
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm"
                    placeholder="Add your personal notes about this asteroid..."
                    rows="3"
                  />
                  <button
                    onClick={() => handleUpdateNote(fav.id)}
                    className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    Save Note
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-400 text-sm font-semibold">
                      Personal Notes:
                    </span>
                    <button
                      onClick={() => {
                        setEditingId(fav.id);
                        setEditNote(fav.notes || "");
                      }}
                      className="p-1 hover:bg-purple-600/50 rounded transition-all"
                      title="Edit notes"
                    >
                      <Edit2 className="w-4 h-4 text-purple-400" />
                    </button>
                  </div>
                  <p className="text-gray-300 text-sm italic">
                    {fav.notes || "No notes yet. Click edit to add your observations."}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
