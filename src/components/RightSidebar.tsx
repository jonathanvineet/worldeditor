import { useState } from 'react'
import './RightSidebar.css'

interface PropRow {
  label: string
  value: string
  editable?: boolean
  unit?: string
  color?: string
}

function PropField({ label, value, unit, color }: PropRow) {
  const [val, setVal] = useState(value)
  return (
    <div className="prop-row">
      <span className="prop-label">{label}</span>
      <div className="prop-value-wrap">
        <input
          className="prop-input"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          style={color ? { color } : undefined}
        />
        {unit && <span className="prop-unit">{unit}</span>}
      </div>
    </div>
  )
}

function PropSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="prop-section">
      <button className="prop-section-header" onClick={() => setOpen(!open)}>
        <span className={`prop-caret ${open ? 'open' : ''}`}>▶</span>
        <span>{title}</span>
      </button>
      {open && <div className="prop-section-body">{children}</div>}
    </div>
  )
}

function XYZField({ label, x, y, z, unit }: { label: string; x: string; y: string; z: string; unit?: string }) {
  const [vals, setVals] = useState({ x, y, z })
  return (
    <div className="xyz-field">
      <span className="prop-label">{label}</span>
      <div className="xyz-inputs">
        {(['x', 'y', 'z'] as const).map((axis) => (
          <div key={axis} className="xyz-input-wrap">
            <span className={`xyz-axis axis-${axis}`}>{axis.toUpperCase()}</span>
            <input
              className="prop-input xyz-input"
              value={vals[axis]}
              onChange={(e) => setVals({ ...vals, [axis]: e.target.value })}
            />
          </div>
        ))}
        {unit && <span className="prop-unit">{unit}</span>}
      </div>
    </div>
  )
}

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState<'transform' | 'material' | 'physics' | 'meta'>('transform')

  return (
    <div className="right-sidebar">
      <div className="inspector-header">
        <span className="inspector-title">Inspector</span>
        <span className="inspector-target">robot_1</span>
      </div>

      <div className="inspector-tabs">
        {(['transform', 'material', 'physics', 'meta'] as const).map((tab) => (
          <button
            key={tab}
            className={`inspector-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            title={tab.charAt(0).toUpperCase() + tab.slice(1)}
          >
            {tab === 'transform' ? 'Xform' : tab === 'material' ? 'Mtrl' : tab === 'physics' ? 'Phys' : 'Meta'}
          </button>
        ))}
      </div>

      <div className="inspector-content">
        {activeTab === 'transform' && (
          <>
            <PropSection title="Transform">
              <XYZField label="Position" x="0.000" y="0.000" z="0.000" unit="m" />
              <XYZField label="Rotation" x="0.000" y="0.000" z="0.000" unit="°" />
              <XYZField label="Scale" x="1.000" y="1.000" z="1.000" />
            </PropSection>

            <PropSection title="Geometry">
              <PropField label="Type" value="Mesh" />
              <PropField label="URI" value="model://robot_1/mesh.dae" />
              <PropField label="Scale" value="1.0" unit="×" />
            </PropSection>

            <PropSection title="Pose (SDF)">
              <div className="code-block">
                <span className="code-line"><span className="xml-tag">&lt;pose&gt;</span>0 0 0 0 0 0<span className="xml-tag">&lt;/pose&gt;</span></span>
              </div>
            </PropSection>
          </>
        )}

        {activeTab === 'material' && (
          <>
            <PropSection title="Surface">
              <PropField label="Script" value="Gazebo/Grey" />
              <div className="prop-row">
                <span className="prop-label">Ambient</span>
                <div className="color-row">
                  <div className="color-swatch" style={{ background: 'rgba(100,100,100,0.8)' }} />
                  <input className="prop-input" defaultValue="0.4 0.4 0.4 1" />
                </div>
              </div>
              <div className="prop-row">
                <span className="prop-label">Diffuse</span>
                <div className="color-row">
                  <div className="color-swatch" style={{ background: 'rgba(200,200,200,0.8)' }} />
                  <input className="prop-input" defaultValue="0.8 0.8 0.8 1" />
                </div>
              </div>
              <div className="prop-row">
                <span className="prop-label">Specular</span>
                <div className="color-row">
                  <div className="color-swatch" style={{ background: 'rgba(30,30,30,0.8)' }} />
                  <input className="prop-input" defaultValue="0.1 0.1 0.1 1" />
                </div>
              </div>
              <div className="prop-row">
                <span className="prop-label">Emissive</span>
                <div className="color-row">
                  <div className="color-swatch" style={{ background: 'rgba(0,0,0,0.8)' }} />
                  <input className="prop-input" defaultValue="0.0 0.0 0.0 1" />
                </div>
              </div>
            </PropSection>
            <PropSection title="Texture">
              <PropField label="Albedo" value="—" />
              <PropField label="Normal" value="—" />
              <PropField label="Roughness" value="0.5" />
              <PropField label="Metallic" value="0.0" />
            </PropSection>
          </>
        )}

        {activeTab === 'physics' && (
          <>
            <PropSection title="Dynamics">
              <div className="prop-row">
                <span className="prop-label">Static</span>
                <label className="prop-checkbox">
                  <input type="checkbox" defaultChecked={false} />
                  <span className="checkbox-label">Off</span>
                </label>
              </div>
              <PropField label="Mass" value="1.000" unit="kg" />
              <PropField label="Mu₁" value="0.800" />
              <PropField label="Mu₂" value="0.800" />
            </PropSection>

            <PropSection title="Inertia">
              <PropField label="Ixx" value="0.0014" unit="kg·m²" />
              <PropField label="Ixy" value="0.0000" unit="kg·m²" />
              <PropField label="Ixz" value="0.0000" unit="kg·m²" />
              <PropField label="Iyy" value="0.0014" unit="kg·m²" />
              <PropField label="Iyz" value="0.0000" unit="kg·m²" />
              <PropField label="Izz" value="0.0025" unit="kg·m²" />
            </PropSection>

            <PropSection title="Collision">
              <PropField label="Shape" value="Box" />
              <XYZField label="Size" x="0.500" y="0.400" z="0.300" unit="m" />
              <PropField label="Friction" value="0.8" />
            </PropSection>
          </>
        )}

        {activeTab === 'meta' && (
          <>
            <PropSection title="Identity">
              <PropField label="Name" value="robot_1" />
              <PropField label="Model" value="TurtleBot3 Burger" />
              <PropField label="Version" value="1.0.0" />
              <PropField label="Author" value="Robotics Lab" />
            </PropSection>
            <PropSection title="SDF">
              <PropField label="SDF Ver." value="1.10" />
              <PropField label="File" value="robot_1.sdf" />
              <PropField label="Plugin" value="libgazebo_ros.so" />
            </PropSection>
            <PropSection title="Tags">
              <div className="tag-list">
                <span className="tag">mobile</span>
                <span className="tag">sensor</span>
                <span className="tag">lidar</span>
                <span className="tag">diff-drive</span>
              </div>
            </PropSection>
          </>
        )}
      </div>
    </div>
  )
}
