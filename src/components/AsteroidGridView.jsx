import { Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AsteroidGridView({
  asteroids,
  favorites,
  onToggleFavorite,
  onSelectAsteroid,
  loading,
}) {
  const isFavorite = (asteroidId) => {
    return favorites.some((fav) => fav.asteroid_id === asteroidId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-cyan-400 animate-pulse" />
          <p className="text-xl text-gray-400">Loading asteroids...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
          Asteroid Database
        </h1>
        <p className="text-gray-400">
          Explore {asteroids.length} asteroids and save your favorites
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {asteroids.map((asteroid, index) => (
          <motion.div
            key={asteroid.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="bg-gradient-to-br from-gray-900/90 to-black/80 backdrop-blur-xl border border-gray-800 hover:border-cyan-500/50 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
          >
            {/* Header with Name and Favorite Button */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{asteroid.name}</h3>
              <button
                onClick={() => onToggleFavorite(asteroid)}
                className={`p-2 rounded-lg transition-all ${
                  isFavorite(asteroid.id)
                    ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                    : "bg-gray-800 text-gray-400 hover:bg-cyan-600/30 hover:text-cyan-400"
                }`}
                title={isFavorite(asteroid.id) ? "Remove from favorites" : "Add to favorites"}
              >
                <Star
                  className={`w-5 h-5 ${isFavorite(asteroid.id) ? "fill-yellow-400" : ""}`}
                />
              </button>
            </div>

            {/* Asteroid Details */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Type:</span>
                <span className="text-cyan-300">{asteroid.type || "Unknown"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Distance:</span>
                <span className="text-purple-300">{asteroid.distance || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Diameter:</span>
                <span className="text-blue-300">{asteroid.diameter || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Value:</span>
                <span className="text-green-300 font-semibold">
                  {asteroid.value || "N/A"}
                </span>
              </div>
            </div>

            {/* View Details Button */}
            <button
              onClick={() => onSelectAsteroid(asteroid)}
              className="w-full py-2 px-4 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white text-sm font-medium transition-all"
            >
              View Details
            </button>
          </motion.div>
        ))}
      </div>

      {asteroids.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">No asteroids found</p>
        </div>
      )}
    </div>
  );
}
