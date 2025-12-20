// src/components/FavoritesView.jsx
import { useState, useRef, useEffect } from "react";
import { Trash2, Edit2, Save } from "lucide-react";
import * as THREE from "three";
import { motion } from "framer-motion";

/* ================
   EXPLORE-STYLE BG
================ */

function ExploreStyleBackground() {
  const bgCanvasRef = useRef(null);
  const floatCanvasRef = useRef(null);

  // BACK STARFIELD + MOONS (same as Explore, but no colored planets)
  useEffect(() => {
    if (!bgCanvasRef.current) return;

    const canvas = bgCanvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02010a, 0.0016);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 70);

    // dense starfield
    const starGeom = new THREE.BufferGeometry();
    const starCount = 6000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 500;
      positions[i + 1] = (Math.random() - 0.5) * 500;
      positions[i + 2] = (Math.random() - 0.5) * 500;
    }
    starGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      transparent: true,
      opacity: 0.95,
    });
    const stars = new THREE.Points(starGeom, starMat);
    scene.add(stars);

    // gray moons instead of colorful planets
    const moonGeom = new THREE.SphereGeometry(1.3, 20, 20);
    for (let i = 0; i < 18; i++) {
      const moon = new THREE.Mesh(
        moonGeom,
        new THREE.MeshStandardMaterial({
          color: 0x9ca3af,
          roughness: 0.9,
          metalness: 0.1,
        })
      );
      moon.position.set(
        (Math.random() - 0.5) * 420,
        (Math.random() - 0.5) * 420,
        (Math.random() - 0.5) * 420
      );
      moon.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const s = 0.3 + Math.random() * 0.7;
      moon.scale.set(s, s, s);
      scene.add(moon);
    }

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(10, 20, 20);
    scene.add(dir);

    let frameId;
    const clock = new THREE.Clock();

    const animateScene = () => {
      frameId = requestAnimationFrame(animateScene);
      const t = clock.getElapsedTime();
      stars.rotation.y += 0.002;
      stars.rotation.x += 0.001;
      camera.position.z = 70 + Math.sin(t * 0.15) * 3;
      renderer.render(scene, camera);
    };

    animateScene();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      starGeom.dispose();
      moonGeom.dispose();
    };
  }, []);

  // FOREGROUND FLOATING MOONS (replace colored asteroids with gray)
  useEffect(() => {
    if (!floatCanvasRef.current) return;

    const canvas = floatCanvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 30);

    const moonGeom = new THREE.IcosahedronGeometry(1.6, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x9ca3af,
      flatShading: true,
    });

    const moons = [];
    for (let i = 0; i < 22; i++) {
      const mesh = new THREE.Mesh(moonGeom, material);
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        -10 - Math.random() * 20
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const s = 0.5 + Math.random() * 1.4;
      mesh.scale.set(s, s, s);
      scene.add(mesh);
      moons.push(mesh);
    }

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(-10, 10, 20);
    scene.add(dir);

    let frameId;
    const clock = new THREE.Clock();

    const animateScene = () => {
      frameId = requestAnimationFrame(animateScene);
      const t = clock.getElapsedTime();

      moons.forEach((m, i) => {
        m.rotation.y += 0.01 + i * 0.0007;
        m.rotation.x += 0.008 + i * 0.0004;
        m.position.y += Math.sin(t * 0.6 + i) * 0.003;
      });

      renderer.render(scene, camera);
    };

    animateScene();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      moonGeom.dispose();
    };
  }, []);

  return (
    <>
      <canvas ref={bgCanvasRef} className="fixed inset-0 z-0" />
      <canvas
        ref={floatCanvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />
    </>
  );
}

/* ================
   FAVORITES VIEW
================ */

export default function FavoritesView({
  favorites,
  onUpdateFavorite,
  onRemoveFavorite,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState("");

  const handleUpdateNote = async (id) => {
    await onUpdateFavorite(id, editNote);
    setEditingId(null);
    setEditNote("");
  };

  const empty = !favorites || favorites.length === 0;

  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-black">
      <ExploreStyleBackground />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 min-h-screen flex flex-col"
      >
        {/* header: only count */}
        <header className="pt-24 px-6 md:px-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div />
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-[0.25em]">
                Saved
              </p>
              <p className="text-2xl font-bold text-cyan-300">
                {favorites.length.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
        </header>

        {/* empty state */}
        {empty && (
          <div className="flex-1 flex items-center justify-center px-6 pb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-sm tracking-[0.3em] uppercase text-slate-200">
                NO FAVORITES YET
              </h2>
            </motion.div>
          </div>
        )}

        {/* favorites grid (unchanged from previous answer) */}
        {!empty && (
          <main className="flex-1 px-6 md:px-10 pb-16">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {favorites.map((fav) => (
                <motion.article
                  key={fav.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative rounded-3xl border border-cyan-500/25 bg-black/70 backdrop-blur-xl p-6 shadow-[0_18px_80px_rgba(15,23,42,0.85)] hover:-translate-y-2 hover:shadow-[0_26px_90px_rgba(15,23,42,0.9)] transition-transform"
                >
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.18),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(15,23,42,0.9),transparent_60%)] opacity-80" />

                  <div className="relative z-10 flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.26em] text-slate-400 mb-1">
                        Asteroid observation
                      </p>
                      <h3 className="text-lg font-semibold text-slate-50">
                        {fav.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        API ID:{" "}
                        <span className="text-cyan-300">{fav.asteroid_id}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveFavorite(fav.id)}
                      className="p-2 rounded-lg bg-red-900/40 hover:bg-red-700/70 transition-colors"
                      aria-label="Remove favorite"
                    >
                      <Trash2 className="w-4 h-4 text-red-300" />
                    </button>
                  </div>

                  <div className="relative z-10 grid grid-cols-2 gap-3 text-xs text-slate-300 mb-4">
                    {fav.type && (
                      <div className="rounded-xl bg-slate-900/70 border border-slate-700/70 px-3 py-2">
                        <p className="uppercase tracking-[0.2em] text-[10px] text-slate-400">
                          Type
                        </p>
                        <p className="mt-1 text-sm text-teal-300">{fav.type}</p>
                      </div>
                    )}
                    {fav.distance && (
                      <div className="rounded-xl bg-slate-900/70 border border-slate-700/70 px-3 py-2">
                        <p className="uppercase tracking-[0.2em] text-[10px] text-slate-400">
                          Distance
                        </p>
                        <p className="mt-1 text-sm text-sky-300">
                          {fav.distance}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 border-t border-slate-700/70 pt-4">
                    {editingId === fav.id ? (
                      <>
                        <textarea
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          rows={3}
                          className="w-full bg-black/70 border border-cyan-500/40 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          placeholder="Add your observation notes..."
                        />
                        <button
                          onClick={() => handleUpdateNote(fav.id)}
                          className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold text-sm py-2.5 hover:from-cyan-400 hover:to-teal-400 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          Save note
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] uppercase tracking-[0.26em] text-slate-400">
                            Personal log
                          </span>
                          <button
                            onClick={() => {
                              setEditingId(fav.id);
                              setEditNote(fav.notes || "");
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors"
                            aria-label="Edit note"
                          >
                            <Edit2 className="w-4 h-4 text-cyan-300" />
                          </button>
                        </div>
                        <p className="text-sm text-slate-200 italic">
                          {fav.notes && fav.notes.trim().length > 0
                            ? fav.notes
                            : "No notes yet. Click the pen to record what you saw."}
                        </p>
                      </>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </main>
        )}
      </motion.div>
    </div>
  );
}
