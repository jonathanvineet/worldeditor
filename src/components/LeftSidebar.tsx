import { useState } from 'react'
import './LeftSidebar.css'

interface SceneNode {
  id: string
  name: string
  type: string
  glyph: string
  children?: SceneNode[]
  expanded?: boolean
}

// Minimal scene tree - just World, Ground Plane, and Sun
const SCENE_TREE: SceneNode[] = [
  {
    id: 'world',
    name: 'World',
    type: 'world',
    glyph: '◎',
    expanded: true,
    children: [
      {
        id: 'ground_plane',
        name: 'Ground Plane',
        type: 'model',
        glyph: '▬',
        children: [
          { id: 'ground_visual', name: 'Visual', type: 'visual', glyph: '◆' },
          { id: 'ground_collision', name: 'Collision', type: 'collision', glyph: '⬡' },
        ],
      },
      {
        id: 'sun',
        name: 'Sun',
        type: 'light',
        glyph: '☀',
        children: [],
      },
    ],
  },
]

const ASSETS = [
  { category: 'Lights', items: ['Point Light', 'Spot Light', 'Directional', 'Area Light'] },
  { category: 'Sensors', items: ['Camera', 'Ray (Lidar)', 'IMU', 'Contact', 'GPS'] },
  { category: 'Shapes', items: ['Box', 'Sphere', 'Cylinder', 'Capsule'] },
  { category: 'Model', items: ['From File...', 'From URDF...'] },
]

function TreeNode({ node, depth }: { node: SceneNode; depth: number }) {
  const [expanded, setExpanded] = useState(node.expanded ?? false)
  const [selected, setSelected] = useState(false)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="tree-node">
      <div
        className={`tree-item ${selected ? 'selected' : ''}`}
        style={{ paddingLeft: `${6 + depth * 14}px` }}
        onClick={() => setSelected(!selected)}
      >
        {hasChildren ? (
          <span
            className={`tree-expando ${expanded || 'collapsed'}`}
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
          />
        ) : (
          <span className="tree-expando-placeholder" />
        )}
        <span className="tree-glyph">{node.glyph}</span>
        <span className="tree-name">{node.name}</span>
        {node.type !== 'world' && <span className="tree-badge">{node.type}</span>}
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
          Scene
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
            <button className="sidebar-tool" title="Add entity to world">
              <span className="tool-icon">+</span>
            </button>
            <button className="sidebar-tool" title="Delete selected">
              <span className="tool-icon">×</span>
            </button>
            <div className="sidebar-spacer" />
            <input className="sidebar-filter" placeholder="Filter..." type="text" />
          </div>
          <div className="tree-view">
            {SCENE_TREE.map((node) => (
              <TreeNode key={node.id} node={node} depth={0} />
            ))}
            {/* Empty state helper */}
            <div className="tree-helper">
              <span className="helper-line">Drag assets here</span>
              <span className="helper-line subtle">or use Insert menu</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="sidebar-content">
          <div className="sidebar-toolbar">
            <input
              className="sidebar-filter full"
              placeholder="Search assets..."
              type="text"
              value={assetSearch}
              onChange={(e) => setAssetSearch(e.target.value)}
            />
          </div>
          <div className="assets-list">
            {ASSETS.map((category) => {
              const filtered = category.items.filter((item) =>
                item.toLowerCase().includes(assetSearch.toLowerCase())
              )
              if (filtered.length === 0) return null
              return (
                <div key={category.category} className="asset-category">
                  <div className="asset-cat-header">{category.category}</div>
                  {filtered.map((item) => (
                    <div key={item} className="asset-row">
                      <span className="asset-drag">⋮⋮</span>
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
