import {useEffect, useRef} from 'react'
import cytoscape from 'cytoscape'
import fcose from 'cytoscape-fcose'

cytoscape.use(fcose)

const palette = {
  Technology:'#8b5cf6',
  Company:'#22c8f4',
  Concept:'#34d399',
  Person:'#fbbf24',
  Product:'#f472b6',
  Service:'#fb7185'
}

export default function GraphViewer({
  graph, edgeLength, nodeSize, selectedTypes, layoutName, onSelectNode,
  theme = 'light'
}) {
  const containerRef = useRef(null)
  const cyRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    if (cyRef.current) cyRef.current.destroy()

    const isDark = theme === 'dark'
    const textColor = isDark ? '#e5edff' : '#273650'
    const outlineColor = isDark ? '#0b1224' : '#ffffff'
    const edgeColor = isDark ? '#6078b4' : '#91a2c0'
    const edgeLabelBg = isDark ? '#111a30' : '#ffffff'

    const elements = [
      ...(graph?.nodes || []).map(node => ({
        data: {
          ...node,
          id: String(node.id ?? node.name),
          color: palette[node.entity_type] || '#94a3b8'
        }
      })),
      ...(graph?.relationships || []).map((rel, index) => ({
        data: {
          id: `rel-${index}-${rel.source}-${rel.target}`,
          source: String(rel.source),
          target: String(rel.target),
          relation: rel.relation || 'RELATED_TO',
          weight: rel.weight || 1
        }
      }))
    ]

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      minZoom: .2,
      maxZoom: 4,
      wheelSensitivity: .22,
      motionBlur: true,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'background-opacity': .96,
            label: 'data(name)',
            color: textColor,
            'font-size': 12,
            'font-weight': 700,
            'text-wrap': 'ellipsis',
            'text-max-width': 145,
            'text-outline-color': outlineColor,
            'text-outline-width': 3,
            width: `mapData(degree,0,10,${nodeSize*.7},${nodeSize*1.65})`,
            height: `mapData(degree,0,10,${nodeSize*.7},${nodeSize*1.65})`,
            'border-width': 2,
            'border-color': 'data(color)',
            'overlay-opacity': 0,
            'transition-property': 'border-width, opacity, background-opacity',
            'transition-duration': 220
          }
        },
        {
          selector: 'node:hover',
          style: {
            'border-width': 5,
            'border-color': '#ffffff',
            'overlay-color': 'data(color)',
            'overlay-opacity': .17,
            'z-index': 99
          }
        },
        {
          selector: 'edge',
          style: {
            width: 'mapData(weight,1,5,1.4,3.5)',
            'line-color': edgeColor,
            'target-arrow-color': edgeColor,
            'target-arrow-shape': 'triangle',
            'arrow-scale': 1.05,
            'curve-style': 'bezier',
            'line-style': 'dashed',
            'line-dash-pattern': [5, 5],
            'line-dash-offset': 0,
            opacity: isDark ? .8 : .76,
            label: 'data(relation)',
            color: isDark ? '#c1d0f2' : '#536783',
            'font-size': 9,
            'font-weight': 600,
            'text-rotation': 'autorotate',
            'text-background-color': edgeLabelBg,
            'text-background-opacity': .88,
            'text-background-padding': 2,
            'transition-property': 'line-color, opacity, width',
            'transition-duration': 250
          }
        },
        {
          selector: 'node.neighbor',
          style: {
            'border-width': 5,
            'border-color': '#22d3ee',
            'overlay-color': '#22d3ee',
            'overlay-opacity': .15,
            opacity: 1,
            'z-index': 90
          }
        },
        {
          selector: 'edge.active-edge',
          style: {
            'line-color': '#22d3ee',
            'target-arrow-color': '#22d3ee',
            width: 3.5,
            opacity: 1,
            'line-style': 'dashed',
            'line-dash-pattern': [7, 4],
            'z-index': 80
          }
        },
        {
          selector: '.faded',
          style: { opacity: .1 }
        },
        {
          selector: '.type-hidden',
          style: { display: 'none' }
        }
      ],
      layout: {
        name: layoutName === 'fcose' ? 'fcose' : layoutName,
        animate: true,
        animationDuration: 850,
        randomize: true,
        fit: true,
        padding: 60,
        idealEdgeLength: edgeLength,
        nodeRepulsion: 9000,
        edgeElasticity: .35,
        gravity: .2
      }
    })

    cyRef.current = cy

    // Hover reveals immediate neighbors and their connecting edges.
    cy.on('mouseover', 'node', event => {
      const node = event.target
      cy.elements().addClass('faded')
      node.removeClass('faded')
      node.neighborhood().removeClass('faded')
      node.neighborhood('edge').addClass('active-edge')
      node.neighborhood('node').addClass('neighbor')
    })

    cy.on('mouseout', 'node', () => {
      cy.elements().removeClass('faded active-edge neighbor')
    })

    cy.on('tap', 'node', event => {
      const node = event.target
      cy.elements().removeClass('faded active-edge neighbor')
      node.neighborhood().addClass('neighbor')
      node.neighborhood('edge').addClass('active-edge')
      onSelectNode(node.data())
    })

    // Animate dashed connection flow with lightweight staggered transitions.
    let flowTimer
    let pulseTimer

    const startFlow = () => {
      const edges = cy.edges()
      if (edges.length) {
        edges.forEach((edge, index) => {
          edge.style('line-dash-offset', index % 2 ? 5 : 0)
          edge.animate({
            style: { 'line-dash-offset': index % 2 ? -10 : -5 },
            duration: 1050 + (index % 4) * 180,
            easing: 'linear'
          })
        })
      }
    }

    // A soft border pulse adds life without repeatedly rebuilding the graph.
    const pulseNodes = () => {
      cy.nodes(':visible').forEach((node, index) => {
        if (node.hasClass('neighbor')) return
        node.animate({
          style: { 'border-width': 3.5 },
          duration: 550 + (index % 3) * 100,
          easing: 'ease-in-out'
        }).promise('complete').then(() => {
          if (!node.removed() && !node.hasClass('neighbor')) {
            node.animate({
              style: { 'border-width': 2 },
              duration: 650,
              easing: 'ease-in-out'
            })
          }
        })
      })
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      flowTimer = window.setInterval(startFlow, 1450)
      pulseTimer = window.setInterval(pulseNodes, 2350)
      window.setTimeout(pulseNodes, 900)
    }

    return () => {
      window.clearInterval(flowTimer)
      window.clearInterval(pulseTimer)
      cy.destroy()
      cyRef.current = null
    }
  }, [graph, edgeLength, nodeSize, layoutName, onSelectNode, theme])

  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    cy.batch(() => {
      cy.nodes().forEach(node => {
        const visible = selectedTypes.includes(node.data('entity_type'))
        if (visible) {
          node.show()
        } else {
          node.hide()
        }
      })

      cy.edges().forEach(edge => {
        const sourceVisible = selectedTypes.includes(
          edge.source().data('entity_type')
        )
        const targetVisible = selectedTypes.includes(
          edge.target().data('entity_type')
        )

        if (sourceVisible && targetVisible) {
          edge.show()
        } else {
          edge.hide()
        }
      })
    })

    const visibleNodes = cy.nodes(':visible')
    if (visibleNodes.length === 0) return

    cy.elements(':visible').layout({
      name: 'fcose',
      animate: true,
      animationDuration: 350,
      randomize: false,
      fit: true,
      padding: 60,
      idealEdgeLength: edgeLength,
      nodeRepulsion: 9000,
      gravity: .2
    }).run()
  }, [selectedTypes, edgeLength])

function zoomIn() {
    const cy = cyRef.current
    if (!cy) return
    cy.zoom({
      level: Math.min(cy.maxZoom(), cy.zoom() * 1.25),
      renderedPosition: {
        x: cy.width() / 2,
        y: cy.height() / 2
      }
    })
  }

  function zoomOut() {
    const cy = cyRef.current
    if (!cy) return
    cy.zoom({
      level: Math.max(cy.minZoom(), cy.zoom() / 1.25),
      renderedPosition: {
        x: cy.width() / 2,
        y: cy.height() / 2
      }
    })
  }

  function fitGraph() {
    const cy = cyRef.current
    if (!cy) return
    const visible = cy.elements(':visible')
    if (visible.length) cy.fit(visible, 38)
  }

  function reflowGraph() {
    const cy = cyRef.current
    if (!cy) return
    cy.layout({
      name: layoutName === 'fcose' ? 'fcose' : layoutName,
      animate: true,
      animationDuration: 850,
      randomize: true,
      fit: true,
      padding: 48,
      idealEdgeLength: edgeLength,
      nodeRepulsion: 9000,
      edgeElasticity: .35,
      gravity: .2
    }).run()
  }

  return (
    <div className="graph-stage graph-stage-with-tools">
      <div className="graph-floating-tools" role="toolbar" aria-label="Graph navigation">
        <span className="graph-live-indicator">
          <i aria-hidden="true" /> LIVE GRAPH
        </span>
        <div className="graph-tool-group">
          <button type="button" title="Zoom out" aria-label="Zoom out" onClick={zoomOut}>
            <span aria-hidden="true">&#8722;</span>
          </button>
          <button type="button" title="Zoom in" aria-label="Zoom in" onClick={zoomIn}>
            <span aria-hidden="true">+</span>
          </button>
          <button type="button" title="Fit graph to canvas" onClick={fitGraph}>Fit</button>
          <button type="button" title="Rearrange graph nodes" onClick={reflowGraph}>Reflow</button>
        </div>
      </div>
      <div ref={containerRef} className="graph-canvas" />
    </div>
  )
}

