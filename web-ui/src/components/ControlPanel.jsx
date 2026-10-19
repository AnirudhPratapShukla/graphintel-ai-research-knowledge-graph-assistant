export default function ControlPanel({
  edgeLength,setEdgeLength,nodeSize,setNodeSize,layoutName,setLayoutName,
  selectedTypes,toggleType,types
}) {
  const colors = {
    Technology:'#7c3aed',Company:'#0ea5e9',Concept:'#10b981',
    Person:'#f59e0b',Product:'#ec4899',Service:'#ef4444'
  }
  return (
    <aside className="control-panel panel">
      <div className="panel-title">Graph controls</div>

      <label className="control-label">Edge length <span>{edgeLength}</span></label>
      <input type="range" min="60" max="260" value={edgeLength}
        onChange={e=>setEdgeLength(Number(e.target.value))}/>

      <label className="control-label">Node size <span>{nodeSize}</span></label>
      <input type="range" min="18" max="55" value={nodeSize}
        onChange={e=>setNodeSize(Number(e.target.value))}/>

      <label className="control-label">Layout</label>
      <select value={layoutName} onChange={e=>setLayoutName(e.target.value)}>
        <option value="fcose">Force graph</option>
        <option value="circle">Circle</option>
        <option value="grid">Grid</option>
        <option value="concentric">Concentric</option>
      </select>

      <div className="control-label">Node types</div>
      <div className="filter-list">
        {types.map(type=>(
          <label key={type} className="check-row">
            <input type="checkbox" checked={selectedTypes.includes(type)}
              onChange={()=>toggleType(type)}/>
            <span className="legend-dot" style={{background:colors[type] || '#94a3b8'}}/>
            {type}
          </label>
        ))}
      </div>
    </aside>
  )
}
