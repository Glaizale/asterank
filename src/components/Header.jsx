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
          {/* LOGO */}
          <div className="flex items-center gap-3">
            {/* ASTEROID – NO BACKGROUND */}
            <svg
              viewBox="0 0 64 64"
              className="w-9 h-9"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 10
                   C8 14 6 22 10 30
                   C6 36 10 48 22 52
                   C30 58 46 54 52 42
                   C58 34 56 20 46 14
                   C38 6 22 6 14 10Z"
                fill="#7c3aed"
              />
              <circle cx="24" cy="26" r="4" fill="#5b21b6" />
              <circle cx="38" cy="22" r="3" fill="#5b21b6" />
              <circle cx="34" cy="40" r="5" fill="#4c1d95" />
            </svg>

            {/* ASTERANK TEXT WITH ROCKET A */}
            <h1
              className="text-xl font-bold tracking-widest flex items-center"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              {/* ROCKET A */}
              <span className="relative mr-1 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                ▲
                <span className="absolute left-1/2 -bottom-1 w-1 h-2 bg-cyan-400 blur-sm transform -translate-x-1/2"></span>
              </span>

              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                STERANK
              </span>
            </h1>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            {/* NAV */}
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

            {/* REFRESH */}
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-cyan-400"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* USER */}
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
      </div>
    </header>
  );
}
