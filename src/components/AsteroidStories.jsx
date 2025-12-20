import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { apiService } from "../services/api";

/* =============== SHARED SCENE HOOK =============== */

function useScene(setupFn) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true, // lets Tailwind gradients show through
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(420, 260);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 420 / 260, 0.1, 200);
    camera.position.set(0, 0, 32);

    const { cleanup } = setupFn(scene, camera, renderer);

    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (scene.userData.tick) scene.userData.tick(t);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const width = canvas.parentElement.clientWidth;
      const height = 260;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (cleanup) cleanup();
    };
  }, [setupFn]);

  return canvasRef;
}

/* helper: noisy dodecahedron asteroid */

function makeAsteroid(radius, rough = 1) {
  const geom = new THREE.DodecahedronGeometry(radius, 1);
  const pos = geom.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const noise =
      (Math.sin(v.x * 2.1) + Math.sin(v.y * 1.7) + Math.sin(v.z * 1.9)) *
      0.5 *
      rough;
    v.normalize().multiplyScalar(radius + noise);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  pos.needsUpdate = true;
  geom.computeVertexNormals();
  return geom;
}

/* =============== SCENE 0: CYAN HERO ASTEROID =============== */

function useHeroAsteroidScene() {
  return useScene((scene, camera) => {
    // dark blue fog to match cyan frame gradient
    scene.fog = new THREE.FogExp2(0x020617, 0.018);

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(18, 24, 18);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x38bdf8, 1.4);
    rim.position.set(-20, -12, -10);
    scene.add(rim);

    // cyan‑tinted starfield
    const starGeom = new THREE.BufferGeometry();
    const count = 1200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const r = 70 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i] = r * Math.sin(phi) * Math.cos(theta);
      pos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i + 2] = -40 - r * Math.cos(phi);
    }
    starGeom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.1,
      color: 0xa5f3fc, // light cyan
      transparent: true,
      opacity: 0.9,
    });
    const stars = new THREE.Points(starGeom, starMat);
    stars.renderOrder = -1;
    scene.add(stars);

    // big asteroid
    const asteroidGeom = makeAsteroid(9, 1.4);
    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0x9ca3af,
      roughness: 0.95,
      metalness: 0.2,
      flatShading: true,
    });
    const asteroid = new THREE.Mesh(asteroidGeom, asteroidMat);
    asteroid.position.set(-2, -1, -10);
    scene.add(asteroid);

    // cyan halo
    const haloGeom = new THREE.SphereGeometry(11.5, 48, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
    });
    const halo = new THREE.Mesh(haloGeom, haloMat);
    asteroid.add(halo);

    scene.userData.tick = (t) => {
      stars.rotation.y = t * 0.015;
      asteroid.rotation.y = t * 0.22;
      asteroid.rotation.x = Math.sin(t * 0.27) * 0.25;
      asteroid.position.y = -1 + Math.sin(t * 0.35) * 0.35;
      halo.material.opacity = 0.18 + (Math.sin(t * 3.2) + 1) * 0.06;

      camera.position.set(Math.sin(t * 0.18) * 4.0, 1.6, 28);
      camera.lookAt(-2, -1, -10);
    };

    return {
      cleanup: () => {
        starGeom.dispose();
        asteroidGeom.dispose();
        haloGeom.dispose();
      },
    };
  });
}

/* =============== SCENE 1: PURPLE TUMBLING SHARD =============== */

function useTumblingShardScene() {
  return useScene((scene, camera) => {
    // purple fog to match purple frame
    scene.fog = new THREE.FogExp2(0x050315, 0.022);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(-16, 14, 16);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xa855f7, 1.0);
    rim.position.set(16, -10, -6);
    scene.add(rim);

    // purple / magenta foggy particles
    const fogGeom = new THREE.BufferGeometry();
    const fogCount = 900;
    const fogPos = new Float32Array(fogCount * 3);
    for (let i = 0; i < fogCount * 3; i += 3) {
      fogPos[i] = (Math.random() - 0.5) * 90;
      fogPos[i + 1] = (Math.random() - 0.5) * 50;
      fogPos[i + 2] = -30 - Math.random() * 50;
    }
    fogGeom.setAttribute("position", new THREE.BufferAttribute(fogPos, 3));
    const fogMat = new THREE.PointsMaterial({
      size: 0.9,
      color: 0xc084fc,
      transparent: true,
      opacity: 0.4,
    });
    const fog = new THREE.Points(fogGeom, fogMat);
    fog.renderOrder = -1;
    scene.add(fog);

    const shardGeom = makeAsteroid(4, 1.2);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.45,
      roughness: 0.85,
      flatShading: true,
    });
    const shard = new THREE.Mesh(shardGeom, shardMat);
    shard.scale.set(1.8, 1.0, 1.0);
    shard.position.set(-14, 0, -10);
    scene.add(shard);

    const trailGeom = new THREE.CylinderGeometry(0.4, 1.8, 14, 16, 1, true);
    const trailMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const trail = new THREE.Mesh(trailGeom, trailMat);
    trail.rotation.z = Math.PI / 2;
    trail.position.set(-8, 0, -10);
    scene.add(trail);

    const glow = new THREE.PointLight(0xa855f7, 1.8, 40);
    glow.position.set(-18, 0, -6);
    scene.add(glow);

    scene.userData.tick = (t) => {
      fog.rotation.y = t * 0.03;

      const travel = (t * 5) % 34;
      shard.position.x = -16 + travel;
      shard.position.y = Math.sin(t * 1.1) * 2;
      shard.rotation.y += 0.05;
      shard.rotation.z = Math.sin(t * 0.8) * 0.5;

      trail.position.x = shard.position.x - 4;
      trail.position.y = shard.position.y * 0.8;
      trail.material.opacity = 0.2 + (Math.sin(t * 4) + 1) * 0.15;

      glow.position.set(shard.position.x - 4.5, shard.position.y, -6);
      glow.intensity = 1.7 + (Math.sin(t * 12) + 1) * 0.8;

      camera.position.set(5, 2, 28);
      camera.lookAt(shard.position.x - 2, shard.position.y, -10);
    };

    return {
      cleanup: () => {
        fogGeom.dispose();
        shardGeom.dispose();
        trailGeom.dispose();
      },
    };
  });
}

/* =============== SCENE 2: AMBER RUBBLE RING =============== */

function useRubbleRingScene() {
  return useScene((scene, camera) => {
    // warm amber fog
    scene.fog = new THREE.FogExp2(0x130a04, 0.018);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(10, 20, 18);
    scene.add(key);

    const coreGeom = makeAsteroid(4.6, 1.1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0x7c2d12,
      emissiveIntensity: 0.8,
      roughness: 0.8,
      metalness: 0.25,
      flatShading: true,
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    scene.add(core);

    const dustGeom = new THREE.BufferGeometry();
    const dustPos = new Float32Array(800 * 3);
    for (let i = 0; i < 800 * 3; i += 3) {
      const radius = 12 + Math.random() * 8;
      const angle = Math.random() * Math.PI * 2;
      dustPos[i] = Math.cos(angle) * radius;
      dustPos[i + 1] = (Math.random() - 0.5) * 1.5;
      dustPos[i + 2] = Math.sin(angle) * radius;
    }
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.6,
      color: 0xfacc15,
      transparent: true,
      opacity: 0.7,
    });
    const dust = new THREE.Points(dustGeom, dustMat);
    scene.add(dust);

    const radii = [9, 14, 19];
    const colors = [0x60a5fa, 0x34d399, 0xf59e0b];
    const rocks = [];
    radii.forEach((r, i) => {
      const g = makeAsteroid(2.4 + i * 0.8, 1);
      const rockMat = new THREE.MeshStandardMaterial({
        color: colors[i],
        metalness: 0.35,
        roughness: 0.7,
        flatShading: true,
      });
      const mesh = new THREE.Mesh(g, rockMat);
      const pivot = new THREE.Object3D();
      mesh.position.x = r;
      pivot.add(mesh);
      scene.add(pivot);
      rocks.push({ pivot, geom: g, mesh });
    });

    scene.userData.tick = (t) => {
      core.rotation.y += 0.015;
      core.rotation.x = Math.sin(t * 0.4) * 0.12;

      rocks.forEach((p, i) => {
        p.pivot.rotation.y = t * (0.12 + i * 0.06);
        p.mesh.rotation.y += 0.02 + i * 0.01;
        p.mesh.rotation.z += 0.015;
      });

      dust.rotation.y = t * 0.05;

      camera.position.set(
        Math.sin(t * 0.26) * 26,
        10 + Math.sin(t * 0.2) * 2.5,
        26 + Math.cos(t * 0.26) * 4
      );
      camera.lookAt(0, 0, 0);
    };

    return {
      cleanup: () => {
        coreGeom.dispose();
        dustGeom.dispose();
        radii.forEach((_, i) => rocks[i].geom.dispose());
      },
    };
  });
}

/* =============== SCENE 3: EMERALD ASTEROID LANE =============== */

function useAsteroidFieldScene() {
  return useScene((scene, camera) => {
    // greenish fog
    scene.fog = new THREE.FogExp2(0x02120b, 0.025);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(-12, 18, 16);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x22c55e, 0.9);
    fill.position.set(16, -8, -14);
    scene.add(fill);

    const astGeom = makeAsteroid(1.4, 0.9);
    const asteroids = [];
    for (let i = 0; i < 210; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? 0x9ca3af : i % 3 === 1 ? 0x4b5563 : 0x64748b,
        flatShading: true,
        metalness: 0.25,
        roughness: 0.9,
      });
      const mesh = new THREE.Mesh(astGeom, mat);
      const radius = 14 + Math.random() * 12;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 10;
      mesh.position.set(
        Math.cos(angle) * radius,
        height,
        -10 - Math.sin(angle) * radius * 0.7
      );
      const s = 0.5 + Math.random() * 1.8;
      mesh.scale.set(s, s, s);
      mesh.userData = {
        baseY: height,
        radius,
        angle,
        speed: 0.12 + Math.random() * 0.12,
      };
      scene.add(mesh);
      asteroids.push(mesh);
    }

    const laneGlow = new THREE.PointLight(0x22c55e, 1.4, 60);
    laneGlow.position.set(0, 0, -6);
    scene.add(laneGlow);

    scene.userData.tick = (t) => {
      asteroids.forEach((a, i) => {
        const d = a.userData;
        const angle = d.angle + t * d.speed;
        a.position.x = Math.cos(angle) * d.radius;
        a.position.z = -10 - Math.sin(angle) * d.radius * 0.7;
        a.position.y = d.baseY + Math.sin(t * 1.1 + i) * 0.7;
        a.rotation.x += 0.02 + (i % 5) * 0.002;
        a.rotation.y += 0.03 + (i % 7) * 0.002;
      });

      laneGlow.position.set(Math.sin(t * 0.7) * 6, Math.cos(t * 0.5) * 2, -6);
      laneGlow.intensity = 1.2 + (Math.sin(t * 4.0) + 1) * 0.6;

      camera.position.set(
        Math.sin(t * 0.22) * 19,
        6 + Math.sin(t * 0.3) * 3,
        28
      );
      camera.lookAt(0, 0, -10);
    };

    return {
      cleanup: () => {
        astGeom.dispose();
      },
    };
  });
}

/* =============== SCENE 4: FUCHSIA DISTANT BOULDER =============== */

function useDistantAsteroidScene() {
  return useScene((scene, camera) => {
    // dark indigo fog for fuchsia frame
    scene.fog = new THREE.FogExp2(0x050316, 0.012);

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const galaxyGeom = new THREE.BufferGeometry();
    const count = 2600;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const innerColor = new THREE.Color(0xa855f7);
    const outerColor = new THREE.Color(0x38bdf8);

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 40;
      const spin = radius * 0.3;
      const branch = (i % 4) * ((2 * Math.PI) / 4);
      const randomX = (Math.random() - 0.5) * 2.0;
      const randomY = (Math.random() - 0.5) * 1.6;
      const randomZ = (Math.random() - 0.5) * 2.0;
      const angle = branch + spin;
      pos[i * 3] = Math.cos(angle) * radius + randomX;
      pos[i * 3 + 1] = randomY;
      pos[i * 3 + 2] = Math.sin(angle) * radius + randomZ;

      const mixed = innerColor.clone().lerp(outerColor, radius / 40);
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }

    galaxyGeom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    galaxyGeom.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const galaxyMat = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
    });
    const galaxy = new THREE.Points(galaxyGeom, galaxyMat);
    scene.add(galaxy);

    const rockGeom = makeAsteroid(3.4, 1.1);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0xf9fafb,
      roughness: 0.7,
      metalness: 0.25,
      flatShading: true,
    });
    const rock = new THREE.Mesh(rockGeom, rockMat);
    rock.position.set(0, 0, -18);
    scene.add(rock);

    scene.userData.tick = (t) => {
      galaxy.rotation.y = t * 0.04;
      galaxy.rotation.z = Math.sin(t * 0.18) * 0.12;

      rock.position.y = Math.sin(t * 0.6) * 1.2;
      rock.rotation.y += 0.03;
      rock.rotation.x = Math.sin(t * 0.4) * 0.25;

      camera.position.set(
        Math.sin(t * 0.22) * 24,
        7 + Math.sin(t * 0.3) * 3,
        30
      );
      camera.lookAt(0, 0, -18);
    };

    return {
      cleanup: () => {
        galaxyGeom.dispose();
        rockGeom.dispose();
      },
    };
  });
}

/* =============== MAIN COMPONENT =============== */

export default function AsteroidStories({ observations, onAddFavorite }) {
  const featured = observations.slice(0, 5);

  const scenes = [
    useHeroAsteroidScene(),
    useTumblingShardScene(),
    useRubbleRingScene(),
    useAsteroidFieldScene(),
    useDistantAsteroidScene(),
  ];

  function FavoriteButton({ asteroidId, asteroidName }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleClick = async () => {
      if (saving) return;
      setSaving(true);
      try {
        const res = await apiService.toggleFavorite(asteroidId, {
          asteroid_id: asteroidId,
          name: asteroidName,
          type: "Observation",
          distance: "",
          value: "",
          notes: "",
        });
        if (res.success) setIsFavorite(!res.removed);
      } catch (err) {
        console.error("Error toggling favorite", err);
      } finally {
        setSaving(false);
      }
    };

    return (
      <motion.button
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        className="rounded-2xl bg-black/60 border border-white/20 px-4 py-3 text-sm text-gray-100 flex-1 min-w-[220px] text-left relative overflow-hidden"
        onClick={handleClick}
        disabled={saving}
      >
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(248,250,252,0.12),transparent_55%)] opacity-60" />
        <div className="relative z-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gray-400 mb-1">
            {isFavorite ? "Added in favorites" : "Add to favorites"}
          </p>
          <p className="text-base font-semibold flex items-center gap-2">
            <span className="text-red-500 text-lg leading-none">
              {isFavorite ? "✓" : "★"}
            </span>
            <span>
              {isFavorite
                ? "Already in your favorites"
                : "Save this observation"}
            </span>
          </p>
          <p className="text-[11px] text-gray-400">
            Store this frame in your asteroid archive.
          </p>
        </div>
      </motion.button>
    );
  }

  const frameStory = (obs, idx) => {
    const timeText = obs.time || "an unlogged instant";
    switch (idx) {
      case 0:
        return `At ${timeText}, the telescope locks onto a single, scarred asteroid turning slowly in the dark. Every crater on its surface is a fossil of past collisions, frozen into jagged ridges and collapsed basins. For a brief moment the rock drifts perfectly across the sensor, bright enough to leave a clear signature against the quiet starfield.`;
      case 1:
        return `This frame catches a long, blade‑shaped shard racing through the outer belt. As it tumbles, sharp faces flash in and out of view, fragment of a much larger body shattered long ago. The trail it leaves across the detector is thin but distinct, a straight underline drawn through the background stars.`;
      case 2:
        return `Here the camera stares into a crowded ring of rubble wrapped around a heavy core asteroid. Smaller boulders loop endlessly around their parent, each on a slightly tilted path that never quite repeats. The scene looks calm in a single snapshot, but every orbit hides slow, patient rearrangements that will continue for millions of years.`;
      case 3:
        return `This observation samples a dense asteroid lane, a tilted river of stone flowing through the outer system. Blocks of rock slide past each other at different speeds, sometimes almost overlapping from the telescope’s point of view. The detector records only a thin streak for each one, but together they hint at the depth and thickness of the lane.`;
      default:
        return `Far from the Sun, this lonely boulder glides across a distant spray of stars. Light barely reaches it here, so its motion is subtle, revealed only by patient tracking and careful calibration. The frame feels almost still, yet the asteroid is falling along a vast, slow curve that will never exactly repeat.`;
    }
  };

  return (
    <>
      {featured.map((obs, idx) => {
        const bgBadge =
          idx === 0
            ? "text-cyan-300"
            : idx === 1
            ? "text-purple-300"
            : idx === 2
            ? "text-amber-300"
            : idx === 3
            ? "text-emerald-300"
            : "text-fuchsia-300";

        const gradient =
          idx === 0
            ? "from-cyan-400 to-sky-300"
            : idx === 1
            ? "from-purple-400 to-pink-400"
            : idx === 2
            ? "from-orange-400 to-amber-300"
            : idx === 3
            ? "from-emerald-400 to-teal-300"
            : "from-fuchsia-400 to-indigo-400";

        const fromRight = idx === 1 || idx === 3;
        const travelX = fromRight ? 260 : -260;

        const canvasRef = scenes[idx];

        const bgLayer =
          idx === 0
            ? "bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.38),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(15,23,42,0.95),transparent_60%)]"
            : idx === 1
            ? "bg-[radial-gradient(circle_at_80%_10%,rgba(147,51,234,0.45),transparent_55%),radial-gradient(circle_at_0%_80%,rgba(3,7,18,0.95),transparent_55%)]"
            : idx === 2
            ? "bg-[radial-gradient(circle_at_20%_0%,rgba(251,191,36,0.45),transparent_55%),radial-gradient(circle_at_90%_90%,rgba(15,23,42,0.95),transparent_60%)]"
            : idx === 3
            ? "bg-[radial-gradient(circle_at_10%_80%,rgba(16,185,129,0.4),transparent_55%),radial-gradient(circle_at_90%_20%,rgba(15,23,42,0.95),transparent_60%)]"
            : "bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.4),transparent_55%),radial-gradient(circle_at_50%_100%,rgba(15,23,42,0.95),transparent_60%)]";

        const asteroidId = obs.obs_id || `obs-${idx}`;
        const asteroidName = `Observation ${idx + 1} – ${
          obs.time || "Unknown time"
        }`;

        const labelText =
          idx === 0
            ? "Core asteroid close‑up"
            : idx === 1
            ? "Tumbling shard pass"
            : idx === 2
            ? "Rubble ring survey"
            : idx === 3
            ? "Asteroid lane"
            : "Distant solitary boulder";

        return (
          <section
            key={asteroidId}
            className="relative min-h-screen flex items-center justify-center px-4 py-20"
          >
            <div
              className={`pointer-events-none absolute inset-0 -z-20 ${bgLayer}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.16),transparent_55%),radial-gradient(circle_at_30%_70%,rgba(148,163,184,0.14),transparent_55%)] opacity-70" />
            </div>

            <div className="relative max-w-6xl w-full">
              <div className="flex items-center justify-between mb-6">
                <p
                  className={`uppercase tracking-[0.35em] text-xs md:text-sm ${bgBadge}`}
                >
                  Frame {idx + 1}
                </p>
                <p className="text-xs md:text-sm text-gray-300">
                  SkyMorph asteroid observation
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9 }}
                  className={
                    idx === 0
                      ? "text-center md:text-left"
                      : idx === 1
                      ? "md:order-2 text-right"
                      : idx === 2
                      ? "text-left"
                      : idx === 3
                      ? "md:order-2 text-right"
                      : "text-center md:text-left"
                  }
                >
                  <motion.h2
                    id={`astro-title-${idx}`}
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={{
                      offscreen: { x: travelX, opacity: 0 },
                      onscreen: {
                        x: 0,
                        opacity: 1,
                        transition: { duration: 0.9, ease: "easeOut" },
                      },
                    }}
                    onAnimationComplete={() => {
                      const el = document.getElementById(`astro-title-${idx}`);
                      if (!el) return;
                      el.animate(
                        [
                          { transform: "translateY(0px)" },
                          { transform: "translateY(-8px)" },
                          { transform: "translateY(0px)" },
                        ],
                        {
                          duration: 2600,
                          iterations: Infinity,
                          easing: "ease-in-out",
                        }
                      );
                    }}
                    className="inline-block text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-3"
                  >
                    <span
                      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                    >
                      Observed at
                    </span>{" "}
                    {obs.time || "Unknown time"}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.12 }}
                    className="text-base md:text-lg text-gray-100 mb-3"
                  >
                    Magnitude{" "}
                    <span className="font-semibold text-cyan-300">
                      {obs.mag ?? "N/A"}
                    </span>
                    {" · "}RA{" "}
                    <span className="font-semibold">
                      {obs.center_ra ?? "?"}°
                    </span>
                    {" · "}Dec{" "}
                    <span className="font-semibold">
                      {obs.center_dec ?? "?"}°
                    </span>
                    . {frameStory(obs, idx)}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-xs md:text-sm text-slate-300 tracking-[0.18em] uppercase"
                  >
                    Asterank narrative stream · Frame {idx + 1}
                  </motion.p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, delay: 0.15 }}
                  className="flex flex-col gap-4"
                >
                  <div className="relative w-full h-[260px] rounded-3xl border border-white/20 bg-slate-950/40 overflow-hidden shadow-[0_0_40px_rgba(15,23,42,0.9)]">
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full"
                    />
                    <div className="relative z-10 flex items-center justify-between px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-slate-200">
                      <span>{labelText}</span>
                      <span className="text-sky-300">
                        {obs.mag != null ? `mag ${obs.mag}` : "mag ?"}
                      </span>
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.2),transparent_55%),radial-gradient(circle_at_80%_100%,rgba(15,23,42,0.95),transparent_55%)] mix-blend-screen" />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="rounded-2xl bg-black/60 border border-white/20 px-4 py-3 text-sm text-gray-100"
                    >
                      <p className="text-[11px] uppercase tracking-[0.22em] text-gray-400 mb-1">
                        Drift W–E
                      </p>
                      <p className="text-lg font-semibold">
                        {obs.veloc_we ?? "?"}″/h
                      </p>
                      <p className="text-xs text-gray-400">
                        Sideways crawl across the CCD, tracing how the orbit
                        slides west to east over the sky.
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="rounded-2xl bg-black/60 border border-white/20 px-4 py-3 text-sm text-gray-100"
                    >
                      <p className="text-[11px] uppercase tracking-[0.22em] text-gray-400 mb-1">
                        Drift S–N
                      </p>
                      <p className="text-lg font-semibold">
                        {obs.veloc_sn ?? "?"}″/h
                      </p>
                      <p className="text-xs text-gray-400">
                        Vertical motion that shows whether the asteroid climbs
                        northward or sinks toward the southern sky.
                      </p>
                    </motion.div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="rounded-2xl bg-black/60 border border-white/20 px-4 py-3 text-sm text-gray-100 flex-1 min-w-[220px]"
                    >
                      <p className="text-[11px] uppercase tracking-[0.22em] text-gray-400 mb-1">
                        Frame offset
                      </p>
                      <p className="text-base font-semibold">
                        {obs.offset ?? "?"}′ from centre
                      </p>
                      <p className="text-[11px] text-gray-400">
                        How far this rock sits from the telescope&apos;s
                        crosshair in this snapshot.
                      </p>
                    </motion.div>

                    <FavoriteButton
                      asteroidId={asteroidId}
                      asteroidName={asteroidName}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
