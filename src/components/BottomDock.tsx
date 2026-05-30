import { useState } from 'react'
import './BottomDock.css'

const CONSOLE_LINES = [
  { level: 'info', time: '12:40:01.234', text: '[World] World loaded: empty.world' },
  { level: 'info', time: '12:40:01.310', text: '[Physics] ODE physics engine initialized' },
  { level: 'info', time: '12:40:01.418', text: '[Rendering] OGRE 1.9 renderer ready' },
  { level: 'info', time: '12:40:02.005', text: '[Model] Loaded model: ground_plane' },
  { level: 'info', time: '12:40:02.118', text: '[Light] Directional light "sun" added' },
  { level: 'info', time: '12:40:03.401', text: '[Model] Loaded model: robot_1 (TurtleBot3 Burger)' },
  { level: 'warn', time: '12:40:03.405', text: '[Collision] Mesh approximation used for link: base_link' },
  { level: 'info', time: '12:40:03.622', text: '[Sensor] RPLidar A2 sensor attached to robot_1/lidar' },
  { level: 'info', time: '12:40:03.701', text: '[Sensor] RealSense D435 sensor attached to robot_1/camera_front' },
  { level: 'info', time: '12:40:04.010', text: '[Plugin] gazebo_ros_diff_drive loaded for robot_1' },
  { level: 'warn', time: '12:40:04.015', text: '[Plugin] No ROS master detected. Simulation running standalone.' },
  { level: 'info', time: '12:40:04.300', text: '[Simulation] Ready. Use Play to start.' },
]

const XML_CONTENT = `<?xml version="1.0" ?>
<sdf version="1.10">
  <world name="default">

    <physics name="default_physics" default="true" type="ode">
      <real_time_update_rate>1000.0</real_time_update_rate>
      <max_step_size>0.001</max_step_size>
    </physics>

    <scene>
      <ambient>0.4 0.4 0.4 1</ambient>
      <background>0.7 0.7 0.7 1</background>
      <shadows>true</shadows>
    </scene>

    <light name="sun" type="directional">
      <cast_shadows>true</cast_shadows>
      <pose>0 0 10 0 -0 0</pose>
      <diffuse>0.8 0.8 0.8 1</diffuse>
      <specular>0.2 0.2 0.2 1</specular>
      <direction>-0.5 0.1 -0.9</direction>
    </light>

    <model name="ground_plane">
      <static>true</static>
      <link name="link">
        <collision name="collision">
          <geometry><plane><normal>0 0 1</normal></plane></geometry>
        </collision>
        <visual name="visual">
          <geometry><plane><normal>0 0 1</normal><size>100 100</size></plane></geometry>
          <material><script><uri>file://media/materials/scripts/gazebo.material</uri>
            <name>Gazebo/Grey</name></script></material>
        </visual>
      </link>
    </model>

    <include>
      <uri>model://turtlebot3_burger</uri>
      <name>robot_1</name>
      <pose>0 0 0.1 0 0 0</pose>
    </include>

  </world>
</sdf>`

const PROPERTIES_DATA = [
  { key: 'Physics Engine', value: 'ODE 0.16.3' },
  { key: 'Max Step Size', value: '0.001 s' },
  { key: 'Real-time Factor', value: '1.0' },
  { key: 'Gravity', value: '0 0 -9.81 m/s²' },
  { key: 'Magnetic Field', value: '5.566e-6 2.290e-5 -4.236e-5' },
  { key: 'Wind Speed', value: '0.0 0.0 0.0 m/s' },
  { key: 'Atmosphere', value: 'Standard' },
  { key: 'Temperature', value: '295.15 K' },
  { key: 'Pressure', value: '101.325 kPa' },
  { key: 'Objects', value: '4' },
  { key: 'Models', value: '2' },
  { key: 'Lights', value: '1' },
  { key: 'Sensors', value: '2' },
  { key: 'Joints', value: '3' },
  { key: 'World Name', value: 'default' },
  { key: 'SDF Version', value: '1.10' },
]

export default function BottomDock() {
  const [activeTab, setActiveTab] = useState<'console' | 'xml' | 'properties'>('console')
  const [consoleFilter, setConsoleFilter] = useState('')

  const filteredLines = CONSOLE_LINES.filter(
    (l) => l.text.toLowerCase().includes(consoleFilter.toLowerCase())
  )

  return (
    <div className="bottom-dock">
      <div className="dock-tabs">
        {(['console', 'xml', 'properties'] as const).map((tab) => (
          <button
            key={tab}
            className={`dock-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'console' && (
              <span className="tab-badge warn">1</span>
            )}
          </button>
        ))}
        <div className="dock-tabs-spacer" />
        {activeTab === 'console' && (
          <div className="dock-toolbar">
            <input
              className="dock-filter"
              placeholder="Filter output..."
              value={consoleFilter}
              onChange={(e) => setConsoleFilter(e.target.value)}
            />
            <button className="dock-action" title="Clear console">Clear</button>
          </div>
        )}
      </div>

      <div className="dock-content">
        {activeTab === 'console' && (
          <div className="console-log">
            {filteredLines.map((line, i) => (
              <div key={i} className={`console-line ${line.level}`}>
                <span className="console-time">{line.time}</span>
                <span className={`console-level level-${line.level}`}>
                  {line.level.toUpperCase()}
                </span>
                <span className="console-text">{line.text}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'xml' && (
          <div className="xml-view">
            <pre className="xml-content">{XML_CONTENT}</pre>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="properties-table">
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {PROPERTIES_DATA.map((row) => (
                  <tr key={row.key}>
                    <td className="prop-key">{row.key}</td>
                    <td className="prop-val">{row.value}</td>
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
