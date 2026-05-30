import './Viewport.css'

export default function Viewport() {
  return (
    <div className="viewport">
      {/* Sky dome with atmospheric gradient */}
      <div className="viewport-sky-dome">
        {/* Sun */}
        <div className="viewport-sun" />
        {/* Atmospheric haze near horizon */}
        <div className="viewport-atmosphere" />
      </div>

      {/* Main SVG scene layer */}
      <svg className="viewport-scene" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Grid fade - disappears into fog/horizon */}
          <radialGradient id="gridFadePerspective" cx="50%" cy="100%" r="80%" fx="50%" fy="100%">
            <stop offset="0%" stopColor="#4a5a6a" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#3a4a5a" stopOpacity="0.18" />
            <stop offset="70%" stopColor="#2a3a4a" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#1a2a3a" stopOpacity="0" />
          </radialGradient>

          {/* Shadow gradient for ground plane */}
          <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#000000" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Fog gradient overlay */}
          <linearGradient id="fogOverlay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2530" stopOpacity="0" />
            <stop offset="60%" stopColor="#1a2530" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1a2530" stopOpacity="0.7" />
          </linearGradient>

          {/* Ambient occlusion under objects */}
          <radialGradient id="aoGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ====== INFINITE GROUND GRID ====== */}
        <g className="ground-grid">
          {/* Perspective grid lines extending to horizon */}
          {/* Vertical lines (going away from camera into distance) */}
          {Array.from({ length: 51 }, (_, i) => {
            const t = (i - 25) / 25 // -1 to 1
            const xFar = 500 + t * 50 // Vanishing point spread
            const xBot = 500 + t * 3500 // Wide spread at bottom
            const yHorizon = 320
            const yBot = 720

            // Major lines every 5, minor lines in between
            const isMajor = i % 5 === 25 % 5 // Center line and every 5th
            return (
              <line
                key={`vgrid-${i}`}
                x1={xFar}
                y1={yHorizon}
                x2={xBot}
                y2={yBot}
                stroke={isMajor ? "#4a5a6a" : "#2a3a4a"}
                strokeWidth={isMajor ? 0.8 : 0.4}
                opacity={isMajor ? 0.6 : 0.35}
              />
            )
          })}

          {/* Horizontal grid lines (parallel to camera, stacked into distance) */}
          {Array.from({ length: 25 }, (_, i) => {
            const t = Math.pow(i / 24, 2.5) // Non-linear spacing (dense near camera, sparse far)
            const y = 320 + t * 380
            const spread = 120 + t * 3900 // Narrow at horizon, wide at bottom

            return (
              <line
                key={`hgrid-${i}`}
                x1={500 - spread / 2}
                y1={y}
                x2={500 + spread / 2}
                y2={y}
                stroke="#3a4a5a"
                strokeWidth={0.5}
                opacity={0.5 - t * 0.35}
              />
            )
          })}

          {/* Ground plane subtle luminance difference */}
          <rect x="0" y="320" width="1000" height="380" fill="url(#gridFadePerspective)" />
        </g>

        {/* ====== SHADOW RECEIVING GROUND ====== */}
        {/* Main shadow plane */}
        <ellipse cx="500" cy="700" rx="900" ry="280" fill="url(#groundShadow)" opacity="0.8" />

        {/* ====== WORLD ENTITIES ====== */}
        {/* Ground Plane - subtle texture representation */}
        <g className="ground-plane-entity">
          {/* Ground plane boundary hint */}
          <ellipse
            cx="500"
            cy="630"
            rx="180"
            ry="45"
            fill="none"
            stroke="#3a5a3a"
            strokeWidth="0.6"
            opacity="0.25"
            strokeDasharray="8,6"
          />
          {/* Ground plane center marker */}
          <circle cx="500" cy="630" r="3" fill="#4a6a4a" opacity="0.4" />
          <text x="500" y="668" textAnchor="middle" fill="#4a6a4a" fontSize="9" fontFamily="JetBrains Mono, monospace" opacity="0.5">
            ground_plane
          </text>
        </g>

        {/* ====== ATMOSPHERIC FOG ====== */}
        <rect x="0" y="0" width="1000" height="700" fill="url(#fogOverlay)" />

        {/* ====== HORIZON LINE ====== */}
        <line x1="0" y1="318" x2="1000" y2="318" stroke="#5a6a7a" strokeWidth="1" opacity="0.4" />
      </svg>

      {/* ====== XYZ GIZMO (Bottom-right corner) ====== */}
      <div className="viewport-gizmo">
        <svg className="gizmo-svg" viewBox="0 0 100 100" width="72" height="72">
          <defs>
            <linearGradient id="gizmo-x" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#aa3030" />
              <stop offset="100%" stopColor="#ff5050" />
            </linearGradient>
            <linearGradient id="gizmo-y" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#30aa30" />
              <stop offset="100%" stopColor="#50ff50" />
            </linearGradient>
            <linearGradient id="gizmo-z" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#3050aa" />
              <stop offset="100%" stopColor="#5080ff" />
            </linearGradient>
            <filter id="gizmoGlow">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Z axis - Blue (toward camera/right on screen) */}
          <line x1="48" y1="52" x2="18" y2="68" stroke="url(#gizmo-z)" strokeWidth="3" strokeLinecap="round" filter="url(#gizmoGlow)" />
          <polygon points="18,68 12,63 22,62 24,71" fill="#5080ff" />
          <text x="10" y="75" fill="#5080ff" fontSize="11" fontWeight="700" fontFamily="monospace">Z</text>

          {/* X axis - Red (right) */}
          <line x1="48" y1="52" x2="82" y2="52" stroke="url(#gizmo-x)" strokeWidth="3" strokeLinecap="round" filter="url(#gizmoGlow)" />
          <polygon points="82,52 76,46 76,58 88,52" fill="#ff5050" />
          <text x="86" y="56" fill="#ff5050" fontSize="11" fontWeight="700" fontFamily="monospace">X</text>

          {/* Y axis - Green (up) */}
          <line x1="48" y1="52" x2="48" y2="18" stroke="url(#gizmo-y)" strokeWidth="3" strokeLinecap="round" filter="url(#gizmoGlow)" />
          <polygon points="48,18 42,26 54,26" fill="#50ff50" />
          <text x="44" y="12" fill="#50ff50" fontSize="11" fontWeight="700" fontFamily="monospace">Y</text>

          {/* Center sphere */}
          <circle cx="48" cy="52" r="5" fill="#888" filter="url(#gizmoGlow)" />
          <circle cx="48" cy="52" r="2.5" fill="#ccc" />
        </svg>

        {/* View mode indicator */}
        <div className="gizmo-info">
          <span className="gizmo-label">Perspective</span>
          <span className="gizmo-coords">X: 0.00 Y: 0.00 Z: 5.00</span>
        </div>
      </div>

      {/* ====== CAMERA OVERLAY INFO ====== */}
      <div className="viewport-camera-info">
        <span className="camera-detail">FOV 60°</span>
        <span className="camera-detail">Near 0.01</span>
        <span className="camera-detail">Far 1000</span>
      </div>

      {/* ====== CENTER CROSSHAIR (subtle) ===== */}
      <div className="viewport-crosshair">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <line x1="8" y1="12" x2="16" y2="12" stroke="#fff" strokeWidth="0.5" opacity="0.15" />
          <line x1="12" y1="8" x2="12" y2="16" stroke="#fff" strokeWidth="0.5" opacity="0.15" />
        </svg>
      </div>

      {/* ====== RENDER STATS OVERLAY ===== */}
      <div className="viewport-stats">
        <span>Render: OpenGL</span>
        <span>Shadows: ON</span>
        <span>AA: 4x</span>
      </div>
    </div>
  )
}
