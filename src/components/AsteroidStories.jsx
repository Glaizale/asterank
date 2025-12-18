import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

/* =============== SHARED SCENE HOOK =============== */

function useScene(setupFn) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
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

/* =============== SCENE 0: GIANT CRATERED MOON =============== */

function useMoonScene() {
  return useScene((scene, camera) => {
    scene.fog = new THREE.FogExp2(0x020617, 0.015);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(18, 22, 14);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x3b82f6, 1.5);
    rim.position.set(-20, -10, -8);
    scene.add(rim);

    const starGeom = new THREE.BufferGeometry();
    const count = 800;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const r = 80 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i] = r * Math.sin(phi) * Math.cos(theta);
      pos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i + 2] = -40 - r * Math.cos(phi);
    }
    starGeom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.0,
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });
    const stars = new THREE.Points(starGeom, starMat);
    scene.add(stars);

    const moonGeom = new THREE.SphereGeometry(13, 96, 96);
    const posAttr = moonGeom.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < posAttr.count; i++) {
      v.fromBufferAttribute(posAttr, i);
      const noise =
        (Math.sin(v.x * 1.8) + Math.sin(v.y * 1.3) + Math.sin(v.z * 1.7)) * 0.5;
      const crater = -Math.exp(-((v.x * v.x + v.y * v.y) / 80)) * 1.4;
      v.normalize().multiplyScalar(13 + noise + crater);
      posAttr.setXYZ(i, v.x, v.y, v.z);
    }
    posAttr.needsUpdate = true;
    moonGeom.computeVertexNormals();

    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xd4e2ff,
      roughness: 0.85,
      metalness: 0.05,
    });
    const moon = new THREE.Mesh(moonGeom, moonMat);
    moon.position.set(-2, -1, -10);
    scene.add(moon);

    const atmGeom = new THREE.SphereGeometry(14.2, 64, 64);
    const atmMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
    });
    const atm = new THREE.Mesh(atmGeom, atmMat);
    moon.add(atm);

    scene.userData.tick = (t) => {
      stars.rotation.y = t * 0.01;
      moon.rotation.y = t * 0.18;
      moon.rotation.x = Math.sin(t * 0.25) * 0.18;
      moon.position.y = -1 + Math.sin(t * 0.35) * 0.5;

      camera.position.set(Math.sin(t * 0.18) * 3, 1.5, 30);
      camera.lookAt(-2, -1, -10);
    };

    return {
      cleanup: () => {
        starGeom.dispose();
        moonGeom.dispose();
        atmGeom.dispose();
      },
    };
  });
}

/* =============== SCENE 1: BIG SPACESHIP =============== */

function useShipScene() {
  return useScene((scene, camera) => {
    scene.fog = new THREE.FogExp2(0x020617, 0.02);

    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(-16, 14, 16);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x22d3ee, 1.3);
    rim.position.set(16, -10, -6);
    scene.add(rim);

    const nearGeom = new THREE.BufferGeometry();
    const farGeom = new THREE.BufferGeometry();
    const nearPos = new Float32Array(500 * 3);
    const farPos = new Float32Array(700 * 3);
    for (let i = 0; i < 500 * 3; i += 3) {
      nearPos[i] = (Math.random() - 0.5) * 70;
      nearPos[i + 1] = (Math.random() - 0.5) * 40;
      nearPos[i + 2] = -10 - Math.random() * 30;
    }
    for (let i = 0; i < 700 * 3; i += 3) {
      farPos[i] = (Math.random() - 0.5) * 140;
      farPos[i + 1] = (Math.random() - 0.5) * 70;
      farPos[i + 2] = -50 - Math.random() * 60;
    }
    nearGeom.setAttribute("position", new THREE.BufferAttribute(nearPos, 3));
    farGeom.setAttribute("position", new THREE.BufferAttribute(farPos, 3));
    const nearMat = new THREE.PointsMaterial({
      size: 1.2,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.95,
    });
    const farMat = new THREE.PointsMaterial({
      size: 0.6,
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
    });
    const nearStars = new THREE.Points(nearGeom, nearMat);
    const farStars = new THREE.Points(farGeom, farMat);
    scene.add(farStars);
    scene.add(nearStars);

    const bodyGeom = new THREE.CapsuleGeometry(4.5, 14, 14, 24);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf9fafb,
      metalness: 0.9,
      roughness: 0.18,
    });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.rotation.z = Math.PI / 2;
    body.position.set(-9, 0, -8);
    scene.add(body);

    const wingGeom = new THREE.BoxGeometry(2.4, 10, 0.5);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      metalness: 1,
      roughness: 0.18,
    });
    const wingTop = new THREE.Mesh(wingGeom, wingMat);
    wingTop.position.set(0, 5.2, 0);
    const wingBottom = wingTop.clone();
    wingBottom.position.set(0, -5.2, 0);
    body.add(wingTop);
    body.add(wingBottom);

    const finGeom = new THREE.BoxGeometry(1.6, 4.8, 0.5);
    const finMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      metalness: 0.9,
      roughness: 0.25,
    });
    const fin = new THREE.Mesh(finGeom, finMat);
    fin.position.set(0, 0, 1.4);
    body.add(fin);

    const cockpitGeom = new THREE.SphereGeometry(2.3, 28, 28);
    const cockpitMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.9,
      metalness: 0.8,
      roughness: 0.12,
    });
    const cockpit = new THREE.Mesh(cockpitGeom, cockpitMat);
    cockpit.position.set(4, 0.1, 0.4);
    body.add(cockpit);

    const engineGeom = new THREE.ConeGeometry(1.6, 4.5, 32);
    const engineMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.85,
    });
    const engine = new THREE.Mesh(engineGeom, engineMat);
    engine.rotation.z = -Math.PI / 2;
    engine.position.set(-7.2, 0, 0);
    body.add(engine);

    const engineLight = new THREE.PointLight(0x22d3ee, 2.5, 40);
    engineLight.position.set(-14, 0, 4);
    scene.add(engineLight);

    scene.userData.tick = (t) => {
      nearStars.position.x = Math.sin(t * 0.35) * 5;
      farStars.position.x = Math.sin(t * 0.2) * 7;

      body.position.x = -12 + ((t * 5) % 30);
      body.position.y = Math.sin(t * 0.9) * 2;
      body.rotation.y = Math.sin(t * 0.7) * 0.5;
      body.rotation.x = Math.sin(t * 0.5) * 0.2;

      const flicker = 0.75 + Math.sin(t * 20) * 0.25;
      engine.material.opacity = 0.7 + Math.abs(Math.sin(t * 18)) * 0.3;
      engineLight.intensity = 2.2 + flicker;
      engineLight.position.set(body.position.x - 3.5, body.position.y, 4);

      camera.position.set(5, 2, 28);
      camera.lookAt(-4, 0, -8);
    };

    return {
      cleanup: () => {
        nearGeom.dispose();
        farGeom.dispose();
        bodyGeom.dispose();
        wingGeom.dispose();
        finGeom.dispose();
        cockpitGeom.dispose();
        engineGeom.dispose();
      },
    };
  });
}

/* =============== SCENE 2: MINI SOLAR SYSTEM =============== */

function useSolarScene() {
  return useScene((scene, camera) => {
    scene.fog = new THREE.FogExp2(0x020617, 0.015);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const sunGeom = new THREE.SphereGeometry(4.8, 48, 48);
    const sunMat = new THREE.MeshStandardMaterial({
      color: 0xffb347,
      emissive: 0xf97316,
      emissiveIntensity: 1.3,
      roughness: 0.5,
      metalness: 0.15,
    });
    const sun = new THREE.Mesh(sunGeom, sunMat);
    scene.add(sun);

    const sunGlowGeom = new THREE.SphereGeometry(5.6, 48, 48);
    const sunGlowMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide,
    });
    const sunGlow = new THREE.Mesh(sunGlowGeom, sunGlowMat);
    sun.add(sunGlow);

    const haloGeom = new THREE.RingGeometry(9, 10.6, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeom, haloMat);
    halo.rotation.x = Math.PI / 2;
    scene.add(halo);

    const radii = [10, 15, 21];
    const colors = [0x60a5fa, 0x34d399, 0xf97316];
    const planets = [];
    radii.forEach((r, i) => {
      const g = new THREE.SphereGeometry(2 + i, 32, 32);
      const m = new THREE.MeshStandardMaterial({
        color: colors[i],
        metalness: 0.5,
        roughness: 0.4,
      });
      const mesh = new THREE.Mesh(g, m);
      const pivot = new THREE.Object3D();
      mesh.position.x = r;
      pivot.add(mesh);
      scene.add(pivot);
      planets.push({ pivot, geom: g, mesh });
    });

    const ringPlanet = planets[2].mesh;
    const ringG = new THREE.RingGeometry(3.6, 4.8, 64);
    const ringM = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringG, ringM);
    ring.rotation.x = Math.PI / 3;
    ringPlanet.add(ring);

    const dustGeom = new THREE.BufferGeometry();
    const dustPos = new Float32Array(450 * 3);
    for (let i = 0; i < 450 * 3; i += 3) {
      const radius = 24 + Math.random() * 10;
      const angle = Math.random() * Math.PI * 2;
      dustPos[i] = Math.cos(angle) * radius;
      dustPos[i + 1] = (Math.random() - 0.5) * 2;
      dustPos[i + 2] = Math.sin(angle) * radius;
    }
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.5,
      color: 0xffffff,
      transparent: true,
      opacity: 0.65,
    });
    const dust = new THREE.Points(dustGeom, dustMat);
    scene.add(dust);

    scene.userData.tick = (t) => {
      sun.rotation.y += 0.006;
      sunGlow.rotation.y -= 0.004;
      halo.rotation.z = t * 0.22;

      planets.forEach((p, i) => {
        p.pivot.rotation.y = t * (0.12 + i * 0.06);
        p.mesh.rotation.y += 0.012 + i * 0.004;
      });

      dust.rotation.y = t * 0.04;

      camera.position.set(
        Math.sin(t * 0.26) * 26,
        10 + Math.sin(t * 0.2) * 2.5,
        26 + Math.cos(t * 0.26) * 4
      );
      camera.lookAt(0, 0, 0);
    };

    return {
      cleanup: () => {
        sunGeom.dispose();
        sunGlowGeom.dispose();
        haloGeom.dispose();
        radii.forEach((_, i) => planets[i].geom.dispose());
        ringG.dispose();
        dustGeom.dispose();
      },
    };
  });
}

/* =============== SCENE 3: ASTEROID FIELD =============== */

function useAsteroidFieldScene() {
  return useScene((scene, camera) => {
    scene.fog = new THREE.FogExp2(0x020617, 0.02);

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(-12, 18, 16);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x38bdf8, 0.9);
    fill.position.set(16, -8, -14);
    scene.add(fill);

    const astGeom = new THREE.DodecahedronGeometry(1.4, 1);
    const asteroids = [];
    for (let i = 0; i < 160; i++) {
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

    const saucerGeom = new THREE.CylinderGeometry(0, 7, 2.2, 32);
    const saucerMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      metalness: 0.95,
      roughness: 0.25,
    });
    const saucer = new THREE.Mesh(saucerGeom, saucerMat);
    saucer.rotation.x = Math.PI / 2;
    saucer.position.set(0, 0, -10);
    scene.add(saucer);

    const domeGeom = new THREE.SphereGeometry(2.4, 32, 32);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.8,
    });
    const dome = new THREE.Mesh(domeGeom, domeMat);
    dome.position.set(0, 1.7, 0);
    saucer.add(dome);

    const beamGeom = new THREE.ConeGeometry(1.8, 9, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
    });
    const beam = new THREE.Mesh(beamGeom, beamMat);
    beam.position.set(0, -4.3, 0);
    beam.rotation.x = Math.PI;
    saucer.add(beam);

    const ufoLight = new THREE.PointLight(0x22c55e, 2.4, 50);
    ufoLight.position.set(0, 0, -6);
    scene.add(ufoLight);

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

      saucer.position.x = Math.sin(t * 0.7) * 9;
      saucer.position.y = Math.cos(t * 0.5) * 3;
      saucer.rotation.z = Math.sin(t * 1.0) * 0.4;
      dome.rotation.y -= 0.02;
      beam.material.opacity = 0.22 + (Math.sin(t * 4) + 1) * 0.12;

      ufoLight.position.set(saucer.position.x, saucer.position.y, -6);

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
        saucerGeom.dispose();
        domeGeom.dispose();
        beamGeom.dispose();
      },
    };
  });
}

/* =============== SCENE 4: GALAXY =============== */

function useGalaxyScene() {
  return useScene((scene, camera) => {
    scene.fog = new THREE.FogExp2(0x020617, 0.012);

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const galaxyGeom = new THREE.BufferGeometry();
    const count = 3200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const innerColor = new THREE.Color(0x38bdf8);
    const outerColor = new THREE.Color(0xf97316);

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 30;
      const spin = radius * 0.35;
      const branch = (i % 4) * ((2 * Math.PI) / 4);
      const randomX = (Math.random() - 0.5) * 1.6;
      const randomY = (Math.random() - 0.5) * 1.2;
      const randomZ = (Math.random() - 0.5) * 1.6;

      const angle = branch + spin;
      pos[i * 3] = Math.cos(angle) * radius + randomX;
      pos[i * 3 + 1] = randomY * 1.6;
      pos[i * 3 + 2] = Math.sin(angle) * radius + randomZ;

      const mixed = innerColor.clone().lerp(outerColor, radius / 30);
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

    const coreGeom = new THREE.SphereGeometry(2.2, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.85,
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    scene.add(core);

    const moonGeom = new THREE.SphereGeometry(3.2, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xf9fafb,
      roughness: 0.6,
      metalness: 0.2,
    });
    const moon1 = new THREE.Mesh(moonGeom, moonMat);
    moon1.position.set(12, 4, -12);
    const moon2 = moon1.clone();
    moon2.position.set(-16, -4, -16);
    scene.add(moon1);
    scene.add(moon2);

    scene.userData.tick = (t) => {
      galaxy.rotation.y = t * 0.055;
      galaxy.rotation.z = Math.sin(t * 0.18) * 0.16;

      core.scale.setScalar(1.1 + Math.sin(t * 2.8) * 0.12);

      moon1.position.y = 4 + Math.sin(t * 0.7) * 1.5;
      moon2.position.y = -4 + Math.cos(t * 0.6) * 1.5;
      moon1.rotation.y += 0.025;
      moon2.rotation.y -= 0.022;

      camera.position.set(
        Math.sin(t * 0.22) * 24,
        7 + Math.sin(t * 0.3) * 3,
        30
      );
      camera.lookAt(0, 0, 0);
    };

    return {
      cleanup: () => {
        galaxyGeom.dispose();
        moonGeom.dispose();
        coreGeom.dispose();
      },
    };
  });
}

/* =============== MAIN COMPONENT =============== */

export default function AsteroidStories({ observations, onAddFavorite }) {
  const featured = observations.slice(0, 5);

  const scenes = [
    useMoonScene(),
    useShipScene(),
    useSolarScene(),
    useAsteroidFieldScene(),
    useGalaxyScene(),
  ];

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
            ? "bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.35),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(15,23,42,0.9),transparent_60%)]"
            : idx === 1
            ? "bg-[radial-gradient(circle_at_80%_10%,rgba(147,51,234,0.4),transparent_55%),radial-gradient(circle_at_0%_80%,rgba(3,7,18,0.9),transparent_55%)]"
            : idx === 2
            ? "bg-[radial-gradient(circle_at_20%_0%,rgba(251,191,36,0.4),transparent_55%),radial-gradient(circle_at_90%_90%,rgba(15,23,42,0.9),transparent_60%)]"
            : idx === 3
            ? "bg-[radial-gradient(circle_at_10%_80%,rgba(16,185,129,0.35),transparent_55%),radial-gradient(circle_at_90%_20%,rgba(15,23,42,0.9),transparent_60%)]"
            : "bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.35),transparent_55%),radial-gradient(circle_at_50%_100%,rgba(15,23,42,0.9),transparent_60%)]";

        const asteroidId = obs.obs_id || `obs-${idx}`;
        const asteroidName = `Observation ${idx + 1} – ${
          obs.time || "Unknown time"
        }`;

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
                  SkyMorph observation snapshot
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* MAIN TEXT */}
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
                    className="text-base md:text-lg text-gray-100"
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
                    . The asteroid traces a luminous path across the sensor,
                    another tiny frame in its endless orbit.
                  </motion.p>
                </motion.div>

                {/* METRICS + 3D PANEL */}
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
                      <span>
                        {idx === 0
                          ? "Lunar horizon"
                          : idx === 1
                          ? "Ship fly‑by"
                          : idx === 2
                          ? "Orbital dance"
                          : idx === 3
                          ? "Asteroid lane"
                          : "Galaxy wake"}
                      </span>
                      <span className="text-sky-300">
                        {obs.mag != null ? `mag ${obs.mag}` : "mag ?"}
                      </span>
                    </div>
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
                        Sliding sideways across the starfield.
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
                        Climbing silently north or south.
                      </p>
                    </motion.div>
                  </div>

                  {/* Frame offset + Add to Favorites side by side, same style */}
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
                        Distance from the telescope&apos;s centre.
                      </p>
                    </motion.div>

                    <motion.button
                      whileHover={{ y: -4, scale: 1.02 }}
                      type="button"
                      className="rounded-2xl bg-black/60 border border-white/20 px-4 py-3 text-sm text-gray-100 flex-1 min-w-[220px] text-left"
                      onClick={() =>
                        onAddFavorite &&
                        onAddFavorite({
                          id: asteroidId,
                          name: asteroidName,
                          type: "Observation",
                          distance: "",
                          value: "",
                          notes: "",
                        })
                      }
                    >
                      <p className="text-[11px] uppercase tracking-[0.22em] text-gray-400 mb-1">
                        Add to favorites
                      </p>
                      <p className="text-base font-semibold flex items-center gap-2">
                        <span className="text-red-500 text-lg leading-none">
                          ★
                        </span>
                        <span>Save this observation</span>
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Store this frame in your asteroid archive.
                      </p>
                    </motion.button>
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
