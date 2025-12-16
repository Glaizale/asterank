import { Star, Trash2, Edit2, Save } from "lucide-react";

export default function FavoritesView({
  favorites,
  editingId,
  editNote,
  setEditingId,
  setEditNote,
  updateNote,
  deleteFavorite,
}) {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-20">
        <Star
          className="w-20 h-20 mx-auto mb-4 text-purple-400/50"
          style={{ animation: "pulse 2s ease-in-out infinite" }}
        />
        <p className="text-purple-300 text-2xl">
          No favorites yet. Start exploring!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {favorites.map((fav) => (
        <div
          key={fav.id}
          className="bg-black/60 backdrop-blur-2xl rounded-3xl p-8 border border-yellow-500/30 hover:border-yellow-400 transition-all hover:shadow-2xl hover:shadow-yellow-500/20"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <Star
                className="w-8 h-8 text-yellow-400 fill-yellow-400"
                style={{ animation: "pulse 2s ease-in-out infinite" }}
              />
              <h3 className="text-3xl font-bold text-yellow-200">{fav.name}</h3>
            </div>
            <button
              onClick={() => deleteFavorite(fav.id)}
              className="p-3 hover:bg-red-600/50 rounded-xl transition-all transform hover:scale-110"
            >
              <Trash2 className="w-6 h-6 text-red-400" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-900/30 p-4 rounded-xl">
              <span className="text-purple-400 text-sm">RA:</span>
              <p className="text-xl font-mono text-white">{fav.ra}°</p>
            </div>
            <div className="bg-pink-900/30 p-4 rounded-xl">
              <span className="text-pink-400 text-sm">Dec:</span>
              <p className="text-xl font-mono text-white">{fav.dec}°</p>
            </div>
            <div className="bg-blue-900/30 p-4 rounded-xl col-span-2">
              <span className="text-blue-400 text-sm">Magnitude:</span>
              <p className="text-xl font-mono text-white">{fav.vmag}</p>
            </div>
          </div>
          <div className="border-t border-purple-500/30 pt-6">
            {editingId === fav.id ? (
              <div className="space-y-3">
                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  placeholder="Add your observation notes..."
                  rows="4"
                />
                <button
                  onClick={() => updateNote(fav.id, editNote)}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  <Save className="w-5 h-5" />
                  Save Note
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-purple-400 text-sm font-semibold">
                    Personal Notes:
                  </span>
                  <button
                    onClick={() => {
                      setEditingId(fav.id);
                      setEditNote(fav.note || "");
                    }}
                    className="p-2 hover:bg-purple-600/50 rounded-lg transition-all"
                  >
                    <Edit2 className="w-5 h-5 text-purple-400" />
                  </button>
                </div>
                <p className="text-purple-200 italic">
                  {fav.note ||
                    "No notes yet. Click edit to add your observations."}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
