import { useState, useEffect } from 'react'
import './RightSidebar.css'

interface Entity {
  id: string
  name: string
  type: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  color: string
}

interface RightSidebarProps {
  selectedEntity: Entity | null
}

function PropField({ label, value, unit, onChange }: { label: string; value: string; unit?: string; onChange?: (v: string) => void }) {
  const [val, setVal] = useState(value)
  useEffect(() => { setVal(value) }, [value])
  return (
    <div className="prop-row">
      <span className="prop-label">{label}</span>
      <div className="prop-value">
        <input
          className="prop-input"
          value={val}
          onChange={(e) => { setVal(e.target.value); onChange?.(e.target.value) }}
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
      <button className="prop-header" onClick={() => setOpen(!open)}>
        <span className={`prop-arrow ${open ? 'open' : ''}`}>▶</span>
        <span>{title}</span>
      </button>
      {open && <div className="prop-body">{children}</div>}
    </div>
  )
}

function XYZField({ label, x, y, z, onChange }: { label: string; x: string; y: string; z: string; onChange?: (axis: 'x' | 'y' | 'z', v: string) => void }) {
  const [vals, setVals] = useState({ x, y, z })
  useEffect(() => { setVals({ x, y, z }) }, [x, y, z])
  const handleChange = (axis: 'x' | 'y' | 'z', v: string) => {
    setVals({ ...vals, [axis]: v })
    onChange?.(axis, v)
  }
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

const DEFAULT_ENTITY: Entity = {
  id: '',
  name: 'World',
  type: 'world',
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
  color: '#888',
}

export default function RightSidebar({ selectedEntity }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<'xform' | 'material' | 'physics' | 'meta'>('xform')
  const entity = selectedEntity || DEFAULT_ENTITY

  return (
    <div className="right-sidebar">
      <div className="inspector-head">
        <span className="inspector-label">INSPECTOR</span>
        <span className="inspector-target">{entity.name}</span>
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
              <XYZField
                label="Pos"
                x={entity.position[0].toFixed(3)}
                y={entity.position[1].toFixed(3)}
                z={entity.position[2].toFixed(3)}
              />
              <XYZField
                label="Rot"
                x={entity.rotation[0].toFixed(3)}
                y={entity.rotation[1].toFixed(3)}
                z={entity.rotation[2].toFixed(3)}
              />
              <XYZField
                label="Scale"
                x={entity.scale[0].toFixed(3)}
                y={entity.scale[1].toFixed(3)}
                z={entity.scale[2].toFixed(3)}
              />
            </PropSection>
            <PropSection title="Geometry" defaultOpen={false}>
              <PropField label="Type" value={entity.type === 'box' ? 'Box' : entity.type === 'sphere' ? 'Sphere' : entity.type === 'ground' ? 'Plane' : entity.type === 'light' ? 'Light' : 'Unknown'} />
              <PropField label="Color" value={entity.color} />
            </PropSection>
          </>
        )}

        {activeTab === 'material' && (
          <>
            <PropSection title="Surface">
              <PropField label="Color" value={entity.color} />
              <PropField label="Roughness" value="0.70" />
              <PropField label="Metallic" value="0.10" />
            </PropSection>
          </>
        )}

        {activeTab === 'physics' && (
          <>
            <PropSection title="Dynamics">
              <div className="prop-row">
                <span className="prop-label">Static</span>
                <input type="checkbox" defaultChecked={entity.type === 'ground'} />
              </div>
              <PropField label="Mass" value={entity.type === 'ground' ? '∞' : '1.0'} unit="kg" />
              <PropField label="Friction" value="0.80" />
            </PropSection>
          </>
        )}

        {activeTab === 'meta' && (
          <>
            <PropSection title="Identity">
              <PropField label="Name" value={entity.name} />
              <PropField label="ID" value={entity.id} />
              <PropField label="Type" value={entity.type} />
            </PropSection>
          </>
        )}
      </div>
    </div>
  )
}
