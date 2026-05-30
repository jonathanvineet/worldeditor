import React, { useRef, useState, useEffect, useMemo, useCallback, ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, TransformControls, Environment, Stats } from '@react-three/drei'
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

// Memoized infinite grid component
const InfiniteGrid = useMemo(() => function MemoizedInfiniteGrid() {
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
}, []) as React.FC

// Memoized directional sunlight with shadows
const Sunlight = useMemo(() => function MemoizedSunlight({ position }: { position: [number, number, number] }) {
  const lightGeom = useMemo(() => [0.3, 16, 16] as const, [])
  
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
        <sphereGeometry args={lightGeom} />
        <meshBasicMaterial color="#ffd080" />
      </mesh>
    </>
  )
}, []) as React.FC<{ position: [number, number, number] }>

// Memoized shadow receiving floor
const ShadowFloor = useMemo(() => function MemoizedShadowFloor() {
  const planeArgs = useMemo(() => [100, 100] as const, [])
  
  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={planeArgs} />
      <shadowMaterial opacity={0.3} />
    </mesh>
  )
}, []) as React.FC

// Selectable entity mesh - receives selection from context
function EntityMesh({ entity }: { entity: Entity }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { selectedId, setSelectedId, hoveredId, setHoveredId } = useApp()
  const isSelected = selectedId === entity.id
  const isHovered = hoveredId === entity.id
// Memoized outline mesh for selection/hover - only re-renders when state changes
const EntityOutline = ({ entity, isSelected, isHovered }: { entity: Entity; isSelected: boolean; isHovered: boolean }) => {
  const isVisible = isSelected || (isHovered && !isSelected)
  if (!isVisible || entity.type === 'ground') return null

  const outlineColor = isSelected ? '#0080ff' : '#ff8000'
  const outlineScale = 1.03

  const geometry = useMemo(() => {
    switch (entity.type) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />
      default:
        return <sphereGeometry args={[0.25, 16, 16]} />
    }
  }, [entity.type])

  return (
    <mesh
      position={entity.position}
      rotation={entity.rotation}
      scale={[entity.scale[0] * outlineScale, entity.scale[1] * outlineScale, entity.scale[2] * outlineScale]}
    >
      {geometry}
      <meshBasicMaterial
        color={outlineColor}
        transparent
        opacity={0.15}
        depthTest={false}
      />
    </mesh>
  )
}

// Memoized entity mesh with optimized rendering
const EntityMesh = ({ entity }: { entity: Entity }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { selectedId, setSelectedId, hoveredId, setHoveredId } = useApp()
  
  // Only these values trigger a re-render for this specific entity
  const isSelected = selectedId === entity.id
  const isHovered = hoveredId === entity.id

  // Memoized geometry - never recreated unless entity.type changes
  const geometry = useMemo(() => {
    switch (entity.type) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />
      case 'ground':
        return <planeGeometry args={[50, 50]} />
      case 'light':
        return <sphereGeometry args={[0.2, 16, 16]} />
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }, [entity.type])

  // Memoized material - never recreated unless selection/hover state changes
  const materialColor = useMemo(() => {
    if (isSelected) return '#0080ff'
    if (isHovered) return '#ff8000'
    return '#000000'
  }, [isSelected, isHovered])

  const emissiveIntensity = useMemo(() => {
    return isSelected ? 0.3 : isHovered ? 0.15 : 0
  }, [isSelected, isHovered])

  // Memoized scale for outline effect
  const outlineScale = useMemo(() => isSelected ? 1.02 : 1, [isSelected])

  // Memoized rotation
  const rotation = useMemo(() => 
    entity.type === 'ground' ? [-Math.PI / 2, 0, 0] : entity.rotation,
    [entity.type, entity.rotation]
  )

  // Memoized scale array
  const scaledScale = useMemo(() => [
    entity.scale[0] * outlineScale,
    entity.scale[1] * outlineScale,
    entity.scale[2] * outlineScale
  ], [entity.scale, outlineScale])

  // Use callbacks to prevent function recreation
  const handleClick = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setSelectedId(entity.id)
  }, [entity.id, setSelectedId])

  const handlePointerOver = useCallback(() => setHoveredId(entity.id), [entity.id, setHoveredId])
  const handlePointerOut = useCallback(() => setHoveredId(null), [setHoveredId])

  return (
    <>
      {/* Main mesh */}
      <mesh
        ref={meshRef}
        position={entity.position}
        rotation={rotation}
        scale={scaledScale}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow={entity.type !== 'ground' && entity.type !== 'light'}
        receiveShadow={entity.type === 'ground'}
      >
        {geometry}
        <meshStandardMaterial
          color={entity.color}
          emissive={materialColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Outline - rendered separately to isolate re-renders */}
      <EntityOutline entity={entity} isSelected={isSelected} isHovered={isHovered} />
    </>
  )
}

// Apply React.memo to EntityMesh to prevent re-renders from parent context changes
// Only re-render if the entity object itself changes
const MemoizedEntityMesh = React.memo(EntityMesh, (prevProps, nextProps) => {
  // Return true if props are equal (skip render)
  return prevProps.entity === nextProps.entity
})

// Memoized transform gizmo - only re-renders when selected entity changes
const TransformGizmo = ({ selectedEntity, transformMode }: { selectedEntity: Entity | null, transformMode: string }) => {
  const controlsRef = useRef<any>(null)
  
  // Memoized geometries to prevent recreation
  const boxGeom = useMemo(() => <boxGeometry args={[1, 1, 1]} />, [])
  const sphereGeom = useMemo(() => <sphereGeometry args={[0.5, 32, 32]} />, [])

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.setMode(transformMode)
    }
  }, [transformMode])

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
        position={selectedEntity.position}
        rotation={selectedEntity.rotation}
        scale={selectedEntity.scale}
      >
        {selectedEntity.type === 'box' ? boxGeom : sphereGeom}
        <meshStandardMaterial visible={false} />
      </mesh>
    </TransformControls>
  )
}

const MemoizedTransformGizmo = React.memo(TransformGizmo, (prev, next) => {
  // Re-render only if selected entity changes
  return prev.selectedEntity === next.selectedEntity && prev.transformMode === next.transformMode
})

// Memoized FPS counter - rendered outside canvas, independent updates
const FPSCounterOverlay = React.memo(function FPSCounterOverlay() {
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
})

// Memoized orbit controls wrapper - only re-renders when selected entity changes
const OrbitControlsWrapper = React.memo(function OrbitControlsWrapper() {
  const controlsRef = useRef<any>(null)
  const { onFocusSelected } = useToolbar()
  const { selectedEntity } = useApp()

  // Register focus callback
  useEffect(() => {
    onFocusSelected(() => {
      if (controlsRef.current && selectedEntity) {
        const target = new THREE.Vector3(...selectedEntity.position)
        controlsRef.current.target.copy(target)
        controlsRef.current.update()
      }
    })
  }, [onFocusSelected, selectedEntity])

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      screenSpacePanning
      minDistance={1}
      maxDistance={80}
      maxPolarAngle={Math.PI / 2 - 0.05}
    />
  )
})

// Memoized scene content - uses memoized entity renderers
const SceneContent = React.memo(function SceneContent() {
  const { entities, selectedEntity } = useApp()
  const { transformMode } = useToolbar()

  // Memoized light intensities and colors
  const ambientLightIntensity = useMemo(() => 0.3, [])
  const sunlightPosition = useMemo(() => [5, 10, 5] as [number, number, number], [])
  const backgroundColor = useMemo(() => '#0a1525', [])
  const fogColor = useMemo(() => '#0d1a2e', [])
  const fogNear = useMemo(() => 30, [])
  const fogFar = useMemo(() => 100, [])

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={ambientLightIntensity} />

      {/* Sky/fog */}
      <color attach="background" args={[backgroundColor]} />
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

      {/* Environment */}
      <Environment preset="night" background={false} />

      {/* Infinite grid */}
      <InfiniteGrid />

      {/* Shadow floor */}
      <ShadowFloor />

      {/* Directional sunlight */}
      <Sunlight position={sunlightPosition} />

      {/* Entities - use memoized entity mesh to prevent re-renders from context changes */}
      {entities.map((entity) => (
        <MemoizedEntityMesh key={entity.id} entity={entity} />
      ))}

      {/* Transform gizmo */}
      <MemoizedTransformGizmo selectedEntity={selectedEntity} transformMode={transformMode} />

      {/* Orbit controls */}
      <OrbitControlsWrapper />

      {/* Stats component from drei - shows real-time FPS and performance metrics */}
      <Stats />
    </>
  )
})

// Main 3D Viewport component - memoized to prevent re-renders from parent changes
export default React.memo(function Viewport3D() {
  const { selectedId, setSelectedId, entities } = useApp()

  // Memoized callback for deselection on pointer miss
  const handlePointerMissed = useCallback(() => setSelectedId(null), [setSelectedId])

  // Memoized camera config
  const cameraConfig = useMemo(() => ({ position: [8, 6, 8], fov: 50, near: 0.1, far: 1000 }), [])

  // Memoized selected entity message
  const selectedMessage = useMemo(() => {
    if (!selectedId) return 'Click to select'
    const entity = entities.find(e => e.id === selectedId)
    return entity ? `Selected: ${entity.name}` : 'Unknown'
  }, [selectedId, entities])

  return (
    <div className="viewport3d" tabIndex={0}>
      <Canvas
        shadows
        camera={cameraConfig as any}
        onPointerMissed={handlePointerMissed}
      >
        <SceneContent />
      </Canvas>

      {/* Top-right overlay with performance info */}
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

      {/* Bottom-left overlay with selection status */}
      <div className="viewport-overlay bottom-left">
        <span className="overlay-message">{selectedMessage}</span>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="viewport-overlay shortcuts-hint">
        <span>W: Move | E: Rotate | R: Scale | F: Focus</span>
      </div>
    </div>
  )
})
