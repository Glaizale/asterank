import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sphere } from "@react-three/drei";
import { useRef } from "react";

function RotatingPlanet({ position, size, color, speed }) {
  const ref = useRef();

  useFrame(() => {
    ref.current.rotation.y += speed;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Asteroid({ position }) {
  const ref = useRef();

  useFrame(() => {
    ref.current.rotation.x += 0.002;
    ref.current.rotation.y += 0.003;
  });

  return (
    <mesh ref={ref} position={position}>
      <dodecahedronGeometry args={[0.4]} />
      <meshStandardMaterial color="#7c3aed" />
    </mesh>
  );
}

export default function SpaceBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10] }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: -20,
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Star field */}
      <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />

      {/* Planets */}
      <RotatingPlanet
        position={[-5, 2, -10]}
        size={1.5}
        color="#38bdf8"
        speed={0.002}
      />
      <RotatingPlanet
        position={[4, -2, -8]}
        size={1}
        color="#a855f7"
        speed={0.003}
      />

      {/* Asteroids */}
      <Asteroid position={[2, 3, -6]} />
      <Asteroid position={[-3, -2, -5]} />
      <Asteroid position={[0, 1, -4]} />
    </Canvas>
  );
}
