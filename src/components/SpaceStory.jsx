import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import * as THREE from "three";
import SpaceScene from "../scenes/SpaceScene";
import AsteroidExplorer from "./AsteroidExplorer";
import { apiService } from "../services/api";
import { Rocket, Star, Globe, Satellite, Compass, Zap } from "lucide-react";

export default function SpaceStory({ user, onLogout }) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [asteroids, setAsteroids] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showAsteroids, setShowAsteroids] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef();
  const { scrollYProgress } = useScroll({ container: containerRef });

  // Transform scroll to chapter
  const chapterProgress = useTransform(scrollYProgress, [0, 1], [0, 4]);

  useEffect(() => {
    const unsubscribe = chapterProgress.on("change", (value) => {
      setCurrentChapter(Math.floor(value));
      setScrollProgress(value);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    loadAsteroids();
    loadFavorites();
  }, []);

  const loadAsteroids = async () => {
    const data = await apiService.getAsteroids();
    setAsteroids(data.data || []);
  };

  const loadFavorites = async () => {
    const data = await apiService.getFavorites();
    setFavorites(data.data || []);
  };

  const toggleFavorite = async (asteroid) => {
    const result = await apiService.toggleFavorite(asteroid.id, asteroid.name);
    if (result.success) {
      loadFavorites();
    }
  };

  const storyChapters = [
    {
      title: "THE COSMIC BEGINNING",
      subtitle: "4.6 Billion Years Ago",
      description:
        "In the swirling cosmic dust of a young solar system, asteroids were born. These ancient wanderers hold secrets from the dawn of our planetary neighborhood.",
      color: "from-purple-900/90 to-indigo-900/70",
      icon: <Globe className="w-16 h-16" />,
      animation: "stars",
    },
    {
      title: "THE BELT FRONTIER",
      subtitle: "Between Mars and Jupiter",
      description:
        "The asteroid belt—a cosmic ring of millions of space rocks, each a potential treasure chest of rare minerals and precious metals.",
      color: "from-blue-900/90 to-cyan-900/70",
      icon: <Satellite className="w-16 h-16" />,
      animation: "belt",
    },
    {
      title: "THE MINING REVOLUTION",
      subtitle: "Space Resources Unlimited",
      description:
        "A single asteroid can contain more platinum than all reserves on Earth. The cosmic gold rush begins 4 billion kilometers from home.",
      color: "from-amber-900/90 to-yellow-900/70",
      icon: <Zap className="w-16 h-16" />,
      animation: "mining",
    },
    {
      title: "YOUR MISSION",
      subtitle: "Explore the Asterank Database",
      description:
        "Access real-time asteroid data from the Asterank API. Track, analyze, and claim your place in space exploration history.",
      color: "from-emerald-900/90 to-green-900/70",
      icon: <Rocket className="w-16 h-16" />,
      animation: "mission",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* 3D Space Background */}
      <SpaceScene scrollProgress={scrollProgress} />

      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 z-10" />
      <div
        className={`fixed inset-0 bg-gradient-to-br ${
          storyChapters[currentChapter]?.color ||
          "from-purple-900/20 to-blue-900/20"
        } transition-all duration-1000 z-10`}
      />

      {/* Main Content */}
      <div
        ref={containerRef}
        className="relative z-20 h-screen overflow-y-auto scroll-smooth"
      >
        {/* Chapter 0: Welcome */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-6xl mx-auto text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-8"
            >
              <Star className="w-20 h-20 text-cyan-400" />
            </motion.div>

            <h1 className="text-7xl md:text-9xl font-bold mb-6">
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                ASTEROID
              </span>
              <span className="block text-white mt-4">ODYSSEY</span>
            </h1>

            <p className="text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              A cosmic journey through the asteroid frontier. Discover the
              untold stories of space rocks that shaped our solar system.
            </p>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-20"
            >
              <p className="text-cyan-400 text-sm tracking-widest">
                SCROLL TO BEGIN JOURNEY
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Story Chapters */}
        {storyChapters.map((chapter, index) => (
          <motion.section
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="min-h-screen flex items-center justify-center px-6 py-20"
          >
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-4 mb-8">
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    {chapter.icon}
                  </div>
                  <div>
                    <span className="text-cyan-300 font-semibold tracking-widest">
                      CHAPTER {index + 1}
                    </span>
                    <p className="text-xl text-gray-300">{chapter.subtitle}</p>
                  </div>
                </div>

                <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                  {chapter.title}
                </h2>

                <p className="text-xl text-gray-300 leading-relaxed mb-12">
                  {chapter.description}
                </p>

                {index === 3 && (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      repeatType: "reverse",
                    }}
                  >
                    <button
                      onClick={() => setShowAsteroids(true)}
                      className="group px-12 py-6 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 rounded-2xl text-white font-bold text-2xl flex items-center gap-4 transition-all duration-300"
                    >
                      <Compass className="w-8 h-8 group-hover:rotate-180 transition-transform" />
                      EXPLORE ASTEROID DATABASE
                    </button>
                  </motion.div>
                )}
              </div>

              <div className="relative h-96">
                {/* Animated Elements for Each Chapter */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl border border-white/10 backdrop-blur-sm" />

                {chapter.animation === "stars" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(50)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                        animate={{
                          x: Math.sin(i * 0.5 + scrollProgress * 10) * 100,
                          y: Math.cos(i * 0.5 + scrollProgress * 10) * 100,
                        }}
                        transition={{ duration: 2 + i * 0.1 }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        ))}

        {/* User Info */}
        <div className="fixed top-6 right-6 z-30">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-gray-400 text-sm">Space Explorer</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-900/30 hover:bg-red-800/40 text-red-400 rounded-lg border border-red-500/20 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Asteroid Explorer Modal */}
      <AnimatePresence>
        {showAsteroids && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <AsteroidExplorer
              asteroids={asteroids}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onClose={() => setShowAsteroids(false)}
              user={user}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
