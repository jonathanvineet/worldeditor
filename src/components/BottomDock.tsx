import { useState } from 'react'
import './BottomDock.css'

const CONSOLE_LINES = [
  { time: '10:42:01.034', msg: '[World] Scene initialized: empty_world.sdf', lvl: 'info' },
  { time: '10:42:01.158', msg: '[Physics] ODE engine ready (step=0.001s)', lvl: 'info' },
  { time: '10:42:01.289', msg: '[Render] OpenGL 4.6 context created', lvl: 'info' },
  { time: '10:42:01.412', msg: '[Model] ground_plane loaded (static)', lvl: 'info' },
  { time: '10:42:01.524', msg: '[Light] Directional "sun" added', lvl: 'info' },
  { time: '10:42:01.645', msg: '[Simulation] Ready — Press Play to begin', lvl: 'info' },
]

const XML_CONTENT = `<?xml version="1.0"?>
<sdf version="1.10">
  <world name="empty_world">

    <physics type="ode">
      <real_time_update_rate>1000</real_time_update_rate>
      <max_step_size>0.001</max_step_size>
      <gravity>0 0 -9.81</gravity>
    </physics>

    <scene>
      <ambient>0.4 0.4 0.4 1</ambient>
      <background>0.12 0.15 0.18 1</background>
      <shadows>true</shadows>
    </scene>

    <light name="sun" type="directional">
      <pose>0 0 10 0 -0.3 0.5</pose>
      <diffuse>0.9 0.85 0.8 1</diffuse>
      <specular>0.2 0.2 0.2 1</specular>
      <direction>-0.5 0.25 -0.83</direction>
    </light>

    <model name="ground_plane">
      <static>true</static>
      <link name="link">
        <visual name="visual">
          <geometry><plane><normal>0 0 1</normal><size>100 100</size></plane></geometry>
        </visual>
        <collision name="collision">
          <geometry><plane><normal>0 0 1</normal></plane></geometry>
        </collision>
      </link>
    </model>

  </world>
</sdf>`

const WORLD_PROPS = [
  ['Physics Engine', 'ODE 0.16.2'],
  ['Step Size', '0.001 s'],
  ['RTF Target', '1.000'],
  ['Gravity', '0 0 -9.81 m/s²'],
  ['World Name', 'empty_world'],
  ['SDF Version', '1.10'],
  ['Models', '1'],
  ['Lights', '1'],
  ['Sensors', '0'],
]

export default function BottomDock() {
  const [tab, setTab] = useState<'console' | 'xml' | 'props'>('console')
  const [filter, setFilter] = useState('')

  const filtered = CONSOLE_LINES.filter((l) =>
    l.msg.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="bottom-dock">
      <div className="dock-tabs">
        <button className={`dock-tab ${tab === 'console' ? 'active' : ''}`} onClick={() => setTab('console')}>
          Console
        </button>
        <button className={`dock-tab ${tab === 'xml' ? 'active' : ''}`} onClick={() => setTab('xml')}>
          SDF
        </button>
        <button className={`dock-tab ${tab === 'props' ? 'active' : ''}`} onClick={() => setTab('props')}>
          Properties
        </button>
        <div className="dock-spacer" />
        {tab === 'console' && (
          <input
            className="dock-filter"
            placeholder="Filter..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        )}
      </div>

      <div className="dock-body">
        {tab === 'console' && (
          <div className="console-view">
            {filtered.map((line, i) => (
              <div key={i} className="console-line">
                <span className="console-time">{line.time}</span>
                <span className={`console-lvl ${line.lvl}`}>{line.lvl.toUpperCase()}</span>
                <span className="console-msg">{line.msg}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'xml' && (
          <div className="xml-view">
            <pre className="xml-code">{XML_CONTENT}</pre>
          </div>
        )}

        {tab === 'props' && (
          <div className="props-view">
            <table className="props-table">
              <tbody>
                {WORLD_PROPS.map(([k, v]) => (
                  <tr key={k}>
                    <td className="props-k">{k}</td>
                    <td className="props-v">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
