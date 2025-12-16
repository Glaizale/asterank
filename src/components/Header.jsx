import { Star, Moon, Sparkles, User, LogOut } from "lucide-react";

export default function Header({
  user,
  view,
  setView,
  favorites,
  handleLogout,
  onShowLogin,
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b border-purple-500/20 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              ASTERANK
            </h1>
            <span className="text-xs text-purple-300 bg-purple-900/30 px-2 py-1 rounded-full">
              Cosmic Explorer
            </span>
          </div>

          {/* Navigation & User */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Explore Button */}
            <button
              onClick={() => setView("explore")}
              className={`px-6 py-2.5 rounded-xl transition-all transform hover:scale-105 flex items-center gap-2 font-medium ${
                view === "explore"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50 text-white"
                  : "bg-white/10 hover:bg-white/20 text-gray-300"
              }`}
            >
              <Moon className="w-4 h-4" />
              Explore
            </button>

            {/* Favorites Button */}
            <button
              onClick={() => setView("favorites")}
              className={`px-6 py-2.5 rounded-xl transition-all transform hover:scale-105 flex items-center gap-2 font-medium relative ${
                view === "favorites"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50 text-white"
                  : "bg-white/10 hover:bg-white/20 text-gray-300"
              }`}
            >
              <Star className="w-4 h-4" />
              Favorites
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* User Section */}
            <div className="flex items-center gap-3 pl-4 border-l border-purple-500/30">
              {user ? (
                <>
                  <div className="flex items-center gap-2 bg-purple-900/30 px-3 py-1.5 rounded-lg">
                    <User className="w-4 h-4 text-purple-300" />
                    <span className="text-purple-200 font-medium">
                      {user.name || user.email?.split("@")[0] || "User"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl transition-all flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={onShowLogin}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
