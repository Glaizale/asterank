import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import * as THREE from "three";
import AsteroidManager from "./AsteroidManager";

export default function AsterankStoryExplorer({ user }) {
  const [showAsteroidManager, setShowAsteroidManager] = useState(false);
  const [asteroidData, setAsteroidData] = useState(null);

  const containerRef = useRef(null);
  const canvasRef = useRef(null); // background stars, planet, moon, main asteroid
  const floatingRef = useRef(null); // original floating asteroids canvas

  /* ===================== SCROLL ===================== */
  const { scrollY } = useScroll({ container: containerRef });
  const timeline = useMotionValue(0);

  useEffect(() => {
    animate(timeline, 1, { duration: 0.9, ease: "easeOut" });
  }, []);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      timeline.set(1 + latest / 300);
    });
  }, [scrollY]);

  /* ===================== FETCH ASTEROID DATA ===================== */
  useEffect(() => {
    fetch("https://www.asterank.com/api/skymorph/search?target=J99TS7A")
      .then((res) => res.json())
      .then((data) => setAsteroidData(data[0] || data))
      .catch(console.error);
  }, []);

  /* ===================== BACKGROUND SCENE (stars, planet, moon, main asteroid) ===================== */
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000010);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // -------------------- Stars --------------------
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 6000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 500;
    }
    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.25,
        transparent: true,
        opacity: 0.8,
      })
    );
    scene.add(stars);

    // -------------------- Planet --------------------
    const planetGeometry = new THREE.SphereGeometry(5, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({
      color: 0x2244ff,
      roughness: 0.8,
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.set(-20, -10, -30);
    scene.add(planet);

    // -------------------- Moon --------------------
    const moonGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: 0x999999,
      roughness: 0.9,
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    // -------------------- Main Asteroid --------------------
    const asteroidGeometry = new THREE.IcosahedronGeometry(2, 1);
    const asteroidMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      roughness: 1,
      transparent: true,
      opacity: 0.9,
    });
    const mainAsteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    mainAsteroid.position.set(10, 5, -20);
    scene.add(mainAsteroid);

    // -------------------- Lights --------------------
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(50, 50, 50);
    scene.add(dirLight);
    scene.add(new THREE.AmbientLight(0x404040, 0.6));

    // -------------------- Animation Loop --------------------
    const animateScene = () => {
      requestAnimationFrame(animateScene);

      stars.rotation.y += 0.0008;

      planet.rotation.y += 0.002;
      moon.position.set(
        planet.position.x + Math.cos(Date.now() * 0.001) * 8,
        planet.position.y + Math.sin(Date.now() * 0.001) * 8,
        planet.position.z + Math.sin(Date.now() * 0.001) * 3
      );

      mainAsteroid.rotation.x += 0.002;
      mainAsteroid.rotation.y += 0.003;

      renderer.render(scene, camera);
    };

    animateScene();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ===================== ORIGINAL FLOATING ASTEROIDS (UNCHANGED) ===================== */
  useEffect(() => {
    if (!floatingRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: floatingRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 50;

    const asteroids = [];
    for (let i = 0; i < 30; i++) {
      const mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(Math.random() * 1.2 + 0.6, 1),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 1,
          transparent: true,
          opacity: 0.6,
        })
      );

      mesh.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 100
      );

      scene.add(mesh);
      asteroids.push(mesh);
    }

    scene.add(new THREE.DirectionalLight(0xffffff, 0.8));

    const animateAsteroids = () => {
      requestAnimationFrame(animateAsteroids);
      asteroids.forEach((a, i) => {
        a.rotation.x += 0.001 + i * 0.0001;
        a.rotation.y += 0.002;
      });
      renderer.render(scene, camera);
    };

    animateAsteroids();
  }, []);

  /* ===================== TITLE MOTION ===================== */
  const asteroidX = useTransform(timeline, [0, 1, 3], ["60vw", "0vw", "-70vw"]);
  const explorerX = useTransform(timeline, [0, 1, 3], ["-60vw", "0vw", "70vw"]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0" />
      <canvas ref={floatingRef} className="fixed inset-0 pointer-events-none" />

      <div
        ref={containerRef}
        className="relative z-10 h-screen overflow-y-auto"
      >
        {/* ===================== HERO ===================== */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
          <motion.h1
            style={{ x: asteroidX }}
            className="text-8xl font-extrabold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent"
          >
            ASTEROID
          </motion.h1>
          <motion.h1
            style={{ x: explorerX }}
            className="text-8xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mt-6"
          >
            EXPLORER
          </motion.h1>
          <p className="mt-10 text-2xl text-gray-300 max-w-3xl">
            A cinematic journey through real asteroid intelligence.
          </p>
        </section>

        {/* ===================== DATA STORY ===================== */}
        <section className="min-h-screen flex items-center justify-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {[
              {
                label: "Asteroid ID",
                value: asteroidData?.full_name || "J99TS7A",
              },
              {
                label: "Orbit Class",
                value: asteroidData?.orbit_class || "Main Belt",
              },
              {
                label: "Estimated Diameter",
                value: asteroidData?.diameter || "Unknown",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 text-center"
              >
                <p className="text-gray-400 uppercase tracking-widest text-sm">
                  {item.label}
                </p>
                <h3 className="text-4xl font-bold text-white mt-4">
                  {item.value}
                </h3>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ===================== STORY CHAPTERS ===================== */}
        {[
          {
            chapter: "Chapter I",
            title: "A Birth in the Main Belt",
            text: `Our asteroid ${
              asteroidData?.full_name || "J99TS7A"
            } formed billions of years ago in the asteroid belt, a relic of the early solar system.`,
            color: "text-cyan-400",
          },
          {
            chapter: "Chapter II",
            title: "Drifting Through Space",
            text: `It silently orbits the Sun, traveling millions of kilometers every year. Its orbit class is "${
              asteroidData?.orbit_class || "Main Belt"
            }".`,
            color: "text-orange-400",
          },
          {
            chapter: "Chapter III",
            title: "Preserving Ancient Secrets",
            text: `This asteroid holds a time capsule of the early solar system, its estimated diameter is ${
              asteroidData?.diameter || "Unknown"
            } km, keeping cosmic history intact.`,
            color: "text-purple-400",
          },
          {
            chapter: "Chapter IV",
            title: "A Cosmic Treasure",
            text: `Asteroids like ${
              asteroidData?.full_name || "J99TS7A"
            } are potential resources for metals and water, fueling humanity's future in space.`,
            color: "text-pink-400",
          },
          {
            chapter: "Chapter V",
            title: "The Explorer Awaits",
            text: "Our journey today is only observation, tomorrow we may visit and mine, fulfilling humanity's curiosity and ambition.",
            color: "text-green-400",
          },
        ].map((story, i) => (
          <section
            key={i}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-4xl text-center"
            >
              <p className={`uppercase tracking-[0.4em] mb-6 ${story.color}`}>
                {story.chapter}
              </p>
              <h2 className="text-6xl font-extrabold text-white mb-8">
                {story.title}
              </h2>
              <p className="text-2xl text-gray-300 leading-relaxed">
                {story.text}
              </p>
            </motion.div>
          </section>
        ))}

        {/* ===================== FINAL CTA ===================== */}
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
