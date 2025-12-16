import { Moon, Star, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function ExploreView({
  loading,
  asteroids = [
    {
      id: 1,
      name: "Ceres",
      date: "2024-01-15",
      ra: 10.5934,
      dec: 7.3401,
      vmag: 6.64,
    },
    {
      id: 2,
      name: "Vesta",
      date: "2024-01-16",
      ra: 15.2341,
      dec: -5.1234,
      vmag: 7.2,
    },
    {
      id: 3,
      name: "Pallas",
      date: "2024-01-17",
      ra: 8.9876,
      dec: 12.4567,
      vmag: 8.1,
    },
    {
      id: 4,
      name: "Hygiea",
      date: "2024-01-18",
      ra: 20.1234,
      dec: -8.7654,
      vmag: 9.5,
    },
  ],
  currentAsteroidIndex = 0,
  isFavorite = () => false,
  addToFavorites = () => {},
  setSelectedAsteroid = () => {},
}) {
  const canvasRefs = useRef([]);
  const scenesRef = useRef([]);
  const renderersRef = useRef([]);
  const objectsRef = useRef([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Create starfield background
    const createStarfield = (scene) => {
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true,
        opacity: 0.8,
      });

      const starsVertices = [];
      for (let i = 0; i < 3000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
      }

      starsGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(starsVertices, 3)
      );
      const starField = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(starField);
      return starField;
    };

    // Setup scene for each asteroid
    asteroids.forEach((asteroid, index) => {
      const canvas = canvasRefs.current[index];
      if (!canvas) return;

      const scene = new THREE.Scene();
      scenesRef.current[index] = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        2000
      );
      camera.position.z = 15;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setClearColor(0x000000, 0);
      renderersRef.current[index] = renderer;

      // Add starfield to all scenes
      createStarfield(scene);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1, 100);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);

      // Create different objects for each asteroid
      let mainObject;

      if (index === 0) {
        // REALISTIC MOON with texture
        const moonGeometry = new THREE.SphereGeometry(4, 64, 64);

        // Create realistic moon texture procedurally
        const canvas2d = document.createElement("canvas");
        canvas2d.width = 1024;
        canvas2d.height = 1024;
        const ctx = canvas2d.getContext("2d");

        // Base gray color
        ctx.fillStyle = "#8a8a8a";
        ctx.fillRect(0, 0, 1024, 1024);

        // Add craters
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * 1024;
          const y = Math.random() * 1024;
          const radius = Math.random() * 50 + 10;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, "#5a5a5a");
          gradient.addColorStop(0.7, "#6a6a6a");
          gradient.addColorStop(1, "#8a8a8a");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Add texture noise
        for (let i = 0; i < 10000; i++) {
          const x = Math.random() * 1024;
          const y = Math.random() * 1024;
          const brightness = Math.random() * 40 + 100;
          ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
          ctx.fillRect(x, y, 1, 1);
        }

        const moonTexture = new THREE.CanvasTexture(canvas2d);
        const moonMaterial = new THREE.MeshStandardMaterial({
          map: moonTexture,
          roughness: 0.9,
          metalness: 0.1,
        });

        mainObject = new THREE.Mesh(moonGeometry, moonMaterial);
        mainObject.position.set(0, 0, 0);
        scene.add(mainObject);
      } else if (index === 1) {
        // BIG ROCKET
        const rocketGroup = new THREE.Group();

        // Rocket body (cone)
        const bodyGeometry = new THREE.CylinderGeometry(0.8, 1.2, 6, 32);
        const bodyMaterial = new THREE.MeshStandardMaterial({
          color: 0xeeeeee,
          metalness: 0.7,
          roughness: 0.3,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        rocketGroup.add(body);

        // Rocket nose (cone)
        const noseGeometry = new THREE.ConeGeometry(0.8, 2, 32);
        const noseMaterial = new THREE.MeshStandardMaterial({
          color: 0xff0000,
          metalness: 0.8,
          roughness: 0.2,
        });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.y = 4;
        rocketGroup.add(nose);

        // Fins
        for (let i = 0; i < 4; i++) {
          const finGeometry = new THREE.BoxGeometry(0.2, 2, 1.5);
          const finMaterial = new THREE.MeshStandardMaterial({
            color: 0x3333ff,
            metalness: 0.6,
            roughness: 0.4,
          });
          const fin = new THREE.Mesh(finGeometry, finMaterial);
          const angle = (i / 4) * Math.PI * 2;
          fin.position.x = Math.cos(angle) * 1.2;
          fin.position.z = Math.sin(angle) * 1.2;
          fin.position.y = -2;
          fin.rotation.y = angle;
          rocketGroup.add(fin);
        }

        // Engine flames
        const flameGeometry = new THREE.ConeGeometry(0.6, 2, 32);
        const flameMaterial = new THREE.MeshBasicMaterial({
          color: 0xff6600,
          transparent: true,
          opacity: 0.8,
        });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.y = -4;
        flame.rotation.x = Math.PI;
        rocketGroup.add(flame);

        rocketGroup.scale.set(1.5, 1.5, 1.5);
        scene.add(rocketGroup);
        mainObject = rocketGroup;
      } else if (index === 2) {
        // SATURN-LIKE PLANET with rings
        const planetGroup = new THREE.Group();

        const planetGeometry = new THREE.SphereGeometry(3.5, 64, 64);
        const planetMaterial = new THREE.MeshStandardMaterial({
          color: 0xf4a460,
          roughness: 0.7,
          metalness: 0.2,
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planetGroup.add(planet);

        // Multiple rings
        for (let i = 0; i < 5; i++) {
          const ringGeometry = new THREE.TorusGeometry(
            4.5 + i * 0.3,
            0.15,
            16,
            100
          );
          const ringMaterial = new THREE.MeshStandardMaterial({
            color: i % 2 === 0 ? 0xdaa520 : 0xcd853f,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide,
          });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.rotation.x = Math.PI / 2.5;
          planetGroup.add(ring);
        }

        scene.add(planetGroup);
        mainObject = planetGroup;
      } else {
        // ASTEROID FIELD
        const asteroidGroup = new THREE.Group();

        for (let i = 0; i < 30; i++) {
          const size = Math.random() * 0.5 + 0.3;
          const asteroidGeometry = new THREE.DodecahedronGeometry(size, 0);
          const asteroidMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b7355,
            roughness: 0.9,
            metalness: 0.1,
          });
          const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

          const angle = (i / 30) * Math.PI * 2;
          const radius = 5 + Math.random() * 3;
          asteroid.position.x = Math.cos(angle) * radius;
          asteroid.position.y = (Math.random() - 0.5) * 4;
          asteroid.position.z = Math.sin(angle) * radius;

          asteroid.rotation.x = Math.random() * Math.PI;
          asteroid.rotation.y = Math.random() * Math.PI;
          asteroid.rotation.z = Math.random() * Math.PI;

          asteroidGroup.add(asteroid);
        }

        scene.add(asteroidGroup);
        mainObject = asteroidGroup;
      }

      objectsRef.current[index] = { mainObject, camera, scene, renderer };
    });

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      asteroids.forEach((asteroid, index) => {
        const obj = objectsRef.current[index];
        if (!obj) return;

        const canvas = canvasRefs.current[index];
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scrollOffset = scrollY - rect.top;
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          const rotationSpeed = Math.abs(scrollOffset) * 0.00005;

          if (index === 0) {
            // Moon rotates on scroll
            obj.mainObject.rotation.y += rotationSpeed;
          } else if (index === 1) {
            // Rocket spins
            obj.mainObject.rotation.y += rotationSpeed;
            obj.mainObject.rotation.z = Math.sin(Date.now() * 0.001) * 0.1;
          } else if (index === 2) {
            // Planet rotates
            obj.mainObject.rotation.y += rotationSpeed * 0.5;
            obj.mainObject.children[0].rotation.y += 0.005;
          } else {
            // Asteroid field rotates
            obj.mainObject.rotation.y += rotationSpeed;
            obj.mainObject.children.forEach((child) => {
              child.rotation.x += 0.01;
              child.rotation.y += 0.01;
            });
          }

          obj.renderer.render(obj.scene, obj.camera);
        }
      });
    };

    animate();

    const handleResize = () => {
      asteroids.forEach((_, index) => {
        const canvas = canvasRefs.current[index];
        const obj = objectsRef.current[index];
        if (canvas && obj) {
          obj.camera.aspect = canvas.clientWidth / canvas.clientHeight;
          obj.camera.updateProjectionMatrix();
          obj.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderersRef.current.forEach((renderer) => renderer?.dispose());
    };
  }, [asteroids.length, scrollY]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-fuchsia-800 to-purple-900">
        <Moon
          className="w-20 h-20 text-purple-300 mb-4"
          style={{ animation: "spin 2s linear infinite" }}
        />
        <p className="text-purple-200 text-2xl">Loading celestial objects...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-purple-900 via-fuchsia-800 to-purple-900 min-h-screen">
      <div className="space-y-0">
        {asteroids.map((asteroid, index) => (
          <div
            key={asteroid.id}
            className="min-h-screen flex items-center justify-center py-20 px-4 relative"
          >
            {/* Individual 3D Canvas for each asteroid */}
            <canvas
              ref={(el) => (canvasRefs.current[index] = el)}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 0 }}
            />

            <div
              className={`max-w-4xl w-full transition-all duration-1000 transform relative z-10 ${
                index === currentAsteroidIndex
                  ? "opacity-100 scale-100"
                  : "opacity-50 scale-95"
              }`}
            >
              <div className="relative">
                <div
                  className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 opacity-20 blur-3xl"
                  style={{ animation: "pulse 4s ease-in-out infinite" }}
                />

                <div className="bg-purple-950/40 backdrop-blur-xl rounded-3xl p-12 border border-fuchsia-400/30 shadow-2xl shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 transition-all duration-500">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Moon
                          className="w-16 h-16 text-fuchsia-300"
                          style={{
                            animation: "pulse 2s ease-in-out infinite",
                          }}
                        />
                        <div
                          className="absolute inset-0 w-16 h-16 border-4 border-fuchsia-400/30 rounded-full"
                          style={{
                            animation:
                              "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
                          }}
                        />
                      </div>
                      <div>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-fuchsia-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                          {asteroid.name}
                        </h2>
                        <p className="text-purple-200 text-lg">
                          Discovered: {asteroid.date}
                        </p>
                      </div>
                    </div>
                    {isFavorite(asteroid.id) ? (
                      <Star
                        className="w-10 h-10 text-yellow-300 fill-yellow-300"
                        style={{
                          animation: "pulse 2s ease-in-out infinite",
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => addToFavorites(asteroid)}
                        className="p-4 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 rounded-xl transition-all transform hover:scale-110 shadow-lg shadow-fuchsia-500/50"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-fuchsia-500/20 to-transparent p-6 rounded-2xl border border-fuchsia-400/30 backdrop-blur-sm">
                      <p className="text-fuchsia-300 text-sm mb-2 font-medium">
                        Right Ascension
                      </p>
                      <p className="text-4xl font-bold text-white font-mono">
                        {asteroid.ra}°
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-transparent p-6 rounded-2xl border border-purple-400/30 backdrop-blur-sm">
                      <p className="text-purple-300 text-sm mb-2 font-medium">
                        Declination
                      </p>
                      <p className="text-4xl font-bold text-white font-mono">
                        {asteroid.dec}°
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-500/20 to-transparent p-6 rounded-2xl border border-pink-400/30 backdrop-blur-sm">
                      <p className="text-pink-300 text-sm mb-2 font-medium">
                        Visual Magnitude
                      </p>
                      <p className="text-4xl font-bold text-white font-mono">
                        {asteroid.vmag}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-violet-500/20 to-transparent p-6 rounded-2xl border border-violet-400/30 backdrop-blur-sm">
                      <p className="text-violet-300 text-sm mb-2 font-medium">
                        Observation Date
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {asteroid.date}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAsteroid(asteroid)}
                    className="w-full py-4 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-fuchsia-500/50 transition-all transform hover:scale-105 text-white"
                  >
                    View Detailed Information
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
