export default function NodeInspector({node}) {
  if (!node) return (
    <aside className="inspector panel">
      <div className="panel-title">Node inspector</div>
      <div className="empty-state">Click a node to inspect it.</div>
    </aside>
  )
  return (
    <aside className="inspector panel">
      <div className="panel-title">Node inspector</div>
      <div className="node-name">{node.name}</div>
      <div className="node-type">{node.entity_type}</div>
      <p className="muted">{node.description || 'No description available.'}</p>
      <div className="metric-grid">
        <div><span>Connections</span><strong>{node.degree ?? 0}</strong></div>
        <div><span>Graph ID</span><strong>{String(node.id).slice(-8)}</strong></div>
      </div>
    </aside>
  )
}
