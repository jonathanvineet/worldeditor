import { useState } from 'react'
import './Toolbar.css'

interface ToolGroup {
  tools: Tool[]
}

interface Tool {
  id: string
  label: string
  icon: string
  isAction?: boolean
}

type IconElement = React.ReactElement

const TOOL_GROUPS: ToolGroup[] = [
  {
    tools: [
      { id: 'select', label: 'Select (Q)', icon: 'cursor' },
      { id: 'move', label: 'Move (W)', icon: 'move' },
      { id: 'rotate', label: 'Rotate (E)', icon: 'rotate' },
      { id: 'scale', label: 'Scale (R)', icon: 'scale' },
    ],
  },
  {
    tools: [
      { id: 'camera', label: 'Camera', icon: 'camera' },
      { id: 'light', label: 'Light', icon: 'light' },
      { id: 'model', label: 'Model', icon: 'model' },
      { id: 'terrain', label: 'Terrain', icon: 'terrain' },
      { id: 'sensor', label: 'Sensor', icon: 'sensor' },
    ],
  },
  {
    tools: [
      { id: 'play', label: 'Play (F5)', icon: 'play', isAction: true },
      { id: 'pause', label: 'Pause (F6)', icon: 'pause', isAction: true },
      { id: 'stop', label: 'Stop (F7)', icon: 'stop', isAction: true },
      { id: 'reset', label: 'Reset (F8)', icon: 'reset', isAction: true },
    ],
  },
]

const ICONS: Record<string, IconElement> = {
  cursor: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M3 1l10 6-5 1.5L6.5 14z"/>
    </svg>
  ),
  move: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1l2 3H9v3h3V6l3 2-3 2V9h-3v3h1l-2 3-2-3h1V9H5v1L2 8l3-2v1h3V4H7z"/>
    </svg>
  ),
  rotate: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 8A5 5 0 1 1 8 3" strokeLinecap="round"/>
      <polyline points="12,1 13,4 10,4" fill="currentColor" stroke="none"/>
      <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  scale: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="1.5" y="1.5" width="5" height="5" rx="0.5"/>
      <rect x="9" y="9" width="5.5" height="5.5" rx="0.5"/>
      <line x1="6.5" y1="4" x2="9" y2="4"/>
      <line x1="12" y1="6.5" x2="12" y2="9"/>
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M1 4h9v7H1V4zm9 1.5L14 3v9l-4-2.5V5.5z"/>
    </svg>
  ),
  light: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="8" cy="7" r="3"/>
      <line x1="8" y1="1" x2="8" y2="2.5"/>
      <line x1="8" y1="11.5" x2="8" y2="13"/>
      <line x1="2.5" y1="7" x2="4" y2="7"/>
      <line x1="12" y1="7" x2="13.5" y2="7"/>
      <line x1="4.1" y1="3.1" x2="5.1" y2="4.1"/>
      <line x1="10.9" y1="9.9" x2="11.9" y2="10.9"/>
      <line x1="11.9" y1="3.1" x2="10.9" y2="4.1"/>
      <line x1="5.1" y1="9.9" x2="4.1" y2="10.9"/>
      <path d="M6 10h4v1.5a2 2 0 01-4 0V10z" fill="currentColor" stroke="none"/>
    </svg>
  ),
  model: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5z"/>
      <line x1="8" y1="2" x2="8" y2="14"/>
      <line x1="2" y1="5.5" x2="14" y2="5.5"/>
    </svg>
  ),
  terrain: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <polyline points="1,13 4,7 7,10 10,4 13,8 15,6"/>
      <line x1="1" y1="13" x2="15" y2="13"/>
    </svg>
  ),
  sensor: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="8" cy="8" r="2"/>
      <path d="M4 4a5.66 5.66 0 000 8" strokeLinecap="round"/>
      <path d="M12 12a5.66 5.66 0 000-8" strokeLinecap="round"/>
      <path d="M1.5 1.5a9.5 9.5 0 000 13" strokeLinecap="round"/>
      <path d="M14.5 14.5a9.5 9.5 0 000-13" strokeLinecap="round"/>
    </svg>
  ),
  play: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <polygon points="4,2 13,8 4,14"/>
    </svg>
  ),
  pause: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <rect x="3" y="2" width="4" height="12" rx="1"/>
      <rect x="9" y="2" width="4" height="12" rx="1"/>
    </svg>
  ),
  stop: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <rect x="3" y="3" width="10" height="10" rx="1"/>
    </svg>
  ),
  reset: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 5A5 5 0 1 0 13.5 9" strokeLinecap="round"/>
      <polyline points="13,2 13,5.5 9.5,5.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

export default function Toolbar() {
  const [activeTool, setActiveTool] = useState('select')
  const [simState, setSimState] = useState<'stopped' | 'playing' | 'paused'>('stopped')

  function handleTool(tool: Tool) {
    if (tool.isAction) {
      if (tool.id === 'play') setSimState('playing')
      else if (tool.id === 'pause') setSimState('paused')
      else if (tool.id === 'stop' || tool.id === 'reset') setSimState('stopped')
    } else {
      setActiveTool(tool.id)
    }
  }

  return (
    <div className="toolbar">
      {TOOL_GROUPS.map((group, gi) => (
        <div key={gi} className="toolbar-group">
          {group.tools.map((tool) => {
            const isPlayAction = tool.isAction
            const isActive = isPlayAction
              ? (tool.id === 'play' && simState === 'playing') ||
                (tool.id === 'pause' && simState === 'paused') ||
                (tool.id === 'stop' && simState === 'stopped') ||
                (tool.id === 'reset' && simState === 'stopped')
              : activeTool === tool.id

            return (
              <button
                key={tool.id}
                className={`toolbar-btn ${isActive ? 'active' : ''} ${tool.id === 'play' && simState === 'playing' ? 'sim-active' : ''}`}
                title={tool.label}
                onClick={() => handleTool(tool)}
              >
                <span className="toolbar-icon">{ICONS[tool.icon]}</span>
                <span className="toolbar-label">{tool.label.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      ))}

      <div className="toolbar-spacer" />

      <div className="toolbar-group toolbar-right">
        <div className="toolbar-sim-info">
          <span className={`sim-indicator ${simState}`} />
          <span className="sim-label">
            {simState === 'playing' ? 'RUNNING' : simState === 'paused' ? 'PAUSED' : 'STOPPED'}
          </span>
        </div>
        <div className="toolbar-snap">
          <label>Snap</label>
          <select>
            <option>None</option>
            <option>0.1m</option>
            <option>0.25m</option>
            <option>0.5m</option>
            <option>1.0m</option>
          </select>
        </div>
        <div className="toolbar-snap">
          <label>RTF</label>
          <select>
            <option>1.0×</option>
            <option>0.5×</option>
            <option>0.25×</option>
            <option>2.0×</option>
          </select>
        </div>
      </div>
    </div>
  )
}
