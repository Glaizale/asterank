import { Star, User, LogOut, RefreshCw } from "lucide-react";

export default function Header({
  user,
  view,
  setView,
  favorites,
  handleLogout,
  onShowLogin,
  onRefresh,
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-lg border-b border-gray-800/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1
              className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              ASTERANK
            </h1>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("explore")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === "explore"
                    ? "bg-cyan-900/30 text-cyan-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                Explore
              </button>
              <button
                onClick={() => setView("grid")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === "grid"
                    ? "bg-blue-900/30 text-blue-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                Asteroids
              </button>
              <button
                onClick={() => setView("favorites")}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  view === "favorites"
                    ? "bg-purple-900/30 text-purple-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <Star className="w-4 h-4" />
                Favorites {favorites.length > 0 && `(${favorites.length})`}
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-cyan-400"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-white font-medium">
                  {user?.name || "Explorer"}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setView("explore")}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              view === "explore"
                ? "bg-cyan-900/30 text-cyan-400"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setView("favorites")}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              view === "favorites"
                ? "bg-purple-900/30 text-purple-400"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <Star className="w-4 h-4" />
            Favorites {favorites.length > 0 && `(${favorites.length})`}
          </button>
        </div>
      </div>
    </header>
  );
}
