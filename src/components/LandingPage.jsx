import React, { useRef, useEffect } from "react";
import * as THREE from "three";

function LandingPage({ onShowLogin }) {
  const mountRef = useRef(null);

  useEffect(() => {
    // Three.js Scene Setup - PLANETS ONLY
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 600 / 600, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });

    renderer.setSize(600, 600);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Create floating planets
    const planets = [];
    const planetColors = [
      0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xffeaa7, 0xdda0dd, 0x9d4edd,
      0xff9e00,
    ];

    const planetGroup = new THREE.Group();

    for (let i = 0; i < 8; i++) {
      const size = Math.random() * 0.7 + 0.4;
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: planetColors[i],
        shininess: 30,
      });
      const planet = new THREE.Mesh(geometry, material);

      const angle = (i / 8) * Math.PI * 2;
      const distance = 2 + Math.random() * 3;
      const height = Math.random() * 4 - 2;

      planet.position.set(
        Math.cos(angle) * distance,
        height,
        Math.sin(angle) * distance
      );

      planetGroup.add(planet);
      planets.push({
        mesh: planet,
        speed: Math.random() * 0.008 + 0.003,
        angle: angle,
        distance: distance,
        height: height,
        rotationSpeedY: Math.random() * 0.02 + 0.01,
        rotationSpeedX: Math.random() * 0.01 + 0.005,
      });
    }

    scene.add(planetGroup);

    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 1500;
    const positions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3;
      const radius = 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.15,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(15, 10, 10);
    scene.add(directionalLight);

    camera.position.z = 10;
    camera.position.y = 1;

    // Animation
    let floatOffset = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      floatOffset += 0.015;

      planets.forEach((planet, i) => {
        planet.angle += planet.speed;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
        planet.mesh.position.y =
          planet.height + Math.sin(floatOffset * 0.8 + i) * 0.8;
        planet.mesh.rotation.y += planet.rotationSpeedY;
        planet.mesh.rotation.x += planet.rotationSpeedX;
      });

      planetGroup.rotation.y += 0.001;
      stars.rotation.y += 0.0003;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className="w-full h-full text-white relative"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(images/background.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "none",
          WebkitFilter: "none",
          opacity: 1,
        }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(139, 69, 172, 0.3) 0%, rgba(88, 28, 135, 0.2) 50%, rgba(49, 19, 91, 0.25) 100%)",
          }}
        ></div>
      </div>

      {/* Header with Login/Signup Buttons */}
      <div className="absolute top-0 right-0 z-40 p-8 flex gap-4">
        <button
          onClick={onShowLogin}
          className="px-8 py-3 border-2 border-white rounded-full text-sm font-semibold tracking-wider hover:bg-white hover:text-purple-900 transition-all transform hover:scale-105 backdrop-blur-sm bg-white/10"
        >
          LOG IN
        </button>
        <button
          onClick={onShowLogin}
          className="px-8 py-3 bg-white text-purple-900 rounded-full text-sm font-semibold tracking-wider hover:bg-purple-100 transition-all transform hover:scale-105 shadow-lg"
        >
          SIGN UP
        </button>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-between px-16">
        {/* Left Side - 3D Planets */}
        <div className="flex-1 flex justify-center items-center">
          <div
            ref={mountRef}
            className="transform transition-transform duration-300 hover:scale-105"
            style={{
              width: "600px",
              height: "600px",
            }}
          />
        </div>

        {/* Right Side - Text Content */}
        <div className="flex-1 text-right max-w-2xl pr-16">
          <h1
            className="text-9xl font-bold mb-8 tracking-wider animate-fade-in"
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              textShadow:
                "0 0 40px rgba(168, 85, 247, 0.8), 0 0 80px rgba(168, 85, 247, 0.4)",
              animation: "glow 2s ease-in-out infinite alternate",
              background: "linear-gradient(45deg, #c084fc, #a855f7, #e879f9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            asterank
          </h1>
          <p
            className="text-2xl text-white mb-12 leading-relaxed font-light"
            style={{
              textShadow: "0 2px 20px rgba(0, 0, 0, 0.8)",
              animation: "slideIn 1s ease-out",
            }}
          >
            Explore near-Earth asteroids and uncover their estimated economic
            value using real astronomical data. Asterank provides a powerful,
            visual way to understand asteroid mining potential and space
            resources.
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes glow {
          from {
            text-shadow: 0 0 40px rgba(168, 85, 247, 0.8),
              0 0 80px rgba(168, 85, 247, 0.4);
          }
          to {
            text-shadow: 0 0 60px rgba(168, 85, 247, 1),
              0 0 100px rgba(168, 85, 247, 0.6);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
