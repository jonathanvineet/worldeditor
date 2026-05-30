import { useState } from 'react'
import { useApp } from '../App'
import './LeftSidebar.css'

interface SceneNode {
  id: string
  name: string
  type: string
  glyph: string
  expanded?: boolean
  children?: SceneNode[]
}

const SCENE_TREE: SceneNode[] = [
  {
    id: 'world',
    name: 'World',
    type: 'world',
    glyph: '◎',
    expanded: true,
    children: [
      { id: 'ground_plane', name: 'Ground Plane', type: 'ground', glyph: '▬' },
      { id: 'sun', name: 'Sun', type: 'light', glyph: '☀' },
    ],
  },
  {
    id: 'objects',
    name: 'Objects',
    type: 'folder',
    glyph: '◁',
    expanded: true,
    children: [
      { id: 'box_0', name: 'Box', type: 'box', glyph: '□' },
      { id: 'sphere_0', name: 'Sphere', type: 'sphere', glyph: '○' },
    ],
  },
]

const ASSETS = [
  { category: 'Primitive', items: ['Box', 'Sphere', 'Cylinder', 'Capsule', 'Plane'] },
  { category: 'Lights', items: ['Point Light', 'Spot Light', 'Directional'] },
  { category: 'Sensor', items: ['Camera', 'Ray (Lidar)', 'IMU', 'GPS'] },
]

function TreeNode({ node, depth, selectedId, onSelect }: {
  node: SceneNode
  depth: number
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(node.expanded ?? true)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="tree-node">
      <div
        className={`tree-item ${selectedId === node.id ? 'selected' : ''}`}
        style={{ paddingLeft: `${6 + depth * 14}px` }}
        onClick={() => { if (node.type !== 'world' && node.type !== 'folder') onSelect(node.id) }}
      >
        {hasChildren ? (
          <span
            className={`tree-expando ${expanded ? 'open' : ''}`}
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
          />
        ) : (
          <span className="tree-expando-placeholder" />
        )}
        <span className="tree-glyph">{node.glyph}</span>
        <span className="tree-name">{node.name}</span>
        {node.type && node.type !== 'world' && node.type !== 'folder' && (
          <span className="tree-badge">{node.type}</span>
        )}
      </div>
      {expanded && hasChildren && (
        <div className="tree-children">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={{ ...child, children: child.children || [] }}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<'scene' | 'assets'>('scene')
  const [assetSearch, setAssetSearch] = useState('')
  const { selectedId, setSelectedId } = useApp()

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
            <button className="sidebar-tool" title="Add entity">+</button>
            <button className="sidebar-tool" title="Delete selected">×</button>
            <div className="sidebar-spacer" />
            <input className="sidebar-filter" placeholder="Filter..." type="text" />
          </div>
          <div className="tree-view">
            {SCENE_TREE.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                depth={0}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            ))}
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
            {ASSETS.map((cat) => {
              const filtered = cat.items.filter((item) =>
                item.toLowerCase().includes(assetSearch.toLowerCase())
              )
              if (filtered.length === 0) return null
              return (
                <div key={cat.category} className="asset-category">
                  <div className="asset-cat-header">{cat.category}</div>
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
