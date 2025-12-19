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
        <Star className="w-20 h-20 mx-auto mb-4 text-purple-400/50 animate-pulse" />
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
    <div className="relative min-h-screen overflow-hidden">
      {/* simple animated gradient background (no custom CSS) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-slate-950 via-slate-900 to-black" />

      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-purple-500/40 bg-slate-950/70 px-4 py-2 backdrop-blur-xl">
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="text-xs tracking-[0.3em] uppercase text-purple-200">
              Favorites Dock
            </span>
          </div>
          {/* count badge, no sentence */}
          <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-[0.25em]">
            <span className="h-[1px] w-10 bg-purple-400/60" />
            <span>{favorites.length.toString().padStart(2, "0")} saved</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {favorites.map((fav, index) => (
            <div
              key={fav.id}
              className="
                group relative rounded-3xl border border-purple-500/30 
                bg-gradient-to-br from-slate-900/70 via-slate-950/90 to-black/80
                backdrop-blur-xl p-6
                shadow-[0_18px_60px_rgba(15,23,42,0.9)]
                transition-all duration-400 
                hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(168,85,247,0.6)]
                hover:rotate-[0.5deg]
              "
              style={{
                // simple staggered fade + slide without defining keyframes
                opacity: 1,
                transform: `translateY(0px)`,
                transitionDelay: `${index * 60}ms`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-300 fill-yellow-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]" />
                  <h3 className="text-2xl font-semibold text-white tracking-[0.08em]">
                    {fav.name}
                  </h3>
                </div>
                <button
                  onClick={() => handleDelete(fav.id, fav.name)}
                  className="p-2 rounded-lg transition-all hover:bg-red-600/40 hover:scale-105"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                {fav.type && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type</span>
                    <span className="text-cyan-300 font-medium">
                      {fav.type}
                    </span>
                  </div>
                )}
                {fav.distance && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Distance</span>
                    <span className="text-purple-200">{fav.distance}</span>
                  </div>
                )}
                {fav.value && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated value</span>
                    <span className="text-emerald-300">{fav.value}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-purple-500/20 pt-4">
                {editingId === fav.id ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-300 text-xs font-semibold tracking-[0.18em] uppercase">
                        Edit notes
                      </span>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditNote("");
                        }}
                        className="p-1 hover:bg-slate-800/70 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                    <textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      className="w-full px-3 py-2 bg-black/60 border border-purple-500/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-100 text-sm resize-none"
                      placeholder="Log your mission notes for this object..."
                      rows="3"
                    />
                    <button
                      onClick={() => handleUpdateNote(fav.id)}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-medium text-slate-950"
                    >
                      <Save className="w-4 h-4" />
                      Save note
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-300 text-xs font-semibold tracking-[0.18em] uppercase">
                        Personal log
                      </span>
                      <button
                        onClick={() => {
                          setEditingId(fav.id);
                          setEditNote(fav.notes || "");
                        }}
                        className="p-1 rounded transition-all hover:bg-purple-600/40 hover:scale-105"
                        title="Edit notes"
                      >
                        <Edit2 className="w-4 h-4 text-purple-300" />
                      </button>
                    </div>
                    <p className="text-slate-200 text-sm italic leading-relaxed">
                      {fav.notes ||
                        "No notes yet. Tap the pen icon to record your observations."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
