import React, { useState, useMemo } from 'react';

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
    outputs: ["Probability distributions", "Portfolio construction tool", "Globally exportable product"] },
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
  { from: "6e", to: "5a", label: "product revenue" }, { from: "6e", to: "4a", label: "dealmaking intelligence" },
];

const STYLES = {
  layers: {
    1: { color: "#3B82F6", name: "Sensing" },
    2: { color: "#10B981", name: "Operations" },
    3: { color: "#F59E0B", name: "Capital" },
    4: { color: "#EF4444", name: "Dealmaking" },
    5: { color: "#8B5CF6", name: "Sustainability" },
    6: { color: "#EC4899", name: "AI Generation" },
  },
  components: {
    input: { bg: "#EFF6FF", border: "#60A5FA", text: "#1E3A8A" }, // Blueish
    effort: { bg: "#FFFBEB", border: "#FBBF24", text: "#92400E" }, // Amberish
    output: { bg: "#ECFDF5", border: "#34D399", text: "#065F46" }, // Greenish
  }
};

const FullNetworkDiagram = ({ interventions, connections, selected, onSelect }) => {
  const nodePositions = useMemo(() => {
    const pos = {};
    const layerGroups = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    interventions.forEach(n => layerGroups[n.layer].push(n.id));
    
    // Circular layout per layer
    const cx = 500, cy = 400;
    const layerAngles = { 1: -0.8, 2: -0.2, 3: 0.4, 4: 1.2, 5: 2.2, 6: 2.8 };
    const layerRadius = { 1: 300, 2: 240, 3: 280, 4: 250, 5: 180, 6: 250 };
    
    Object.keys(layerGroups).forEach(layer => {
      const nodes = layerGroups[layer];
      const startAngle = layerAngles[layer];
      const spread = nodes.length > 1 ? 0.8 : 0;
      nodes.forEach((id, i) => {
        const angle = startAngle + (nodes.length > 1 ? (i / (nodes.length - 1)) * spread : 0);
        pos[id] = { x: cx + Math.cos(angle) * layerRadius[layer], y: cy + Math.sin(angle) * layerRadius[layer] };
      });
    });
    return pos;
  }, [interventions]);

  return (
    <svg viewBox="0 0 1000 800" className="w-full h-full transition-opacity duration-300">
      <defs>
        <marker id="arrowHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#9CA3AF" opacity="0.6"/>
        </marker>
        <marker id="arrowHeadActive" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#374151" />
        </marker>
      </defs>

      {/* RENDER EDGES */}
      {connections.map((c, i) => {
        const fromPos = nodePositions[c.from];
        const toPos = nodePositions[c.to];
        if (!fromPos || !toPos) return null;
        
        const isActive = c.from === selected || c.to === selected;
        const opacity = selected ? (isActive ? 1 : 0.05) : 0.2;
        
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const nx = dx/dist, ny = dy/dist;
        
        // Edge endpoints (padding for node radius)
        const x1 = fromPos.x + nx * 24; const y1 = fromPos.y + ny * 24;
        const x2 = toPos.x - nx * 24; const y2 = toPos.y - ny * 24;
        
        const isSelfLoop = c.from === c.to;
        return isSelfLoop ? null : (
          <path key={`edge-${i}`} d={`M ${x1} ${y1} Q ${(x1+x2)/2 - dy*0.1} ${(y1+y2)/2 + dx*0.1} ${x2} ${y2}`}
            stroke={isActive ? "#4B5563" : "#9CA3AF"}
            strokeWidth={isActive ? 1.5 : 1}
            fill="none"
            opacity={opacity}
            markerEnd={isActive ? "url(#arrowHeadActive)" : "url(#arrowHead)"}
            className="transition-all duration-300"
          />
        );
      })}

      {/* RENDER NODES */}
      {interventions.map(n => {
        const p = nodePositions[n.id];
        const isSelected = selected === n.id;
        const isConnected = selected && connections.some(c => (c.from === selected && c.to === n.id) || (c.to === selected && c.from === n.id));
        const opacity = selected ? (isSelected || isConnected ? 1 : 0.1) : 1;
        
        return (
          <g key={n.id} onClick={(e) => { e.stopPropagation(); onSelect(n.id); }} style={{ cursor: 'pointer', opacity }} className="transition-all duration-300 transform origin-center">
            <circle cx={p.x} cy={p.y} r={isSelected ? 26 : 22} fill={STYLES.layers[n.layer].color} 
              stroke={isSelected ? "#111827" : "none"} strokeWidth={isSelected ? 3 : 0} 
              className="drop-shadow-md hover:filter hover:brightness-110" />
            <text x={p.x} y={p.y + 2} textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize="11" fontWeight="700">
              {n.id}
            </text>
            <text x={p.x} y={p.y + 36} textAnchor="middle" fill="#374151" fontSize="10" fontWeight={isSelected ? "600" : "400"}>
              {n.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const NodeStarDiagram = ({ node, connections, onSelect }) => {
  if (!node) return null;
  const inEdges = connections.filter(c => c.to === node.id);
  const outEdges = connections.filter(c => c.from === node.id);

  const cx = 500, cy = 400; // Center of canvas

  return (
    <svg viewBox="0 0 1000 800" className="w-full h-full animate-fade-in font-sans">
      <defs>
        <marker id="arrowMarkerIn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#60A5FA" />
        </marker>
        <marker id="arrowMarkerEffort" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#FBBF24" />
        </marker>
        <marker id="arrowMarkerOut" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#34D399" />
        </marker>
      </defs>

      {/* CENTRAL NODE */}
      <circle cx={cx} cy={cy} r={40} fill={STYLES.layers[node.layer].color} className="drop-shadow-lg" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize="18" fontWeight="bold">
        {node.id}
      </text>

      {/* INPUTS (Left, Blue) */}
      {node.inputs.map((inp, i) => {
        const y = cy - ((node.inputs.length - 1) * 35) / 2 + i * 35;
        const x = cx - 300;
        return (
          <g key={`in-${i}`}>
            <rect x={x - 150} y={y - 12} width={140} height={24} rx={4} fill={STYLES.components.input.bg} stroke={STYLES.components.input.border} />
            <text x={x - 142} y={y + 1} fill={STYLES.components.input.text} fontSize="11" alignmentBaseline="middle">{inp.length > 22 ? inp.substring(0, 20)+'...' : inp}</text>
            <path d={`M ${x} ${y} L ${cx - 45} ${cy}`} stroke={STYLES.components.input.border} strokeWidth={2} markerEnd="url(#arrowMarkerIn)" />
          </g>
        );
      })}

      {/* EFFORTS (Top, Amber) */}
      {node.efforts.map((eff, i) => {
        const x = cx - ((node.efforts.length - 1) * 160) / 2 + i * 160;
        const y = cy - 250;
        return (
          <g key={`eff-${i}`}>
            <rect x={x - 70} y={y - 14} width={140} height={28} rx={14} fill={STYLES.components.effort.bg} stroke={STYLES.components.effort.border} className="drop-shadow-sm" />
            <text x={x} y={y + 1} textAnchor="middle" fill={STYLES.components.effort.text} fontSize="11" alignmentBaseline="middle">{eff.length > 20 ? eff.substring(0, 18)+'...' : eff}</text>
            <path d={`M ${x} ${y + 16} L ${cx} ${cy - 45}`} stroke={STYLES.components.effort.border} strokeWidth={2} markerEnd="url(#arrowMarkerEffort)" strokeDasharray="4 2" />
          </g>
        );
      })}

      {/* OUTPUTS (Right, Green) */}
      {node.outputs.map((out, i) => {
        const y = cy - ((node.outputs.length - 1) * 45) / 2 + i * 45;
        const x = cx + 300;
        return (
          <g key={`out-${i}`}>
            <rect x={x} y={y - 15} width={150} height={30} rx={4} fill={STYLES.components.output.bg} stroke={STYLES.components.output.border} />
            <text x={x + 8} y={y + 1} fill={STYLES.components.output.text} fontSize="11" alignmentBaseline="middle">{out.length > 22 ? out.substring(0, 20)+'...' : out}</text>
            <path d={`M ${cx + 45} ${cy} L ${x - 5} ${y}`} stroke={STYLES.components.output.border} strokeWidth={2} fill="none" markerEnd="url(#arrowMarkerOut)" />
          </g>
        );
      })}

    </svg>
  );
};

export default function App() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [viewMode, setViewMode] = useState('full'); // 'full' | 'node-star'

  // If node clicked in full mode, switch to node-star
  const handleSelect = (id) => {
    if (selectedNodeId === id && viewMode === 'full') {
      setViewMode('node-star');
    } else {
      setSelectedNodeId(id);
      if (viewMode === 'node-star') setViewMode('node-star');
    }
  };

  const selectedNode = selectedNodeId ? INTERVENTIONS.find(n => n.id === selectedNodeId) : null;
  const inEdges = selectedNode ? CONNECTIONS.filter(c => c.to === selectedNode.id) : [];
  const outEdges = selectedNode ? CONNECTIONS.filter(c => c.from === selectedNode.id) : [];

  return (
    <div className="w-full h-screen flex flex-col bg-slate-50 font-sans p-6 text-slate-800" onClick={() => { if(viewMode === 'full') setSelectedNodeId(null); }}>
      {/* Header bar */}
      <header className="flex justify-between items-end mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Node-Star Framework</h1>
          <p className="text-slate-500 text-sm mt-1">Global Cambridge Institute - Intervention Supply Network</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm border border-slate-200">
          <button 
            onClick={() => setViewMode('full')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'full' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Full Network Graph
          </button>
          <button 
            onClick={() => { if(selectedNodeId) setViewMode('node-star'); }}
            disabled={!selectedNodeId}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'node-star' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            Individual Node-Star View
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Visualization Canvas */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative" onClick={e => e.stopPropagation()}>
          {viewMode === 'full' ? (
            <FullNetworkDiagram 
              interventions={INTERVENTIONS} 
              connections={CONNECTIONS} 
              selected={selectedNodeId} 
              onSelect={handleSelect} 
            />
          ) : (
            <NodeStarDiagram 
              node={selectedNode} 
              connections={CONNECTIONS}
              onSelect={(id) => { setSelectedNodeId(id); setViewMode('node-star'); }}
            />
          )}

          {/* Contextual helper for Full View */}
          {viewMode === 'full' && !selectedNodeId && (
            <div className="absolute bottom-6 left-6 text-xs text-slate-400 font-medium">
              Click any node to highlight connections. Click again to open its Node-Star diagram.
            </div>
          )}
          {viewMode === 'node-star' && (
            <button 
              onClick={() => setViewMode('full')}
              className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 bg-white shadow-sm border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              &larr; Back to Full Graph
            </button>
          )}
        </div>

        {/* Legend / Details Sidebar */}
        <aside className="w-80 flex flex-col gap-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
          
          {selectedNode ? (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner"
                  style={{ backgroundColor: STYLES.layers[selectedNode.layer].color }}
                >
                  {selectedNode.id}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 leading-tight">{selectedNode.label}</h3>
                  <span className="text-xs font-medium text-slate-500">
                    Layer {selectedNode.layer}: {STYLES.layers[selectedNode.layer].name}
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-sm mt-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> Inputs
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {selectedNode.inputs.map((d,i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-amber-500"></div> Efforts
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {selectedNode.efforts.map((d,i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500"></div> Outputs
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    {selectedNode.outputs.map((d,i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Receives from:</h4>
                  <div className="flex flex-col gap-1.5">
                    {inEdges.map((e, i) => (
                      <button key={i} onClick={() => handleSelect(e.from)} className="text-left text-xs px-2 py-1.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors flex items-center gap-2">
                        <span className="font-bold flex-shrink-0" style={{color: STYLES.layers[INTERVENTIONS.find(n=>n.id===e.from)?.layer || 1].color}}>{e.from}</span>
                        <span className="text-slate-600 truncate">{e.label}</span>
                      </button>
                    ))}
                    {inEdges.length === 0 && <span className="text-xs text-slate-400 italic px-2">None</span>}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Feeds into:</h4>
                  <div className="flex flex-col gap-1.5">
                    {outEdges.map((e, i) => (
                      <button key={i} onClick={() => handleSelect(e.to)} className="text-left text-xs px-2 py-1.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors flex items-center gap-2">
                        <span className="font-bold flex-shrink-0" style={{color: STYLES.layers[INTERVENTIONS.find(n=>n.id===e.to)?.layer || 1].color}}>{e.to}</span>
                        <span className="text-slate-600 truncate">{e.label}</span>
                      </button>
                    ))}
                    {outEdges.length === 0 && <span className="text-xs text-slate-400 italic px-2">None</span>}
                  </div>
                </div>
              </div>

              {viewMode === 'full' && (
                <button 
                  onClick={() => setViewMode('node-star')}
                  className="mt-6 w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
                >
                  View Star Diagram
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">Ecosystem Layers</h3>
              <div className="space-y-3">
                {Object.entries(STYLES.layers).map(([id, layer]) => (
                  <div key={id} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }}></div>
                    <span className="text-sm font-medium text-slate-700">Layer {id}: {layer.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-6 pt-4 border-t border-slate-100 leading-relaxed">
                The Global Cambridge Framework classifies the ecosystem into 6 progressive layers, forming a coherent supply network for venture generation.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
