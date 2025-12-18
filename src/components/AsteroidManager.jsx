import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Table from "./Table";

const API_URL = "http://localhost:8000/api";

export default function AsteroidManager({ user, onClose }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState("J99TS7A");
  const [error, setError] = useState("");

  const loadData = (t = target) => {
    setLoading(true);
    setError("");
    fetch(`${API_URL}/asteroids?target=${encodeURIComponent(t)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("AsteroidManager fetched:", data);
        if (
          data &&
          data.success &&
          data.data &&
          Array.isArray(data.data.results)
        ) {
          setRows(data.data.results);
          setTarget(data.target || t);
        } else {
          setRows([]);
          setError(data?.message || "Unexpected API response");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading asteroid observations:", err);
        setRows([]);
        setError("Failed to load asteroid data");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData("J99TS7A");
  }, []);

  const columns = [
    { Header: "Obs ID", accessor: "obs_id" },
    { Header: "Time", accessor: "time" },
    { Header: "Mag", accessor: "mag" },
    { Header: "Center RA", accessor: "center_ra" },
    { Header: "Center Dec", accessor: "center_dec" },
    { Header: "Vel W–E", accessor: "veloc_we" },
    { Header: "Vel S–N", accessor: "veloc_sn" },
    { Header: "Offset (')", accessor: "offset" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!target.trim()) return;
    loadData(target.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold">
            <span className="text-cyan-400">Asteroid</span>{" "}
            <span className="text-purple-400">Database</span>
          </h2>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            Live observations from the Asterank SkyMorph API for your target.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Target input */}
      <form
        onSubmit={handleSubmit}
        className="px-6 pt-4 pb-2 flex flex-wrap items-center gap-3 border-b border-gray-800"
      >
        <label className="text-gray-300 text-sm md:text-base">
          Target:&nbsp;
        </label>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="px-3 py-2 rounded-lg bg-black/60 border border-gray-700 text-white text-sm md:text-base focus:outline-none focus:border-cyan-500"
          placeholder="e.g. J99TS7A"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm md:text-base"
        >
          Search
        </button>
        <span className="ml-auto text-xs md:text-sm text-gray-500">
          Logged in as {user?.name || "Explorer"}
        </span>
      </form>

      {/* Content */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col gap-4">
        {loading && (
          <div className="text-cyan-400 animate-pulse">
            Loading observations for {target}...
          </div>
        )}

        {error && !loading && <div className="text-red-400 mb-2">{error}</div>}

        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-2 text-xs md:text-sm text-gray-400">
              <span>
                Showing {rows.length} observations for target{" "}
                <span className="text-cyan-400 font-semibold">{target}</span>
              </span>
              <span>Source: SkyMorph search endpoint</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1"
            >
              <Table columns={columns} data={rows} />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
