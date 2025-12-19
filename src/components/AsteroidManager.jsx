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
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      {/* leave YOUR main page background visible – only add light stars */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(148,163,184,0.7)_1px,transparent_1px)] bg-[size:2px_2px] opacity-60"
        animate={{
          backgroundPosition: ["0px 0px", "70px 50px", "0px 0px"],
        }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />

      {/* simple top bar: title + close, with no big background */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{
            opacity: 1,
            x: [0, 10, 0, -6, 0],
            y: [0, -4, 0, 3, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        >
          <h2 className="text-2xl md:text-3xl font-black drop-shadow-[0_0_12px_rgba(15,23,42,0.8)]">
            <span className="text-sky-400">Asteroid</span>{" "}
            <span className="text-purple-400">Database</span>
          </h2>
        </motion.div>

        <motion.button
          type="button"
          onClick={onClose}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-300/70 bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300 text-slate-950 text-lg font-bold shadow-[0_0_18px_rgba(56,189,248,0.9)] hover:brightness-110"
        >
          ×
        </motion.button>
      </div>

      {/* tiny target info bar, almost transparent */}
      <form
        onSubmit={handleSubmit}
        className="mx-6 mb-2 flex items-center gap-3 rounded-full border border-slate-500/30 bg-black/20 px-4 py-2 backdrop-blur-sm"
      >
        <span className="text-xs md:text-sm text-slate-200/80">
          Target asteroid ID
        </span>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-32 rounded-lg border border-slate-600/40 bg-black/60 px-3 py-1.5 text-xs md:text-sm text-slate-100 outline-none focus:border-sky-400"
          disabled
        />
        <div className="ml-auto flex items-center gap-2 text-[10px] md:text-xs text-slate-200/80">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]" />
          <span>SkyMorph search endpoint</span>
        </div>
      </form>

      {/* MAIN AREA: only a thin translucent box around the table */}
      <div className="flex-1 px-6 pb-6 pt-1">
        <div className="relative flex h-full flex-col">
          {/* status line floating above table */}
          <div className="mb-2 flex items-center justify-between text-[11px] md:text-xs text-slate-100/85">
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-[0.2em] text-slate-300/80">
                Data stream
              </span>
              <span className="h-[1px] w-20 bg-gradient-to-r from-sky-400 via-cyan-400/60 to-transparent" />
              <span>
                {loading
                  ? `Requesting frames for ${target}…`
                  : `Showing ${rows.length} observations for `}
                {!loading && (
                  <span className="font-semibold text-sky-300">{target}</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400/90 shadow-[0_0_12px_rgba(16,185,129,1)]" />
              <span className="text-slate-100/85">
                {loading ? "Live query" : "Snapshot loaded"}
              </span>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden">
            {loading && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-sky-300">
                <motion.div
                  className="h-9 w-9 rounded-full border-2 border-sky-400/40 border-t-sky-300"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <p className="text-xs md:text-sm">
                  Loading observations for{" "}
                  <span className="font-semibold">{target}</span>…
                </p>
              </div>
            )}

            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-red-500/50 bg-red-500/15 px-4 py-3 text-xs md:text-sm text-red-100"
              >
                {error}
              </motion.div>
            )}

            {!loading && !error && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex h-full flex-col"
              >
                {/* only this box: very transparent */}
                <div className="flex-1 overflow-auto rounded-3xl border border-slate-400/35 bg-black/15 backdrop-blur-md shadow-[0_0_30px_rgba(15,23,42,0.8)]">
                  <Table columns={columns} data={rows} />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
