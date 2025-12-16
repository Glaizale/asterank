import { X, Star } from "lucide-react";

export default function AsteroidDetailModal({
  asteroid,
  onClose,
  isFavorite,
  addToFavorites,
}) {
  if (!asteroid) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-purple-900/90 to-black/90 rounded-3xl p-10 max-w-3xl w-full border border-purple-500/50 shadow-2xl shadow-purple-500/30"
        style={{ animation: "fadeIn 0.3s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {asteroid.name}
          </h3>

          <button
            onClick={onClose}
            className="p-3 hover:bg-purple-600/50 rounded-xl transition-all hover:scale-110"
          >
            <X className="w-8 h-8 text-purple-400" />
          </button>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-black/40 p-6 rounded-2xl border border-purple-500/30">
            <span className="text-purple-400 text-sm block mb-2">
              Right Ascension
            </span>
            <p className="text-3xl font-mono text-purple-200">{asteroid.ra}°</p>
          </div>

          <div className="bg-black/40 p-6 rounded-2xl border border-pink-500/30">
            <span className="text-pink-400 text-sm block mb-2">
              Declination
            </span>
            <p className="text-3xl font-mono text-pink-200">{asteroid.dec}°</p>
          </div>

          <div className="bg-black/40 p-6 rounded-2xl border border-blue-500/30">
            <span className="text-blue-400 text-sm block mb-2">
              Visual Magnitude
            </span>
            <p className="text-3xl font-mono text-blue-200">{asteroid.vmag}</p>
          </div>

          <div className="bg-black/40 p-6 rounded-2xl border border-indigo-500/30">
            <span className="text-indigo-400 text-sm block mb-2">
              Observation Date
            </span>
            <p className="text-2xl text-indigo-200">{asteroid.date}</p>
          </div>
        </div>

        {/* ACTION */}
        {!isFavorite(asteroid.id) && (
          <button
            onClick={() => {
              addToFavorites(asteroid);
              onClose();
            }}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 flex items-center justify-center gap-3"
          >
            <Star className="w-6 h-6" />
            Add to Favorites
          </button>
        )}
      </div>
    </div>
  );
}
