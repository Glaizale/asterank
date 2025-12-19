import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 right-6 z-50 animate-slideInRight">
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-xl border ${
          type === "success"
            ? "bg-green-900/90 border-green-500/50 text-green-100"
            : "bg-red-900/90 border-red-500/50 text-red-100"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-6 h-6" />
        ) : (
          <XCircle className="w-6 h-6" />
        )}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
