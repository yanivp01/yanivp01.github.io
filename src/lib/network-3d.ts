import { layerColor, toGraphData } from './ecosystem-model';

export interface Network3DHandle {
  destroy(): void;
  /** Highlight `id` and its direct neighbours, dim the rest and pause auto-rotate; `null` resets. */
  select(id: string | null): void;
}

export interface Network3DOptions {
  autoRotate?: boolean;
  interactive?: boolean;
  /** Fired on node click (with the node id) and on background click (with null). Only in interactive mode. */
  onNodeClick?(id: string | null): void;
}

const ACCENT = '#1f4ed8';
const DIM_NODE_ALPHA = 0.16; // × nodeOpacity 0.95 ≈ 0.15
const DIM_LINK_ALPHA = 0.14; // × linkOpacity 0.35 ≈ 0.05

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const rgba = (hex: string, a: number) => `rgba(${hexToRgb(hex).join(',')},${a})`;
/** Mix a hex colour toward white (0..1) — used to brighten the selected node. */
function lighten(hex: string, amount: number): string {
  const c = hexToRgb(hex).map((v) => Math.round(v + (255 - v) * amount));
  return `rgb(${c.join(',')})`;
}
const endId = (end: unknown) => (typeof end === 'object' && end !== null ? String((end as { id: string }).id) : String(end));

export async function mountNetwork3D(el: HTMLElement, opts: Network3DOptions = {}): Promise<Network3DHandle> {
  const { default: ForceGraph3D } = await import('3d-force-graph');
  const { autoRotate = true, interactive = true, onNodeClick } = opts;
  const data = toGraphData();

  // Selection state drives the colour accessors; neighbours are computed from the link list.
  let selected: string | null = null;
  const neighbours = new Set<string>();
  const nodeColor = (n: any): string => {
    const base = layerColor(n.layer);
    if (!selected) return base;
    if (n.id === selected) return lighten(base, 0.35);
    return neighbours.has(n.id) ? base : rgba(base, DIM_NODE_ALPHA);
  };
  const linkColor = (l: any): string => {
    if (!selected) return ACCENT;
    const a = endId(l.source), b = endId(l.target);
    return a === selected || b === selected ? ACCENT : rgba(ACCENT, DIM_LINK_ALPHA);
  };
  const nodeVal = (n: any): number => (selected && n.id === selected ? 2 : 1);

  const graph = new ForceGraph3D(el, { controlType: 'orbit' })
    .graphData(data)
    .backgroundColor('rgba(0,0,0,0)')
    .showNavInfo(false)
    .nodeRelSize(5)
    .nodeColor(nodeColor)
    .nodeVal(nodeVal)
    .nodeOpacity(0.95)
    .linkColor(linkColor)
    .linkOpacity(0.35)
    .linkWidth(0.6)
    .nodeLabel((n: any) => (interactive ? `${n.id} · ${n.label}` : ''))
    // Node dragging stays off: with three r186 OrbitControls, 3d-force-graph's dragend fires a
    // synthetic touch `pointerup` on the document while the real mouse pointer is still tracked,
    // which throws inside OrbitControls and leaves the node stuck to the cursor after a plain
    // click. Drag rotates the scene; clicks select nodes.
    .enableNodeDrag(false)
    .enablePointerInteraction(interactive)
    .width(el.clientWidth)
    .height(el.clientHeight);

  graph.cameraPosition({ z: 260 });

  // OrbitControls auto-rotation: yields to pointer input natively and is ticked by
  // 3d-force-graph's own render loop. Note that loop only calls controls.update() while
  // controls.enabled is true, so non-interactive (hero) mode keeps the controls enabled and
  // switches off the individual pointer behaviours instead of using enableNavigationControls(false).
  const controls = graph.controls() as any;
  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = 0.6;
  if (!interactive) { controls.enableRotate = false; controls.enableZoom = false; controls.enablePan = false; }

  if (interactive) {
    graph.onNodeClick((n: any) => onNodeClick?.(String(n.id)));
    graph.onBackgroundClick(() => onNodeClick?.(null));
    graph.showPointerCursor((obj: any) => !!obj); // registering onBackgroundClick would otherwise set `pointer` over the whole canvas
  }

  const select = (id: string | null) => {
    selected = id;
    neighbours.clear();
    if (id) {
      for (const l of data.links) {
        const a = endId(l.source), b = endId(l.target);
        if (a === id) neighbours.add(b);
        if (b === id) neighbours.add(a);
      }
    }
    // Fresh accessor identities force three-forcegraph to re-digest node/link materials.
    graph.nodeColor((n: any) => nodeColor(n)).nodeVal((n: any) => nodeVal(n)).linkColor((l: any) => linkColor(l));
    controls.autoRotate = autoRotate && !id;
  };

  const onResize = () => graph.width(el.clientWidth).height(el.clientHeight);
  window.addEventListener('resize', onResize);
  return {
    select,
    destroy() { window.removeEventListener('resize', onResize); graph._destructor?.(); el.replaceChildren(); },
  };
}
