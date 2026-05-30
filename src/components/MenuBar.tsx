import { useState, useRef, useEffect } from 'react'
import './MenuBar.css'

interface MenuItem {
  label: string
  items: string[]
}

const MENUS: MenuItem[] = [
  {
    label: 'File',
    items: ['New World', 'Open World...', 'Open Recent ▶', '—', 'Save', 'Save As...', '—', 'Import Model...', 'Export World...', '—', 'Exit'],
  },
  {
    label: 'Edit',
    items: ['Undo', 'Redo', '—', 'Cut', 'Copy', 'Paste', 'Duplicate', 'Delete', '—', 'Select All', 'Deselect All', '—', 'Preferences...'],
  },
  {
    label: 'View',
    items: ['Scene Tree', 'Inspector', 'Console', 'Asset Browser', '—', 'Perspective', 'Top', 'Front', 'Right', '—', 'Grid', 'Axes', 'Wireframe', 'Bounding Boxes', '—', 'Reset View'],
  },
  {
    label: 'Insert',
    items: ['Primitive ▶', 'Light ▶', 'Camera', 'Sensor ▶', '—', 'Robot ▶', 'Ground Plane', 'Sky', '—', 'From File...'],
  },
  {
    label: 'Simulation',
    items: ['Play', 'Pause', 'Stop', 'Reset', '—', 'Step Forward', 'Step Backward', '—', 'Real-time Factor: 1.0', 'Physics Engine ▶', '—', 'Record'],
  },
  {
    label: 'Tools',
    items: ['Measure Distance', 'Mass Properties', 'Inertia Visualizer', '—', 'SDF Validator', 'URDF Importer', '—', 'Plugin Manager', 'Script Console'],
  },
  {
    label: 'Window',
    items: ['Workspace Default', 'Workspace Simulation', 'Workspace Debug', '—', 'Float Panel', 'Reset Layout', '—', 'Full Screen'],
  },
  {
    label: 'Help',
    items: ['Documentation', 'SDF Reference', 'Keyboard Shortcuts', '—', 'Report Issue', '—', 'About World Editor'],
  },
]

export default function MenuBar() {
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="menubar" ref={menuRef}>
      <div className="menubar-brand">WE</div>
      {MENUS.map((menu, i) => (
        <div key={menu.label} className="menubar-item">
          <button
            className={`menubar-trigger ${openMenu === i ? 'active' : ''}`}
            onMouseDown={() => setOpenMenu(openMenu === i ? null : i)}
            onMouseEnter={() => openMenu !== null && setOpenMenu(i)}
          >
            {menu.label}
          </button>
          {openMenu === i && (
            <div className="menubar-dropdown">
              {menu.items.map((item, j) =>
                item === '—' ? (
                  <div key={j} className="menu-separator" />
                ) : (
                  <button key={j} className="menu-item" onClick={() => setOpenMenu(null)}>
                    {item}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
