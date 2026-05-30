import { useState } from 'react'
import './RightSidebar.css'

function PropField({ label, value, unit }: { label: string; value: string; unit?: string }) {
  const [val, setVal] = useState(value)
  return (
    <div className="prop-row">
      <span className="prop-label">{label}</span>
      <div className="prop-value">
        <input className="prop-input" value={val} onChange={(e) => setVal(e.target.value)} />
        {unit && <span className="prop-unit">{unit}</span>}
      </div>
    </div>
  )
}

function PropSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="prop-section">
      <button className="prop-header" onClick={() => setOpen(!open)}>
        <span className={`prop-arrow ${open ? 'open' : ''}`}>▶</span>
        <span>{title}</span>
      </button>
      {open && <div className="prop-body">{children}</div>}
    </div>
  )
}

function XYZField({ label, x, y, z }: { label: string; x: string; y: string; z: string }) {
  const [vals, setVals] = useState({ x, y, z })
  const handleChange = (axis: 'x' | 'y' | 'z', v: string) => setVals({ ...vals, [axis]: v })
  return (
    <div className="xyz-row">
      <span className="prop-label">{label}</span>
      <div className="xyz-inputs">
        {(['x', 'y', 'z'] as const).map((a) => (
          <div key={a} className="xyz-cell">
            <span className={`xyz-tag ${a}`}>{a.toUpperCase()}</span>
            <input
              className="prop-input xyz-val"
              value={vals[a]}
              onChange={(e) => handleChange(a, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState<'xform' | 'material' | 'physics' | 'meta'>('xform')
  const [target] = useState('World')

  return (
    <div className="right-sidebar">
      <div className="inspector-head">
        <span className="inspector-label">INSPECTOR</span>
        <span className="inspector-target">{target}</span>
      </div>

      <div className="inspector-tabs">
        {['xform', 'material', 'physics', 'meta'].map((tab) => (
          <button
            key={tab}
            className={`inspector-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab as typeof activeTab)}
          >
            {tab === 'xform' ? 'Xform' : tab === 'material' ? 'Mtrl' : tab === 'physics' ? 'Phys' : 'Meta'}
          </button>
        ))}
      </div>

      <div className="inspector-scroll">
        {activeTab === 'xform' && (
          <>
            <PropSection title="Transform">
              <XYZField label="Pos" x="0.000" y="0.000" z="0.000" />
              <XYZField label="Ori" x="0.000" y="0.000" z="0.000" />
              <XYZField label="Scale" x="1.000" y="1.000" z="1.000" />
            </PropSection>
            <PropSection title="Geometry" defaultOpen={false}>
              <PropField label="Type" value="Plane" />
              <PropField label="Size" value="100 × 100" unit="m" />
            </PropSection>
          </>
        )}

        {activeTab === 'material' && (
          <>
            <PropSection title="Surface">
              <PropField label="Ambient" value="0.4 0.4 0.4" />
              <PropField label="Diffuse" value="0.8 0.8 0.8" />
              <PropField label="Specular" value="0.1 0.1 0.1" />
            </PropSection>
          </>
        )}

        {activeTab === 'physics' && (
          <>
            <PropSection title="Physics">
              <div className="prop-row">
                <span className="prop-label">Static</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="prop-row">
                <span className="prop-label">Gravity</span>
                <input type="checkbox" defaultChecked />
              </div>
              <PropField label="Engine" value="ODE" />
            </PropSection>
          </>
        )}

        {activeTab === 'meta' && (
          <>
            <PropSection title="Identity">
              <PropField label="Name" value="world" />
              <PropField label="SDF" value="1.10" />
            </PropSection>
          </>
        )}
      </div>
    </div>
  )
}
