/* Interactive Node-Star Network — vanilla JS port of InteractiveNodeStarNetwork.jsx */
(function () {
  'use strict';

  const INTERVENTIONS = [
    { id: "1a", label: "Venture Registry", layer: 1, short: "Registry",
      inputs: ["Companies House data", "Patent filings", "Funding announcements", "Hiring signals", "Publications", "KYC/credential infrastructure"],
      efforts: ["Data ingestion pipelines", "Entity resolution", "Continuous monitoring", "Identity verification"],
      outputs: ["Live ecosystem map", "Verified entity profiles", "Longitudinal venture data", "Training data for AI"] },
    { id: "1b", label: "Needs-Offers Matching", layer: 1, short: "Matching",
      inputs: ["Venture Registry data", "Investor mandate data", "Talent pool data", "Needs/offers signals"],
      efforts: ["Signal inference from activity", "Matching algorithms", "Recommendation ranking"],
      outputs: ["Matched pairs", "Gap analysis", "Demand signals"] },
    { id: "1c", label: "Network Diagnostics", layer: 1, short: "Diagnostics",
      inputs: ["Venture Registry data", "Matching interaction data", "Deal outcome data", "Membership data"],
      efforts: ["Centrality analysis", "Structural hole detection", "Community clustering", "Health scoring"],
      outputs: ["Ecosystem health dashboard", "Bottleneck identification", "Intervention targeting", "Benchmarking data"] },
    { id: "1d", label: "Sector Emergence", layer: 1, short: "Emergence",
      inputs: ["Patent co-filing data", "Hiring clusters", "Publication co-authorship", "Venture Registry data"],
      efforts: ["Pattern detection models", "Anomaly detection", "Trend forecasting"],
      outputs: ["Emerging sector alerts", "Diversification opportunities", "Investment signal data"] },
    { id: "2a", label: "Governance Routing", layer: 2, short: "GovRoute",
      inputs: ["Venture profiles", "Regulatory text corpora", "Growth stage data", "Jurisdiction data"],
      efforts: ["NLP regulatory parsing", "ROI optimisation", "Roadmap generation", "Stage-matching"],
      outputs: ["Prioritised roadmaps", "Cost-of-non-compliance estimates", "Pre-certification status", "Governance training data"] },
    { id: "2b", label: "Contract & Procurement", layer: 2, short: "Contracts",
      inputs: ["Deal type data", "Governance routing output", "Template libraries", "Payment infrastructure"],
      efforts: ["AI contract drafting", "Vendor assessment automation", "Pre-certification"],
      outputs: ["Standardised instruments", "Pre-certified ventures", "Compressed procurement", "Contract outcome data"] },
    { id: "2c", label: "Financial Ops Auto", layer: 2, short: "FinOps",
      inputs: ["Cap table data", "SEIS/EIS parameters", "Grant reporting reqs", "Invoice data"],
      efforts: ["Automated invoicing", "Tax credit processing", "Grant compliance reporting"],
      outputs: ["Clean financial records", "Optimised tax claims", "Freed founder time", "Financial performance data"] },
    { id: "3a", label: "Deal Flow Matching", layer: 3, short: "DealFlow",
      inputs: ["Venture Registry data", "Investor mandates", "Matching engine output", "Pre-certification status"],
      efforts: ["Continuous mandate matching", "Proactive surfacing", "Cross-hub routing"],
      outputs: ["Matched investment targets", "Deal pipeline", "Capital deployment data"] },
    { id: "3b", label: "Dynamic Fund Structuring", layer: 3, short: "Struct",
      inputs: ["SEIS/EIS parameters", "Investor profiles", "Deal flow data", "Tax regime data"],
      efforts: ["Vehicle optimisation modelling", "Tax arbitrage calc", "Regulatory compliance"],
      outputs: ["Optimised fund structures", "SEIS-maximised vehicles", "Exportable structuring tools"] },
    { id: "3c", label: "IP Valuation Engine", layer: 3, short: "IPValue",
      inputs: ["Longitudinal data", "Patent networks", "Academic impact", "Team data", "Comparable transactions"],
      efforts: ["Multimodal model training", "Valuation model dev", "Backtesting"],
      outputs: ["Defensible IP valuations", "Rating methodology", "New asset class creation", "Exportable tool"] },
    { id: "3d", label: "Value Retention Instruments", layer: 3, short: "ValRetain",
      inputs: ["Deal outcome data", "Cooperative legal frameworks", "Exit event data", "Fund structuring output"],
      efforts: ["Instrument design", "Legal structuring", "Ecosystem equity management"],
      outputs: ["Stakeholdership via exits", "Retained value pool", "Recycled capital"] },
    { id: "3e", label: "Parametric Insurance", layer: 3, short: "Insurance",
      inputs: ["Sensing data", "Risk event triggers", "Venture profile data", "Commodity feed"],
      efforts: ["Risk model development", "Trigger calibration", "Claims automation", "Premium pricing"],
      outputs: ["Innovation risk coverage", "Automated payouts", "Risk-pooled portfolio", "Premium income"] },
    { id: "3f", label: "Cross-Hub Co-Investment", layer: 3, short: "CoInvest",
      inputs: ["Hub partnership agreements", "Cross-jurisdiction data", "Deal flow from hubs"],
      efforts: ["Vehicle structuring", "Automated compliance", "Co-investment routing"],
      outputs: ["Bilateral investment flows", "Connectivity infrastructure", "Cross-hub deal data"] },
    { id: "4a", label: "Hub-to-Hub Partnerships", layer: 4, short: "HubPartner",
      inputs: ["Sensing intelligence", "Complementary capability data", "Regulatory compatibility", "Co-invest infrastructure"],
      efforts: ["Partnership negotiation", "Term sheet design", "Governance alignment"],
      outputs: ["Bilateral agreements", "Shared sensing data", "Co-investment routing"] },
    { id: "4b", label: "Institutional Campaigns", layer: 4, short: "Campaign",
      inputs: ["Stakeholder maps", "Policy models", "Health data", "Evidential base"],
      efforts: ["Lobbying", "Governance navigation", "Narrative construction"],
      outputs: ["Policy changes", "Academic pathways", "Institutional funding"] },
    { id: "4c", label: "Anchor Tenant Recruitment", layer: 4, short: "Anchors",
      inputs: ["Corporate strategy signals", "Sensing data", "Pre-certified ventures", "Value models"],
      efforts: ["Targeted outreach", "Incentive package design", "Relationship cultivation"],
      outputs: ["Corporate presence", "Anchor investment", "Market access", "Demand signal"] },
    { id: "4d", label: "Geopolitical Intelligence", layer: 4, short: "GeoPol",
      inputs: ["Geopolitical data feeds", "Trade restriction mon", "Regulatory divergence", "Sensing layer data"],
      efforts: ["AI analysis", "Sovereignty risk assessment", "Opportunity ID"],
      outputs: ["Risk reports", "Dealmaking intelligence", "Exportable intelligence"] },
    { id: "5a", label: "Financial Sustainability", layer: 5, short: "FinSustain",
      inputs: ["Revenue flows", "Membership fees", "Transaction fees", "Insurance premiums", "Data sales"],
      efforts: ["Revenue collection", "Cost management", "Reinvestment allocation", "Export pricing"],
      outputs: ["Operational funding", "Reinvestment surplus", "Exportable business model"] },
    { id: "6a", label: "Training Data Creation", layer: 6, short: "TrainData",
      inputs: ["All operational data", "Venture trajectories", "Deal outcomes", "Governance decisions"],
      efforts: ["Data labelling", "Quality assurance", "Privacy-preserving aggregation"],
      outputs: ["Labelled training sets", "Longitudinal corpus", "Unique data asset"] },
    { id: "6b", label: "AI Research Demand Pull", layer: 6, short: "Research",
      inputs: ["Unsolved problems", "Training data", "Cambridge AI research capacity"],
      efforts: ["Problem specification", "Research mapping", "Model development"],
      outputs: ["New AI models", "Published research", "Layer performance improvements"] },
    { id: "6d", label: "Ecosystem Control Mechanism", layer: 6, short: "EcoControl",
      inputs: ["Integrated layer data", "Health diagnostics", "Custom AI models"],
      efforts: ["Control model training", "Real-time coordination", "Anomaly response"],
      outputs: ["Coordinated ecosystem", "Automated orchestration", "Cambridge-native AI"] },
    { id: "6e", label: "Innovation Prediction Model", layer: 6, short: "Predict",
      inputs: ["5+ years longitudinal data", "All layer outputs", "External benchmarks"],
      efforts: ["Foundational model training", "Validation", "Calibration"],
      outputs: ["Probability distributions", "Portfolio construction tool", "Globally exportable product"] }
  ];

  const CONNECTIONS = [
    { from: "1a", to: "1b", label: "entity data" }, { from: "1a", to: "1c", label: "entity data" },
    { from: "1a", to: "1d", label: "entity data" }, { from: "1a", to: "2a", label: "venture profiles" },
    { from: "1a", to: "3a", label: "venture data" }, { from: "1a", to: "3c", label: "longitudinal data" },
    { from: "1a", to: "3e", label: "venture profiles" }, { from: "1a", to: "4c", label: "venture data" },
    { from: "1a", to: "6a", label: "raw data" },
    { from: "1b", to: "1c", label: "interaction data" }, { from: "1b", to: "3a", label: "matched pairs" },
    { from: "1b", to: "4a", label: "capability analysis" },
    { from: "1c", to: "4a", label: "health data" }, { from: "1c", to: "4b", label: "evidential base" },
    { from: "1c", to: "6d", label: "health metrics" },
    { from: "1d", to: "3b", label: "sector signals" }, { from: "1d", to: "4b", label: "diversification data" },
    { from: "2a", to: "2b", label: "compliance status" }, { from: "2a", to: "3a", label: "pre-certification" },
    { from: "2a", to: "3f", label: "jurisdictional data" },
    { from: "2b", to: "3a", label: "instruments" }, { from: "2b", to: "4a", label: "inter-hub templates" },
    { from: "2c", to: "3b", label: "financial data" }, { from: "2c", to: "5a", label: "clean records" },
    { from: "3a", to: "3b", label: "deal pipeline" }, { from: "3a", to: "3d", label: "deal outcomes" },
    { from: "3a", to: "5a", label: "transaction fees" }, { from: "3a", to: "6a", label: "deal data" },
    { from: "3b", to: "3f", label: "vehicle structures" }, { from: "3b", to: "5a", label: "structuring fees" },
    { from: "3c", to: "3a", label: "valuations" }, { from: "3c", to: "3e", label: "risk assessments" },
    { from: "3c", to: "5a", label: "valuation revenue" },
    { from: "3d", to: "5a", label: "recycled capital" },
    { from: "3e", to: "1a", label: "risk event data" }, { from: "3e", to: "5a", label: "premium income" },
    { from: "3f", to: "4a", label: "bilateral flows" }, { from: "3f", to: "5a", label: "vehicle fees" },
    { from: "4a", to: "1a", label: "new hub data" }, { from: "4a", to: "3f", label: "partnership terms" },
    { from: "4b", to: "2a", label: "policy changes" }, { from: "4b", to: "3b", label: "expanded SEIS/EIS" },
    { from: "4c", to: "1a", label: "new entities" }, { from: "4c", to: "3a", label: "investment demand" },
    { from: "4c", to: "5a", label: "anchor fees" },
    { from: "5a", to: "1a", label: "operational funding" }, { from: "5a", to: "2a", label: "operational funding" },
    { from: "5a", to: "6a", label: "operational funding" },
    { from: "6a", to: "6b", label: "training sets" }, { from: "6a", to: "6d", label: "training data" },
    { from: "6a", to: "6e", label: "longitudinal corpus" },
    { from: "6b", to: "1b", label: "improved models" }, { from: "6b", to: "2a", label: "improved NLP" },
    { from: "6b", to: "3c", label: "improved valuation" },
    { from: "6d", to: "1a", label: "coordination signals" }, { from: "6d", to: "5a", label: "optimisation" },
    { from: "6e", to: "5a", label: "product revenue" }, { from: "6e", to: "4a", label: "dealmaking intelligence" }
  ];

  const STYLES = {
    layers: {
      1: { color: "#3B82F6", name: "Sensing" },
      2: { color: "#10B981", name: "Operations" },
      3: { color: "#F59E0B", name: "Capital" },
      4: { color: "#EF4444", name: "Dealmaking" },
      5: { color: "#8B5CF6", name: "Sustainability" },
      6: { color: "#EC4899", name: "AI Generation" }
    },
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
      else if (k.startsWith('on') && typeof attrs[k] === 'function') e.addEventListener(k.slice(2), attrs[k]);
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
      if (k.startsWith('on') && typeof attrs[k] === 'function') e.addEventListener(k.slice(2), attrs[k]);
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
        class: 'node-group',
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
        fill: STYLES.layers[n.layer].color,
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
      fill: STYLES.layers[node.layer].color
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
    const sidebar = document.getElementById('network-sidebar');
    sidebar.innerHTML = '';

    if (state.selectedNodeId) {
      const node = INTERVENTIONS.find(n => n.id === state.selectedNodeId);
      const inEdges  = CONNECTIONS.filter(c => c.to === node.id);
      const outEdges = CONNECTIONS.filter(c => c.from === node.id);
      const layerColor = STYLES.layers[node.layer].color;

      const header = el('div', { class: 'node-header' }, [
        el('div', { class: 'node-badge', style: `background:${layerColor}` }, node.id),
        el('div', null, [
          el('div', { class: 'node-title' }, node.label),
          el('div', { class: 'node-sublabel' }, `Layer ${node.layer}: ${STYLES.layers[node.layer].name}`)
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
        const color = STYLES.layers[(fromNode && fromNode.layer) || 1].color;
        inWrap.appendChild(el('button', {
          onclick: () => handleSelect(e.from)
        }, [
          el('span', { class: 'edge-id', style: `color:${color}` }, e.from),
          el('span', { class: 'edge-label' }, e.label)
        ]));
      });
      sidebar.appendChild(inWrap);

      sidebar.appendChild(el('h4', null, 'Feeds into'));
      const outWrap = el('div', { class: 'edge-list' });
      if (outEdges.length === 0) outWrap.appendChild(el('span', { class: 'empty-edges' }, 'None'));
      else outEdges.forEach(e => {
        const toNode = INTERVENTIONS.find(n => n.id === e.to);
        const color = STYLES.layers[(toNode && toNode.layer) || 1].color;
        outWrap.appendChild(el('button', {
          onclick: () => handleSelect(e.to)
        }, [
          el('span', { class: 'edge-id', style: `color:${color}` }, e.to),
          el('span', { class: 'edge-label' }, e.label)
        ]));
      });
      sidebar.appendChild(outWrap);

      if (state.viewMode === 'full') {
        sidebar.appendChild(el('button', {
          class: 'view-star-btn',
          onclick: () => { setViewMode('star'); }
        }, 'View Star Diagram'));
      }
    } else {
      sidebar.appendChild(el('h3', null, 'Ecosystem Layers'));
      Object.entries(STYLES.layers).forEach(([id, layer]) => {
        sidebar.appendChild(el('div', { class: 'layer-row' }, [
          el('span', { class: 'layer-dot', style: `background:${layer.color}` }),
          `Layer ${id}: ${layer.name}`
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
    const canvas = document.getElementById('network-canvas');
    canvas.innerHTML = '';

    if (state.viewMode === 'full') {
      canvas.appendChild(renderFullGraph());
      canvas.appendChild(el('div', { class: 'canvas-helper' },
        state.selectedNodeId
          ? 'Click the node again or "View Star Diagram" to drill in. Click empty space to deselect.'
          : 'Click any node to highlight its connections. Click again to open its node-star view.'
      ));
    } else {
      canvas.appendChild(renderStarDiagram());
      const back = el('button', {
        class: 'back-button',
        onclick: () => setViewMode('full')
      }, '← Back to full graph');
      canvas.appendChild(back);
    }
  }

  function renderToolbar() {
    const fullBtn = document.getElementById('btn-view-full');
    const starBtn = document.getElementById('btn-view-star');
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

  // ----- Init -----
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-view-full').addEventListener('click', () => setViewMode('full'));
    document.getElementById('btn-view-star').addEventListener('click', () => setViewMode('star'));
    document.getElementById('network-canvas').addEventListener('click', (ev) => {
      // Click on canvas background (not a node) deselects in full mode
      if (ev.target.tagName === 'svg' || ev.target.closest('.canvas-helper')) deselect();
    });
    rerender();
  });
})();
