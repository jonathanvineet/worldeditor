import './StatusBar.css'

export default function StatusBar() {
  return (
    <div className="statusbar">
      <div className="statusbar-left">
        <span className="status-item">
          <span className="status-dot ready" />
          <span className="status-label">Physics: Ready</span>
        </span>
        <span className="status-sep" />
        <span className="status-item">
          <span className="status-key">Objects:</span>
          <span className="status-val">4</span>
        </span>
        <span className="status-sep" />
        <span className="status-item">
          <span className="status-key">Models:</span>
          <span className="status-val">2</span>
        </span>
        <span className="status-sep" />
        <span className="status-item">
          <span className="status-key">Triangles:</span>
          <span className="status-val">0</span>
        </span>
        <span className="status-sep" />
        <span className="status-item">
          <span className="status-key">Selected:</span>
          <span className="status-val accent">robot_1</span>
        </span>
      </div>

      <div className="statusbar-center">
        <span className="status-item">
          <span className="status-key">Cursor:</span>
          <span className="status-val mono">0.000, 0.000, 0.000</span>
        </span>
      </div>

      <div className="statusbar-right">
        <span className="status-item">
          <span className="status-key">FPS:</span>
          <span className="status-val accent">60</span>
        </span>
        <span className="status-sep" />
        <span className="status-item">
          <span className="status-key">SDF:</span>
          <span className="status-val">1.10</span>
        </span>
        <span className="status-sep" />
        <span className="status-item">
          <span className="status-key">RTF:</span>
          <span className="status-val">0.00</span>
        </span>
        <span className="status-sep" />
        <span className="status-item mono">
          World Editor v0.1.0
        </span>
      </div>
    </div>
  )
}
