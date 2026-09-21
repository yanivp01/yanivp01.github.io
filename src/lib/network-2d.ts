// @ts-nocheck
/* Interactive Node-Star Network — port of _legacy/js/network.js (itself a vanilla JS port of InteractiveNodeStarNetwork.jsx).
   The legacy IIFE is wrapped in mountNetwork2D(); data lives in ./ecosystem-model. */
import { CONNECTIONS, INTERVENTIONS, LAYERS, layerColor, layerName } from './ecosystem-model';

export function mountNetwork2D(root: HTMLElement, opts: { interactive?: boolean } = {}) {
  const interactive = opts.interactive !== false;

  const STYLES = {
    components: {
      input:  { bg: "#EFF6FF", border: "#60A5FA", text: "#1E3A8A" },
      effort: { bg: "#FFFBEB", border: "#FBBF24", text: "#92400E" },
      output: { bg: "#ECFDF5", border: "#34D399", text: "#065F46" }
    }
  };

  const SVG_NS = "http://www.w3.org/2000/svg";

  // ----- State -----
  const state = {
    selectedNodeId: null,
    viewMode: 'full' // 'full' | 'star'
  };

  // ----- Layout -----
  function computeNodePositions() {
    const pos = {};
    const layerGroups = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    INTERVENTIONS.forEach(n => layerGroups[n.layer].push(n.id));
    const cx = 500, cy = 400;
    const layerAngles = { 1: -0.8, 2: -0.2, 3: 0.4, 4: 1.2, 5: 2.2, 6: 2.8 };
    const layerRadius = { 1: 300, 2: 240, 3: 280, 4: 250, 5: 180, 6: 250 };
    Object.keys(layerGroups).forEach(layer => {
      const nodes = layerGroups[layer];
      const startAngle = layerAngles[layer];
      const spread = nodes.length > 1 ? 0.8 : 0;
      nodes.forEach((id, i) => {
        const angle = startAngle + (nodes.length > 1 ? (i / (nodes.length - 1)) * spread : 0);
        pos[id] = {
          x: cx + Math.cos(angle) * layerRadius[layer],
          y: cy + Math.sin(angle) * layerRadius[layer]
        };
      });
    });
    return pos;
  }

  const NODE_POSITIONS = computeNodePositions();

  // ----- DOM helpers -----
  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'style') e.setAttribute('style', attrs[k]);
      else if (k.startsWith('on') && typeof attrs[k] === 'function') { if (interactive) e.addEventListener(k.slice(2), attrs[k]); }
      else e.setAttribute(k, attrs[k]);
    }
    if (children) (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  }

  function svgEl(tag, attrs, children) {
    const e = document.createElementNS(SVG_NS, tag);
    if (attrs) for (const k in attrs) {
      if (k.startsWith('on') && typeof attrs[k] === 'function') { if (interactive) e.addEventListener(k.slice(2), attrs[k]); }
      else e.setAttribute(k, attrs[k]);
    }
    if (children) (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  }

  function truncate(s, n) {
    return s.length > n ? s.substring(0, n - 2) + '…' : s;
  }

  // ----- Containers (the legacy page shipped these in network.html; build them inside root) -----
  const canvas = el('div', { class: 'network-canvas' });
  let sidebar = null, fullBtn = null, starBtn = null;
  root.replaceChildren();
  if (interactive) {
    fullBtn = el('button', { type: 'button', class: 'active' }, 'Full network graph');
    starBtn = el('button', { type: 'button', disabled: '' }, 'Node-star view');
    root.appendChild(el('div', { class: 'network-toolbar' }, [
      el('div', { class: 'view-toggle', role: 'tablist' }, [fullBtn, starBtn]),
      el('div', { class: 'network-hint' }, 'Select a node to enable the node-star view.')
    ]));
    sidebar = el('aside', { class: 'network-sidebar' });
    root.appendChild(el('div', { class: 'network-layout' }, [canvas, sidebar]));
  } else {
    root.appendChild(el('div', { class: 'network-layout network-layout--static' }, canvas));
  }

  // ----- Renders -----
  function renderArrowDefs(svg) {
    const defs = svgEl('defs');
    defs.appendChild(svgEl('marker', {
      id: 'arrowHead', viewBox: '0 0 10 10', refX: '9', refY: '5',
      markerWidth: '6', markerHeight: '6', orient: 'auto'
    }, svgEl('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: '#9CA3AF', opacity: '0.6' })));
    defs.appendChild(svgEl('marker', {
      id: 'arrowHeadActive', viewBox: '0 0 10 10', refX: '9', refY: '5',
      markerWidth: '6', markerHeight: '6', orient: 'auto'
    }, svgEl('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: '#374151' })));
    defs.appendChild(svgEl('marker', {
      id: 'mIn', viewBox: '0 0 10 10', refX: '8', refY: '5',
      markerWidth: '6', markerHeight: '6', orient: 'auto'
    }, svgEl('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: STYLES.components.input.border })));
    defs.appendChild(svgEl('marker', {
      id: 'mEffort', viewBox: '0 0 10 10', refX: '8', refY: '5',
      markerWidth: '6', markerHeight: '6', orient: 'auto'
    }, svgEl('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: STYLES.components.effort.border })));
    defs.appendChild(svgEl('marker', {
      id: 'mOut', viewBox: '0 0 10 10', refX: '8', refY: '5',
      markerWidth: '6', markerHeight: '6', orient: 'auto'
    }, svgEl('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: STYLES.components.output.border })));
    svg.appendChild(defs);
  }

  function renderFullGraph() {
    const svg = svgEl('svg', { viewBox: '0 0 1000 800', preserveAspectRatio: 'xMidYMid meet' });
    renderArrowDefs(svg);

    const selected = state.selectedNodeId;

    // Edges
    CONNECTIONS.forEach((c, i) => {
      const fromPos = NODE_POSITIONS[c.from];
      const toPos = NODE_POSITIONS[c.to];
      if (!fromPos || !toPos || c.from === c.to) return;
      const isActive = c.from === selected || c.to === selected;
      const opacity = selected ? (isActive ? 1 : 0.05) : 0.2;
      const dx = toPos.x - fromPos.x;
      const dy = toPos.y - fromPos.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const nx = dx/dist, ny = dy/dist;
      const x1 = fromPos.x + nx * 24, y1 = fromPos.y + ny * 24;
      const x2 = toPos.x - nx * 24,   y2 = toPos.y - ny * 24;
      svg.appendChild(svgEl('path', {
        d: `M ${x1} ${y1} Q ${(x1+x2)/2 - dy*0.1} ${(y1+y2)/2 + dx*0.1} ${x2} ${y2}`,
        stroke: isActive ? '#4B5563' : '#9CA3AF',
        'stroke-width': isActive ? 1.5 : 1,
        fill: 'none',
        opacity: opacity,
        'marker-end': isActive ? 'url(#arrowHeadActive)' : 'url(#arrowHead)'
      }));
    });

    // Nodes
    INTERVENTIONS.forEach(n => {
      const p = NODE_POSITIONS[n.id];
      const isSelected = selected === n.id;
      const isConnected = selected && CONNECTIONS.some(c =>
        (c.from === selected && c.to === n.id) || (c.to === selected && c.from === n.id));
      const opacity = selected ? (isSelected || isConnected ? 1 : 0.15) : 1;

      const g = svgEl('g', {
        class: interactive ? 'node-group' : 'node-group node-group--static',
        opacity: opacity,
        onclick: function (ev) {
          ev.stopPropagation();
          handleSelect(n.id);
        }
      });
      g.appendChild(svgEl('circle', {
        class: 'node-bg',
        cx: p.x, cy: p.y,
        r: isSelected ? 26 : 22,
        fill: layerColor(n.layer),
        stroke: isSelected ? '#111827' : 'none',
        'stroke-width': isSelected ? 3 : 0
      }));
      g.appendChild(svgEl('text', {
        x: p.x, y: p.y + 2,
        'text-anchor': 'middle', 'dominant-baseline': 'middle',
        fill: '#FFFFFF', 'font-size': '11', 'font-weight': '700',
        'pointer-events': 'none'
      }, n.id));
      g.appendChild(svgEl('text', {
        x: p.x, y: p.y + 38,
        'text-anchor': 'middle',
        fill: '#374151', 'font-size': '10',
        'font-weight': isSelected ? '600' : '400',
        'pointer-events': 'none'
      }, n.short));

      svg.appendChild(g);
    });

    return svg;
  }

  function renderStarDiagram() {
    const node = INTERVENTIONS.find(n => n.id === state.selectedNodeId);
    const svg = svgEl('svg', { viewBox: '0 0 1000 800', preserveAspectRatio: 'xMidYMid meet' });
    renderArrowDefs(svg);
    if (!node) return svg;

    const cx = 500, cy = 400;

    // Inputs (left)
    node.inputs.forEach((inp, i) => {
      const y = cy - ((node.inputs.length - 1) * 35) / 2 + i * 35;
      const x = cx - 300;
      svg.appendChild(svgEl('rect', {
        x: x - 150, y: y - 12, width: 140, height: 24, rx: 4,
        fill: STYLES.components.input.bg, stroke: STYLES.components.input.border
      }));
      svg.appendChild(svgEl('text', {
        x: x - 142, y: y + 1,
        fill: STYLES.components.input.text, 'font-size': '11',
        'alignment-baseline': 'middle'
      }, truncate(inp, 22)));
      svg.appendChild(svgEl('path', {
        d: `M ${x} ${y} L ${cx - 45} ${cy}`,
        stroke: STYLES.components.input.border, 'stroke-width': '2',
        'marker-end': 'url(#mIn)', fill: 'none'
      }));
    });

    // Efforts (top)
    node.efforts.forEach((eff, i) => {
      const x = cx - ((node.efforts.length - 1) * 160) / 2 + i * 160;
      const y = cy - 250;
      svg.appendChild(svgEl('rect', {
        x: x - 70, y: y - 14, width: 140, height: 28, rx: 14,
        fill: STYLES.components.effort.bg, stroke: STYLES.components.effort.border
      }));
      svg.appendChild(svgEl('text', {
        x: x, y: y + 1, 'text-anchor': 'middle',
        fill: STYLES.components.effort.text, 'font-size': '11',
        'alignment-baseline': 'middle'
      }, truncate(eff, 20)));
      svg.appendChild(svgEl('path', {
        d: `M ${x} ${y + 16} L ${cx} ${cy - 45}`,
        stroke: STYLES.components.effort.border, 'stroke-width': '2',
        'marker-end': 'url(#mEffort)', 'stroke-dasharray': '4 2', fill: 'none'
      }));
    });

    // Outputs (right)
    node.outputs.forEach((out, i) => {
      const y = cy - ((node.outputs.length - 1) * 45) / 2 + i * 45;
      const x = cx + 300;
      svg.appendChild(svgEl('rect', {
        x: x, y: y - 15, width: 150, height: 30, rx: 4,
        fill: STYLES.components.output.bg, stroke: STYLES.components.output.border
      }));
      svg.appendChild(svgEl('text', {
        x: x + 8, y: y + 1,
        fill: STYLES.components.output.text, 'font-size': '11',
        'alignment-baseline': 'middle'
      }, truncate(out, 22)));
      svg.appendChild(svgEl('path', {
        d: `M ${cx + 45} ${cy} L ${x - 5} ${y}`,
        stroke: STYLES.components.output.border, 'stroke-width': '2',
        fill: 'none', 'marker-end': 'url(#mOut)'
      }));
    });

    // Central node (rendered last so it sits on top)
    svg.appendChild(svgEl('circle', {
      cx: cx, cy: cy, r: 40,
      fill: layerColor(node.layer)
    }));
    svg.appendChild(svgEl('text', {
      x: cx, y: cy,
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: '#FFFFFF', 'font-size': '18', 'font-weight': 'bold'
    }, node.id));
    svg.appendChild(svgEl('text', {
      x: cx, y: cy + 60,
      'text-anchor': 'middle',
      fill: '#374151', 'font-size': '13', 'font-weight': '600'
    }, node.label));

    // Section headers
    svg.appendChild(svgEl('text', {
      x: cx - 220, y: 80,
      'text-anchor': 'middle',
      fill: STYLES.components.input.text, 'font-size': '13', 'font-weight': '700'
    }, 'INPUTS'));
    svg.appendChild(svgEl('text', {
      x: cx, y: 50,
      'text-anchor': 'middle',
      fill: STYLES.components.effort.text, 'font-size': '13', 'font-weight': '700'
    }, 'EFFORTS'));
    svg.appendChild(svgEl('text', {
      x: cx + 350, y: 80,
      'text-anchor': 'middle',
      fill: STYLES.components.output.text, 'font-size': '13', 'font-weight': '700'
    }, 'OUTPUTS'));

    return svg;
  }

  // ----- Sidebar -----
  function renderSidebar() {
    if (!sidebar) return;
    sidebar.innerHTML = '';

    if (state.selectedNodeId) {
      const node = INTERVENTIONS.find(n => n.id === state.selectedNodeId);
      const inEdges  = CONNECTIONS.filter(c => c.to === node.id);
      const outEdges = CONNECTIONS.filter(c => c.from === node.id);
      const color = layerColor(node.layer);

      const header = el('div', { class: 'node-header' }, [
        el('div', { class: 'node-badge', style: `background:${color}` }, node.id),
        el('div', null, [
          el('div', { class: 'node-title' }, node.label),
          el('div', { class: 'node-sublabel' }, `Layer ${node.layer}: ${layerName(node.layer)}`)
        ])
      ]);
      sidebar.appendChild(header);

      const sectionList = (title, dotColor, items) => {
        const h = el('h4', null, [
          el('span', { class: 'legend-dot', style: `background:${dotColor}` }), title
        ]);
        const ul = el('ul', null, items.map(t => el('li', null, t)));
        return [h, ul];
      };
      sectionList('Inputs',  STYLES.components.input.border,  node.inputs ).forEach(n => sidebar.appendChild(n));
      sectionList('Efforts', STYLES.components.effort.border, node.efforts).forEach(n => sidebar.appendChild(n));
      sectionList('Outputs', STYLES.components.output.border, node.outputs).forEach(n => sidebar.appendChild(n));

      sidebar.appendChild(el('hr', { class: 'sidebar-divider' }));

      sidebar.appendChild(el('h4', null, 'Receives from'));
      const inWrap = el('div', { class: 'edge-list' });
      if (inEdges.length === 0) inWrap.appendChild(el('span', { class: 'empty-edges' }, 'None'));
      else inEdges.forEach(e => {
        const fromNode = INTERVENTIONS.find(n => n.id === e.from);
        const c = layerColor((fromNode && fromNode.layer) || 1);
        inWrap.appendChild(el('button', {
          type: 'button',
          onclick: () => handleSelect(e.from)
        }, [
          el('span', { class: 'edge-id', style: `color:${c}` }, e.from),
          el('span', { class: 'edge-label' }, e.label)
        ]));
      });
      sidebar.appendChild(inWrap);

      sidebar.appendChild(el('h4', null, 'Feeds into'));
      const outWrap = el('div', { class: 'edge-list' });
      if (outEdges.length === 0) outWrap.appendChild(el('span', { class: 'empty-edges' }, 'None'));
      else outEdges.forEach(e => {
        const toNode = INTERVENTIONS.find(n => n.id === e.to);
        const c = layerColor((toNode && toNode.layer) || 1);
        outWrap.appendChild(el('button', {
          type: 'button',
          onclick: () => handleSelect(e.to)
        }, [
          el('span', { class: 'edge-id', style: `color:${c}` }, e.to),
          el('span', { class: 'edge-label' }, e.label)
        ]));
      });
      sidebar.appendChild(outWrap);

      if (state.viewMode === 'full') {
        sidebar.appendChild(el('button', {
          type: 'button',
          class: 'view-star-btn',
          onclick: () => { setViewMode('star'); }
        }, 'View Star Diagram'));
      }
    } else {
      sidebar.appendChild(el('h3', null, 'Ecosystem Layers'));
      LAYERS.forEach(layer => {
        sidebar.appendChild(el('div', { class: 'layer-row' }, [
          el('span', { class: 'layer-dot', style: `background:${layer.color}` }),
          `Layer ${layer.n}: ${layer.name}`
        ]));
      });
      sidebar.appendChild(el('hr', { class: 'sidebar-divider' }));
      sidebar.appendChild(el('p', { style: 'font-size:.8rem;color:var(--color-muted);line-height:1.55;' },
        'The Global Cambridge framework classifies the ecosystem into six progressive layers, ' +
        'forming a coherent supply network for venture generation. Click any node to inspect its ' +
        'inputs, efforts, outputs, and connections.'
      ));
    }
  }

  // ----- Canvas / toolbar -----
  function renderCanvas() {
    canvas.innerHTML = '';

    if (state.viewMode === 'full') {
      canvas.appendChild(renderFullGraph());
      if (interactive) canvas.appendChild(el('div', { class: 'canvas-helper' },
        state.selectedNodeId
          ? 'Click the node again or "View Star Diagram" to drill in. Click empty space to deselect.'
          : 'Click any node to highlight its connections. Click again to open its node-star view.'
      ));
    } else {
      canvas.appendChild(renderStarDiagram());
      const back = el('button', {
        type: 'button',
        class: 'back-button',
        onclick: () => setViewMode('full')
      }, '← Back to full graph');
      canvas.appendChild(back);
    }
  }

  function renderToolbar() {
    if (!fullBtn || !starBtn) return;
    fullBtn.classList.toggle('active', state.viewMode === 'full');
    starBtn.classList.toggle('active', state.viewMode === 'star');
    starBtn.disabled = !state.selectedNodeId;
  }

  function rerender() {
    renderCanvas();
    renderSidebar();
    renderToolbar();
  }

  // ----- Interactions -----
  function handleSelect(id) {
    if (state.selectedNodeId === id && state.viewMode === 'full') {
      state.viewMode = 'star';
    } else {
      state.selectedNodeId = id;
    }
    rerender();
  }

  function setViewMode(mode) {
    if (mode === 'star' && !state.selectedNodeId) return;
    state.viewMode = mode;
    rerender();
  }

  function deselect() {
    if (state.viewMode === 'full' && state.selectedNodeId) {
      state.selectedNodeId = null;
      rerender();
    }
  }

  // ----- Init (was DOMContentLoaded in the legacy IIFE) -----
  if (interactive) {
    fullBtn.addEventListener('click', () => setViewMode('full'));
    starBtn.addEventListener('click', () => setViewMode('star'));
    canvas.addEventListener('click', (ev) => {
      // Click on canvas background (not a node) deselects in full mode
      if (ev.target.tagName === 'svg' || ev.target.closest('.canvas-helper')) deselect();
    });
  }
  rerender();
}
