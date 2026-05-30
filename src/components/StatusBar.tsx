import './StatusBar.css'

export default function StatusBar() {
  return (
    <div className="statusbar">
      <div className="status-left">
        <span className="status-item">
          <span className="status-light ready" />
          Physics: Ready
        </span>
        <span className="status-sep" />
        <span className="status-item">Models: 1</span>
        <span className="status-sep" />
        <span className="status-item">Lights: 1</span>
        <span className="status-sep" />
        <span className="status-item">SDF 1.10</span>
      </div>

      <div className="status-center">
        <span className="status-item mono">0.000, 0.000, 0.000</span>
      </div>

      <div className="status-right">
        <span className="status-item">FPS 60</span>
        <span className="status-sep" />
        <span className="status-item">RTF 1.00</span>
        <span className="status-sep" />
        <span className="status-item subtle">World Editor</span>
      </div>
    </div>
  )
}
