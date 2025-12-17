export default function AsteroidManager({ user, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-zinc-900 p-10 rounded-2xl text-white max-w-lg w-full text-center">
        <h2 className="text-3xl font-bold mb-4">Asteroid Database</h2>

        <p className="text-gray-400 mb-6">
          Welcome {user?.name || "Explorer"}, this is the asteroid manager
          panel.
        </p>

        <button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold"
        >
          Close
        </button>
      </div>
    </div>
  );
}
