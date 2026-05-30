import { useState, createContext, useContext } from 'react'
import MenuBar from './components/MenuBar'
import Toolbar, { ToolbarProvider } from './components/Toolbar'
import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import BottomDock from './components/BottomDock'
import StatusBar from './components/StatusBar'
import Viewport3D from './Viewport3D'
import './App.css'

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

// Selection context shared across components
interface AppContextType {
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  hoveredId: string | null
  setHoveredId: (id: string | null) => void
  entities: Entity[]
  selectedEntity: Entity | null
}

const AppContext = createContext<AppContextType>({
  selectedId: null,
  setSelectedId: () => {},
  hoveredId: null,
  setHoveredId: () => {},
  entities: [],
  selectedEntity: null,
})

export function useApp() {
  return useContext(AppContext)
}

// Entities data
const ENTITIES: Entity[] = [
  { id: 'ground_plane', name: 'Ground Plane', type: 'ground', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#3a5a3a' },
  { id: 'sun', name: 'Sun', type: 'light', position: [5, 10, 5], rotation: [-0.5, 0.5, 0], scale: [1, 1, 1], color: '#ffd080' },
  { id: 'box_0', name: 'Box', type: 'box', position: [2, 0.5, 1], rotation: [0, 0.3, 0], scale: [1, 1, 1], color: '#4a90c0' },
  { id: 'sphere_0', name: 'Sphere', type: 'sphere', position: [-1.5, 0.5, -2], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#c05050' },
]

function AppContent() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const selectedEntity = ENTITIES.find(e => e.id === selectedId) || null

  return (
    <AppContext.Provider value={{ selectedId, setSelectedId, hoveredId, setHoveredId, entities: ENTITIES, selectedEntity }}>
      <div className="app">
        <MenuBar />
        <Toolbar />
        <div className="app-body">
          <LeftSidebar />
          <div className="app-center">
            <Viewport3D />
            <BottomDock />
          </div>
          <RightSidebar selectedEntity={selectedEntity} />
        </div>
        <StatusBar />
      </div>
    </AppContext.Provider>
  )
}

export default function App() {
  return (
    <ToolbarProvider>
      <AppContent />
    </ToolbarProvider>
  )
}
