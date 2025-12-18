import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function SpaceScene({ scrollProgress }) {
  const canvasRef = useRef()
  const sceneRef = useRef()
  const starsRef = useRef()
  const asteroidsRef = useRef()

  useEffect(() => {
    if (!canvasRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true 
    })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Stars
    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 5000
    const positions = new Float32Array(starsCount * 3)
    
    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3
      const radius = 100
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const starsMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 0.2,
      transparent: true,
      opacity: 0.8
    })
    
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)
    starsRef.current = stars
    
    // Asteroids
    const asteroidGroup = new THREE.Group()
    const asteroidCount = 100
    
    for (let i = 0; i < asteroidCount; i++) {
      const size = Math.random() * 0.5 + 0.1
      const geometry = new THREE.SphereGeometry(size, 8, 8)
      const material = new THREE.MeshPhongMaterial({
        color: i % 3 === 0 ? 0x4ecdc4 : i % 3 === 1 ? 0xff6b6b : 0xffeaa7,
        shininess: 30,
        transparent: true,
        opacity: 0.7
      })
      
      const asteroid = new THREE.Mesh(geometry, material)
      
      const angle = Math.random() * Math.PI * 2
      const distance = 20 + Math.random() * 30
      const height = Math.random() * 20 - 10
      
      asteroid.position.set(
        Math.cos(angle) * distance,
        height,
        Math.sin(angle) * distance
      )
      
      asteroid.userData = {
        speed: Math.random() * 0.01 + 0.005,
        angle: angle,
        distance: distance,
        height: height,
        rotationSpeed: Math.random() * 0.02 + 0.01
      }
      
      asteroidGroup.add(asteroid)
    }
    
    scene.add(asteroidGroup)
    asteroidsRef.current = asteroidGroup
    
    // Planet
    const planetGeometry = new THREE.SphereGeometry(5, 32, 32)
    const planetMaterial = new THREE.MeshPhongMaterial({
      color: 0x4ecdc4,
      shininess: 100,
      wireframe: true
    })
    const planet = new THREE.Mesh(planetGeometry, planetMaterial)
    planet.position.set(0, 0, -50)
    scene.add(planet)
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)
    
    camera.position.z = 30
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Update based on scroll
      const scrollEffect = scrollProgress * Math.PI * 2
      
      // Rotate stars
      if (starsRef.current) {
        starsRef.current.rotation.y = scrollEffect * 0.1
      }
      
      // Move asteroids
      if (asteroidsRef.current) {
        asteroidsRef.current.children.forEach((asteroid, i) => {
          const data = asteroid.userData
          data.angle += data.speed
          
          asteroid.position.x = Math.cos(data.angle) * data.distance
          asteroid.position.z = Math.sin(data.angle) * data.distance
          asteroid.rotation.y += data.rotationSpeed
          asteroid.rotation.x += data.rotationSpeed * 0.5
        })
        
        asteroidsRef.current.rotation.y = scrollEffect * 0.05
      }
      
      // Move camera based on scroll
      camera.position.y = Math.sin(scrollEffect) * 10
      camera.position.x = Math.cos(scrollEffect) * 10
      camera.lookAt(0, 0, 0)
      
      renderer.render(scene, camera)
    }
    
    animate()
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    
    sceneRef.current = scene
    
    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [scrollProgress])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}