import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, TransformControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useApp } from './App'
import { useToolbar } from './components/Toolbar'
import './Viewport3D.css'

// Entity type
interface Entity {
  id: string
  name: string
  type: 'ground' | 'light' | 'box' | 'sphere'
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
}

// Infinite grid component
function InfiniteGrid() {
  return (
    <Grid
      position={[0, -0.01, 0]}
      args={[200, 200]}
      cellSize={1}
      cellThickness={0.5}
      cellColor="#3a4a5a"
      sectionSize={10}
      sectionThickness={1}
      sectionColor="#4a5a6a"
      fadeDistance={100}
      fadeStrength={1}
      followCamera={false}
      infiniteGrid={true}
    />
  )
}

// Directional sunlight with shadows
function Sunlight({ position }: { position: [number, number, number] }) {
  return (
    <>
      <directionalLight
        position={position}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />
      {/* Sun visual indicator */}
      <mesh position={position}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#ffd080" />
      </mesh>
    </>
  )
}

// Shadow receiving floor
function ShadowFloor() {
  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[100, 100]} />
      <shadowMaterial opacity={0.3} />
    </mesh>
  )
}

// Selectable entity mesh - receives selection from context
function EntityMesh({ entity }: { entity: Entity }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { selectedId, setSelectedId, hoveredId, setHoveredId } = useApp()
  const isSelected = selectedId === entity.id
  const isHovered = hoveredId === entity.id

  const geomProps = useMemo(() => {
    switch (entity.type) {
      case 'box':
        return { geometry: <boxGeometry args={[1, 1, 1]} /> }
      case 'sphere':
        return { geometry: <sphereGeometry args={[0.5, 32, 32]} /> }
      case 'ground':
        return { geometry: <planeGeometry args={[50, 50]} /> }
      case 'light':
        return { geometry: <sphereGeometry args={[0.2, 16, 16]} /> }
      default:
        return { geometry: <boxGeometry args={[1, 1, 1]} /> }
    }
  }, [entity.type])

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setSelectedId(entity.id)
  }

  const handlePointerOver = () => setHoveredId(entity.id)
  const handlePointerOut = () => setHoveredId(null)

  useEffect(() => {
    document.body.style.cursor = isHovered ? 'pointer' : 'default'
  }, [isHovered])

  // Emissive color and intensity based on hover and selection state
  const emissiveIntensity = isSelected ? 0.3 : isHovered ? 0.15 : 0
  const emissiveColor = isSelected ? '#0080ff' : isHovered ? '#ff8000' : '#000000'

  return (
    <mesh
      ref={meshRef}
      position={entity.position}
      rotation={entity.type === 'ground' ? [-Math.PI / 2, 0, 0] : entity.rotation}
      scale={entity.scale}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      castShadow={entity.type !== 'ground' && entity.type !== 'light'}
      receiveShadow={entity.type === 'ground'}
    >
      {geomProps.geometry}
      <meshStandardMaterial
        color={entity.color}
        emissive={emissiveColor}
        emissiveIntensity={emissiveIntensity}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  )
}

// Transform gizmo that responds to toolbar mode
function TransformGizmo() {
  const { selectedId, entities } = useApp()
  const { transformMode } = useToolbar()
  const controlsRef = useRef<any>(null)
  const objectRef = useRef<THREE.Object3D>(null)

  const selectedEntity = entities.find(e => e.id === selectedId)

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.setMode(transformMode)
    }
  }, [transformMode, selectedId])

  // Don't show for ground or light
  if (!selectedEntity || selectedEntity.type === 'ground' || selectedEntity.type === 'light') {
    return null
  }

  return (
    <TransformControls
      ref={controlsRef}
      mode={transformMode}
      size={0.8}
    >
      <mesh
        ref={objectRef}
        position={selectedEntity.position}
        rotation={selectedEntity.rotation}
        scale={selectedEntity.scale}
      >
        {selectedEntity.type === 'box' ? (
          <boxGeometry args={[1, 1, 1]} />
        ) : (
          <sphereGeometry args={[0.5, 32, 32]} />
        )}
        <meshStandardMaterial visible={false} />
      </mesh>
    </TransformControls>
  )
}

// FPS counter - rendered outside canvas
function FPSCounterOverlay() {
  const [fps, setFps] = useState(60)

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let rafId: number

    const tick = () => {
      frameCount++
      const now = performance.now()
      if (now - lastTime >= 500) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)))
        frameCount = 0
        lastTime = now
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return <span className="overlay-value">{fps}</span>
}

// Scene content
function SceneContent() {
  const { entities } = useApp()

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.3} />

      {/* Sky/fog */}
      <color attach="background" args={['#0a1525']} />
      <fog attach="fog" args={['#0d1a2e', 30, 100]} />

      {/* Environment */}
      <Environment preset="night" background={false} />

      {/* Infinite grid */}
      <InfiniteGrid />

      {/* Shadow floor */}
      <ShadowFloor />

      {/* Directional sunlight */}
      <Sunlight position={[5, 10, 5]} />

      {/* Entities */}
      {entities.map((entity) => (
        <EntityMesh key={entity.id} entity={entity} />
      ))}

      {/* Transform gizmo */}
      <TransformGizmo />
    </>
  )
}

// Main 3D Viewport component
export default function Viewport3D() {
  const { selectedId, setSelectedId, entities } = useApp()

  return (
    <div className="viewport3d">
      <Canvas
        shadows
        camera={{ position: [8, 6, 8], fov: 50, near: 0.1, far: 1000 }}
        onPointerMissed={() => setSelectedId(null)}
      >
        <SceneContent />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          screenSpacePanning
          minDistance={1}
          maxDistance={80}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>

      {/* Top-right overlay */}
      <div className="viewport-overlay top-right">
        <div className="overlay-row">
          <span className="overlay-label">Render:</span>
          <span className="overlay-value">WebGL</span>
        </div>
        <div className="overlay-row">
          <span className="overlay-label">Shadows:</span>
          <span className="overlay-value on">ON</span>
        </div>
        <div className="overlay-row">
          <span className="overlay-label">FPS:</span>
          <FPSCounterOverlay />
        </div>
      </div>

      {/* Bottom-right overlay with XYZ gizmo */}
      <div className="viewport-overlay bottom-right">
        <div className="gizmo-3d">
          <svg viewBox="0 0 64 64" width="56" height="56">
            <line x1="32" y1="32" x2="56" y2="20" stroke="#e05050" strokeWidth="2" />
            <text x="58" y="22" fill="#e05050" fontSize="10" fontWeight="bold">X</text>
            <line x1="32" y1="32" x2="32" y2="6" stroke="#50c050" strokeWidth="2" />
            <text x="29" y="6" fill="#50c050" fontSize="10" fontWeight="bold">Y</text>
            <line x1="32" y1="32" x2="8" y2="44" stroke="#5080e0" strokeWidth="2" />
            <text x="2" y="48" fill="#5080e0" fontSize="10" fontWeight="bold">Z</text>
            <circle cx="32" cy="32" r="3" fill="#888" />
          </svg>
        </div>
        <div className="perspective-label">Perspective</div>
      </div>

      {/* Bottom-left overlay */}
      <div className="viewport-overlay bottom-left">
        <span className="overlay-message">
          {selectedId
            ? `Selected: ${entities.find(e => e.id === selectedId)?.name || 'Unknown'}`
            : 'Click to select'}
        </span>
      </div>
    </div>
  )
}
