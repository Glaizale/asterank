import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import * as THREE from "three";
import axios from "axios";
import AsteroidManager from "./AsteroidManager";
import AsteroidStories from "./AsteroidStories";
import AsteroidCard from "./AsteroidCard";

const API_URL = "http://localhost:8000/api";

export default function AsterankStoryExplorer({ user, onToggleFavorite }) {
  const [showAsteroidManager, setShowAsteroidManager] = useState(false);
  const [asteroidData, setAsteroidData] = useState(null);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const floatingRef = useRef(null);

  const { scrollY } = useScroll({ container: containerRef });
  const timeline = useMotionValue(0);

  useEffect(() => {
    animate(timeline, 1, { duration: 0.9, ease: "easeOut" });
  }, [timeline]);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      timeline.set(1 + latest / 300);
    });
  }, [scrollY, timeline]);

  // background three.js
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
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

    const moonGeom = new THREE.SphereGeometry(1.2, 16, 16);
    for (let i = 0; i < 20; i++) {
      const moon = new THREE.Mesh(
        moonGeom,
        new THREE.MeshStandardMaterial({
          color: 0x888888,
          roughness: 0.9,
          metalness: 0.1,
        })
      );
      moon.position.set(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400
      );
      moon.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const s = 0.2 + Math.random() * 0.5;
      moon.scale.set(s, s, s);
      scene.add(moon);
    }

    const planetGeom = new THREE.SphereGeometry(1.4, 20, 20);
    for (let i = 0; i < 10; i++) {
      const planet = new THREE.Mesh(
        planetGeom,
        new THREE.MeshStandardMaterial({
          color: 0x888888,
          roughness: 0.9,
          metalness: 0.1,
        })
      );
      planet.position.set(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400
      );
      planet.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const s = 0.2 + Math.random() * 0.5;
      planet.scale.set(s, s, s);
      scene.add(planet);
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
      planetGeom.dispose();
    };
  }, []);

  // foreground floating asteroids
  useEffect(() => {
    if (!floatingRef.current) return;

    const canvas = floatingRef.current;
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

    const asteroidGeom = new THREE.IcosahedronGeometry(1.6, 1);
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x6366f1, flatShading: true }),
      new THREE.MeshStandardMaterial({ color: 0xf97316, flatShading: true }),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, flatShading: true }),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, flatShading: true }),
    ];

    const asteroids = [];
    for (let i = 0; i < 22; i++) {
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(asteroidGeom, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        -10 - Math.random() * 20
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const s = 0.5 + Math.random() * 1.4;
      mesh.scale.set(s, s, s);
      scene.add(mesh);
      asteroids.push(mesh);
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

      asteroids.forEach((a, i) => {
        a.rotation.y += 0.01 + i * 0.0007;
        a.rotation.x += 0.008 + i * 0.0004;
        a.position.y += Math.sin(t * 0.6 + i) * 0.003;
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
      asteroidGeom.dispose();
    };
  }, []);

  // API fetch
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/asteroids?target=J99TS7A`)
      .then((res) => res.json())
      .then((data) => {
        setAsteroidData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching asteroid data:", err);
        setLoading(false);
      });
  }, []);

  const observations =
    asteroidData &&
    asteroidData.data &&
    Array.isArray(asteroidData.data.results)
      ? asteroidData.data.results
      : [];

  const target = asteroidData?.target || "J99TS7A";

  const asteroidX = useTransform(timeline, [0, 1, 3], ["60vw", "0vw", "-70vw"]);
  const explorerX = useTransform(timeline, [0, 1, 3], ["-60vw", "0vw", "70vw"]);

  const handleFavoriteAdded = () => {
    // optional: toast or local UI update
  };

  // handler used by AsteroidStories
  const handleAddFavoriteFromStory = async (asteroid) => {
    try {
      await onToggleFavorite(asteroid);
      handleFavoriteAdded();
    } catch (err) {
      console.error("Error adding favorite from story", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0" />
      <canvas ref={floatingRef} className="fixed inset-0 pointer-events-none" />

      <div
        ref={containerRef}
        className="relative z-10 h-screen overflow-y-auto"
      >
        {/* HERO */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
          <motion.h1
            style={{ x: asteroidX }}
            className="text-[9vw] md:text-[8vw] leading-none font-extrabold bg-gradient-to-r from-orange-400 via-amber-300 to-red-600 bg-clip-text text-transparent tracking-[0.12em] uppercase"
          >
            ASTEROID
          </motion.h1>

          <motion.h1
            style={{ x: explorerX }}
            className="text-[9vw] md:text-[8vw] leading-none font-extrabold bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-600 bg-clip-text text-transparent mt-6 tracking-[0.12em] uppercase"
          >
            EXPLORER
          </motion.h1>

          <p className="mt-10 text-2xl text-gray-300 max-w-3xl">
            A cinematic journey through real asteroid intelligence.
          </p>
          {loading && (
            <div className="mt-8 text-cyan-400 animate-pulse">
              Loading cosmic data...
            </div>
          )}
        </section>

        {/* STATUS CARDS */}
        <section className="min-h-screen flex items-center justify-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 text-center">
              <p className="text-gray-400 uppercase tracking-widest text-sm">
                Target Asteroid
              </p>
              <h3 className="text-4xl font-bold text-white mt-4">{target}</h3>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 text-center">
              <p className="text-gray-400 uppercase tracking-widest text-sm">
                Total Observations
              </p>
              <h3 className="text-4xl font-bold text-white mt-4">
                {observations.length}
              </h3>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 text-center">
              <p className="text-gray-400 uppercase tracking-widest text-sm">
                API Status
              </p>
              <h3 className="text-4xl font-bold text-white mt-4">
                {loading ? "Loading..." : "Online"}
              </h3>
            </div>
          </motion.div>
        </section>

        {/* SIMPLE LIST WITH ADD TO FAVORITES (if you kept it) */}
        {/* You removed this section already, so it's fine to leave out */}

        {/* STORY SECTIONS */}
        <AsteroidStories
          observations={observations}
          onAddFavorite={handleAddFavoriteFromStory}
        />

        {/* FINAL CTA */}
        <section className="min-h-screen flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.08 }}
            onClick={() => setShowAsteroidManager(true)}
            className="px-16 py-8 bg-gradient-to-r from-cyan-600 to-purple-700 rounded-full text-white text-2xl font-bold shadow-[0_0_80px_rgba(139,92,246,0.7)]"
          >
            ENTER ASTEROID DATABASE
          </motion.button>
        </section>
      </div>

      {showAsteroidManager && (
        <AsteroidManager
          user={user}
          onClose={() => setShowAsteroidManager(false)}
        />
      )}
    </div>
  );
}
