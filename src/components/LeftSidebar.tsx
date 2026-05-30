import { useState } from 'react'
import './LeftSidebar.css'

interface SceneNode {
  id: string
  name: string
  type: string
  icon: string
  children?: SceneNode[]
  expanded?: boolean
}

const SCENE_TREE: SceneNode[] = [
  {
    id: 'world',
    name: 'world',
    type: 'world',
    icon: '🌐',
    expanded: true,
    children: [
      {
        id: 'ground_plane',
        name: 'ground_plane',
        type: 'model',
        icon: '▦',
        expanded: false,
        children: [
          { id: 'ground_link', name: 'link', type: 'link', icon: '◈' },
        ],
      },
      {
        id: 'sun',
        name: 'sun',
        type: 'light',
        icon: '☀',
        children: [],
      },
      {
        id: 'robot_1',
        name: 'robot_1',
        type: 'model',
        icon: '◈',
        expanded: false,
        children: [
          { id: 'base_link', name: 'base_link', type: 'link', icon: '⬡' },
          { id: 'left_wheel', name: 'left_wheel', type: 'link', icon: '⬡' },
          { id: 'right_wheel', name: 'right_wheel', type: 'link', icon: '⬡' },
          { id: 'lidar', name: 'lidar_sensor', type: 'sensor', icon: '◎' },
          { id: 'camera', name: 'camera_front', type: 'sensor', icon: '◎' },
        ],
      },
      {
        id: 'box_1',
        name: 'box_0',
        type: 'model',
        icon: '▦',
        children: [
          { id: 'box_link', name: 'link', type: 'link', icon: '⬡' },
        ],
      },
    ],
  },
]

const ASSETS = [
  { category: 'Robots', items: ['TurtleBot3', 'Pioneer 3-DX', 'UR5 Arm', 'Fetch Mobile', 'Atlas Humanoid'] },
  { category: 'Sensors', items: ['RPLidar A2', 'Velodyne VLP-16', 'RealSense D435', 'IMU 6-DOF', 'GPS Module'] },
  { category: 'Environments', items: ['Empty World', 'Warehouse', 'Office', 'Outdoor Field', 'Maze Grid'] },
  { category: 'Props', items: ['Cardboard Box', 'Shelf Unit', 'Traffic Cone', 'Pallet', 'Barrel'] },
  { category: 'Lights', items: ['Point Light', 'Spot Light', 'Directional', 'Area Light'] },
]

function TreeNode({ node, depth }: { node: SceneNode; depth: number }) {
  const [expanded, setExpanded] = useState(node.expanded ?? false)
  const [selected, setSelected] = useState(false)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="tree-node">
      <div
        className={`tree-item ${selected ? 'selected' : ''}`}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        onClick={() => setSelected(!selected)}
      >
        {hasChildren ? (
          <span
            className={`tree-caret ${expanded ? 'expanded' : ''}`}
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
          >
            ▶
          </span>
        ) : (
          <span className="tree-caret-placeholder" />
        )}
        <span className="tree-icon">{node.icon}</span>
        <span className="tree-name">{node.name}</span>
        <span className="tree-type">{node.type}</span>
      </div>
      {expanded && hasChildren && (
        <div className="tree-children">
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<'scene' | 'assets'>('scene')
  const [assetSearch, setAssetSearch] = useState('')

  return (
    <div className="left-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activeTab === 'scene' ? 'active' : ''}`}
          onClick={() => setActiveTab('scene')}
        >
          Scene Tree
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'assets' ? 'active' : ''}`}
          onClick={() => setActiveTab('assets')}
        >
          Assets
        </button>
      </div>

      {activeTab === 'scene' && (
        <div className="sidebar-content">
          <div className="sidebar-toolbar">
            <button className="sidebar-action" title="Add Model">+</button>
            <button className="sidebar-action" title="Delete">✕</button>
            <button className="sidebar-action" title="Duplicate">⧉</button>
            <input className="sidebar-search" placeholder="Filter..." type="text" />
          </div>
          <div className="tree-view">
            {SCENE_TREE.map((node) => (
              <TreeNode key={node.id} node={node} depth={0} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="sidebar-content">
          <div className="sidebar-toolbar">
            <input
              className="sidebar-search full"
              placeholder="Search assets..."
              type="text"
              value={assetSearch}
              onChange={(e) => setAssetSearch(e.target.value)}
            />
          </div>
          <div className="assets-list">
            {ASSETS.map((cat) => {
              const filtered = cat.items.filter(item =>
                item.toLowerCase().includes(assetSearch.toLowerCase())
              )
              if (filtered.length === 0) return null
              return (
                <div key={cat.category} className="asset-category">
                  <div className="asset-category-header">{cat.category}</div>
                  {filtered.map((item) => (
                    <div key={item} className="asset-item">
                      <span className="asset-icon">◈</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
