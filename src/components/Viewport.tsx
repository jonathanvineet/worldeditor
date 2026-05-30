import { useState } from 'react'
import './Viewport.css'

const VIEW_OPTIONS = ['Perspective', 'Top', 'Front', 'Right', 'Bottom', 'Back', 'Left']
const RENDER_MODES = ['Solid', 'Wireframe', 'Material', 'Unlit', 'Depth']

export default function Viewport() {
  const [view, setView] = useState('Perspective')
  const [renderMode, setRenderMode] = useState('Solid')
  const [showGrid, setShowGrid] = useState(true)
  const [showGizmo, setShowGizmo] = useState(true)

  return (
    <div className="viewport">
      {/* Sky / horizon background */}
      <div className="viewport-sky" />

      {/* SVG Grid + scene elements */}
      <svg className="viewport-scene" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Radial fade for grid */}
          <radialGradient id="gridFade" cx="50%" cy="65%" r="52%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="horizonFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e2a3a" stopOpacity="1" />
            <stop offset="40%" stopColor="#1a1a1a" stopOpacity="1" />
          </linearGradient>
          <clipPath id="viewportClip">
            <rect x="0" y="0" width="1000" height="700" />
          </clipPath>
        </defs>

        {/* Background gradient */}
        <rect x="0" y="0" width="1000" height="700" fill="url(#horizonFade)" />

        {/* Horizon line */}
        <line x1="0" y1="420" x2="1000" y2="420" stroke="#2a3a4a" strokeWidth="1" opacity="0.8" />

        {/* Ground grid - perspective */}
        {showGrid && (
          <g clipPath="url(#viewportClip)">
            {/* Perspective grid lines going to horizon */}
            {Array.from({ length: 41 }, (_, i) => {
              const t = i / 40
              const x = 500 + (t - 0.5) * 1400
              const yBot = 700
              const yHorizon = 420
              return (
                <line
                  key={`vline-${i}`}
                  x1={500}
                  y1={yHorizon}
                  x2={x}
                  y2={yBot}
                  stroke="#3a3a3a"
                  strokeWidth={i === 20 ? 1.5 : 0.6}
                  opacity={i === 20 ? 0.9 : 0.5}
                />
              )
            })}
            {/* Horizontal grid lines */}
            {Array.from({ length: 14 }, (_, i) => {
              const t = Math.pow(i / 13, 2)
              const y = 420 + t * 280
              const spread = 600 + t * 800
              return (
                <line
                  key={`hline-${i}`}
                  x1={500 - spread / 2}
                  y1={y}
                  x2={500 + spread / 2}
                  y2={y}
                  stroke="#3a3a3a"
                  strokeWidth={0.6}
                  opacity={0.5 - t * 0.1}
                />
              )
            })}
            {/* Axis highlight: X (red) */}
            <line x1="0" y1="420" x2="500" y2="700" stroke="#8b1a1a" strokeWidth="1.5" opacity="0.7" />
            <line x1="1000" y1="420" x2="500" y2="700" stroke="#8b1a1a" strokeWidth="1.5" opacity="0.4" />
            {/* Axis highlight: Y (green) */}
            <line x1="500" y1="420" x2="500" y2="700" stroke="#1a5a1a" strokeWidth="1.5" opacity="0.9" />
          </g>
        )}

        {/* Ground plane subtle glow */}
        <ellipse cx="500" cy="650" rx="380" ry="60" fill="#0e639c" opacity="0.04" />

        {/* Robot representation - wireframe box */}
        <g opacity="0.85">
          {/* Robot body */}
          <polygon
            points="440,560 560,560 580,500 420,500"
            fill="none"
            stroke="#4fc1ff"
            strokeWidth="1.2"
          />
          <polygon
            points="420,500 440,560 440,520 420,460"
            fill="none"
            stroke="#4fc1ff"
            strokeWidth="1.2"
          />
          <polygon
            points="580,500 560,560 560,520 580,460"
            fill="none"
            stroke="#4fc1ff"
            strokeWidth="1.2"
          />
          <polygon
            points="420,460 580,460 560,520 440,520"
            fill="none"
            stroke="#4fc1ff"
            strokeWidth="1"
          />
          {/* Wheels */}
          <ellipse cx="445" cy="560" rx="20" ry="8" fill="none" stroke="#4fc1ff" strokeWidth="1" />
          <ellipse cx="555" cy="560" rx="20" ry="8" fill="none" stroke="#4fc1ff" strokeWidth="1" />
          {/* Sensor head */}
          <rect x="474" y="460" width="52" height="18" fill="none" stroke="#4ec9b0" strokeWidth="1" />
          <line x1="500" y1="450" x2="500" y2="420" stroke="#4ec9b0" strokeWidth="1" strokeDasharray="3,3" />
          {/* Sensor arc/scan */}
          <path d="M440,430 Q500,380 560,430" fill="none" stroke="#4ec9b0" strokeWidth="0.8" opacity="0.6" strokeDasharray="4,4" />
        </g>

        {/* Bounding box dashed outline */}
        <rect
          x="415"
          y="415"
          width="170"
          height="155"
          fill="none"
          stroke="#0e639c"
          strokeWidth="0.8"
          strokeDasharray="5,4"
          opacity="0.6"
        />

        {/* Ground plane object */}
        <polygon
          points="500,420 750,500 500,580 250,500"
          fill="none"
          stroke="#2e5a2e"
          strokeWidth="0.8"
          opacity="0.5"
        />

        {/* Light indicator */}
        <circle cx="200" cy="180" r="8" fill="none" stroke="#dcdcaa" strokeWidth="1" opacity="0.7" />
        <line x1="200" y1="188" x2="200" y2="200" stroke="#dcdcaa" strokeWidth="0.8" opacity="0.5" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2
          return (
            <line
              key={i}
              x1={200 + Math.cos(a) * 10}
              y1={180 + Math.sin(a) * 10}
              x2={200 + Math.cos(a) * 16}
              y2={180 + Math.sin(a) * 16}
              stroke="#dcdcaa"
              strokeWidth="0.8"
              opacity="0.5"
            />
          )
        })}

        {/* Grid fade overlay */}
        <rect x="0" y="0" width="1000" height="700" fill="url(#gridFade)" />
      </svg>

      {/* XYZ Gizmo */}
      {showGizmo && (
        <div className="viewport-gizmo">
          <svg viewBox="0 0 64 64" width="64" height="64">
            <defs>
              <filter id="gizmoGlow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* X axis - red */}
            <line x1="32" y1="32" x2="56" y2="22" stroke="#e05050" strokeWidth="2" strokeLinecap="round" />
            <circle cx="56" cy="22" r="5" fill="#e05050" />
            <text x="54" y="26" fill="white" fontSize="6" textAnchor="middle" dominantBaseline="middle" fontWeight="600">X</text>
            {/* Y axis - green */}
            <line x1="32" y1="32" x2="32" y2="8" stroke="#50c050" strokeWidth="2" strokeLinecap="round" />
            <circle cx="32" cy="8" r="5" fill="#50c050" />
            <text x="32" y="8" fill="white" fontSize="6" textAnchor="middle" dominantBaseline="middle" fontWeight="600">Y</text>
            {/* Z axis - blue */}
            <line x1="32" y1="32" x2="8" y2="42" stroke="#5080e0" strokeWidth="2" strokeLinecap="round" />
            <circle cx="8" cy="42" r="5" fill="#5080e0" />
            <text x="8" y="42" fill="white" fontSize="6" textAnchor="middle" dominantBaseline="middle" fontWeight="600">Z</text>
            {/* Center dot */}
            <circle cx="32" cy="32" r="2.5" fill="#888" />
          </svg>
          <span className="gizmo-label">{view}</span>
        </div>
      )}

      {/* Viewport controls overlay */}
      <div className="viewport-controls">
        <select
          className="viewport-select"
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          {VIEW_OPTIONS.map((v) => <option key={v}>{v}</option>)}
        </select>
        <select
          className="viewport-select"
          value={renderMode}
          onChange={(e) => setRenderMode(e.target.value)}
        >
          {RENDER_MODES.map((m) => <option key={m}>{m}</option>)}
        </select>
        <button
          className={`viewport-toggle ${showGrid ? 'on' : ''}`}
          onClick={() => setShowGrid(!showGrid)}
          title="Toggle Grid"
        >
          Grid
        </button>
        <button
          className={`viewport-toggle ${showGizmo ? 'on' : ''}`}
          onClick={() => setShowGizmo(!showGizmo)}
          title="Toggle Gizmo"
        >
          Gizmo
        </button>
      </div>

      {/* Viewport corner label */}
      <div className="viewport-corner-label">
        Camera: scene_camera_0 &nbsp;|&nbsp; FOV: 60° &nbsp;|&nbsp; Near: 0.01 &nbsp;|&nbsp; Far: 1000
      </div>

      {/* Crosshair */}
      <div className="viewport-crosshair">
        <div className="crosshair-h" />
        <div className="crosshair-v" />
      </div>
    </div>
  )
}
