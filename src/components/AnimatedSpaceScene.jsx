import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Starfield Component
function MovingStarfield() {
  const starsRef = useRef();

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.x += 0.0001;
      starsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <Stars
      ref={starsRef}
      radius={300}
      depth={60}
      count={7000}
      factor={4}
      saturation={0}
      fade
      speed={0.5}
    />
  );
}

// Rocket Component (LANDSCAPE)
function Rocket({ scrollProgress }) {
  const rocketRef = useRef();
  const [position, setPosition] = useState({ x: 20, y: 0, z: 0 });

  useEffect(() => {
    // Rocket: starts at right (20), moves left (-20) based on scroll
    // When scrollProgress = 0: x = 20 (right)
    // When scrollProgress = 0.5: x = 0 (center)
    // When scrollProgress = 1: x = -20 (left)
    const targetX = 20 - scrollProgress * 40;
    setPosition({ x: targetX, y: 0, z: 0 });
  }, [scrollProgress]);

  useFrame((state) => {
    if (rocketRef.current) {
      // Smooth movement
      rocketRef.current.position.x = THREE.MathUtils.lerp(
        rocketRef.current.position.x,
        position.x,
        0.1
      );

      // Rocket floats
      rocketRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.3;

      // Rocket points forward (landscape)
      rocketRef.current.rotation.y = Math.PI / 2;
      rocketRef.current.rotation.z = 0;
    }
  });

  return (
    <group ref={rocketRef} position={[position.x, position.y, position.z]}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.5, 2, 8]} />
        <meshStandardMaterial
          color="#4ECDC4"
          emissive="#4ECDC4"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[1, 0, 0]}>
        <coneGeometry args={[0.5, 1, 8]} />
        <meshStandardMaterial
          color="#FF6B6B"
          emissive="#FF6B6B"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// Asteroid Text
function AsteroidText({ scrollProgress }) {
  const textRef = useRef();
  const [position, setPosition] = useState({ x: 22, y: 3, z: 0 });

  useEffect(() => {
    // ASTEROID: starts at right (22), moves left (-18) following rocket
    const targetX = 22 - scrollProgress * 40;
    setPosition({ x: targetX, y: 3, z: 0 });
  }, [scrollProgress]);

  useFrame(() => {
    if (textRef.current) {
      textRef.current.position.x = THREE.MathUtils.lerp(
        textRef.current.position.x,
        position.x,
        0.1
      );
    }
  });

  return (
    <Text
      ref={textRef}
      position={[position.x, position.y, position.z]}
      fontSize={3}
      color="#FF6B6B"
      font="https://fonts.gstatic.com/s/russoone/v14/Z9XUDmZRWg6M1LvRYsHOy8mJrrg.ttf"
      anchorX="center"
      anchorY="middle"
    >
      ASTEROID
    </Text>
  );
}

// Explorer Text
function ExplorerText({ scrollProgress }) {
  const textRef = useRef();
  const [position, setPosition] = useState({ x: -20, y: -3, z: 0 });

  useEffect(() => {
    // EXPLORER: starts at left (-20), moves right (20) based on scroll
    const targetX = -20 + scrollProgress * 40;
    setPosition({ x: targetX, y: -3, z: 0 });
  }, [scrollProgress]);

  useFrame(() => {
    if (textRef.current) {
      textRef.current.position.x = THREE.MathUtils.lerp(
        textRef.current.position.x,
        position.x,
        0.1
      );
    }
  });

  return (
    <Text
      ref={textRef}
      position={[position.x, position.y, position.z]}
      fontSize={3}
      color="#4ECDC4"
      font="https://fonts.gstatic.com/s/russoone/v14/Z9XUDmZRWg6M1LvRYsHOy8mJrrg.ttf"
      anchorX="center"
      anchorY="middle"
    >
      EXPLORER
    </Text>
  );
}

// Journey Text
function JourneyText({ scrollProgress }) {
  const textRef = useRef();
  const [position, setPosition] = useState({ x: 0, y: -20, z: 0 });

  useEffect(() => {
    // Text moves up/down with scroll
    const targetY = -20 + scrollProgress * 40;
    setPosition({ x: 0, y: targetY, z: 0 });
  }, [scrollProgress]);

  useFrame(() => {
    if (textRef.current) {
      textRef.current.position.y = THREE.MathUtils.lerp(
        textRef.current.position.y,
        position.y,
        0.1
      );
    }
  });

  return (
    <Text
      ref={textRef}
      position={[position.x, position.y, position.z]}
      fontSize={1.5}
      color="#FFEAA7"
      font="https://fonts.gstatic.com/s/russoone/v14/Z9XUDmZRWg6M1LvRYsHOy8mJrrg.ttf"
      anchorX="center"
      anchorY="middle"
      maxWidth={15}
      textAlign="center"
    >
      Journey through the cosmos{"\n"}and discover the treasures{"\n"}of the
      asteroid belt.
    </Text>
  );
}

// Main Scene Component (inside Canvas)
function SpaceScene({ scrollProgress }) {
  return (
    <>
      <MovingStarfield />

      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#4ECDC4" />
      <directionalLight
        position={[-10, -10, -5]}
        intensity={0.5}
        color="#FF6B6B"
      />

      <Rocket scrollProgress={scrollProgress} />
      <AsteroidText scrollProgress={scrollProgress} />
      <ExplorerText scrollProgress={scrollProgress} />
      <JourneyText scrollProgress={scrollProgress} />

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.3} />
      </mesh>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
}

// Main Component
export default function AnimatedSpaceScene() {
  const [scrollProgress, setScrollProgress] = useState(0.5);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress (0 to 1)
      let newProgress = scrollProgress;

      if (currentScrollY > lastScrollY) {
        // Scrolling DOWN - increase progress
        newProgress = Math.min(scrollProgress + 0.05, 1);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling UP - decrease progress
        newProgress = Math.max(scrollProgress - 0.05, 0);
      }

      setScrollProgress(newProgress);
      setLastScrollY(currentScrollY);

      setTimeout(() => setIsScrolling(false), 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollProgress, lastScrollY]);

  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        style={{
          background:
            "linear-gradient(to bottom, #000000 0%, #0a0a2a 50%, #000000 100%)",
        }}
      >
        <SpaceScene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
