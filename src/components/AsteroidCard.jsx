// src/components/AsteroidCard.jsx
import { Star } from "lucide-react";

export default function AsteroidCard({
  asteroid,
  isFavorite,
  onToggleFavorite,
  onSelectAsteroid,
}) {
  return (
    <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-white">{asteroid.name}</h3>

        <button
          onClick={() => onToggleFavorite(asteroid)}
          className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors ${
            isFavorite
              ? "bg-purple-700 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-cyan-600 hover:text-white"
          }`}
        >
          <Star className="w-4 h-4" />
          {isFavorite ? "Remove Favorite" : "Add to Favorites"}
        </button>
      </div>

      {/* rest of asteroid info here */}
      <p className="text-xs text-gray-400">Type: {asteroid.type}</p>

      <button
        onClick={() => onSelectAsteroid(asteroid)}
        className="self-start mt-1 text-xs text-cyan-400 hover:underline"
      >
        View Details
      </button>
    </div>
  );
}
